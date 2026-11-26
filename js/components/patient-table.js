import { $, $$, esc } from "../utils/dom.js";
import { formatDateTime } from "../utils/format.js";
import { patients } from "../data.js";
import { showDetail } from "./detail-panel.js";

const state = {
    query: "",
    filter: "all",
    sortKey: null,
    sortDir: "asc",
    page: 1,
    perPage: 6,
};

/* ---------- filtering ---------- */
function visible() {
    const q = state.query.trim().toLowerCase();
    let list = patients.filter((p) => {
        const hay = [p.name, p.patientId, p.nric, p.phone, p.country, p.email];
        const hit = !q || hay.some((v) => String(v).toLowerCase().includes(q));
        const ok = state.filter === "all" ? true
            : state.filter === "vip" ? p.vip
                : !p.vip;
        return hit && ok;
    });

    if (state.sortKey) {
        const dir = state.sortDir === "asc" ? 1 : -1;
        list = list.slice().sort((a, b) =>
            String(a[state.sortKey]).localeCompare(String(b[state.sortKey]), undefined, { numeric: true }) * dir
        );
    }
    return list;
}

/* ---------- row markup ---------- */
function rowHtml(p) {
    return `
    <tr data-id="${p.id}" tabindex="0" aria-label="Patient ${esc(p.name)}">
      <td>
        <div class="person">
          <div class="avatar" style="background:${p.avatarBg};color:${p.avatarFg}" aria-hidden="true">${esc(p.initials)}</div>
          <div class="person-text">
            <span class="person-name">${esc(p.name)}${p.vip ? ' <span class="vip">VIP</span>' : ""}</span>
            <span class="person-id">ID: ${esc(p.patientId)}</span>
          </div>
        </div>
      </td>
      <td>${esc(p.phone)}</td>
      <td><span class="country"><span class="flag" aria-hidden="true">${p.flag}</span>${esc(p.country)}</span></td>
      <td class="text-nowrap text-secondary">${formatDateTime(p.datetime)}</td>
      <td class="text-end">
        <div class="dropdown">
          <button type="button"
                  class="btn btn-ghost btn-icon"
                  data-bs-toggle="dropdown"
                  data-bs-boundary="viewport"
                  aria-expanded="false"
                  aria-label="Actions for ${esc(p.name)}">
            <i class="bi bi-three-dots-vertical" aria-hidden="true"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm">
            <li><button class="dropdown-item" type="button" data-act="view">View details</button></li>
            <li><button class="dropdown-item" type="button" data-act="edit">Edit patient</button></li>
            <li><button class="dropdown-item" type="button" data-act="schedule">Schedule appointment</button></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item text-danger" type="button" data-act="archive">Archive</button></li>
          </ul>
        </div>
      </td>
    </tr>
  `;
}

/* ---------- pagination ---------- */
function renderPagination(totalPages) {
    const el = $("#pagination");
    if (!el) return;

    const btn = (label, page, opts = {}) => `
    <li class="page-item ${opts.disabled ? "disabled" : ""} ${opts.active ? "active" : ""}">
      <button type="button" class="page-link" data-page="${page}" ${opts.disabled ? "disabled" : ""} aria-label="${opts.aria || `Page ${page}`}">${label}</button>
    </li>`;

    let html = btn('<i class="bi bi-chevron-left" aria-hidden="true"></i>', "prev",
        { disabled: state.page === 1, aria: "Previous page" });

    for (let i = 1; i <= totalPages; i++) {
        html += btn(i, i, { active: i === state.page, aria: `Page ${i}` });
    }

    html += btn('<i class="bi bi-chevron-right" aria-hidden="true"></i>', "next",
        { disabled: state.page === totalPages, aria: "Next page" });

    el.innerHTML = html;
}

