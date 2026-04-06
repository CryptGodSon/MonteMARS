document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    const navbar = document.querySelector('.navbar');

    if (menuToggle && navLinks && navbar) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navbar.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                menuToggle.innerHTML = '&times;';
            } else {
                menuToggle.innerHTML = '&#9776;';
            }
        });
        
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navbar.classList.remove('active');
                menuToggle.innerHTML = '&#9776;';
            });
        });

        // ============================================
        // LOGIKA SCROLLOWANIA (Scroll Down/Up)
        // ============================================
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // 1. Tło paska (gdy przescrollujemy kawałek)
            if (currentScroll > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }

            // 2. Ukrywanie / Pokazywanie
            // Nie ukrywaj jeśli menu mobilne jest otwarte
            if (navbar.classList.contains('active')) return;

            if (currentScroll > lastScroll && currentScroll > 150) {
                // Scroll w dół — ukryj
                navbar.classList.add('nav-hidden');
            } else {
                // Scroll w górę — pokaż
                navbar.classList.remove('nav-hidden');
            }
            
            lastScroll = currentScroll;
        });
    }
});
