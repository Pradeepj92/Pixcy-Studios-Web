// Main scripts - navigation, forms
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModals();
    setupForms();
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

function setupForms() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        alert('Thank you! We will contact you soon.');
        form.reset();
    });
}
