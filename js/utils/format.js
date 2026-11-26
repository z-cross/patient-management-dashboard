/** ISO → "DD MMM YYYY HH:MM AM/PM" */
export function formatDateTime(iso) {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = d.toLocaleString("en-US", { month: "short" });
    const yr = d.getFullYear();
    const h24 = d.getHours();
    const h = String(h24 % 12 || 12).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ap = h24 >= 12 ? "PM" : "AM";
    return `${day} ${mon} ${yr} ${h}:${mm} ${ap}`;
}