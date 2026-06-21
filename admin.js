// Admin Panel — Pixcy Studios
// Uses: Cloudinary for images, Supabase for all text content

import { dbGet, dbSet, uploadImage } from './config.js';

// ─── State ─────────────────────────────────────────────────────────────────
let servicesData = [];
let portfolioData = [];   // array of Cloudinary URLs
let couplesData = [];
let testimonialsData = [];
let videosData = [];   // array of YouTube URLs

// ─── Init ──────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
    showToast('Loading data…');
    try {
        await loadAllData();
    } catch (e) {
        console.error(e);
        alert('⚠️ Could not load data. Check console for details.');
    }
    hideToast();
    setupTabs();
    setupPortfolioDrop();
    setupButtonListeners();
});

// ─── Tab Switching ─────────────────────────────────────────────────────────
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.querySelector(`[data-content="${btn.dataset.tab}"]`).classList.add('active');
        });
    });
}

// ─── Button Listeners ─────────────────────────────────────────────────────
function setupButtonListeners() {
    document.getElementById('btn-save-branding').addEventListener('click', saveBranding);
    document.getElementById('btn-save-hero').addEventListener('click', saveHero);
    document.getElementById('btn-add-service').addEventListener('click', addServiceRow);
    document.getElementById('btn-save-services').addEventListener('click', saveServices);
    document.getElementById('btn-choose-portfolio').addEventListener('click', () => document.getElementById('portfolio-input').click());
    document.getElementById('portfolio-input').addEventListener('change', e => handlePortfolioFiles(e.target.files));
    document.getElementById('btn-save-portfolio').addEventListener('click', savePortfolio);
    document.getElementById('btn-add-video').addEventListener('click', () => addVideoRow());
    document.getElementById('btn-save-videos').addEventListener('click', saveVideos);
    document.getElementById('btn-add-couple').addEventListener('click', addCoupleRow);
    document.getElementById('btn-save-couples').addEventListener('click', saveCouples);
    document.getElementById('btn-add-testimonial').addEventListener('click', addTestimonialRow);
    document.getElementById('btn-save-testimonials').addEventListener('click', saveTestimonials);
    document.getElementById('btn-save-about').addEventListener('click', saveAbout);
    document.getElementById('btn-save-contact').addEventListener('click', saveContact);
}

// ─── Portfolio Drop Zone ───────────────────────────────────────────────────
function setupPortfolioDrop() {
    const drop = document.getElementById('portfolio-drop');
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.style.background = 'rgba(212,175,55,0.12)'; });
    drop.addEventListener('dragleave', () => { drop.style.background = ''; });
    drop.addEventListener('drop', e => { e.preventDefault(); drop.style.background = ''; handlePortfolioFiles(e.dataTransfer.files); });
}

// ─── Load All Data ─────────────────────────────────────────────────────────
async function loadAllData() {
    const [logo, hero, srv, port, vids, coup, test, about, contact] = await Promise.all([
        dbGet('logo'), dbGet('hero'), dbGet('services'), dbGet('portfolio'),
        dbGet('videos'), dbGet('couples'), dbGet('testimonials'), dbGet('about'), dbGet('contact')
    ]);

    if (logo) document.getElementById('logo-text').value = logo.text || '';
    if (hero) {
        document.getElementById('hero-title').value = hero.title || '';
        document.getElementById('hero-subtitle').value = hero.subtitle || '';
        if (hero.image) {
            document.getElementById('hero-bg-preview').innerHTML = `<img src="${hero.image}" style="max-width:300px;margin-top:8px;border-radius:4px;">`;
        }
    }

    servicesData = srv ? srv.list || [] : [];
    servicesData.length > 0 ? displayServices() : addServiceRow();

    portfolioData = port ? port.list || [] : [];
    displayPortfolioPreview();

    videosData = vids ? vids.list || [] : [];
    videosData.length > 0 ? displayVideos() : addVideoRow();

    couplesData = coup ? coup.list || [] : [];
    couplesData.length > 0 ? displayCouples() : addCoupleRow();

    testimonialsData = test ? test.list || [] : [];
    testimonialsData.length > 0 ? displayTestimonials() : addTestimonialRow();

    if (about) {
        document.getElementById('about-title').value = about.title || '';
        document.getElementById('about-text').value = about.text || '';
        if (about.image) document.getElementById('about-preview').innerHTML = `<img src="${about.image}" style="max-width:200px;margin-top:8px;border-radius:4px;">`;
    }
    if (contact) {
        document.getElementById('contact-location').value = contact.location || '';
        document.getElementById('contact-email').value = contact.email || '';
        document.getElementById('contact-phone').value = contact.phone || '';
        document.getElementById('whatsapp-number').value = contact.whatsapp || '';
        document.getElementById('instagram-url').value = contact.instagram || '';
        document.getElementById('youtube-url').value = contact.youtube || '';
    }
}

