import { loadPartial } from "./components/loader.js";
import { initPatientTable } from "./components/patient-table.js";
import { renderAppointments } from "./components/appointments.js";

const PARTIALS = [
    { url: "partials/sidebar.html", mount: '[data-partial="sidebar"]' },
    { url: "partials/topbar.html", mount: '[data-partial="topbar"]' },
    { url: "partials/patient-table.html", mount: '[data-partial="patient-table"]' },
    { url: "partials/appointments.html", mount: '[data-partial="appointments"]' },
    { url: "partials/detail-panel.html", mount: '[data-partial="detail-panel"]' },
    { url: "partials/add-patient-modal.html", mount: '[data-partial="add-patient-modal"]' }, 
];

async function boot() {
    await Promise.all(PARTIALS.map((p) => loadPartial(p.url, p.mount)));
    initPatientTable();
    renderAppointments();
}

boot();