/* ---------- render ---------- */
export function renderPatients() {
    const tbody = $("#patientBody");
    const table = $("#patientTable");
    const empty = $("#emptyState");
    const info = $("#resultsInfo");
    if (!tbody) return;

    const list = visible();
    const totalPages = Math.max(1, Math.ceil(list.length / state.perPage));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * state.perPage;
    const page = list.slice(start, start + state.perPage);

    tbody.innerHTML = page.map(rowHtml).join("");

    table.closest(".table-responsive").hidden = list.length === 0;
    empty.hidden = list.length !== 0;

    info.textContent = list.length === 0
        ? "Showing 0 of 0 results"
        : `Showing ${start + 1}–${start + page.length} of ${list.length} results`;

    renderPagination(totalPages);
    updateSortState();
}

function updateSortState() {
    $$(".th-sort").forEach((btn) => {
        const active = btn.dataset.sort === state.sortKey;
        btn.dataset.dir = active ? state.sortDir : "";
        btn.closest("th").setAttribute(
            "aria-sort",
            active ? (state.sortDir === "asc" ? "ascending" : "descending") : "none"
        );
    });
}

/* ============================================================
   Add patient
   ============================================================ */

const FLAGS = {
    "Malaysia": "🇲🇾", "Singapore": "🇸🇬", "Indonesia": "🇮🇩", "Vietnam": "🇻🇳",
    "India": "🇮🇳", "China": "🇨🇳", "Japan": "🇯🇵", "Ireland": "🇮🇪",
    "United Kingdom": "🇬🇧", "United Arab Emirates": "🇦🇪",
};

const AVATAR_PALETTE = [
    { bg: "#E8F0FE", fg: "#0052CC" },
    { bg: "#E6F7F0", fg: "#1F845A" },
    { bg: "#FFF3E0", fg: "#A55400" },
    { bg: "#F3E8FF", fg: "#6E3BB5" },
    { bg: "#E6F4FA", fg: "#006699" },
    { bg: "#FFEBE6", fg: "#BF2600" },
];

function initialsOf(name) {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function ageFromBirthday(iso) {
    if (!iso) return 0;
    const b = new Date(iso);
    const now = new Date();
    let age = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
    return age;
}

function formatBirthday(iso) {
    if (!iso) return "Not set";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function makePatient(formData) {
    const id = Math.max(0, ...patients.map((p) => p.id)) + 1;
    const pal = AVATAR_PALETTE[id % AVATAR_PALETTE.length];
    const country = formData.country || "Malaysia";

    return {
        id,
        name: formData.name.trim(),
        initials: initialsOf(formData.name),
        vip: !!formData.vip,
        avatarBg: pal.bg,
        avatarFg: pal.fg,
        patientId: `NEW-${String(id).padStart(4, "0")}`,
        phone: formData.phone.trim(),
        email: formData.email?.trim() || "—",
        country,
        flag: FLAGS[country] || "🌐",
        datetime: new Date().toISOString().slice(0, 16),
        nric: formData.nric?.trim() || "PENDING",
        birthday: formatBirthday(formData.birthday),
        age: ageFromBirthday(formData.birthday),
        occupation: formData.occupation?.trim() || "—",
        lastVisit: "New patient",
        duration: "—",
        remarks: formData.remarks?.trim() || "No medical remarks recorded.",
    };
}

function showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const el = document.createElement("div");
    el.className = "toast align-items-center text-bg-success border-0";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
    container.appendChild(el);

    const t = bootstrap.Toast.getOrCreateInstance(el, { delay: 3000 });
    t.show();
    el.addEventListener("hidden.bs.toast", () => el.remove());
}

export function initAddPatient() {
    const modalEl = document.getElementById("addPatientModal");
    const form = document.getElementById("addPatientForm");
    const addBtn = document.getElementById("addPatientBtn");
    if (!modalEl || !form) return;

    /* Open modal from the + button in the topbar */
    addBtn?.addEventListener("click", () => {
        form.reset();
        form.classList.remove("was-validated");
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
    });

    /* Submit */
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const patient = makePatient({
            name: form.elements.name.value,
            phone: form.elements.phone.value,
            email: form.elements.email.value,
            country: form.elements.country.value,
            occupation: form.elements.occupation.value,
            birthday: form.elements.birthday.value,
            nric: form.elements.nric.value,
            remarks: form.elements.remarks.value,
            vip: form.elements.vip.checked,
        });

        /* Prepend so the new patient is at the top */
        patients.unshift(patient);

        /* Reset all filters so they can't accidentally hide the new row */
        state.query = "";
        state.filter = "all";
        state.page = 1;

        const search = document.getElementById("patientSearch");
        if (search) search.value = "";
        const filter = document.getElementById("filterSelect");
        if (filter) filter.value = "all";

        renderPatients();

        /* Flash the new row so it's easy to spot */
        const row = document.querySelector(`#patientBody tr[data-id="${patient.id}"]`);
        row?.classList.add("is-new");
        row?.scrollIntoView({ behavior: "smooth", block: "center" });

        bootstrap.Modal.getInstance(modalEl)?.hide();
        showToast(`Patient “${patient.name}” added.`);
    });
}

