// Loads GA4 and Clarity once consent allows it. Used on standalone pages
// (404, thank-you, privacy policy, terms, and the ad landing pages) that
// don't carry their own analytics-loading logic.
//
// Two consent models, chosen per page by window.CONSENT_MODE:
//   - default ("opt-in"): nothing loads until the visitor accepts. This is
//     the site-wide default and what every ordinary page uses.
//   - "opt-out": loads immediately; only a visitor who actively declines
//     stops it. Set only on pages built for paid ad traffic (currently
//     /wedding/), where the page's whole purpose is measuring the ad that
//     brought the visitor here, and a lightweight non-blocking notice
//     covers the same disclosure a blocking banner would.
(function () {
    var consent = null;
    try { consent = localStorage.getItem('cookieConsent'); } catch (e) {
        // Storage blocked (private mode, embedded webview). An opt-out page
        // has no way to know the visitor declined, so its default -- track --
        // still applies; a strict opt-in page still fails safe to no tracking.
    }
    var optOut = window.CONSENT_MODE === 'opt-out';
    var allowed = optOut ? consent !== 'declined' : consent === 'accepted';
    if (!allowed) return;

    const gaId = window.GA_MEASUREMENT_ID;
    if (gaId && gaId !== 'G-XXXXXXXXXX') {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', gaId);
    }

    const clarityId = window.CLARITY_ID;
    if (clarityId) {
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", clarityId);
    }
})();
