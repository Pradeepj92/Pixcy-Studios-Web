// Main scripts - navigation, forms
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModals();
    setupCookieConsent();
});

function setupNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If the href was dynamically updated to a real URL, let the browser handle it
            if (!href.startsWith('#')) return; 
            if (href === '#') return;
            
            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                }
            } catch (err) {
                // Ignore DOMException for invalid selectors
            }
        });
    });

    // Active nav on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section[id]').forEach(section => {
            if (window.pageYOffset >= section.offsetTop - 150) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    });
}

function setupModals() {
    const lightbox = document.getElementById('lightbox');

    // Close lightbox
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    // Prev / Next — delegate to functions exposed by content.js
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => window.prevPhoto && window.prevPhoto());
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => window.nextPhoto && window.nextPhoto());

    // Couple modal close
    const coupleModal = document.getElementById('couple-modal');
    coupleModal.querySelector('.modal-close').addEventListener('click', closeCoupleModal);
    coupleModal.addEventListener('click', e => { if (e.target === coupleModal) closeCoupleModal(); });

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') window.prevPhoto && window.prevPhoto();
            if (e.key === 'ArrowRight') window.nextPhoto && window.nextPhoto();
        }
        if (coupleModal.classList.contains('active') && e.key === 'Escape') closeCoupleModal();
    });
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function closeCoupleModal() {
    document.getElementById('couple-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function loadGoogleAnalytics() {
    const id = window.GA_MEASUREMENT_ID;
    if (!id || id === 'G-XXXXXXXXXX') return; // placeholder not yet replaced — skip

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id);
}

function loadClarity() {
    const id = window.CLARITY_ID;
    if (!id) return;

    (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
        t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", id);
}

function setupCookieConsent() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted') {
        loadGoogleAnalytics();
        loadClarity();
        return;
    }
    if (consent === 'declined') return;

    banner.hidden = false;

    document.getElementById('cookie-accept').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.hidden = true;
        loadGoogleAnalytics();
        loadClarity();
    });

    document.getElementById('cookie-decline').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        banner.hidden = true;
    });
}
