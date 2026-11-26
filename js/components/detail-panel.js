import { $, esc } from "../utils/dom.js";

export function showDetail(patient) {
    const header = $("#detailHeader");
    const body = $("#detailBody");
    if (!header || !body) return;

    header.innerHTML = `
    <div class="person flex-grow-1">
      <div class="avatar avatar-lg" style="background:${patient.avatarBg};color:${patient.avatarFg}" aria-hidden="true">${esc(patient.initials)}</div>
      <div class="person-text">
        <span class="person-name" id="detailPanelLabel">
          ${esc(patient.name)}
          ${patient.vip ? '<span class="vip">VIP</span>' : ""}
        </span>
        <span class="person-id">ID: ${esc(patient.patientId)}</span>
      </div>
    </div>
    <button type="button" class="btn-close mt-1" data-bs-dismiss="offcanvas" aria-label="Close patient details"></button>
  `;

    body.innerHTML = `
    <section class="detail-section">
      <h3>Contact</h3>
      <dl class="row g-3 m-0">
        <div class="col-6 detail-item"><dt>Phone</dt><dd>${esc(patient.phone)}</dd></div>
        <div class="col-6 detail-item"><dt>Email</dt><dd>${esc(patient.email)}</dd></div>
        <div class="col-6 detail-item"><dt>Nationality</dt><dd><span class="country"><span class="flag" aria-hidden="true">${patient.flag}</span>${esc(patient.country)}</span></dd></div>
        <div class="col-6 detail-item"><dt>Occupation</dt><dd>${esc(patient.occupation)}</dd></div>
      </dl>
    </section>
    <section class="detail-section">
      <h3>Personal</h3>
      <dl class="row g-3 m-0">
        <div class="col-6 detail-item"><dt>Birthday</dt><dd>${esc(patient.birthday)} · ${patient.age} yrs</dd></div>
        <div class="col-6 detail-item"><dt>NRIC / Passport</dt><dd>${esc(patient.nric)}</dd></div>
        <div class="col-6 detail-item"><dt>Last visit</dt><dd>${esc(patient.lastVisit)}</dd></div>
        <div class="col-6 detail-item"><dt>Duration</dt><dd>${esc(patient.duration)}</dd></div>
      </dl>
    </section>
    <section class="detail-section">
      <h3>Medical remarks</h3>
      <div class="remarks">${esc(patient.remarks)}</div>
    </section>
  `;

    const panel = document.getElementById("detailPanel");
    if (panel) bootstrap.Offcanvas.getOrCreateInstance(panel).show();
}