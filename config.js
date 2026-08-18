// Supabase + Cloudinary Configuration for Pixcy Studios
// Supabase: stores all text content (hero, services, contact, etc.)
// Cloudinary: stores all uploaded images

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://xuiiajmkbayveurboomw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1aWlham1rYmF5dmV1cmJvb213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMjQyNzksImV4cCI6MjA5MzgwMDI3OX0.pj7FSzjVOIhPeXIPP0UE1BBFpFoLpHoXDucintyAx8E';

const CLOUDINARY_CLOUD_NAME = 'dimxughun';
const CLOUDINARY_UPLOAD_PRESET = 'pixcy_website';

// Shared client — carries the signed-in session (if any) on every request,
// so writes are authorized by Supabase RLS instead of a client-side password check.
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Supabase Helpers ────────────────────────────────────────────────────────

async function dbGet(section) {
  const { data, error } = await supabase
    .from('content')
    .select('data')
    .eq('section', section)
    .maybeSingle();
  if (error) return null;
  return data ? data.data : null;
}

async function dbSet(section, data) {
  const { error } = await supabase
    .from('content')
    .upsert({ section, data }, { onConflict: 'section' });
  if (error) throw new Error(`Supabase error: ${error.message}`);
}

// Backs up a contact-form submission alongside the WhatsApp message. RLS on
// `leads` only allows public INSERT — never read — so this can't leak other
// visitors' data even though it runs with the public anon key.
async function insertLead(lead) {
  const { error } = await supabase.from('leads').insert(lead);
  if (error) throw new Error(`Supabase error: ${error.message}`);
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

export { supabase, dbGet, dbSet, insertLead, uploadImage };
