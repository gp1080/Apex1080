/* Apex 1080 — Admin dashboard */

(function () {
  'use strict';

  const loginSection = document.getElementById('admin-login');
  const dashboardSection = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('admin-login-error');
  const configWarning = document.getElementById('config-warning');
  const waitlistBody = document.getElementById('waitlist-tbody');
  const contactBody = document.getElementById('contact-tbody');
  const waitlistCount = document.getElementById('waitlist-count');
  const contactCount = document.getElementById('contact-count');
  const adminEmail = document.getElementById('admin-email-display');

  let waitlistData = [];
  let contactData = [];

  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
  }

  function hideError(el) {
    if (!el) return;
    el.textContent = '';
    el.classList.remove('show');
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    });
  }

  function getClient() {
    return window.ApexDB?.getClient();
  }

  async function checkSession() {
    const db = getClient();
    if (!db) return;

    const { data: { session } } = await db.auth.getSession();
    if (session) {
      showDashboard(session.user.email);
      await loadData();
    }
  }

  function showDashboard(email) {
    loginSection.hidden = true;
    dashboardSection.hidden = false;
    if (adminEmail) adminEmail.textContent = email;
  }

  function showLogin() {
    loginSection.hidden = false;
    dashboardSection.hidden = true;
  }

  async function loadData() {
    const db = getClient();
    if (!db) return;

    const [waitlistRes, contactRes] = await Promise.all([
      db.from('waitlist_submissions').select('*').order('created_at', { ascending: false }),
      db.from('contact_submissions').select('*').order('created_at', { ascending: false })
    ]);

    if (waitlistRes.error) {
      alert('Could not load waitlist: ' + waitlistRes.error.message);
      return;
    }
    if (contactRes.error) {
      alert('Could not load contact messages: ' + contactRes.error.message);
      return;
    }

    waitlistData = waitlistRes.data || [];
    contactData = contactRes.data || [];
    renderWaitlist();
    renderContact();
  }

  function renderWaitlist() {
    if (waitlistCount) waitlistCount.textContent = waitlistData.length;
    if (!waitlistBody) return;

    if (!waitlistData.length) {
      waitlistBody.innerHTML = '<tr><td colspan="2" class="admin-empty">No waitlist signups yet.</td></tr>';
      return;
    }

    waitlistBody.innerHTML = waitlistData.map(row => `
      <tr>
        <td>${escapeHtml(row.email)}</td>
        <td>${formatDate(row.created_at)}</td>
      </tr>
    `).join('');
  }

  function renderContact() {
    if (contactCount) contactCount.textContent = contactData.length;
    if (!contactBody) return;

    if (!contactData.length) {
      contactBody.innerHTML = '<tr><td colspan="5" class="admin-empty">No contact messages yet.</td></tr>';
      return;
    }

    contactBody.innerHTML = contactData.map(row => `
      <tr>
        <td>${escapeHtml(row.name)}</td>
        <td><a href="mailto:${escapeHtml(row.email)}">${escapeHtml(row.email)}</a></td>
        <td>${escapeHtml(row.subject || '—')}</td>
        <td class="admin-message-cell">${escapeHtml(row.message)}</td>
        <td>${formatDate(row.created_at)}</td>
      </tr>
    `).join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function exportCsv(filename, rows, headers) {
    const lines = [headers.join(',')];
    rows.forEach(row => {
      lines.push(headers.map(h => {
        const val = String(row[h] ?? '').replace(/"/g, '""');
        return `"${val}"`;
      }).join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ── Init ── */
  if (!window.ApexDB?.isConfigured()) {
    if (configWarning) configWarning.hidden = false;
  } else {
    checkSession();
  }

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(loginError);

    const db = getClient();
    if (!db) {
      showError(loginError, 'Supabase is not configured. Edit js/config.js first.');
      return;
    }

    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error) {
      showError(loginError, error.message);
      return;
    }

    showDashboard(data.user.email);
    await loadData();
  });

  document.getElementById('admin-logout')?.addEventListener('click', async () => {
    const db = getClient();
    if (db) await db.auth.signOut();
    showLogin();
  });

  document.getElementById('admin-refresh')?.addEventListener('click', loadData);

  document.getElementById('export-waitlist')?.addEventListener('click', () => {
    exportCsv('heimdall-waitlist.csv', waitlistData, ['email', 'created_at']);
  });

  document.getElementById('export-contact')?.addEventListener('click', () => {
    exportCsv('heimdall-contact.csv', contactData, ['name', 'email', 'subject', 'message', 'created_at']);
  });

  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-panel').forEach(p => p.hidden = true);
      tab.classList.add('active');
      document.getElementById(tab.dataset.panel).hidden = false;
    });
  });

})();