// ─── Branding ──────────────────────────────────────────────────────────────
async function saveBranding() {
    const text = document.getElementById('logo-text').value.trim();
    showToast('Saving…');
    await dbSet('logo', { text });
    msg('branding-message', 'Branding saved!');
    hideToast();
}

// ─── Hero ──────────────────────────────────────────────────────────────────
async function saveHero() {
    showToast('Saving hero section…');
    const existing = await dbGet('hero') || {};
    let image = existing.image || '';
    const fileInput = document.getElementById('hero-bg-image');
    if (fileInput.files[0]) {
        image = await uploadImage(fileInput.files[0]);
        document.getElementById('hero-bg-preview').innerHTML = `<img src="${image}" style="max-width:300px;margin-top:8px;border-radius:4px;">`;
    }
    
    const data = {
        title: document.getElementById('hero-title').value.trim(),
        subtitle: document.getElementById('hero-subtitle').value.trim(),
        image: image
    };
    
    await dbSet('hero', data);
    msg('hero-message', 'Hero section saved!');
    hideToast();
}

// ─── Services ─────────────────────────────────────────────────────────────
function addServiceRow(service = { name: '', description: '', image: '' }) {
    const container = document.getElementById('services-container');
    const idx = container.children.length;
    const item = document.createElement('div');
    item.className = 'service-item';
    item.dataset.idx = idx;
    item.innerHTML = `
        <div class="form-group">
            <label>Service Name</label>
            <input type="text" class="svc-name" value="${escHtml(service.name)}" placeholder="Wedding Photography">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="svc-desc" rows="3" placeholder="Description...">${escHtml(service.description)}</textarea>
        </div>
        <div class="form-group">
            <label>Service Image</label>
            <input type="file" class="svc-img-input" accept="image/*">
            <div class="svc-img-preview">${service.image ? `<img src="${service.image}" style="max-width:200px;margin-top:8px;border-radius:4px;">` : ''}</div>
        </div>
        <button class="btn-remove" type="button">Remove Service</button>
        <hr style="border-color:#333;margin:16px 0;">
    `;
    item.querySelector('.btn-remove').addEventListener('click', () => item.remove());
    container.appendChild(item);
}

function displayServices() {
    document.getElementById('services-container').innerHTML = '';
    servicesData.forEach(s => addServiceRow(s));
}

async function saveServices() {
    showToast('Uploading images & saving services…');
    const items = document.querySelectorAll('.service-item');
    const updated = [];
    for (const item of items) {
        const name = item.querySelector('.svc-name').value.trim();
        if (!name) continue;
        const desc = item.querySelector('.svc-desc').value.trim();
        const fileInput = item.querySelector('.svc-img-input');
        const idx = parseInt(item.dataset.idx);
        let image = servicesData[idx]?.image || '';
        if (fileInput.files[0]) {
            image = await uploadImage(fileInput.files[0]);
        }
        updated.push({ name, description: desc, image });
    }
    servicesData = updated;
    await dbSet('services', { list: servicesData });
    displayServices();
    msg('services-message', 'Services saved!');
    hideToast();
}

// ─── Portfolio ─────────────────────────────────────────────────────────────
async function handlePortfolioFiles(files) {
    if (!files.length) return;
    showToast(`Uploading ${files.length} photo(s) to Cloudinary…`);
    for (const file of files) {
        const url = await uploadImage(file);
        portfolioData.push(url);
    }
    displayPortfolioPreview();
    await dbSet('portfolio', { list: portfolioData });
    msg('portfolio-message', `${files.length} photo(s) uploaded & saved!`);
    hideToast();
}

