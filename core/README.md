# Source Components (`core/`)

This directory contains the runtime files, loader configurations, and scripts for Firefox.

## Overview & Scope

- **Maintainer & Developer since August 2024:** ONEMEN (<tabmix.onemen@gmail.com>)

### Modifications

All modifications made in this repository are intended to maintain compatibility with modern Firefox
releases published since August 2024.

---

## Directory Structure & Licensing

### 1. Upstream Components (MPL 2.0)

- **Paths:**
  - `core/chrome/utils/` (except `core/chrome/utils/updater/`)
  - `core/fx-folder/`
- **Upstream Source:** Derived from
  [xiaoxiaoflood/firefox-scripts](https://github.com/xiaoxiaoflood/firefox-scripts) (Upstream commit
  [`eb11298`](https://github.com/xiaoxiaoflood/firefox-scripts/commit/eb11298bfacc609b8fd67850295256cd6b621d0f),
  Aug 20, 2024).
- **License:** [Mozilla Public License 2.0 (MPL 2.0)](./LICENSE)

---

### 2. Custom Components (MIT License)

- **Paths:**
  - `core/chrome/utils/updater/`
- **Description:** Original updater UI, styles, and update logic (`scriptsUpdater.sys.mjs`,
  `updater.js`, `scriptsUpdater.xhtml`, `update.css`, `updater-config.sys.mjs`, and associated
  assets).
- **Author & Copyright:** Copyright (c) 2026 ONEMEN (<tabmix.onemen@gmail.com>)
- **License:** [MIT License](../LICENSE)
