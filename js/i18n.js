document.addEventListener('DOMContentLoaded', () => {
    // Determine language from localStorage or default to 'pl'
    let currentLang = localStorage.getItem('monte_lang') || 'pl';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('monte_lang', lang);
        document.documentElement.lang = lang;

        // Update language switcher UI if it exists
        const langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update all elements with data-i18n
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (window.translations && window.translations[lang] && window.translations[lang][key]) {
                el.innerHTML = window.translations[lang][key];
            }
        });

        // Update Kardashev active description if we are on index.html
        if (typeof window.kardashevTranslations !== 'undefined') {
            const activeBtn = document.querySelector('.kardashev-btn.active');
            const mainDesc = document.getElementById('desc-text-main');
            if (activeBtn && mainDesc) {
                const type = activeBtn.getAttribute('data-type');
                mainDesc.innerHTML = window.kardashevTranslations[lang][type];
            }
        }
    }

    // Initialize Language Switcher Buttons
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Apply the initial language
    setLanguage(currentLang);

    // Intercept Kardashev logic to use translations
    const kBtns = document.querySelectorAll('.kardashev-btn');
    if (kBtns.length > 0) {
        kBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    // Update text according to current language
                    const type = btn.getAttribute('data-type');
                    const mainDesc = document.getElementById('desc-text-main');
                    if (window.kardashevTranslations && mainDesc) {
                        mainDesc.innerHTML = window.kardashevTranslations[currentLang][type];
                    }
                }, 500); // 500ms timeout matches the logic in index.html
            });
        });
    }
});
