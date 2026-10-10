// ============================================================
//  MONTE — Internationalization engine (PL / EN)
//  Exposes a global `window.i18n` helper so that static markup
//  (via data-i18n attributes) AND dynamically generated content
//  (counters, the resource table, etc.) can all share one source
//  of truth. Whenever the language changes a `languageChanged`
//  event is dispatched on `document` so page scripts can re-render.
// ============================================================
(function () {
    let currentLang = localStorage.getItem('monte_lang') || 'pl';

    function translate(key) {
        const dict = window.translations && window.translations[currentLang];
        if (dict && dict[key] !== undefined) return dict[key];
        // Fall back to Polish, then to the key itself.
        const fallback = window.translations && window.translations.pl;
        if (fallback && fallback[key] !== undefined) return fallback[key];
        return key;
    }

    // Public API — available synchronously as soon as this file runs.
    window.i18n = {
        get lang() { return currentLang; },
        t: translate,
        setLanguage: setLanguage
    };

    function applyStaticTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const dict = window.translations && window.translations[currentLang];
            if (dict && dict[key] !== undefined) {
                el.innerHTML = dict[key];
            }
        });

        // Translatable attributes, e.g. <input data-i18n-attr="placeholder:some_key">
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
                const [attr, key] = pair.split(':').map(s => s && s.trim());
                if (attr && key) {
                    const val = translate(key);
                    if (val !== key) el.setAttribute(attr, val);
                }
            });
        });
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('monte_lang', lang);
        document.documentElement.lang = lang;

        // Update language switcher UI
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        applyStaticTranslations();

        // Let page-specific scripts re-render any dynamic content.
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    function init() {
        // Wire up the language switcher buttons.
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                setLanguage(btn.getAttribute('data-lang'));
            });
        });

        // Apply the initial language.
        setLanguage(currentLang);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
