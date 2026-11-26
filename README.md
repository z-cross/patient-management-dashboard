# 患者管理 · Patient Management

A clean, responsive **patient management dashboard** for a clinic or medical practice. Built with vanilla JavaScript (ES modules), HTML partials, and Bootstrap 5 — no build step, no framework, just open it in a browser.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Stack](https://img.shields.io/badge/stack-Vanilla%20JS%20%2B%20Bootstrap%205-563d7c)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Overview

This project is a single-page admin dashboard for managing patient records and upcoming appointments. It loads its layout from reusable HTML partials, renders data from a small in-memory dataset, and uses Bootstrap components (offcanvas, modal, dropdown, toast) for interaction.

It is a **front-end prototype**: there is no backend, database, or authentication. Data resets on page reload.

---

## Features

- **Patient list** with live search across name, patient ID, NRIC, phone, country, and email
- **Filtering** by All / VIP / Non-VIP
- **Sortable columns** (name, nationality, datetime) with accessible `aria-sort` state
- **Pagination** with previous/next and numbered pages
- **Patient detail panel** (offcanvas) showing contact, personal, and medical information
- **Add patient** modal with form validation, avatar/flag generation, and a success toast
- **CSV export** of the currently visible (filtered/sorted) patients
- **Appointment cards** with confirmed / pending / urgent status badges
- **Responsive layout** with a collapsible sidebar on mobile
- **Accessibility** touches: skip link markup, ARIA labels, keyboard row activation, focus-friendly controls

---

## Tech Stack

| Layer      | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| Markup     | HTML5 + reusable partials loaded at runtime                   |
| Styling    | [Bootstrap 5.3](https://getbootstrap.com/) + custom CSS layers |
| Icons      | [Bootstrap Icons 1.11](https://icons.getbootstrap.com/)       |
| Fonts      | [Inter](https://fonts.google.com/specimen/Inter)              |
| Logic      | Vanilla JavaScript (ES modules), no dependencies             |

No bundler, package manager, or transpiler is required.

---

## Getting Started

Because the app fetches HTML partials with `fetch()`, it must be served over HTTP — opening `index.html` directly via `file://` will not work.

### Option 1 — Python (usually pre-installed)

```bash
cd patient-management
python3 -m http.server 8000
```

### Option 2 — Node.js

```bash
npx serve .
```

### Option 3 — Any static server

Point any static file server at the project root.

Then open **http://localhost:8000** in your browser.

---

## Project Structure

```
patient-management/
├── index.html                  # App shell + partial mount points
├── partials/                   # HTML fragments loaded at runtime
│   ├── sidebar.html
│   ├── topbar.html
│   ├── patient-table.html
│   ├── appointments.html
│   ├── detail-panel.html
│   └── add-patient-modal.html
├── css/
│   ├── main.css                # Aggregates all stylesheets
│   ├── tokens.css              # Design tokens (colors, spacing, etc.)
│   ├── base.css                # Base/reset styles
│   ├── sidebar.css
│   ├── topbar.css
│   ├── content.css
│   └── views/
│       ├── patient-table.css
│       ├── appointments.css
│       └── detail-panel.css
└── js/
    ├── main.js                 # Entry point: loads partials, boots views
    ├── data.js                 # Sample patients + appointments
    ├── components/
    │   ├── loader.js           # Fetches and mounts HTML partials
    │   ├── patient-table.js    # Search, filter, sort, pagination, add, export
    │   ├── appointments.js     # Renders appointment cards
    │   └── detail-panel.js     # Renders the patient detail offcanvas
    └── utils/
        ├── dom.js              # $ / $$ selectors + HTML escaping
        └── format.js           # Date/time formatting
```

---

## How It Works

1. `js/main.js` loads every partial in `partials/` and swaps each `[data-partial]` mount point with the fetched markup.
2. `initPatientTable()` wires up search, filter, sorting, pagination, CSV export, and the add-patient modal.
3. `renderAppointments()` fills the appointment grid.
4. Clicking a patient row (or its **View details** action) opens the offcanvas panel rendered by `detail-panel.js`.

### Sample data

Patient and appointment data lives in `js/data.js`. Edit that file to change the demo records. Newly added patients are prepended in memory and disappear on reload.

---

## Customization

- **Theme / colors** — edit the design tokens in `css/tokens.css`.
- **Layout & spacing** — adjust the per-area stylesheets in `css/` and `css/views/`.
- **Data model** — extend the objects in `js/data.js`; keep field names in sync with the templates in `js/components/`.
- **Branding** — update the clinic name and profile in `partials/sidebar.html` and `partials/topbar.html`.

---

## Browser Support

Works in all modern evergreen browsers (Chrome, Edge, Firefox, Safari) that support ES modules and `fetch`.

---

## Notes & Limitations

- Front-end only — no persistence, backend, or auth.
- Sample data is fictional and for demonstration purposes only.
- Several sidebar links and account menu items are placeholders (`href="#"`).

---

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).
