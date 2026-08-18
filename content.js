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

// Apply Cloudinary auto-format/auto-quality + width cap to any Cloudinary URL.
// Non-Cloudinary URLs (Unsplash, YouTube thumbnails, etc.) are returned unchanged.
function optimize(url, width) {
    if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}

// Fisher-Yates shuffle
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

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
    if (data && data.image) {
        const heroImg = document.querySelector('.hero-img img');
        if (heroImg) {
            heroImg.src = optimize(data.image, 1920);
        }
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
            ${s.image ? `<div class="svc-img-container"><img src="${optimize(s.image, 600)}" alt="${s.name}" loading="lazy"></div>` : `<div class="svc-img-container"></div>`}
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
            <img src="${optimize(img, 600)}" alt="Portfolio ${i + 1}" loading="lazy">
        </div>
    `).join('');
}

async function loadVideos() {
    const data = await dbGet('videos');
    const videos = data?.list || [];
    const grid = document.getElementById('videos-grid');
    if (!grid) return;

    if (videos.length === 0) {
        grid.innerHTML = '<div class="videos-placeholder">No videos added yet. Add YouTube URLs in admin panel.</div>';
        return;
    }

    grid.innerHTML = videos.map((url, i) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([-\w]+)/);
        const id = match ? match[1] : null;
        if (!id) return '';
        const thumb = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
        const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
        
        // Assign masonry aspect classes
        const classes = ['wide', 'tall', 'square'];
        const aspectClass = classes[i % classes.length];
        
        return `
            <div class="yt-card ${aspectClass}" onclick="openVideoModal('${embedUrl}')">
                <div class="yt-thumb">
                    <img src="${thumb}" alt="Video ${i+1}" loading="lazy" onerror="this.src='https://img.youtube.com/vi/${id}/hqdefault.jpg'">
                    <div class="yt-overlay"></div>
                    <div class="yt-play-btn">
                        <svg viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>`;
    }).join('');
}

window.openVideoModal = function(embedUrl) {
    const modal = document.getElementById('video-modal');
    document.getElementById('video-modal-iframe').src = embedUrl;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeVideoModal = function() {
    const modal = document.getElementById('video-modal');
    document.getElementById('video-modal-iframe').src = '';
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

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
            <img src="${optimize(c.cover, 600)}" alt="${c.name}" loading="lazy">
            <div class="couple-info">
                <h3 class="couple-name">${c.name}</h3>
                <p class="couple-count">${(c.photos || []).length} Photos</p>
            </div>
        </div>
    `).join('');
}

