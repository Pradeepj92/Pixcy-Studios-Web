// Content Loader — Pixcy Studios
// Reads all content from Supabase, images already served from Cloudinary URLs

import { dbGet } from './config.js';

// Track data for lightbox/modals
let portfolioImages = [];
let allCouples = [];
let currentLightboxIndex = 0;

window.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadBranding(),
        loadHero(),
        loadServices(),
        loadPortfolio(),
        loadVideos(),
        loadCouples(),
        loadTestimonials(),
        loadAbout(),
        loadContact()
    ]);
});

// Make these available globally for onclick in HTML
window.openLightbox = openLightbox;
window.nextPhoto = nextPhoto;
window.prevPhoto = prevPhoto;
window.openCoupleModal = openCoupleModal;
window.openCouplePhoto = openCouplePhoto;

async function loadBranding() {
    const data = await dbGet('logo');
    if (data && data.text) {
        document.getElementById('logo-display').innerHTML = `${data.text.split(' ')[0]}<span>${data.text.split(' ').slice(1).join(' ')}</span>`;
    }
}

async function loadHero() {
    const data = await dbGet('hero');
    if (data && data.title) {
        const titleParts = data.title.split(' ');
        const lastWord = titleParts.pop();
        document.getElementById('hero-title').innerHTML = `${titleParts.join(' ')} <span id="hero-title-span">${lastWord}</span>`;
        document.getElementById('hero-subtitle').textContent = data.subtitle || '';
    }
}

async function loadServices() {
    const data = await dbGet('services');
    let services = data?.list || [];

    if (services.length === 0) {
        services = [
            { name: 'Wedding Photography', description: 'Traditional & candid coverage of your special day', image: '' },
            { name: 'Pre-Wedding Shoots', description: 'Romantic outdoor & studio sessions', image: '' },
            { name: 'Maternity Shoots', description: 'Celebrating the beautiful journey to motherhood', image: '' }
        ];
    }

    const grid = document.getElementById('services-grid');
    grid.innerHTML = services.map((s, i) => `
        <div class="svc-row">
            <div class="svc-num">0${i + 1}</div>
            ${s.image ? `<div class="svc-img-container"><img src="${s.image}" alt="${s.name}" loading="lazy"></div>` : `<div class="svc-img-container"></div>`}
            <div class="svc-info">
                <div class="svc-name">${s.name}</div>
                <div class="svc-desc">${s.description}</div>
            </div>
        </div>
    `).join('');
}

async function loadPortfolio() {
    const data = await dbGet('portfolio');
    portfolioImages = data?.list || [];
    const grid = document.getElementById('portfolio-grid');

    if (portfolioImages.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:40px 0;">Photos coming soon...</p>';
        return;
    }

    grid.innerHTML = portfolioImages.map((img, i) => `
        <div class="p-item ${i === 0 ? 'p1' : ''}" onclick="openLightbox(${i})">
            <img src="${img}" alt="Portfolio ${i + 1}" loading="lazy">
        </div>
    `).join('');
}

