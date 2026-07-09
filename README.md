# BIOL 40B — Model Practical Trainer

A browser-based practice practical for the **lab models** (Neuron, Brain, Eye, Ear, Cochlea). It mirrors the real
exam: you're shown a model with numbers tagged on it and, for each number, you type **both the structure's name and
its function**. Names are graded strictly on spelling (with a "check your spelling" hint when you're close); functions
just need a genuine attempt and the model answer is always shown so you can learn it. Anything you miss comes back,
round after round, until every structure is cleared.

**Play it:** open `index.html` (or the GitHub Pages link).

## Coverage — 56 structures
| Model | Structures |
|-------|-----------|
| Neuron | 10 |
| Brain (sagittal) | 12 |
| Eye | 14 |
| Ear | 13 |
| Cochlea | 7 |

Every name and function is transcribed from the class answer keys.

## Built for retention
- **Active recall** — you type the answer from memory, not multiple choice.
- **Both name + function** every time — elaborative encoding beats memorizing a label alone.
- **A learn card after every answer** pairs the correct name with its function for a clean encoding moment.
- **Color-coded models** (neuron/brain red, eye green, ear/cochlea blue) give each model a consistent visual identity.
- **Retry until mastery** — missed structures re-queue each round until nothing is left, then "Take it again" reshuffles.

## Grading rules
- **Name:** strict. Case/punctuation normalized, real synonyms accepted (e.g. *eardrum* = *tympanic membrane*,
  *hammer* = *malleus*). A near-miss gets one spelling nudge, then it's marked wrong.
- **Function:** lax / self-check. Any genuine attempt is accepted; the model answer is always revealed so you can
  check yourself. You must give a function to clear an item.

## Files
| File | Purpose |
|------|---------|
| `index.html` | page structure |
| `styles.css` | model-practical visual identity, light + dark, per-model color |
| `app.js` | engine: dual-field grading, spelling tolerance, retry-until-mastery |
| `data.js` | question bank (names, synonyms, functions) from the answer keys |
| `images/` | upright crops of each numbered model photo |
| `build/` | image-prep scripts |

*Study aid — not for distribution. Model photos are from the class answer keys.*