function displayPortfolioPreview() {
    const preview = document.getElementById('portfolio-preview');
    preview.innerHTML = '';
    portfolioData.forEach((url, i) => {
        const item = document.createElement('div');
        item.className = 'preview-item';
        item.innerHTML = `
            <img src="${url}" loading="lazy">
            <button class="preview-remove" title="Remove">&times;</button>
        `;
        item.querySelector('.preview-remove').addEventListener('click', async () => {
            portfolioData.splice(i, 1);
            displayPortfolioPreview();
        });
        preview.appendChild(item);
    });
}

async function savePortfolio() {
    showToast('Saving portfolio…');
    await dbSet('portfolio', { list: portfolioData });
    msg('portfolio-message', 'Portfolio saved!');
    hideToast();
}

// ─── Videos ─────────────────────────────────────────────────────────────────
function addVideoRow(url = '') {
    const container = document.getElementById('videos-container');
    const item = document.createElement('div');
    item.className = 'video-item';
    item.style.cssText = 'display:flex;gap:1rem;align-items:center;margin-bottom:1rem;';
    item.innerHTML = `
        <input type="url" class="vid-url" value="${escHtml(url)}" placeholder="https://www.youtube.com/watch?v=..." style="flex:1;padding:10px;border:1px solid #444;background:#111;color:#fff;border-radius:4px;">
        <button class="btn-remove" type="button" style="padding:8px 16px;">Remove</button>
    `;
    item.querySelector('.btn-remove').addEventListener('click', () => item.remove());
    container.appendChild(item);
}

function displayVideos() {
    document.getElementById('videos-container').innerHTML = '';
    videosData.forEach(url => addVideoRow(url));
}

async function saveVideos() {
    showToast('Saving videos…');
    videosData = Array.from(document.querySelectorAll('.vid-url'))
        .map(el => el.value.trim())
        .filter(url => url.length > 0);
    await dbSet('videos', { list: videosData });
    msg('videos-message', 'Videos saved!');
    hideToast();
}

// ─── Couples ───────────────────────────────────────────────────────────────
function addCoupleRow(couple = { name: '', cover: '', photos: [] }) {
    const container = document.getElementById('couples-container');
    const idx = container.children.length;
    const item = document.createElement('div');
    item.className = 'couple-item';
    item.dataset.idx = idx;
    item.innerHTML = `
        <div class="form-group">
            <label>Couple Name</label>
            <input type="text" class="cpl-name" value="${escHtml(couple.name)}" placeholder="Priya & Rahul">
        </div>
        <div class="form-group">
            <label>Cover Photo</label>
            <input type="file" class="cpl-cover-input" accept="image/*">
            <div class="cpl-cover-preview">${couple.cover ? `<img src="${couple.cover}" style="max-width:200px;margin-top:8px;border-radius:4px;">` : ''}</div>
        </div>
        <div class="form-group">
            <label>Album Photos (select multiple)</label>
            <input type="file" class="cpl-photos-input" multiple accept="image/*">
            <div class="preview-grid cpl-photos-preview">
                ${(couple.photos || []).map(p => `<div class="preview-item"><img src="${p}" loading="lazy"></div>`).join('')}
            </div>
        </div>
        <button class="btn-remove" type="button">Remove Couple</button>
        <hr style="border-color:#333;margin:16px 0;">
    `;
    item.querySelector('.btn-remove').addEventListener('click', () => item.remove());
    container.appendChild(item);
}

function displayCouples() {
    document.getElementById('couples-container').innerHTML = '';
    couplesData.forEach(c => addCoupleRow(c));
}

