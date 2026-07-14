/* Apex 1080 — Database helpers (Supabase) */

window.ApexDB = (function () {
  'use strict';

  let client = null;

  function isConfigured() {
    const cfg = window.APEX_CONFIG;
    return cfg &&
      cfg.supabaseUrl &&
      cfg.supabaseAnonKey &&
      cfg.supabaseUrl.startsWith('https://') &&
      cfg.supabaseUrl.includes('.supabase.co') &&
      cfg.supabaseAnonKey.startsWith('eyJ');
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (!client && window.supabase) {
      client = window.supabase.createClient(
        window.APEX_CONFIG.supabaseUrl,
        window.APEX_CONFIG.supabaseAnonKey
      );
    }
    return client;
  }

  async function addWaitlistEmail(email) {
    const db = getClient();
    if (!db) return { ok: false, error: 'Database not configured' };

    const { error } = await db
      .from('waitlist_submissions')
      .insert([{ email: email.trim().toLowerCase() }]);

    if (error) {
      if (error.code === '23505') {
        return { ok: true, duplicate: true };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }

  async function addContactSubmission(data) {
    const db = getClient();
    if (!db) return { ok: false, error: 'Database not configured' };

    const { error } = await db.from('contact_submissions').insert([{
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject,
      message: data.message.trim()
    }]);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  return {
    isConfigured,
    getClient,
    addWaitlistEmail,
    addContactSubmission
  };
})();
