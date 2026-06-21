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
        document.getElementById('logo-display').textContent = data.text;
    }
}

async function loadHero() {
    const data = await dbGet('hero');
    if (data && data.title) {
        document.getElementById('hero-title').textContent = data.title;
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
    grid.innerHTML = services.map(s => `
        <div class="service-card">
            ${s.image ? `<img src="${s.image}" alt="${s.name}" class="service-image" loading="lazy">` : ''}
            <div class="service-content">
                <h3>${s.name}</h3>
                <p>${s.description}</p>
            </div>
        </div>
    `).join('');
}

async function loadPortfolio() {
    const data = await dbGet('portfolio');
    portfolioImages = data?.list || [];
    const grid = document.getElementById('portfolio-grid');

    if (portfolioImages.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;padding:40px 0;">Photos coming soon...</p>';
        return;
    }

    grid.innerHTML = portfolioImages.map((img, i) => `
        <div class="portfolio-item" onclick="openLightbox(${i})">
            <img src="${img}" alt="Portfolio ${i + 1}" loading="lazy">
            <div class="portfolio-overlay"></div>
        </div>
    `).join('');
}

async function loadCouples() {
    const data = await dbGet('couples');
    allCouples = data?.list || [];
    const grid = document.getElementById('couples-grid');

    if (allCouples.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;padding:40px 0;">Albums coming soon...</p>';
        return;
    }

    grid.innerHTML = allCouples.map((c, i) => `
        <div class="couple-card" onclick="openCoupleModal(${i})">
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
        slider.innerHTML = '<p style="text-align:center;color:#888;padding:40px 0;">Testimonials coming soon...</p>';
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
    }
    if (contact.instagram) document.getElementById('instagram-link').href = contact.instagram;
    if (contact.youtube) document.getElementById('youtube-link').href = contact.youtube;
}

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