async function loadVideos() {
    const data = await dbGet('videos');
    const videos = data?.list || [];
    const grid = document.getElementById('videos-grid');
    if (!grid) return;

    if (videos.length === 0) {
        grid.innerHTML = '<div class="videos-placeholder">No videos added yet. Add YouTube video URLs in your admin panel.</div>';
        return;
    }

    grid.innerHTML = videos.map(url => {
        // Convert any youtube URL format to embed URL
        let embedUrl = url;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([-\w]+)/);
        if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`;
        return `
            <div class="video-embed">
                <iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
            </div>
        `;
    }).join('');
}

async function loadCouples() {
    const data = await dbGet('couples');
    allCouples = data?.list || [];
    const grid = document.getElementById('couples-grid');

    if (allCouples.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--muted);padding:40px 0;">Albums coming soon...</p>';
        return;
    }

    grid.innerHTML = allCouples.map((c, i) => `
        <div class="p-item ${i === 0 ? 'p1' : ''}" onclick="openCoupleModal(${i})">
            <img src="${c.cover}" alt="${c.name}" loading="lazy">
            <div class="couple-info">
                <h3 class="couple-name">${c.name}</h3>
                <p class="couple-count">${(c.photos || []).length} Photos</p>
            </div>
        </div>
    `).join('');
}

async function loadTestimonials() {
    const data = await dbGet('testimonials');
    const testimonials = data?.list || [];
    const slider = document.getElementById('testimonials-slider');

    if (testimonials.length === 0) {
        slider.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px 0;">Testimonials coming soon...</p>';
        return;
    }

    let html = testimonials.map((t, i) => {
        const initial = t.author ? t.author.charAt(0).toUpperCase() : 'G';
        return `
        <div class="testimonial-slide ${i === 0 ? 'active' : ''}" id="test-slide-${i}">
            <div class="google-review-card">
                <div class="google-review-header">
                    <div class="google-reviewer">
                        <div class="google-avatar">${initial}</div>
                        <div>
                            <div class="google-name">${t.author}</div>
                            <div class="google-date">a month ago</div>
                        </div>
                    </div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" class="google-icon">
                </div>
                <div class="google-stars">★★★★★</div>
                <div class="google-text">"${t.text}"</div>
            </div>
        </div>
    `}).join('');

    if (testimonials.length > 1) {
        html += `
            <div class="test-nav">
                ${testimonials.map((_, i) => `<div class="test-dot ${i === 0 ? 'active' : ''}" onclick="showTestimonial(${i})"></div>`).join('')}
            </div>
        `;
        
        window.showTestimonial = (index) => {
            document.querySelectorAll('.testimonial-slide').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.test-dot').forEach(el => el.classList.remove('active'));
            document.getElementById(`test-slide-${index}`).classList.add('active');
            document.querySelectorAll('.test-dot')[index].classList.add('active');
        };
    }
    
    slider.innerHTML = html;
}

async function loadAbout() {
    const data = await dbGet('about');
    if (data && data.title) {
        document.getElementById('about-title').textContent = data.title;
        document.getElementById('about-content').innerHTML = data.text || '';
    }
    if (data && data.image) {
        document.getElementById('about-image').src = data.image;
    }
}

async function loadContact() {
    const contact = await dbGet('contact');
    if (!contact) return;

    if (contact.location) document.getElementById('contact-location').textContent = contact.location;
    if (contact.email) {
        const el = document.getElementById('contact-email');
        el.textContent = contact.email;
        el.href = 'mailto:' + contact.email;
    }
    if (contact.phone) {
        const el = document.getElementById('contact-phone');
        el.textContent = contact.phone;
        el.href = 'tel:' + contact.phone;
    }
    if (contact.whatsapp) {
        const waFloat = document.getElementById('whatsapp-float');
        waFloat.href = `https://wa.me/${contact.whatsapp}`;
        waFloat.style.display = 'flex';
        window.waNumber = contact.whatsapp;
    }
    if (contact.instagram) {
        const igUrl = contact.instagram;
        ['instagram-link', 'header-ig', 'footer-ig'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.href = igUrl;
        });
    }
    if (contact.youtube) {
        const ytUrl = contact.youtube;
        ['youtube-link', 'header-yt', 'footer-yt', 'videos-yt-btn'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.href = ytUrl;
        });
    }
}

window.submitToWhatsApp = function(event) {
    event.preventDefault();
    const name = document.getElementById('wa-name').value;
    const email = document.getElementById('wa-email').value;
    const phone = document.getElementById('wa-phone').value;
    const service = document.getElementById('wa-service').value;
    const msg = document.getElementById('wa-msg').value;
    
    const text = `Hello Pixcy Studios!%0A%0A*New Inquiry from Website*%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Email:* ${email}%0A*Service Interested:* ${service}%0A*Details:* ${msg}`;
    const waNumber = window.waNumber || '919876543210';
    
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
};

// ─── Lightbox ──────────────────────────────────────────────────────────────
function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
    document.querySelector('.lightbox-img').src = portfolioImages[currentLightboxIndex] || '';
}

function nextPhoto() {
    currentLightboxIndex = (currentLightboxIndex + 1) % portfolioImages.length;
    updateLightboxImage();
}

function prevPhoto() {
    currentLightboxIndex = (currentLightboxIndex - 1 + portfolioImages.length) % portfolioImages.length;
    updateLightboxImage();
}

// ─── Couple Modal ─────────────────────────────────────────────────────────
function openCoupleModal(index) {
    const couple = allCouples[index];
    if (!couple) return;
    document.getElementById('modal-title').textContent = couple.name;
    document.getElementById('modal-grid').innerHTML = (couple.photos || []).map((p, i) =>
        `<img src="${p}" alt="${couple.name} ${i + 1}" loading="lazy" onclick="openCouplePhoto(${index}, ${i})">`
    ).join('');
    document.getElementById('couple-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openCouplePhoto(coupleIndex, photoIndex) {
    portfolioImages = allCouples[coupleIndex].photos || [];
    currentLightboxIndex = photoIndex;
    updateLightboxImage();
    document.getElementById('couple-modal').classList.remove('active');
    document.getElementById('lightbox').classList.add('active');
}
