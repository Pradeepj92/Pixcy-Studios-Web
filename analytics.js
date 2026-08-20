// Loads GA4 and Clarity only if the visitor already accepted analytics
// cookies via the cookie banner on the homepage. Used on standalone pages
// (404, thank-you, privacy policy, terms) that don't carry their own
// cookie banner UI.
(function () {
    if (localStorage.getItem('cookieConsent') !== 'accepted') return;

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