async function loadTestimonials() {
    const data = await dbGet('testimonials');
    const rawList = data?.list || [];
    const slider = document.getElementById('testimonials-slider');

    if (rawList.length === 0) {
        slider.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px 0;">Testimonials coming soon...</p>';
        return;
    }

    const testimonials = shuffle(rawList);

    // Build infinite-loop carousel: duplicate cards for seamless loop
    const googleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="google-icon"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>`;

    window.currentTestimonials = testimonials; // Save for modal
    const cards = testimonials.map((t, i) => {
        const initial = t.author ? t.author.charAt(0).toUpperCase() : 'G';
        return `
            <div class="review-card" onclick="openTestimonialModal(${i})">
                <div class="review-card-top">
                    <div class="google-reviewer">
                        <div class="google-avatar">${initial}</div>
                        <div>
                            <div class="google-name">${t.author}</div>
                            <div class="google-date">${t.role || 'Google Review'}</div>
                        </div>
                    </div>
                    ${googleSvg}
                </div>
                <div class="google-stars">★★★★★</div>
                <div class="google-text">"${t.text}"</div>
            </div>`;
    }).join('');

    // Duplicate for seamless loop
    slider.innerHTML = `
        <div class="reviews-track" id="reviews-track">
            ${cards}${cards}
        </div>
    `;

    // Auto-scroll animation
    startReviewCarousel();
}

function startReviewCarousel() {
    const track = document.getElementById('reviews-track');
    if (!track) return;

    let pos = 0;
    let rafId = null;
    let paused = false;
    const cardWidth = 380 + 24; // card width + gap
    const totalCards = track.children.length / 2;
    const maxPos = cardWidth * totalCards;

    function step() {
        if (!paused) {
            pos += 0.5;
            if (pos >= maxPos) pos = 0;
            track.style.transform = `translateX(-${pos}px)`;
        }
        rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
}

window.openTestimonialModal = function(index) {
    if (!window.currentTestimonials) return;
    const t = window.currentTestimonials[index];
    if (!t) return;
    
    const initial = t.author ? t.author.charAt(0).toUpperCase() : 'G';
    document.getElementById('test-modal-avatar').textContent = initial;
    document.getElementById('test-modal-name').textContent = t.author;
    document.getElementById('test-modal-role').textContent = t.role || 'Google Review';
    document.getElementById('test-modal-text').textContent = `"${t.text}"`;
    
    const modal = document.getElementById('testimonial-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeTestimonialModal = function() {
    const modal = document.getElementById('testimonial-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

async function loadAbout() {
    const data = await dbGet('about');
    if (data && data.title) {
        document.getElementById('about-title').textContent = data.title;
        document.getElementById('about-content').innerHTML = data.text || '';
    }
    if (data && data.image) {
        document.getElementById('about-image').src = optimize(data.image, 800);
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
        // Smart link: on mobile opens Instagram app, on desktop opens browser
        const igSmartUrl = igUrl.includes('instagram.com/')
            ? igUrl.replace('https://www.instagram.com/', 'https://instagram.com/')
            : igUrl;
        ['instagram-link', 'header-ig', 'footer-ig'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.href = igSmartUrl;
                el.setAttribute('target', '_blank');
                el.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }
    if (contact.youtube) {
        const ytUrl = contact.youtube;
        ['youtube-link', 'header-yt', 'footer-yt', 'videos-yt-btn'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.href = ytUrl;
                el.setAttribute('target', '_blank');
                el.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }
}

function clearFieldError(field) {
    field.classList.remove('invalid');
    const err = field.parentElement.querySelector('.field-error');
    if (err) err.textContent = '';
}

function setFieldError(field, message) {
    field.classList.add('invalid');
    const err = field.parentElement.querySelector('.field-error');
    if (err) err.textContent = message;
}

window.submitToWhatsApp = function(event) {
    event.preventDefault();

    const nameField = document.getElementById('wa-name');
    const emailField = document.getElementById('wa-email');
    const phoneField = document.getElementById('wa-phone');
    const serviceField = document.getElementById('wa-service');
    const msgField = document.getElementById('wa-msg');
    const fields = [nameField, emailField, phoneField, serviceField, msgField];

    fields.forEach(clearFieldError);

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const phone = phoneField.value.trim();
    const service = serviceField.value;
    const msg = msgField.value.trim();

    let valid = true;

    if (!name) {
        setFieldError(nameField, 'Please enter your name');
        valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError(emailField, 'Please enter a valid email');
        valid = false;
    }
    // Normalize away punctuation and an optional leading 0 or 91 country code
    // before checking for a 10-digit Indian mobile number.
    let normalizedPhone = phone.replace(/\D/g, '');
    if (normalizedPhone.length === 12 && normalizedPhone.startsWith('91')) {
        normalizedPhone = normalizedPhone.slice(2);
    } else if (normalizedPhone.length === 11 && normalizedPhone.startsWith('0')) {
        normalizedPhone = normalizedPhone.slice(1);
    }
    if (!/^\d{10}$/.test(normalizedPhone)) {
        setFieldError(phoneField, 'Please enter a valid 10-digit phone number');
        valid = false;
    }
    if (!service) {
        setFieldError(serviceField, 'Please select a service');
        valid = false;
    }
    if (!msg) {
        setFieldError(msgField, 'Please tell us about your event');
        valid = false;
    }

    if (!valid) return;

    const text = `Hello Pixcy Studios!%0A%0A*New Inquiry from Website*%0A*Name:* ${name}%0A*Phone:* ${normalizedPhone}%0A*Email:* ${email}%0A*Service Interested:* ${service}%0A*Details:* ${msg}`;
    const waNumber = window.waNumber || '919876543210';
    const waUrl = `https://wa.me/${waNumber}?text=${text}`;

    const waWindow = window.open(waUrl, '_blank');

    const form = document.getElementById('contact-form');
    const success = document.getElementById('form-success');
    const successLink = document.getElementById('form-success-link');
    if (form && success) {
        form.hidden = true;
        success.hidden = false;
        // window.open()'s return value isn't a reliable popup-blocked signal across
        // browsers, so always surface a manual link rather than trusting it opened.
        if (successLink) successLink.href = waUrl;
    }
};

// ─── Lightbox ──────────────────────────────────────────────────────────────
function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightboxImage() {
    document.querySelector('.lightbox-img').src = optimize(portfolioImages[currentLightboxIndex], 1600) || '';
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
        `<img src="${optimize(p, 600)}" alt="${couple.name} ${i + 1}" loading="lazy" onclick="openCouplePhoto(${index}, ${i})">`
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
