async function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    const loadedSrc = new Set(
        [...document.querySelectorAll('script[src]')].map(s => new URL(s.src, location.href).href)
    );

    for (const el of elements) {
        const file = el.getAttribute('data-include');
        try {
            const res = await fetch(file, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const html = await res.text();

            const temp = document.createElement('div');
            temp.innerHTML = html;


            temp.querySelectorAll('link[rel="stylesheet"], style').forEach(node => {
                document.head.appendChild(node.cloneNode(true));
            });


            el.innerHTML = temp.innerHTML;

            const scripts = [...temp.querySelectorAll('script')];
            for (const script of scripts) {
                const newScript = document.createElement('script');

                for (const attr of script.attributes) newScript.setAttribute(attr.name, attr.value);

                if (script.src) {
                    const abs = new URL(script.getAttribute('src'), location.href).href;
                    if (loadedSrc.has(abs)) continue;
                    newScript.src = abs;

                    await new Promise((resolve, reject) => {
                        newScript.onload = () => { loadedSrc.add(abs); resolve(); };
                        newScript.onerror = reject;
                        document.body.appendChild(newScript);
                    });
                } else {
                    newScript.textContent = script.textContent;
                    document.body.appendChild(newScript);
                }
            }

            if (window.initFlowbite) window.initFlowbite();

        } catch (err) {
            el.innerHTML = `<p style="color:red;">Không thể tải ${file}</p>`;
            console.error(`Lỗi include ${file}:`, err);
        }
    }

    document.dispatchEvent(new CustomEvent('includes:ready'));
}

document.addEventListener('DOMContentLoaded', includeHTML);
