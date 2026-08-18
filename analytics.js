// Loads GA4 only if the visitor already accepted analytics cookies via the
// cookie banner on the homepage. Used on standalone pages (404, thank-you,
// privacy policy, terms) that don't carry their own cookie banner UI.
(function () {
    if (localStorage.getItem('cookieConsent') !== 'accepted') return;
    const id = window.GA_MEASUREMENT_ID;
    if (!id || id === 'G-XXXXXXXXXX') return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id);
})();
