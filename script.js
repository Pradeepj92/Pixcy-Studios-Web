// Main scripts - navigation, forms, modals
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupModals();
    setupForms();
});

function setupNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function setupModals() {
    // Lightbox
    const lightbox = document.getElementById('lightbox');
    
    lightbox.querySelector('.lightbox-close').onclick = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightbox.querySelector('.lightbox-prev').onclick = () => {
        currentLightboxIndex = (currentLightboxIndex - 1 + portfolioImages.length) % portfolioImages.length;
        updateLightbox();
    };

    lightbox.querySelector('.lightbox-next').onclick = () => {
        currentLightboxIndex = (currentLightboxIndex + 1) % portfolioImages.length;
        updateLightbox();
    };

    lightbox.onclick = (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Couple modal
    const coupleModal = document.getElementById('couple-modal');
    
    coupleModal.querySelector('.modal-close').onclick = () => {
        coupleModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    coupleModal.onclick = (e) => {
        if (e.target === coupleModal) {
            coupleModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
            if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
        }
    });
}

function setupForms() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Save to localStorage
        const enquiries = JSON.parse(localStorage.getItem('pixcy_enquiries') || '[]');
        enquiries.push({ ...data, timestamp: new Date().toISOString() });
        localStorage.setItem('pixcy_enquiries', JSON.stringify(enquiries));
        
        alert('Thank you! We will contact you soon.');
        form.reset();
    });
}
