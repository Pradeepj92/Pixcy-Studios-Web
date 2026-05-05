// Admin Panel JavaScript
let servicesData = [];
let portfolioData = [];
let couplesData = [];
let testimonialsData = [];

window.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    setupTabSwitching();
    setupFileUploads();
});

function setupTabSwitching() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.querySelector(`[data-content="${btn.dataset.tab}"]`).classList.add('active');
        });
    });
}

function setupFileUploads() {
    const portfolioDrop = document.getElementById('portfolio-drop');
    const portfolioInput = document.getElementById('portfolio-input');

    portfolioDrop.addEventListener('dragover', (e) => {
        e.preventDefault();
        portfolioDrop.style.background = 'rgba(212, 175, 55, 0.1)';
    });

    portfolioDrop.addEventListener('dragleave', () => {
        portfolioDrop.style.background = '';
    });

    portfolioDrop.addEventListener('drop', (e) => {
        e.preventDefault();
        portfolioDrop.style.background = '';
        handlePortfolioFiles(e.dataTransfer.files);
    });

    portfolioInput.addEventListener('change', (e) => {
        handlePortfolioFiles(e.target.files);
    });
}

function loadAllData() {
    const savedData = {
        logo: localStorage.getItem('pixcy_logo'),
        hero: JSON.parse(localStorage.getItem('pixcy_hero') || '{}'),
        services: JSON.parse(localStorage.getItem('pixcy_services') || '[]'),
        portfolio: JSON.parse(localStorage.getItem('pixcy_portfolio') || '[]'),
        couples: JSON.parse(localStorage.getItem('pixcy_couples') || '[]'),
        testimonials: JSON.parse(localStorage.getItem('pixcy_testimonials') || '[]'),
        about: JSON.parse(localStorage.getItem('pixcy_about') || '{}'),
        contact: JSON.parse(localStorage.getItem('pixcy_contact') || '{}')
    };

    // Load logo
    if (savedData.logo) {
        document.getElementById('logo-text').value = savedData.logo;
    }

    // Load hero
    if (savedData.hero.title) {
        document.getElementById('hero-title').value = savedData.hero.title;
        document.getElementById('hero-subtitle').value = savedData.hero.subtitle;
    }

    // Load services
    servicesData = savedData.services;
    if (servicesData.length > 0) {
        displayServices();
    } else {
        addService(); // Add one empty service
    }

    // Load portfolio
    portfolioData = savedData.portfolio;
    displayPortfolioPreview();

    // Load couples
    couplesData = savedData.couples;
    if (couplesData.length > 0) {
        displayCouples();
    } else {
        addCouple();
    }

    // Load testimonials
    testimonialsData = savedData.testimonials;
    if (testimonialsData.length > 0) {
        displayTestimonials();
    } else {
        addTestimonial();
    }

    // Load about
    if (savedData.about.title) {
        document.getElementById('about-title').value = savedData.about.title;
        document.getElementById('about-text').value = savedData.about.text;
    }

    // Load contact
    if (savedData.contact.location) {
        document.getElementById('contact-location').value = savedData.contact.location;
        document.getElementById('contact-email').value = savedData.contact.email;
        document.getElementById('contact-phone').value = savedData.contact.phone;
        document.getElementById('whatsapp-number').value = savedData.contact.whatsapp || '';
        document.getElementById('instagram-url').value = savedData.contact.instagram || '';
        document.getElementById('youtube-url').value = savedData.contact.youtube || '';
    }
}

// Branding
function saveBranding() {
    const logoText = document.getElementById('logo-text').value;
    localStorage.setItem('pixcy_logo', logoText);
    showMessage('branding-message', 'Branding saved!');
}

// Hero
function saveHero() {
    const hero = {
        title: document.getElementById('hero-title').value,
        subtitle: document.getElementById('hero-subtitle').value
    };
    localStorage.setItem('pixcy_hero', JSON.stringify(hero));
    showMessage('hero-message', 'Hero section saved!');
}

// Services
function addService() {
    const container = document.getElementById('services-container');
    const index = servicesData.length;
    servicesData.push({ name: '', description: '', image: '' });

    const item = document.createElement('div');
    item.className = 'service-item';
    item.innerHTML = `
        <div class="form-group">
            <label>Service Name</label>
            <input type="text" class="service-name" placeholder="Wedding Photography">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="service-desc" rows="3" placeholder="Beautiful coverage of your special day..."></textarea>
        </div>
        <div class="form-group">
            <label>Service Image</label>
            <input type="file" class="service-image" accept="image/*" data-index="${index}">
            <div class="preview service-preview-${index}"></div>
        </div>
    `;
    container.appendChild(item);

    item.querySelector('.service-image').addEventListener('change', function(e) {
        handleServiceImage(e.target.files[0], this.dataset.index);
    });
}