/* ---------- wire ---------- */
export function initPatientTable() {

    const tbody = $("#patientBody");
    if (!tbody) return;

    /* sort */
    $$(".th-sort").forEach((btn) => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.sort;
            if (state.sortKey === key) state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
            else { state.sortKey = key; state.sortDir = "asc"; }
            state.page = 1;
            renderPatients();
        });
    });

    /* row click + keyboard */
    tbody.addEventListener("click", (e) => {
        const menu = e.target.closest(".dropdown");
        if (menu) {
            const act = e.target.closest("[data-act]")?.dataset.act;
            if (act === "view") {
                const id = Number(e.target.closest("tr[data-id]").dataset.id);
                showDetail(patients.find((p) => p.id === id));
            }
            return;
        }
        const tr = e.target.closest("tr[data-id]");
        if (tr) showDetail(patients.find((p) => p.id === Number(tr.dataset.id)));
    });

    tbody.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const tr = e.target.closest("tr[data-id]");
        if (!tr || e.target.closest("button")) return;
        e.preventDefault();
        showDetail(patients.find((p) => p.id === Number(tr.dataset.id)));
    });

    /* pagination */
    $("#pagination")?.addEventListener("click", (e) => {
        const b = e.target.closest("[data-page]");
        if (!b || b.disabled) return;
        const v = b.dataset.page;
        const totalPages = Math.max(1, Math.ceil(visible().length / state.perPage));
        if (v === "prev") state.page = Math.max(1, state.page - 1);
        else if (v === "next") state.page = Math.min(totalPages, state.page + 1);
        else state.page = Number(v);
        renderPatients();
    });

    /* search */
    let t;
    $("#patientSearch")?.addEventListener("input", (e) => {
        clearTimeout(t);
        t = setTimeout(() => { state.query = e.target.value; state.page = 1; renderPatients(); }, 150);
    });

    /* filter */
    $("#filterSelect")?.addEventListener("change", (e) => {
        state.filter = e.target.value;
        state.page = 1;
        renderPatients();
    });

    /* clear search */
    $("#clearSearchBtn")?.addEventListener("click", () => {
        const s = $("#patientSearch");
        if (s) s.value = "";
        const f = $("#filterSelect");
        if (f) f.value = "all";
        state.query = ""; state.filter = "all"; state.page = 1;
        renderPatients();
        s?.focus();
    });

    /* export */
    $("#exportBtn")?.addEventListener("click", () => {
        const list = visible();
        const rows = [["Name", "Patient ID", "Phone", "Nationality", "Datetime", "VIP"]];
        list.forEach((p) => rows.push([p.name, p.patientId, p.phone, p.country, formatDateTime(p.datetime), p.vip ? "Yes" : "No"]));
        const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
        const a = Object.assign(document.createElement("a"), { href: url, download: "patients.csv" });
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
    });

    /* add patient */
    $("#addPatientBtn")?.addEventListener("click", () => {
        console.log("Add patient — wire up modal next.");
    });

    initAddPatient();

    renderPatients();
}