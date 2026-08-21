(function () {
  'use strict';

  const SQLITE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/';
  const IDB_NAME = 'phc-liquid-type-test';
  const IDB_STORE = 'sqlite-database';
  const CANDIDATES = [
    { code: 'NaCl', name: 'sodium chloride' },
    { code: 'Na₂CO₃', name: 'sodium carbonate' },
    { code: 'NaOH', name: 'sodium hydroxide' },
    { code: 'H₂SO₄', name: 'sulfuric acid' }
  ];

  let root;
  let database;
  let browserStore;
  let currentStage = 1;
  let autosaveTimer;
  let state = createState();

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return 'exp-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  function localDate() {
    const now = new Date();
    return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  }

  function createState() {
    return {
      id: createId(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      safety: { supervised: false, identified: false, approved: false, ppe: false, equipment: false, conditions: false },
      sampleCode: '',
      testDate: localDate(),
      sampleTemp: null,
      volumeMl: 10,
      candidateNotes: '',
      tolerance: null,
      conclusion: '',
      trials: [1, 2, 3].map(function (number) {
        return { number: number, method: 'subtraction', temperature: null, volume: 10, empty: null, combined: null, observation: '' };
      }),
      references: CANDIDATES.map(function (candidate) {
        return { code: candidate.code, form: '', temperature: null, density: null };
      })
    };
  }

  function numberOrNull(value) {
    if (value === '' || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function formatNumber(value, maxDigits) {
    if (value === null || value === undefined || !Number.isFinite(Number(value))) return '—';
    return Number(value).toLocaleString('en-US', { maximumFractionDigits: maxDigits || 6 });
  }

  function escapeHtml(value) {
    return String(value === null || value === undefined ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function setDatabaseStatus(message, type) {
    const element = root.querySelector('#db-status');
    element.textContent = message;
    element.className = 'lab-db-status' + (type ? ' is-' + type : '');
  }

  function feedback(message, type) {
    const element = root.querySelector('#lab-feedback');
    if (!element) return;
    element.textContent = message || '';
    element.className = 'lab-feedback' + (type ? ' is-' + type : '');
  }

  function openIndexedDb() {
    return new Promise(function (resolve, reject) {
      const request = window.indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = function () {
        request.result.createObjectStore(IDB_STORE);
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error('IndexedDB could not be opened.')); };
    });
  }

  function readStoredDatabase() {
    return new Promise(function (resolve, reject) {
      const transaction = browserStore.transaction(IDB_STORE, 'readonly');
      const request = transaction.objectStore(IDB_STORE).get('main');
      request.onsuccess = function () { resolve(request.result || null); };
      request.onerror = function () { reject(request.error || new Error('Stored SQLite database could not be read.')); };
    });
  }

  function writeStoredDatabase(bytes) {
    return new Promise(function (resolve, reject) {
      const transaction = browserStore.transaction(IDB_STORE, 'readwrite');
      transaction.objectStore(IDB_STORE).put({ bytes: Array.from(bytes), savedAt: new Date().toISOString() }, 'main');
      transaction.oncomplete = resolve;
      transaction.onerror = function () { reject(transaction.error || new Error('SQLite database could not be saved.')); };
    });
  }

  function queryRows(sql, params) {
    const result = database.exec(sql, params || []);
    if (!result.length) return [];
    const table = result[0];
    return table.values.map(function (values) {
      return table.columns.reduce(function (row, column, index) { row[column] = values[index]; return row; }, {});
    });
  }

  async function persistDatabase() {
    await writeStoredDatabase(database.export());
  }

  async function initializeDatabase() {
    setDatabaseStatus('Loading SQLite database...', 'loading');
    if (!window.initSqlJs) throw new Error('SQLite engine did not load. Check the network connection and reload the page.');
    browserStore = await openIndexedDb();
    const stored = await readStoredDatabase();
    const SQL = await window.initSqlJs({ locateFile: function (file) { return SQLITE_CDN + file; } });
    database = stored ? new SQL.Database(new Uint8Array(stored.bytes)) : new SQL.Database();
    database.run('PRAGMA foreign_keys = ON; CREATE TABLE IF NOT EXISTS experiments (id TEXT PRIMARY KEY, status TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, sample_code TEXT, test_date TEXT, sample_temp_c REAL, volume_ml REAL, candidate_notes TEXT, tolerance_g_ml REAL, mean_density_g_ml REAL, range_density_g_ml REAL, conclusion TEXT, payload_json TEXT NOT NULL); CREATE TABLE IF NOT EXISTS trials (id INTEGER PRIMARY KEY AUTOINCREMENT, experiment_id TEXT NOT NULL, trial_number INTEGER NOT NULL, method TEXT NOT NULL, temperature_c REAL, volume_ml REAL, empty_container_g REAL, combined_mass_g REAL, liquid_mass_g REAL, density_g_ml REAL, observation TEXT, FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE); CREATE TABLE IF NOT EXISTS candidate_references (id INTEGER PRIMARY KEY AUTOINCREMENT, experiment_id TEXT NOT NULL, candidate_code TEXT NOT NULL, form_note TEXT, reference_temperature_c REAL, reference_density_g_ml REAL, FOREIGN KEY (experiment_id) REFERENCES experiments(id) ON DELETE CASCADE);');
    const drafts = queryRows("SELECT payload_json FROM experiments WHERE status = 'draft' ORDER BY updated_at DESC LIMIT 1");
    if (drafts.length && drafts[0].payload_json) {
      try { state = normalizeState(JSON.parse(drafts[0].payload_json)); } catch (error) { /* Keep a clean state if an old draft is corrupt. */ }
    }
    setDatabaseStatus('SQLite ready · saved locally in this browser', 'ready');
    renderAll();
    renderRecords();
  }

  function normalizeState(value) {
    const fresh = createState();
    const result = Object.assign(fresh, value || {});
    result.safety = Object.assign(fresh.safety, value && value.safety ? value.safety : {});
    result.trials = [1, 2, 3].map(function (number, index) {
      return Object.assign(fresh.trials[index], value && value.trials && value.trials[index] ? value.trials[index] : {}, { number: number });
    });
    result.references = CANDIDATES.map(function (candidate, index) {
      return Object.assign(fresh.references[index], value && value.references && value.references[index] ? value.references[index] : {}, { code: candidate.code });
    });
    return result;
  }

  function syncStateFromDom() {
    root.querySelectorAll('[data-safety]').forEach(function (input) { state.safety[input.dataset.safety] = input.checked; });
    state.sampleCode = root.querySelector('#sample-code').value.trim();
    state.testDate = root.querySelector('#test-date').value;
    state.sampleTemp = numberOrNull(root.querySelector('#sample-temp').value);
    state.volumeMl = numberOrNull(root.querySelector('#volume-ml').value);
    state.candidateNotes = root.querySelector('#candidate-notes').value.trim();
    state.tolerance = numberOrNull(root.querySelector('#tolerance').value);
    state.conclusion = root.querySelector('#conclusion').value.trim();
    root.querySelectorAll('[data-trial]').forEach(function (card, index) {
      const get = function (field) { return card.querySelector('[data-field="' + field + '"]'); };
      state.trials[index] = {
        number: index + 1,
        method: get('method').value,
        temperature: numberOrNull(get('temperature').value),
        volume: numberOrNull(get('volume').value),
        empty: numberOrNull(get('empty').value),
        combined: numberOrNull(get('combined').value),
        observation: get('observation').value.trim()
      };
    });
    root.querySelectorAll('[data-candidate-row]').forEach(function (row, index) {
      state.references[index] = {
        code: CANDIDATES[index].code,
        form: row.querySelector('[data-ref="form"]').value.trim(),
        temperature: numberOrNull(row.querySelector('[data-ref="temperature"]').value),
        density: numberOrNull(row.querySelector('[data-ref="density"]').value)
      };
    });
    state.updatedAt = new Date().toISOString();
  }

  function renderAll() {
    root.querySelectorAll('[data-safety]').forEach(function (input) { input.checked = !!state.safety[input.dataset.safety]; });
    root.querySelector('#sample-code').value = state.sampleCode || '';
    root.querySelector('#test-date').value = state.testDate || localDate();
    root.querySelector('#sample-temp').value = state.sampleTemp === null ? '' : state.sampleTemp;
    root.querySelector('#volume-ml').value = state.volumeMl === null ? '' : state.volumeMl;
    root.querySelector('#candidate-notes').value = state.candidateNotes || '';
    root.querySelector('#tolerance').value = state.tolerance === null ? '' : state.tolerance;
    root.querySelector('#conclusion').value = state.conclusion || '';
    state.trials.forEach(function (trial, index) {
      const card = root.querySelector('[data-trial="' + (index + 1) + '"]');
      const set = function (field, value) { card.querySelector('[data-field="' + field + '"]').value = value === null || value === undefined ? '' : value; };
      set('method', trial.method); set('temperature', trial.temperature); set('volume', trial.volume); set('empty', trial.empty); set('combined', trial.combined); set('observation', trial.observation);
      updateTareField(card);
    });
    state.references.forEach(function (reference, index) {
      const row = root.querySelector('[data-candidate-row="' + index + '"]');
      if (!row) return;
      row.querySelector('[data-ref="form"]').value = reference.form || '';
      row.querySelector('[data-ref="temperature"]').value = reference.temperature === null ? '' : reference.temperature;
      row.querySelector('[data-ref="density"]').value = reference.density === null ? '' : reference.density;
    });
    updateCalculated();
    renderNavigation();
  }

  function updateTareField(card) {
    const method = card.querySelector('[data-field="method"]').value;
    const empty = card.querySelector('[data-field="empty"]');
    empty.disabled = method === 'tare';
    if (method === 'tare') { empty.value = '0'; empty.setAttribute('aria-label', 'Empty container, not used after tare'); }
    else { empty.removeAttribute('aria-label'); if (empty.value === '0') empty.value = ''; }
  }

  function calculateTrial(trial) {
    if (trial.volume === null || trial.volume <= 0 || trial.combined === null) return { mass: null, density: null };
    const mass = trial.method === 'tare' ? trial.combined : (trial.empty === null ? null : trial.combined - trial.empty);
    if (mass === null || mass < 0) return { mass: null, density: null };
    return { mass: mass, density: mass / trial.volume };
  }

  function calculateStats() {
    const calculated = state.trials.map(calculateTrial);
    const densities = calculated.map(function (item) { return item.density; }).filter(function (value) { return value !== null && Number.isFinite(value); });
    if (densities.length !== 3) return { trials: calculated, mean: null, range: null };
    const mean = densities.reduce(function (sum, value) { return sum + value; }, 0) / densities.length;
    return { trials: calculated, mean: mean, range: Math.max.apply(null, densities) - Math.min.apply(null, densities) };
  }

  function comparison() {
    const stats = calculateStats();
    const tolerance = state.tolerance;
    const rows = state.references.map(function (reference) {
      const difference = stats.mean !== null && reference.density !== null ? Math.abs(stats.mean - reference.density) : null;
      return Object.assign({}, reference, { difference: difference, fits: difference !== null && tolerance !== null && difference <= tolerance });
    });
    const usable = rows.filter(function (row) { return row.difference !== null; });
    const fits = rows.filter(function (row) { return row.fits; });
    let status = 'waiting';
    let label = 'Enter reference values to see the comparison result.';
    if (stats.mean === null) { status = 'waiting'; label = 'Complete all three valid trials before comparing candidates.'; }
    else if (tolerance === null) { status = 'waiting'; label = 'Enter the comparison tolerance supplied by the supervisor.'; }
    else if (!usable.length) { status = 'waiting'; label = 'Enter at least one reference density at the matching temperature.'; }
    else if (fits.length === 1) { status = 'success'; label = 'Consistent with ' + fits[0].code + '. One candidate is within the comparison tolerance.'; }
    else if (fits.length > 1) { status = 'warning'; label = 'Inconclusive. Two or more candidates are within the comparison tolerance.'; }
    else { status = 'warning'; label = 'Inconclusive. No candidate is within the comparison tolerance.'; }
    return { stats: stats, rows: rows, fits: fits, status: status, label: label };
  }

  function updateCalculated() {
    const stats = calculateStats();
    state.trials.forEach(function (trial, index) {
      const card = root.querySelector('[data-trial="' + (index + 1) + '"]');
      const result = stats.trials[index];
      card.querySelector('[data-field="mass"]').textContent = formatNumber(result.mass);
      card.querySelector('[data-field="density"]').textContent = formatNumber(result.density);
      card.querySelector('[data-result-label]').textContent = result.density === null ? 'Waiting for valid measurements' : formatNumber(result.density) + ' g/mL';
    });
    root.querySelector('#mean-density').textContent = formatNumber(stats.mean);
    root.querySelector('#density-range').textContent = formatNumber(stats.range);
    root.querySelector('#summary-temperature').textContent = formatNumber(state.sampleTemp, 2);
    const review = root.querySelector('#review-trials');
    const hasAny = state.trials.some(function (trial) { return trial.combined !== null || trial.empty !== null; });
    review.innerHTML = hasAny ? state.trials.map(function (trial, index) {
      const result = stats.trials[index];
      return '<tr><td>Trial ' + (index + 1) + '</td><td>' + formatNumber(result.mass) + '</td><td>' + formatNumber(trial.volume, 4) + '</td><td>' + formatNumber(result.density) + '</td><td>' + escapeHtml(trial.observation || '—') + '</td></tr>';
    }).join('') : '<tr><td colspan="5">Enter three complete trials to calculate the review table.</td></tr>';
    const result = comparison();
    root.querySelector('#candidate-result').textContent = result.label;
    root.querySelector('#candidate-result').className = 'lab-result-callout is-' + result.status;
    root.querySelectorAll('[data-candidate-row]').forEach(function (row, index) {
      const candidate = result.rows[index];
      row.querySelector('[data-ref="difference"]').textContent = formatNumber(candidate.difference);
      row.querySelector('[data-ref="fits"]').textContent = candidate.difference === null ? '—' : (candidate.fits ? 'Fits' : 'No');
      row.querySelector('[data-ref="fits"]').className = candidate.difference === null ? '' : (candidate.fits ? 'is-fit' : 'is-no-fit');
    });
    root.querySelector('#final-result').textContent = result.label;
    root.querySelector('#final-result').className = 'lab-result-callout is-' + result.status;
  }

  function renderCandidateRows() {
    root.querySelector('#candidate-rows').innerHTML = CANDIDATES.map(function (candidate, index) {
      return '<tr data-candidate-row="' + index + '"><th scope="row">' + candidate.code + '<small>' + candidate.name + '</small></th><td><input data-ref="form" type="text" placeholder="Form or concentration" aria-label="' + candidate.code + ' form or concentration"></td><td><input data-ref="temperature" type="number" step="0.1" inputmode="decimal" aria-label="' + candidate.code + ' reference temperature"></td><td><input data-ref="density" type="number" step="0.0001" inputmode="decimal" aria-label="' + candidate.code + ' reference density"></td><td><output data-ref="difference">—</output></td><td><output data-ref="fits">—</output></td></tr>';
    }).join('');
  }

  function renderNavigation() {
    const maxStage = !allSafetyChecked() ? 1 : (validSetup() ? (allTrialsComplete() ? (comparison().stats.mean !== null ? (comparison().rows.some(function (row) { return row.density !== null; }) ? 6 : 5) : 4) : 3) : 2);
    const safetyContinue = root.querySelector('[data-action="next"][data-next="2"]');
    if (safetyContinue) safetyContinue.disabled = !allSafetyChecked();
    root.querySelectorAll('[data-stage]').forEach(function (button) {
      const number = Number(button.dataset.stage);
      button.disabled = number > maxStage;
      button.classList.toggle('is-active', number === currentStage);
      button.classList.toggle('is-complete', number < currentStage && number <= maxStage);
    });
  }

  function allSafetyChecked() {
    return Object.keys(state.safety).every(function (key) { return state.safety[key]; });
  }

  function validSetup() {
    return !!state.sampleCode && !!state.testDate && state.sampleTemp !== null && state.volumeMl !== null && state.volumeMl > 0;
  }

  function allTrialsComplete() {
    return calculateStats().mean !== null;
  }

  function validateStage(stage) {
    syncStateFromDom();
    updateCalculated();
    if (stage === 1 && !allSafetyChecked()) return 'Complete every safety check before continuing.';
    if (stage === 2 && !validSetup()) return 'Enter the sample code, date, temperature, and a positive volume before continuing.';
    if (stage === 3 && !allTrialsComplete()) return 'Enter valid measurements for all three trials before continuing.';
    if (stage === 5) {
      const result = comparison();
      if (result.stats.mean === null || state.tolerance === null || !result.rows.some(function (row) { return row.density !== null; })) return 'Enter the comparison tolerance and at least one reference density before continuing.';
    }
    return '';
  }

  function setStage(stage) {
    currentStage = stage;
    root.querySelectorAll('[data-stage-panel]').forEach(function (panel) {
      const active = Number(panel.dataset.stagePanel) === stage;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    renderNavigation();
    const heading = root.querySelector('[data-stage-panel="' + stage + '"] h2');
    if (heading) heading.focus({ preventScroll: true });
    window.scrollTo({ top: root.offsetTop - 24, behavior: 'smooth' });
  }

  function snapshotPayload() {
    syncStateFromDom();
    const stats = calculateStats();
    return Object.assign({}, state, { meanDensity: stats.mean, rangeDensity: stats.range });
  }

  function saveIntoSqlite(status) {
    const payload = snapshotPayload();
    state.status = status;
    state.updatedAt = new Date().toISOString();
    payload.status = status;
    payload.updatedAt = state.updatedAt;
    const stats = calculateStats();
    database.run('INSERT OR REPLACE INTO experiments (id, status, created_at, updated_at, sample_code, test_date, sample_temp_c, volume_ml, candidate_notes, tolerance_g_ml, mean_density_g_ml, range_density_g_ml, conclusion, payload_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [state.id, status, state.createdAt, state.updatedAt, state.sampleCode, state.testDate, state.sampleTemp, state.volumeMl, state.candidateNotes, state.tolerance, stats.mean, stats.range, state.conclusion, JSON.stringify(payload)]);
    database.run('DELETE FROM trials WHERE experiment_id = ?', [state.id]);
    state.trials.forEach(function (trial, index) {
      const result = stats.trials[index];
      database.run('INSERT INTO trials (experiment_id, trial_number, method, temperature_c, volume_ml, empty_container_g, combined_mass_g, liquid_mass_g, density_g_ml, observation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [state.id, index + 1, trial.method, trial.temperature, trial.volume, trial.empty, trial.combined, result.mass, result.density, trial.observation]);
    });
    database.run('DELETE FROM candidate_references WHERE experiment_id = ?', [state.id]);
    state.references.forEach(function (reference) {
      database.run('INSERT INTO candidate_references (experiment_id, candidate_code, form_note, reference_temperature_c, reference_density_g_ml) VALUES (?, ?, ?, ?, ?)', [state.id, reference.code, reference.form, reference.temperature, reference.density]);
    });
  }

  async function saveCurrent(status, message) {
    if (!database) { feedback('SQLite is not ready. Reload the page before saving.', 'error'); return false; }
    if (status === 'saved') {
      const error = validateStage(1) || validateStage(2) || validateStage(3) || validateStage(5);
      if (error) { feedback(error, 'error'); return false; }
      if (!state.conclusion) state.conclusion = generatedConclusion();
      root.querySelector('#conclusion').value = state.conclusion;
    }
    saveIntoSqlite(status);
    await persistDatabase();
    setDatabaseStatus(status === 'saved' ? 'Record saved in SQLite · local browser database' : 'Draft saved in SQLite · local browser database', 'ready');
    feedback(message || (status === 'saved' ? 'Completed record saved.' : 'Draft saved.'), 'success');
    renderRecords();
    return true;
  }

  function generatedConclusion() {
    const result = comparison();
    const sample = state.sampleCode || 'The sample';
    const stats = result.stats;
    let match = 'inconclusive';
    if (result.fits.length === 1) match = 'consistent with ' + result.fits[0].code;
    const reason = result.fits.length === 1 ? 'one candidate is within the comparison tolerance' : 'the density evidence does not identify exactly one candidate';
    return sample + ' had a mean density of ' + formatNumber(stats.mean) + ' g/mL at ' + formatNumber(state.sampleTemp, 2) + ' °C, with a range of ' + formatNumber(stats.range) + ' g/mL. The result is ' + match + ' because ' + reason + '. Density does not prove complete chemical identity.';
  }

  function meaningfulData() {
    return !!state.sampleCode || state.trials.some(function (trial) { return trial.combined !== null || trial.empty !== null; });
  }

  function scheduleAutosave() {
    window.clearTimeout(autosaveTimer);
    autosaveTimer = window.setTimeout(function () {
      if (database && meaningfulData()) saveCurrent('draft', 'Draft auto-saved.');
    }, 900);
  }

  function records() {
    return queryRows('SELECT id, status, updated_at, sample_code, test_date, mean_density_g_ml, range_density_g_ml, conclusion, payload_json FROM experiments ORDER BY updated_at DESC');
  }

  function renderRecords() {
    if (!database) return;
    const list = root.querySelector('#saved-records');
    const rows = records();
    if (!rows.length) { list.innerHTML = '<p class="lab-empty">No saved records yet.</p>'; return; }
    list.innerHTML = rows.map(function (row) {
      return '<article class="lab-record"><div><strong>' + escapeHtml(row.sample_code || 'Unnamed sample') + '</strong><span>' + escapeHtml(row.status === 'saved' ? 'Completed record' : 'Draft') + ' · ' + escapeHtml(row.test_date || 'No date') + '</span><small>Mean density: ' + escapeHtml(formatNumber(row.mean_density_g_ml)) + ' g/mL · range: ' + escapeHtml(formatNumber(row.range_density_g_ml)) + ' g/mL</small></div><div class="lab-record-actions"><button class="lab-button lab-button-small lab-button-secondary" type="button" data-action="load-record" data-record-id="' + escapeHtml(row.id) + '">Review</button><button class="lab-button lab-button-small lab-button-danger" type="button" data-action="delete-record" data-record-id="' + escapeHtml(row.id) + '">Delete</button></div></article>';
    }).join('');
  }

  function loadRecord(id) {
    const rows = queryRows('SELECT payload_json FROM experiments WHERE id = ?', [id]);
    if (!rows.length) return;
    try {
      state = normalizeState(JSON.parse(rows[0].payload_json));
      currentStage = 6;
      renderAll();
      feedback('Record loaded for review. Editing it will update the saved record as a draft until you save it again.', 'success');
      setStage(6);
    } catch (error) { feedback('This record could not be loaded.', 'error'); }
  }

  async function deleteRecord(id) {
    if (!window.confirm('Delete this experiment record from the local SQLite database?')) return;
    database.run('DELETE FROM experiments WHERE id = ?', [id]);
    await persistDatabase();
    if (state.id === id) { state = createState(); currentStage = 1; renderAll(); setStage(1); }
    renderRecords();
    feedback('Record deleted from this browser database.', 'success');
  }

  function exportRecords() {
    if (!database) { feedback('SQLite is not ready. Reload the page before exporting.', 'error'); return; }
    const payload = { schemaVersion: 1, exportedAt: new Date().toISOString(), experiments: records().map(function (row) { return JSON.parse(row.payload_json); }) };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'liquid-type-test-records-' + localDate() + '.json';
    link.click();
    URL.revokeObjectURL(link.href);
    feedback('Records exported as JSON.', 'success');
  }

  async function importRecords(file) {
    if (!file || !database) return;
    try {
      const payload = JSON.parse(await file.text());
      if (!Array.isArray(payload.experiments)) throw new Error('Invalid export format.');
      payload.experiments.forEach(function (item) {
        state = normalizeState(item);
        saveIntoSqlite(item.status === 'saved' ? 'saved' : 'draft');
      });
      await persistDatabase();
      renderRecords();
      feedback(payload.experiments.length + ' record(s) imported into SQLite.', 'success');
    } catch (error) { feedback('Import failed. Use a JSON export from this lab page.', 'error'); }
  }

  function startNew() {
    if (meaningfulData() && !window.confirm('Start a new test? The current draft will remain in saved records if it was already saved.')) return;
    state = createState(); currentStage = 1; renderAll(); setStage(1); feedback('New test ready. Complete the safety gate first.', '');
  }

  function bindEvents() {
    root.addEventListener('click', function (event) {
      const button = event.target.closest('[data-action], [data-stage]');
      if (!button || button.disabled) return;
      const action = button.dataset.action;
      if (button.dataset.stage) { const stage = Number(button.dataset.stage); if (!button.disabled) setStage(stage); return; }
      if (action === 'new') startNew();
      if (action === 'export') exportRecords();
      if (action === 'load-record') loadRecord(button.dataset.recordId);
      if (action === 'delete-record') deleteRecord(button.dataset.recordId);
      if (action === 'back') setStage(Number(button.dataset.back));
      if (action === 'next') { const error = validateStage(currentStage); if (error) feedback(error, 'error'); else { feedback('', ''); setStage(Number(button.dataset.next)); } }
      if (action === 'save-draft') saveCurrent('draft');
      if (action === 'save-complete') saveCurrent('saved');
    });
    root.addEventListener('input', function (event) {
      if (event.target.matches('[data-field="method"]')) updateTareField(event.target.closest('[data-trial]'));
      syncStateFromDom(); updateCalculated(); renderNavigation(); scheduleAutosave();
    });
    root.addEventListener('change', function (event) {
      if (event.target.matches('[data-safety]')) { syncStateFromDom(); renderNavigation(); }
      if (event.target.id === 'import-file') importRecords(event.target.files[0]);
    });
  }

  async function start() {
    root = document.querySelector('[data-lab-app]');
    if (!root) return;
    renderCandidateRows();
    const feedbackNode = document.createElement('p');
    feedbackNode.id = 'lab-feedback';
    feedbackNode.className = 'lab-feedback';
    feedbackNode.setAttribute('role', 'status');
    feedbackNode.setAttribute('aria-live', 'polite');
    root.querySelector('.lab-toolbar').after(feedbackNode);
    bindEvents();
    renderAll();
    try { await initializeDatabase(); }
    catch (error) { setDatabaseStatus('SQLite unavailable · data cannot be saved', 'error'); feedback(error.message, 'error'); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}());