function handleServiceImage(file, index) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            servicesData[index].image = e.target.result;
            document.querySelector(`.service-preview-${index}`).innerHTML = 
                `<img src="${e.target.result}" style="max-width: 200px;">`;
        };
        reader.readAsDataURL(file);
    }
}

function displayServices() {
    const container = document.getElementById('services-container');
    container.innerHTML = '';
    servicesData.forEach((service, index) => {
        const item = document.createElement('div');
        item.className = 'service-item';
        item.innerHTML = `
            <div class="form-group">
                <label>Service Name</label>
                <input type="text" class="service-name" value="${service.name}" placeholder="Wedding Photography">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="service-desc" rows="3" placeholder="Description...">${service.description}</textarea>
            </div>
            <div class="form-group">
                <label>Service Image</label>
                <input type="file" class="service-image" accept="image/*" data-index="${index}">
                <div class="preview service-preview-${index}">
                    ${service.image ? `<img src="${service.image}" style="max-width: 200px;">` : ''}
                </div>
            </div>
        `;
        container.appendChild(item);

        item.querySelector('.service-image').addEventListener('change', function(e) {
            handleServiceImage(e.target.files[0], this.dataset.index);
        });
    });
}

function saveServices() {
    const names = document.querySelectorAll('.service-name');
    const descs = document.querySelectorAll('.service-desc');

    servicesData = Array.from(names).map((input, i) => ({
        name: input.value,
        description: descs[i].value,
        image: servicesData[i]?.image || ''
    })).filter(s => s.name);

    localStorage.setItem('pixcy_services', JSON.stringify(servicesData));
    showMessage('services-message', 'Services saved!');
}

// Portfolio
function handlePortfolioFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                portfolioData.push(e.target.result);
                displayPortfolioPreview();
            };
            reader.readAsDataURL(file);
        }
    });
}

function displayPortfolioPreview() {
    const preview = document.getElementById('portfolio-preview');
    preview.innerHTML = '';
    portfolioData.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'preview-item';
        item.innerHTML = `
            <img src="${img}">
            <button class="preview-remove" onclick="removePortfolio(${index})">&times;</button>
        `;
        preview.appendChild(item);
    });
}

function removePortfolio(index) {
    portfolioData.splice(index, 1);
    displayPortfolioPreview();
}

function savePortfolio() {
    localStorage.setItem('pixcy_portfolio', JSON.stringify(portfolioData));
    showMessage('portfolio-message', 'Portfolio saved!');
}

// Couples
function addCouple() {
    const container = document.getElementById('couples-container');
    const index = couplesData.length;
    couplesData.push({ name: '', cover: '', photos: [] });

    const item = document.createElement('div');
    item.className = 'couple-item';
    item.innerHTML = `
        <div class="form-group">
            <label>Couple Name</label>
            <input type="text" class="couple-name" placeholder="Priya & Rahul">
        </div>
        <div class="form-group">
            <label>Cover Photo</label>
            <input type="file" class="couple-cover" accept="image/*" data-index="${index}">
            <div class="preview couple-cover-${index}"></div>
        </div>
        <div class="form-group">
            <label>Album Photos</label>
            <input type="file" class="couple-photos" multiple accept="image/*" data-index="${index}">
            <div class="preview-grid couple-photos-${index}"></div>
        </div>
    `;
    container.appendChild(item);

    setupCoupleHandlers(item, index);
}

