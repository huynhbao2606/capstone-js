async function includeHTML() {
    const elements = document.querySelectorAll("[data-include]");
    const loadedSrc = new Set(
        [...document.querySelectorAll('script[src]')].map(s => new URL(s.src, location.origin).href)
    );

    for (const el of elements) {
        const file = el.getAttribute("data-include");
        try {
            const res = await fetch(file, { cache: "no-cache" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const html = await res.text();
            const temp = document.createElement("div");
            temp.innerHTML = html;

            // CSS
            temp.querySelectorAll('link[rel="stylesheet"], style').forEach(node => {
                const exists = [...document.head.querySelectorAll("link[rel='stylesheet']")]
                    .some(l => l.href === node.href);
                if (!exists) document.head.appendChild(node.cloneNode(true));
            });

            // Gắn HTML
            el.innerHTML = temp.innerHTML;

            // Chạy lại tất cả script bên trong include
            const scripts = [...temp.querySelectorAll("script")];
            for (const script of scripts) {
                const newScript = document.createElement("script");

                // Copy thuộc tính
                for (const attr of script.attributes) {
                    newScript.setAttribute(attr.name, attr.value);
                }

                if (script.src) {
                    const abs = new URL(script.getAttribute("src"), location.origin).href;
                    if (loadedSrc.has(abs)) continue; // tránh load trùng
                    loadedSrc.add(abs);
                    await new Promise((resolve, reject) => {
                        newScript.onload = resolve;
                        newScript.onerror = reject;
                        newScript.src = abs;
                        document.body.appendChild(newScript);
                    });
                } else {
                    newScript.textContent = script.textContent;
                    document.body.appendChild(newScript);
                }
            }

        } catch (err) {
            el.innerHTML = `<p style="color:red;">Không thể tải ${file}</p>`;
            console.error(`Lỗi include ${file}:`, err);
        }
    }

    window.includesReady = true;
    document.dispatchEvent(new CustomEvent("includes:ready"));
}

document.addEventListener("DOMContentLoaded", () => {
    includeHTML().then(() => {
        console.log("✅ All includes loaded");
    });
});
