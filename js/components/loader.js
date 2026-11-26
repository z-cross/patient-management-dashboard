/**
 * Fetch an HTML partial and replace its mount point with the real element.
 * Using replaceWith (not innerHTML) keeps the loaded <aside>/<header>
 * as a direct child of the flex container, so sticky + flex sizing work.
 */
export async function loadPartial(url, mountSelector) {
    const mount = document.querySelector(mountSelector);
    if (!mount) {
        console.error(`[loader] Mount point not found: ${mountSelector}`);
        return;
    }

    try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

        const tpl = document.createElement("template");
        tpl.innerHTML = (await res.text()).trim();
        mount.replaceWith(tpl.content);
    } catch (err) {
        console.error(`[loader] Failed to load ${url}:`, err);
        mount.innerHTML = `<div class="alert alert-danger m-3 mb-0">Failed to load ${url}</div>`;
    }
}