async function saveCouples() {
    showToast('Uploading photos & saving couples…');
    const items = document.querySelectorAll('.couple-item');
    const updated = [];
    for (const item of items) {
        const name = item.querySelector('.cpl-name').value.trim();
        if (!name) continue;
        const idx = parseInt(item.dataset.idx);

        let cover = couplesData[idx]?.cover || '';
        const coverInput = item.querySelector('.cpl-cover-input');
        if (coverInput.files[0]) cover = await uploadImage(coverInput.files[0]);

        let photos = [...(couplesData[idx]?.photos || [])];
        const photosInput = item.querySelector('.cpl-photos-input');
        for (const file of photosInput.files) {
            photos.push(await uploadImage(file));
        }

        updated.push({ name, cover, photos });
    }
    couplesData = updated;
    await dbSet('couples', { list: couplesData });
    displayCouples();
    msg('couples-message', 'Couples saved!');
    hideToast();
}

// ─── Testimonials ──────────────────────────────────────────────────────────
function addTestimonialRow(t = { text: '', author: '', role: '' }) {
    const container = document.getElementById('testimonials-container');
    const item = document.createElement('div');
    item.className = 'testimonial-item';
    item.innerHTML = `
        <div class="form-group">
            <label>Testimonial Text</label>
            <textarea class="test-text" rows="4" placeholder="Amazing work! We loved our photos...">${escHtml(t.text)}</textarea>
        </div>
        <div class="form-group">
            <label>Client Name</label>
            <input type="text" class="test-author" value="${escHtml(t.author)}" placeholder="Priya & Rahul">
        </div>
        <div class="form-group">
            <label>Event/Role (optional)</label>
            <input type="text" class="test-role" value="${escHtml(t.role)}" placeholder="Wedding - Dec 2023">
        </div>
        <button class="btn-remove" type="button">Remove</button>
        <hr style="border-color:#333;margin:16px 0;">
    `;
    item.querySelector('.btn-remove').addEventListener('click', () => item.remove());
    container.appendChild(item);
}

function displayTestimonials() {
    document.getElementById('testimonials-container').innerHTML = '';
    testimonialsData.forEach(t => addTestimonialRow(t));
}

async function saveTestimonials() {
    showToast('Saving testimonials…');
    testimonialsData = Array.from(document.querySelectorAll('.testimonial-item')).map(item => ({
        text: item.querySelector('.test-text').value.trim(),
        author: item.querySelector('.test-author').value.trim(),
        role: item.querySelector('.test-role').value.trim()
    })).filter(t => t.text && t.author);
    await dbSet('testimonials', { list: testimonialsData });
    msg('testimonials-message', 'Testimonials saved!');
    hideToast();
}

// ─── About ─────────────────────────────────────────────────────────────────
async function saveAbout() {
    showToast('Saving about section…');
    const existing = await dbGet('about') || {};
    let image = existing.image || '';
    const fileInput = document.getElementById('about-image');
    if (fileInput.files[0]) {
        image = await uploadImage(fileInput.files[0]);
        document.getElementById('about-preview').innerHTML = `<img src="${image}" style="max-width:200px;margin-top:8px;border-radius:4px;">`;
    }
    await dbSet('about', {
        title: document.getElementById('about-title').value.trim(),
        text: document.getElementById('about-text').value.trim(),
        image
    });
    msg('about-message', 'About section saved!');
    hideToast();
}

// ─── Contact ───────────────────────────────────────────────────────────────
async function saveContact() {
    showToast('Saving contact info…');
    await dbSet('contact', {
        location: document.getElementById('contact-location').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        phone: document.getElementById('contact-phone').value.trim(),
        whatsapp: document.getElementById('whatsapp-number').value.trim(),
        instagram: document.getElementById('instagram-url').value.trim(),
        youtube: document.getElementById('youtube-url').value.trim()
    });
    msg('contact-message', 'Contact info saved!');
    hideToast();
}

// ─── UI Helpers ─────────────────────────────────────────────────────────────
function msg(id, text) {
    const el = document.getElementById(id);
    el.textContent = '✅ ' + text;
    el.className = 'message success';
    setTimeout(() => { el.textContent = ''; el.className = 'message'; }, 4000);
}
function showToast(text) {
    const t = document.getElementById('upload-toast');
    t.textContent = '⏳ ' + text;
    t.style.display = 'block';
}
function hideToast() {
    document.getElementById('upload-toast').style.display = 'none';
}
function escHtml(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
