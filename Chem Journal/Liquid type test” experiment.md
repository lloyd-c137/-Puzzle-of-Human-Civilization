---
layout: default
title: Liquid Type Test Experiment
permalink: /chemistry/liquid-type-test/
section: Chemistry
summary: A safety-first density experiment for comparing a supervised classroom sample with candidate liquids.
---

# Liquid Type Test Experiment

## Objective

Measure the sample's density and compare it with the supplied candidate liquids.

## Safety gate

Proceed only when all boxes are checked:

- [ ] The sample is a supervised classroom/laboratory sample.
- [ ] The sample has a code and belongs to a known candidate list.
- [ ] A supervisor approved the test and provided waste instructions.
- [ ] Goggles, gloves, and a lab coat/apron are available.
- [ ] The balance, volume tool, thermometer, labels, spill tray, and waste container are ready.
- [ ] There is no open flame, heating, tasting, or mouth pipetting.

If any box is unchecked, stop and record: **Not tested — safety requirement missing.**

Never test a bottle of genuinely unknown liquid. Do not open, smell, taste, touch, heat, mix, or pour it into a drain.

## Equipment

- balance
- clean, dry container with lid
- graduated cylinder, pipette, or other supervisor-approved volume tool
- thermometer
- labels and pen
- spill tray
- approved chemical-waste container

## Procedure

1. Record the sample code, candidate list, date, and sample temperature.
2. Label the container with the sample code and place it in the spill tray.
3. Place the clean, dry container **and lid** on the balance.
   - If using tare, press tare and record the balance reading as `0.00 g`.
   - Otherwise, record the empty-container mass as $m_1$.
4. Measure exactly the same volume for every trial. Use **10.00 mL** unless the supervisor specifies another volume.
5. Transfer the sample into the container. Close the lid.
6. Record the mass:
   - after taring: record the liquid mass directly as $m_2$;
   - without taring: record the container-plus-liquid mass as $m_3$.
7. Record visible observations. Do not deliberately smell the sample.
8. Dispose of the sample exactly as the supervisor instructed. Never return it to the original container or pour it into a sink.
9. Clean and dry the container as instructed, or use another clean, dry container.
10. Repeat Steps 3–9 until you have **three trials**.
11. Stop and notify the supervisor immediately if there is a spill, strong vapor, pressure, heating, reaction, leak, or other unexpected change.

## Data table

| Trial | Temperature (°C) | Volume (mL) | Empty container (g) | Container + liquid (g) | Liquid mass (g) | Density (g/mL) | Observation |
|---|---:|---:|---:|---:|---:|---:|---|
| 1 |  | 10.00 |  |  |  |  |  |
| 2 |  | 10.00 |  |  |  |  |  |
| 3 |  | 10.00 |  |  |  |  |  |

## Calculations

If the balance was not tared:

$$
m_{\text{liquid}} = m_{\text{container+liquid}} - m_{\text{empty container}}
$$

For each trial:

$$
D = \frac{m_{\text{liquid}}}{V}
$$

Then calculate:

$$
\bar{D} = \frac{D_1 + D_2 + D_3}{3}
$$

$$
\text{range} = D_{\text{highest}} - D_{\text{lowest}}
$$

Record:

- Mean density: `__________ g/mL`
- Range: `__________ g/mL`
- Sample temperature: `__________ °C`
- Candidate comparison tolerance: `__________ g/mL`

## Compare with candidates

Use reference densities measured at the same or a very similar temperature.

For each candidate:

$$
\Delta = \left|\bar{D} - D_{\text{reference}}\right|
$$

Mark **Fits** only when the absolute difference is no greater than the supervisor's comparison tolerance.

| Candidate | Reference density (g/mL) | Absolute difference (g/mL) | Fits? |
|---|---:|---:|---|
|  |  |  | Yes / No |
|  |  |  | Yes / No |
|  |  |  | Yes / No |

## Result rule

- **Exactly one candidate fits:** report **“consistent with [candidate]”**.
- **Two or more candidates fit:** report **“inconclusive — density cannot distinguish the candidates.”**
- **No candidate fits:** report **“inconclusive — check the measurements, temperature, sample, and candidate list.”**

Density supports a candidate; it does not prove complete chemical identity.

## Conclusion

> Sample `__________` had a mean density of `__________ g/mL` at `__________ °C`, with a range of `__________ g/mL`. The result is **[consistent with / inconclusive for]** `__________` because `__________`.
