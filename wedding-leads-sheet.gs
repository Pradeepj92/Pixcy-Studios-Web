/**
 * Pixcy Studios — wedding landing page → Google Sheet
 * ==================================================
 *
 * Appends every enquiry from pixcystudios.in/wedding/ as a row in the
 * "Pixcy Studios — Wedding Leads" spreadsheet, so the leads exist as a
 * spreadsheet in Drive as well as in the CRM database.
 *
 * The database is the source of truth. This copy is convenience: if this
 * script is down, the landing page has already saved the lead and the
 * visitor never sees an error.
 *
 * ─── SETUP (about three minutes, once) ──────────────────────────────────
 *
 *  1. Open the sheet:
 *     https://docs.google.com/spreadsheets/d/1c5DDG935lxFfD3uf60qPKhYXfBOgDKeRwKQa5LAhigo/edit
 *
 *  2. Extensions → Apps Script. Delete whatever is in Code.gs and paste
 *     this whole file in. Save.
 *
 *  3. Change SHARED_SECRET below to any random string of your own, then
 *     save again. (It stops strangers posting junk rows if the URL leaks.)
 *
 *  4. Deploy → New deployment → gear icon → Web app.
 *       Execute as:        Me
 *       Who has access:    Anyone
 *     Deploy. Approve the permission prompt — it is asking to write to
 *     your own sheet.
 *
 *  5. Copy the Web app URL. It looks like
 *     https://script.google.com/macros/s/AKfy..../exec
 *
 *  6. Paste it into /admin.html → Wedding LP tab → "Google Sheet webhook
 *     URL", put the same secret in "Webhook secret", and Save.
 *
 * If you ever change the secret here, change it in admin too.
 *
 * ─── NOTE ON RE-DEPLOYING ───────────────────────────────────────────────
 * Editing this script does NOT update the live web app. After any change:
 * Deploy → Manage deployments → pencil icon → Version: New version →
 * Deploy. The URL stays the same.
 */

var SHARED_SECRET = 'change-me-to-something-random';

var HEADERS = [
  'Timestamp', 'Name', 'WhatsApp', 'Wedding Date',
  'Location', 'Budget', 'Source', 'Status', 'Lead ID'
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reply(false, 'no body');
    }

    var data = JSON.parse(e.postData.contents);

    if (SHARED_SECRET && data.secret !== SHARED_SECRET) {
      return reply(false, 'bad secret');
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Write the header row if someone started from a blank sheet.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // The date arrives as YYYY-MM-DD. Keep it as text so Sheets doesn't
    // reinterpret it as US month/day on a differently-localised account.
    sheet.appendRow([
      formatStamp(data.timestamp),
      data.name || '',
      "'" + (data.phone || ''),        // leading quote keeps the leading zero
      "'" + (data.weddingDate || ''),
      data.location || '',
      data.budget || '',
      data.source || 'wedding_landing_page',
      'New',
      data.leadId || ''
    ]);

    return reply(true, 'ok');
  } catch (err) {
    return reply(false, String(err));
  }
}

/** Lets you confirm the deployment is live by opening the URL in a browser. */
function doGet() {
  return ContentService
    .createTextOutput('Pixcy wedding lead endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function formatStamp(iso) {
  var d = iso ? new Date(iso) : new Date();
  if (isNaN(d.getTime())) d = new Date();
  return Utilities.formatDate(d, 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
}

function reply(ok, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: ok, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
