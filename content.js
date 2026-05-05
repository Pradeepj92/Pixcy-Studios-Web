// Content loader - loads all content from localStorage
window.addEventListener('DOMContentLoaded', () => {
    loadBranding();
    loadHero();
    loadServices();
    loadPortfolio();
    loadCouples();
    loadTestimonials();
    loadAbout();
    loadContact();
});

function loadBranding() {
    const logo = localStorage.getItem('pixcy_logo');
    if (logo) {
        document.getElementById('logo-display').textContent = logo;
    }
}

function loadHero() {
    const hero = JSON.parse(localStorage.getItem('pixcy_hero') || '{}');
    if (hero.title) {
        document.getElementById('hero-title').textContent = hero.title;
        document.getElementById('hero-subtitle').textContent = hero.subtitle;
    }
}

function loadServices() {
    const services = JSON.parse(localStorage.getItem('pixcy_services') || '[]');
    const grid = document.getElementById('services-grid');
    
    if (services.length === 0) {
        // Default services
        services.push(
            { name: 'Wedding Photography', description: 'Traditional & candid coverage of your special day', image: '' },
            { name: 'Pre-Wedding Shoots', description: 'Romantic outdoor & studio sessions', image: '' },
            { name: 'Maternity Shoots', description: 'Celebrating the beautiful journey to motherhood', image: '' }
        );
    }

    grid.innerHTML = services.map(s => `
        <div class="service-card">
            ${s.image ? `<img src="${s.image}" alt="${s.name}" class="service-image">` : ''}
            <div class="service-content">
                <h3>${s.name}</h3>
                <p>${s.description}</p>
            </div>
        </div>
    `).join('');
}

function loadPortfolio() {
    const portfolio = JSON.parse(localStorage.getItem('pixcy_portfolio') || '[]');
    const grid = document.getElementById('portfolio-grid');
    
    if (portfolio.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Add photos from Admin Panel</p>';
        return;
    }

    grid.innerHTML = portfolio.map((img, i) => `
        <div class="portfolio-item" onclick="openLightbox(${i})">
            <img src="${img}" alt="Portfolio ${i+1}">
            <div class="portfolio-overlay"></div>
        </div>
    `).join('');
}

function loadCouples() {
    const couples = JSON.parse(localStorage.getItem('pixcy_couples') || '[]');
    const grid = document.getElementById('couples-grid');
    
    if (couples.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #888;">Add couple albums from Admin Panel</p>';
        return;
    }

    grid.innerHTML = couples.map((c, i) => `
        <div class="couple-card" onclick="openCoupleModal(${i})">
            <img src="${c.cover}" alt="${c.name}">
            <div class="couple-info">
                <h3 class="couple-name">${c.name}</h3>
                <p class="couple-count">${c.photos.length} Photos</p>
            </div>
        </div>
    `).join('');
}

function loadTestimonials() {
    const testimonials = JSON.parse(localStorage.getItem('pixcy_testimonials') || '[]');
    const slider = document.getElementById('testimonials-slider');
    
    if (testimonials.length === 0) {
        slider.innerHTML = '<p style="text-align: center; color: #888;">Add testimonials from Admin Panel</p>';
        return;
    }

    slider.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">"${t.text}"</p>
            <div class="testimonial-author">${t.author}</div>
            ${t.role ? `<div class="testimonial-role">${t.role}</div>` : ''}
        </div>
    `).join('');
}

function loadAbout() {
    const about = JSON.parse(localStorage.getItem('pixcy_about') || '{}');
    if (about.title) {
        document.getElementById('about-title').textContent = about.title;
        document.getElementById('about-content').innerHTML = about.text;
    }
}

function loadContact() {
    const contact = JSON.parse(localStorage.getItem('pixcy_contact') || '{}');
    if (contact.location) {
        document.getElementById('contact-location').textContent = contact.location;
        document.getElementById('contact-email').textContent = contact.email;
        document.getElementById('contact-email').href = 'mailto:' + contact.email;
        document.getElementById('contact-phone').textContent = contact.phone;
        document.getElementById('contact-phone').href = 'tel:' + contact.phone;
        
        if (contact.whatsapp) {
            const waFloat = document.getElementById('whatsapp-float');
            waFloat.href = `https://wa.me/${contact.whatsapp}`;
            waFloat.style.display = 'flex';
        }
        
        if (contact.instagram) {
            document.getElementById('instagram-link').href = contact.instagram;
        }
        
        if (contact.youtube) {
            document.getElementById('youtube-link').href = contact.youtube;
        }
    }
}

// Lightbox
let currentLightboxIndex = 0;
let portfolioImages = [];

function openLightbox(index) {
    portfolioImages = JSON.parse(localStorage.getItem('pixcy_portfolio') || '[]');
    currentLightboxIndex = index;
    updateLightbox();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightbox() {
    const img = document.querySelector('.lightbox-img');
    img.src = portfolioImages[currentLightboxIndex];
}

function openCoupleModal(index) {
    const couples = JSON.parse(localStorage.getItem('pixcy_couples') || '[]');
    const couple = couples[index];
    
    document.getElementById('modal-title').textContent = couple.name;
    document.getElementById('modal-grid').innerHTML = couple.photos.map((p, i) => 
        `<img src="${p}" alt="${couple.name} ${i+1}" onclick="openCouplePhoto(${index}, ${i})">`
    ).join('');
    
    document.getElementById('couple-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openCouplePhoto(coupleIndex, photoIndex) {
    const couples = JSON.parse(localStorage.getItem('pixcy_couples') || '[]');
    portfolioImages = couples[coupleIndex].photos;
    currentLightboxIndex = photoIndex;
    updateLightbox();
    document.getElementById('couple-modal').classList.remove('active');
    document.getElementById('lightbox').classList.add('active');
}