function setupCoupleHandlers(item, index) {
    item.querySelector('.couple-cover').addEventListener('change', function(e) {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                couplesData[index].cover = ev.target.result;
                document.querySelector(`.couple-cover-${index}`).innerHTML = 
                    `<img src="${ev.target.result}" style="max-width: 200px;">`;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    item.querySelector('.couple-photos').addEventListener('change', function(e) {
        Array.from(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                couplesData[index].photos.push(ev.target.result);
                const grid = document.querySelector(`.couple-photos-${index}`);
                const div = document.createElement('div');
                div.className = 'preview-item';
                div.innerHTML = `<img src="${ev.target.result}">`;
                grid.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    });
}

function displayCouples() {
    const container = document.getElementById('couples-container');
    container.innerHTML = '';
    couplesData.forEach((couple, index) => {
        const item = document.createElement('div');
        item.className = 'couple-item';
        item.innerHTML = `
            <div class="form-group">
                <label>Couple Name</label>
                <input type="text" class="couple-name" value="${couple.name}">
            </div>
            <div class="form-group">
                <label>Cover Photo</label>
                <input type="file" class="couple-cover" accept="image/*" data-index="${index}">
                <div class="preview couple-cover-${index}">
                    ${couple.cover ? `<img src="${couple.cover}" style="max-width: 200px;">` : ''}
                </div>
            </div>
            <div class="form-group">
                <label>Album Photos</label>
                <input type="file" class="couple-photos" multiple accept="image/*" data-index="${index}">
                <div class="preview-grid couple-photos-${index}">
                    ${couple.photos.map(p => `<div class="preview-item"><img src="${p}"></div>`).join('')}
                </div>
            </div>
        `;
        container.appendChild(item);
        setupCoupleHandlers(item, index);
    });
}

function saveCouples() {
    const names = document.querySelectorAll('.couple-name');
    couplesData.forEach((couple, i) => {
        couple.name = names[i].value;
    });
    couplesData = couplesData.filter(c => c.name && c.cover);
    localStorage.setItem('pixcy_couples', JSON.stringify(couplesData));
    showMessage('couples-message', 'Couples saved!');
}

// Testimonials
function addTestimonial() {
    const container = document.getElementById('testimonials-container');
    testimonialsData.push({ text: '', author: '', role: '' });

    const item = document.createElement('div');
    item.className = 'testimonial-item';
    item.innerHTML = `
        <div class="form-group">
            <label>Testimonial Text</label>
            <textarea class="testimonial-text" rows="4" placeholder="Amazing work! We loved our photos..."></textarea>
        </div>
        <div class="form-group">
            <label>Client Name</label>
            <input type="text" class="testimonial-author" placeholder="Priya & Rahul">
        </div>
        <div class="form-group">
            <label>Event/Role (optional)</label>
            <input type="text" class="testimonial-role" placeholder="Wedding - Dec 2023">
        </div>
    `;
    container.appendChild(item);
}

function displayTestimonials() {
    const container = document.getElementById('testimonials-container');
    container.innerHTML = '';
    testimonialsData.forEach(testimonial => {
        const item = document.createElement('div');
        item.className = 'testimonial-item';
        item.innerHTML = `
            <div class="form-group">
                <label>Testimonial Text</label>
                <textarea class="testimonial-text" rows="4">${testimonial.text}</textarea>
            </div>
            <div class="form-group">
                <label>Client Name</label>
                <input type="text" class="testimonial-author" value="${testimonial.author}">
            </div>
            <div class="form-group">
                <label>Event/Role</label>
                <input type="text" class="testimonial-role" value="${testimonial.role}">
            </div>
        `;
        container.appendChild(item);
    });
}

function saveTestimonials() {
    const texts = document.querySelectorAll('.testimonial-text');
    const authors = document.querySelectorAll('.testimonial-author');
    const roles = document.querySelectorAll('.testimonial-role');

    testimonialsData = Array.from(texts).map((el, i) => ({
        text: el.value,
        author: authors[i].value,
        role: roles[i].value
    })).filter(t => t.text && t.author);

    localStorage.setItem('pixcy_testimonials', JSON.stringify(testimonialsData));
    showMessage('testimonials-message', 'Testimonials saved!');
}

// About
function saveAbout() {
    const about = {
        title: document.getElementById('about-title').value,
        text: document.getElementById('about-text').value
    };
    localStorage.setItem('pixcy_about', JSON.stringify(about));
    showMessage('about-message', 'About section saved!');
}

// Contact
function saveContact() {
    const contact = {
        location: document.getElementById('contact-location').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        whatsapp: document.getElementById('whatsapp-number').value,
        instagram: document.getElementById('instagram-url').value,
        youtube: document.getElementById('youtube-url').value
    };
    localStorage.setItem('pixcy_contact', JSON.stringify(contact));
    showMessage('contact-message', 'Contact info saved!');
}

function showMessage(id, text) {
    const msg = document.getElementById(id);
    msg.textContent = '✅ ' + text;
    msg.className = 'message success';
    setTimeout(() => msg.className = 'message', 3000);
}
