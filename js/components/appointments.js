import { $, esc } from "../utils/dom.js";
import { appointments } from "../data.js";

const LABEL = { confirmed: "Confirmed", pending: "Pending", urgent: "Urgent" };

export function renderAppointments() {
    const grid = $("#apptGrid");
    if (!grid) return;

    grid.innerHTML = appointments.map((a) => `
    <div class="col-12 col-md-6 col-xl-3">
      <article class="appt-card">
        <span class="appt-date"><i class="bi bi-calendar3 me-1" aria-hidden="true"></i>${esc(a.date)} · ${esc(a.time)}</span>
        <h3 class="appt-title">${esc(a.type)}</h3>
        <div class="appt-doctor">
          <span class="avatar" aria-hidden="true">${esc(a.initials)}</span>
          ${esc(a.doctor)}
        </div>
        <p class="appt-note">${esc(a.note)}</p>
        <span class="status status--${a.status}">${LABEL[a.status]}</span>
      </article>
    </div>
  `).join("");
}