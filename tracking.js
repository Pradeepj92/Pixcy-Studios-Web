// Conversion tracking for paid-traffic landing pages.
//
// Reads its IDs from window globals set in each page's <head>, so a new
// Pixel / GA property can be dropped in without touching this file:
//
//     window.META_PIXEL_ID    = '1234567890';   // '' disables the Pixel
//     window.GA_MEASUREMENT_ID = 'G-XXXXXXX';
//
// Like analytics.js, nothing loads until the visitor accepts cookies — the
// privacy policy promises that, and the Pixel is an analytics cookie too.
// Events fired before consent are queued rather than dropped, so a visitor
// who converts and *then* accepts still reports correctly.
(function () {
    var PLACEHOLDER = 'YOUR_PIXEL_ID';

    // Meta's standard events. Anything not on this list is sent as a custom
    // event instead, which is what trackCustom exists for.
    var STANDARD_EVENTS = [
        'PageView', 'Lead', 'Contact', 'ViewContent', 'CompleteRegistration',
        'Schedule', 'SubmitApplication', 'InitiateCheckout', 'Search',
    ];

    var queue = [];
    var ready = false;

    function hasConsent() {
        try {
            return localStorage.getItem('cookieConsent') === 'accepted';
        } catch (e) {
            // Storage blocked (private mode, embedded webview). Treat an
            // unreadable choice as "not accepted" rather than assuming yes.
            return false;
        }
    }

    function loadPixel(id) {
        /* eslint-disable */
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        /* eslint-enable */

        window.fbq('init', id);
        window.fbq('track', 'PageView');
    }

    function send(name, params) {
        var pixelId = window.META_PIXEL_ID;
        if (window.fbq && pixelId && pixelId !== PLACEHOLDER) {
            if (STANDARD_EVENTS.indexOf(name) !== -1) {
                window.fbq('track', name, params);
            } else {
                window.fbq('trackCustom', name, params);
            }
        }

        // Mirror into GA4. Meta's event names are PascalCase; GA4 wants
        // snake_case, and 'Lead' is GA's 'generate_lead' by convention.
        if (window.gtag) {
            var gaName = name === 'Lead'
                ? 'generate_lead'
                : name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
            window.gtag('event', gaName, params || {});
        }
    }

    // Safe to call at any time, from any page — a no-op until consent lands.
    window.pixcyTrack = function (name, params) {
        if (!ready) {
            queue.push([name, params]);
            return;
        }
        send(name, params);
    };

    if (!hasConsent()) return;

    var pixelId = window.META_PIXEL_ID;
    if (pixelId && pixelId !== PLACEHOLDER) loadPixel(pixelId);

    ready = true;
    queue.forEach(function (args) { send(args[0], args[1]); });
    queue.length = 0;
})();
