// Supabase + Cloudinary Configuration for Pixcy Studios
// Supabase: stores all text content (hero, services, contact, etc.)
// Cloudinary: stores all uploaded images

const SUPABASE_URL = 'https://xuiiajmkbayveurboomw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1aWlham1rYmF5dmV1cmJvb213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMjQyNzksImV4cCI6MjA5MzgwMDI3OX0.pj7FSzjVOIhPeXIPP0UE1BBFpFoLpHoXDucintyAx8E';

const CLOUDINARY_CLOUD_NAME = 'dimxughun';
const CLOUDINARY_UPLOAD_PRESET = 'pixcy_website';

// ─── Supabase Helpers ────────────────────────────────────────────────────────

async function dbGet(section) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/content?section=eq.${section}&select=data`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  return rows.length > 0 ? rows[0].data : null;
}

async function dbSet(section, data) {
  // Upsert: insert or update based on section key
  const res = await fetch(`${SUPABASE_URL}/rest/v1/content`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({ section, data }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase error: ${err}`);
  }
}

// ─── Cloudinary Upload Helper ─────────────────────────────────────────────────

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const result = await res.json();
  return result.secure_url;
}

export { dbGet, dbSet, uploadImage };
