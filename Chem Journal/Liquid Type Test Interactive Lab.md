---
layout: default
title: Liquid Type Test Interactive Lab
permalink: /chemistry/liquid-type-test-lab/
published: false
section: Chemistry
description: A staged, safety-first SQLite-backed workflow for the Liquid Type Test Experiment.
stylesheet: liquid-test-lab
---

<div class="lab-app" id="liquid-lab" data-lab-app>
  <header class="lab-hero">
    <p class="lab-eyebrow">Supervised classroom workflow</p>
    <h1>Liquid Type Test Interactive Lab</h1>
    <p class="lab-lede">Follow one stage at a time. Enter measurements as you make them. The page calculates density, stores the record in SQLite in this browser, and keeps the evidence available for later review.</p>
    <div class="lab-safety-banner" role="note">
      <strong>Safety boundary:</strong> Use only a labeled, supervisor-approved sample or prepared solution. Do not test an unknown bottle, mix candidates, heat samples, taste samples, or mouth-pipette. NaOH and H₂SO₄ may be corrosive.
    </div>
  </header>

  <div class="lab-toolbar" aria-label="Lab record controls">
    <p class="lab-db-status" id="db-status" role="status">Loading SQLite database...</p>
    <div class="lab-toolbar-actions">
      <button class="lab-button lab-button-secondary" type="button" data-action="new">Start new test</button>
      <button class="lab-button lab-button-secondary" type="button" data-action="export">Export records</button>
      <label class="lab-button lab-button-secondary lab-file-button" for="import-file">Import records<input id="import-file" type="file" accept="application/json" hidden></label>
    </div>
  </div>

  <div class="lab-workspace">
    <nav class="lab-steps" aria-label="Experiment stages">
      <p class="lab-steps-title">Stages</p>
      <button class="lab-step is-active" type="button" data-stage="1"><span>1</span><strong>Safety gate</strong><small>Required before testing</small></button>
      <button class="lab-step" type="button" data-stage="2"><span>2</span><strong>Sample setup</strong><small>Identify the test</small></button>
      <button class="lab-step" type="button" data-stage="3"><span>3</span><strong>Three trials</strong><small>Record measurements</small></button>
      <button class="lab-step" type="button" data-stage="4"><span>4</span><strong>Review calculations</strong><small>Check the evidence</small></button>
      <button class="lab-step" type="button" data-stage="5"><span>5</span><strong>Compare candidates</strong><small>Use matching references</small></button>
      <button class="lab-step" type="button" data-stage="6"><span>6</span><strong>Save conclusion</strong><small>Keep the record</small></button>
    </nav>

    <main class="lab-main">
      <form id="lab-form" novalidate>
        <section class="lab-stage is-active" data-stage-panel="1" aria-labelledby="stage-1-title">
          <div class="lab-stage-heading"><span class="lab-stage-number">1</span><div><p class="lab-eyebrow">Stage 1</p><h2 id="stage-1-title">Safety gate</h2><p>Check every requirement before opening or transferring the sample.</p></div></div>
          <div class="lab-alert lab-alert-danger"><strong>Stop if any box stays unchecked.</strong> Record “Not tested, safety requirement missing” and ask the supervisor what to do next.</div>
          <fieldset class="lab-checklist" id="safety-checks">
            <legend>Before you begin</legend>
            <label><input type="checkbox" data-safety="supervised"> The sample is a supervised classroom or laboratory sample.</label>
            <label><input type="checkbox" data-safety="identified"> The sample has a code and belongs to one of the four approved candidates: NaCl, Na₂CO₃, NaOH, or H₂SO₄.</label>
            <label><input type="checkbox" data-safety="approved"> The supervisor approved the test and gave waste instructions.</label>
            <label><input type="checkbox" data-safety="ppe"> Goggles, gloves, and a lab coat or apron are available.</label>
            <label><input type="checkbox" data-safety="equipment"> The balance, volume tool, thermometer, labels, spill tray, and waste container are ready.</label>
            <label><input type="checkbox" data-safety="conditions"> There is no open flame, heating, tasting, or mouth pipetting.</label>
          </fieldset>
          <div class="lab-candidate-strip"><strong>Approved candidates:</strong> NaCl, Na₂CO₃, NaOH, H₂SO₄. Use only the form and concentration supplied by the supervisor.</div>
          <div class="lab-actions"><button class="lab-button lab-button-primary" type="button" data-action="next" data-next="2" disabled>Continue to sample setup</button></div>
        </section>

        <section class="lab-stage" data-stage-panel="2" aria-labelledby="stage-2-title" hidden>
          <div class="lab-stage-heading"><span class="lab-stage-number">2</span><div><p class="lab-eyebrow">Stage 2</p><h2 id="stage-2-title">Sample setup</h2><p>Record the identity and conditions before measuring.</p></div></div>
          <div class="lab-form-grid">
            <label>Sample code<input id="sample-code" type="text" autocomplete="off" placeholder="Example: L-01" required></label>
            <label>Experiment date<input id="test-date" type="date" required></label>
            <label>Sample temperature (°C)<input id="sample-temp" type="number" step="0.1" inputmode="decimal" placeholder="Example: 20.0" required></label>
            <label>Volume per trial (mL)<input id="volume-ml" type="number" min="0.01" step="0.01" value="10.00" required></label>
          </div>
          <label class="lab-field-wide">Candidate form or concentration supplied by the supervisor<textarea id="candidate-notes" rows="3" placeholder="Example: aqueous solutions; record each concentration and the reference temperature before comparing."></textarea></label>
          <div class="lab-instruction"><strong>Do:</strong> Label the container with the sample code and place it inside the spill tray. Use the same volume for all three trials unless the supervisor specifies another volume.</div>
          <div class="lab-actions"><button class="lab-button lab-button-secondary" type="button" data-action="back" data-back="1">Back</button><button class="lab-button lab-button-primary" type="button" data-action="next" data-next="3">Continue to trials</button></div>
        </section>

        <section class="lab-stage" data-stage-panel="3" aria-labelledby="stage-3-title" hidden>
          <div class="lab-stage-heading"><span class="lab-stage-number">3</span><div><p class="lab-eyebrow">Stage 3</p><h2 id="stage-3-title">Record three trials</h2><p>Use a clean, dry container and lid. Close the lid before recording the mass.</p></div></div>
          <div class="lab-alert lab-alert-info"><strong>Tare or subtraction:</strong> If you tared the balance with the empty container and lid, choose “Tared” and enter the liquid mass directly in the second mass field. Otherwise choose “Subtraction” and enter both masses.</div>
          <div class="lab-trials" id="trial-fields">
            <article class="lab-trial" data-trial="1"><div class="lab-trial-heading"><h3>Trial 1</h3><span class="lab-trial-result" data-result-label="1">Waiting for measurements</span></div><div class="lab-form-grid lab-form-grid-trial"><label>Mass method<select data-field="method"><option value="subtraction">Subtraction</option><option value="tare">Tared</option></select></label><label>Temperature (°C)<input data-field="temperature" type="number" step="0.1" inputmode="decimal"></label><label>Volume (mL)<input data-field="volume" type="number" min="0.01" step="0.01" inputmode="decimal"></label><label>Empty container (g)<input data-field="empty" type="number" step="0.0001" inputmode="decimal"></label><label>Container + liquid, or liquid after tare (g)<input data-field="combined" type="number" step="0.0001" inputmode="decimal"></label><label>Liquid mass (g)<output data-field="mass">—</output></label><label>Density (g/mL)<output data-field="density">—</output></label></div><label class="lab-field-wide">Visible observation<textarea data-field="observation" rows="2" placeholder="Record only what you observe. Do not deliberately smell the sample."></textarea></label></article>
            <article class="lab-trial" data-trial="2"><div class="lab-trial-heading"><h3>Trial 2</h3><span class="lab-trial-result" data-result-label="2">Waiting for measurements</span></div><div class="lab-form-grid lab-form-grid-trial"><label>Mass method<select data-field="method"><option value="subtraction">Subtraction</option><option value="tare">Tared</option></select></label><label>Temperature (°C)<input data-field="temperature" type="number" step="0.1" inputmode="decimal"></label><label>Volume (mL)<input data-field="volume" type="number" min="0.01" step="0.01" inputmode="decimal"></label><label>Empty container (g)<input data-field="empty" type="number" step="0.0001" inputmode="decimal"></label><label>Container + liquid, or liquid after tare (g)<input data-field="combined" type="number" step="0.0001" inputmode="decimal"></label><label>Liquid mass (g)<output data-field="mass">—</output></label><label>Density (g/mL)<output data-field="density">—</output></label></div><label class="lab-field-wide">Visible observation<textarea data-field="observation" rows="2" placeholder="Record only what you observe. Do not deliberately smell the sample."></textarea></label></article>
            <article class="lab-trial" data-trial="3"><div class="lab-trial-heading"><h3>Trial 3</h3><span class="lab-trial-result" data-result-label="3">Waiting for measurements</span></div><div class="lab-form-grid lab-form-grid-trial"><label>Mass method<select data-field="method"><option value="subtraction">Subtraction</option><option value="tare">Tared</option></select></label><label>Temperature (°C)<input data-field="temperature" type="number" step="0.1" inputmode="decimal"></label><label>Volume (mL)<input data-field="volume" type="number" min="0.01" step="0.01" inputmode="decimal"></label><label>Empty container (g)<input data-field="empty" type="number" step="0.0001" inputmode="decimal"></label><label>Container + liquid, or liquid after tare (g)<input data-field="combined" type="number" step="0.0001" inputmode="decimal"></label><label>Liquid mass (g)<output data-field="mass">—</output></label><label>Density (g/mL)<output data-field="density">—</output></label></div><label class="lab-field-wide">Visible observation<textarea data-field="observation" rows="2" placeholder="Record only what you observe. Do not deliberately smell the sample."></textarea></label></article>
          </div>
          <div class="lab-actions"><button class="lab-button lab-button-secondary" type="button" data-action="back" data-back="2">Back</button><button class="lab-button lab-button-primary" type="button" data-action="next" data-next="4">Review calculations</button></div>
        </section>

        <section class="lab-stage" data-stage-panel="4" aria-labelledby="stage-4-title" hidden>
          <div class="lab-stage-heading"><span class="lab-stage-number">4</span><div><p class="lab-eyebrow">Stage 4</p><h2 id="stage-4-title">Review calculations</h2><p>Check each result before comparing the sample with the candidates.</p></div></div>
          <div class="lab-summary-grid"><div><span>Mean density</span><strong id="mean-density">—</strong><small>g/mL</small></div><div><span>Range</span><strong id="density-range">—</strong><small>g/mL</small></div><div><span>Sample temperature</span><strong id="summary-temperature">—</strong><small>°C</small></div></div>
          <div class="lab-table-wrap"><table class="lab-table"><caption>Calculated trial results</caption><thead><tr><th>Trial</th><th>Mass (g)</th><th>Volume (mL)</th><th>Density (g/mL)</th><th>Observation</th></tr></thead><tbody id="review-trials"><tr><td colspan="5">Enter three complete trials to calculate the review table.</td></tr></tbody></table></div>
          <div class="lab-instruction"><strong>Check:</strong> the mass should be for the liquid alone, all volumes should match, and the number of digits should be supported by your balance and volume tool.</div>
          <div class="lab-actions"><button class="lab-button lab-button-secondary" type="button" data-action="back" data-back="3">Back</button><button class="lab-button lab-button-primary" type="button" data-action="next" data-next="5">Compare candidates</button></div>
        </section>

        <section class="lab-stage" data-stage-panel="5" aria-labelledby="stage-5-title" hidden>
          <div class="lab-stage-heading"><span class="lab-stage-number">5</span><div><p class="lab-eyebrow">Stage 5</p><h2 id="stage-5-title">Compare candidates</h2><p>Enter the correct reference data supplied by your supervisor.</p></div></div>
          <div class="lab-form-grid lab-form-grid-compact"><label>Comparison tolerance (g/mL)<input id="tolerance" type="number" min="0" step="0.0001" inputmode="decimal" placeholder="Supervisor value" required></label></div>
          <div class="lab-table-wrap"><table class="lab-table lab-reference-table"><caption>Reference comparison</caption><thead><tr><th>Candidate</th><th>Form or concentration</th><th>Reference temperature (°C)</th><th>Reference density (g/mL)</th><th>Difference</th><th>Fits?</th></tr></thead><tbody id="candidate-rows"></tbody></table></div>
          <p class="lab-muted">Use a reference density for the same candidate form or concentration and a matching temperature. The page marks a candidate as fitting only when the absolute difference is no greater than the tolerance.</p>
          <div class="lab-result-callout" id="candidate-result" role="status">Enter reference values to see the comparison result.</div>
          <div class="lab-actions"><button class="lab-button lab-button-secondary" type="button" data-action="back" data-back="4">Back</button><button class="lab-button lab-button-primary" type="button" data-action="next" data-next="6">Write conclusion</button></div>
        </section>

        <section class="lab-stage" data-stage-panel="6" aria-labelledby="stage-6-title" hidden>
          <div class="lab-stage-heading"><span class="lab-stage-number">6</span><div><p class="lab-eyebrow">Stage 6</p><h2 id="stage-6-title">Save the record</h2><p>Write what the evidence supports. Density does not prove complete chemical identity.</p></div></div>
          <div class="lab-result-callout" id="final-result" role="status">Complete the calculations and candidate comparison first.</div>
          <label class="lab-field-wide">Conclusion<textarea id="conclusion" rows="5" placeholder="Example: Sample L-01 had a mean density of ... at ... °C, with a range of ... . The result is consistent with ... because ... ."></textarea></label>
          <div class="lab-actions lab-actions-wrap"><button class="lab-button lab-button-secondary" type="button" data-action="back" data-back="5">Back</button><button class="lab-button lab-button-secondary" type="button" data-action="save-draft">Save draft</button><button class="lab-button lab-button-primary" type="button" data-action="save-complete">Save completed record</button></div>
          <section class="lab-records" aria-labelledby="records-title"><div class="lab-records-heading"><div><p class="lab-eyebrow">SQLite records</p><h3 id="records-title">Saved experiments</h3></div><p class="lab-muted">Stored locally in this browser. Export a JSON copy for later review or backup.</p></div><div id="saved-records" class="lab-record-list"><p class="lab-empty">No saved records yet.</p></div></section>
        </section>
      </form>
    </main>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js"></script>
<script src="{{ '/assets/js/liquid-test-lab.js' | relative_url }}" defer></script>
