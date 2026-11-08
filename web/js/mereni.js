/* AutoPraizler M.L. – měření konverzí (Google Ads / GA4 / Sklik) se souhlasem návštěvníka.
 * - Bez vyplněných ID v js/config.js se neděje vůbec nic (žádná lišta, žádné cookies, žádné požadavky).
 * - S vyplněnými ID se zobrazí lišta souhlasu; volba se ukládá do localStorage pod klíčem „ap_consent“.
 * - Google Consent Mode v2: výchozí stav vše „denied“, po souhlasu „granted“. gtag.js a rc.js (Seznam)
 *   se načtou teprve po kliknutí na „Přijmout“. Bez souhlasu web nekontaktuje žádnou třetí stranu.
 * - Konverze: událost „ap:form-sent“ (odesílá js/main.js po úspěšném odeslání formuláře) a kliknutí na odkaz tel:.
 */
(function () {
  'use strict';

  var cfg = window.AP_CONFIG || {};
  var googleId = cfg.googleAdsId || cfg.ga4Id || '';
  var hasGoogle = !!googleId;
  var hasSklik = !!cfg.sklikConversionId;
  if (!hasGoogle && !hasSklik) return; // měření není nastavené

  var KEY = 'ap_consent';
  var isDe = (document.documentElement.lang || '').toLowerCase().indexOf('de') === 0;
  var granted = false;
  var gtagLoaded = false;
  var rcLoaded = false;
  var rcQueue = [];
  var bar = null;

  var t = isDe ? {
    text: 'Mit Ihrer Zustimmung messen wir anonymisiert, ob unsere Anzeigen (Google, Seznam) zu Anrufen und Anfragen führen. Dazu werden Cookies gesetzt. Ohne Zustimmung werden keine Daten an Dritte übermittelt.',
    more: 'Datenschutz',
    accept: 'Akzeptieren',
    reject: 'Ablehnen',
    label: 'Cookie-Einstellungen'
  } : {
    text: 'S Vaším souhlasem měříme, zda naše reklama (Google, Seznam) vede k telefonátům a poptávkám. K tomu se ukládají cookies. Bez souhlasu web žádné údaje třetím stranám nepředává.',
    more: 'Více o ochraně osobních údajů',
    accept: 'Přijmout',
    reject: 'Odmítnout',
    label: 'Nastavení cookies'
  };

  var store = {
    get: function () { try { return window.localStorage.getItem(KEY); } catch (e) { return null; } },
    set: function (v) { try { window.localStorage.setItem(KEY, v); } catch (e) { /* soukromý režim apod. */ } }
  };

  /* ---------- Google Consent Mode v2 (jen zápis do dataLayer, nic se nenačítá) ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  function loadScript(src, onload) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    if (onload) s.onload = onload;
    document.head.appendChild(s);
  }

  function loadGoogle() {
    if (!hasGoogle || gtagLoaded) return;
    gtagLoaded = true;
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(googleId));
    gtag('js', new Date());
    if (cfg.googleAdsId) gtag('config', cfg.googleAdsId);
    if (cfg.ga4Id) gtag('config', cfg.ga4Id);
  }

  function loadSklik() {
    if (!hasSklik || rcLoaded) return;
    rcLoaded = true;
    loadScript('https://c.seznam.cz/js/rc.js', function () {
      var q = rcQueue; rcQueue = [];
      q.forEach(function (fn) { fn(); });
    });
  }

  function sklikHit() {
    if (!hasSklik || !granted) return;
    var fire = function () {
      if (!granted) return; // souhlas mohl být mezitím odvolán
      if (window.rc && typeof window.rc.conversionHit === 'function') {
        var hit = { id: Number(cfg.sklikConversionId), consent: 1 };
        if (cfg.sklikConversionValue) hit.value = Number(cfg.sklikConversionValue);
        window.rc.conversionHit(hit);
      }
    };
    if (window.rc && window.rc.conversionHit) fire(); else rcQueue.push(fire);
  }

  function adsConversion(label, extra) {
    if (!granted || !cfg.googleAdsId || !label) return;
    var data = { send_to: cfg.googleAdsId + '/' + label };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) data[k] = extra[k];
    gtag('event', 'conversion', data);
  }

  function grant() {
    granted = true;
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
    loadGoogle();
    loadSklik();
  }

  // Odvolání souhlasu: už načtený Google tag dostane „denied“, čekající konverze Sklik se zahodí.
  function deny() {
    granted = false;
    rcQueue = [];
    if (gtagLoaded) {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied'
      });
    }
  }

  /* ---------- Lišta souhlasu (vlastní markup, bez knihoven) ---------- */
  function hideBar() {
    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
    bar = null;
  }

  function showBar() {
    if (bar) return;
    bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', t.label);

    var inner = document.createElement('div');
    inner.className = 'container';

    var p = document.createElement('p');
    p.appendChild(document.createTextNode(t.text + ' '));
    var more = document.createElement('a');
    more.href = '/ochrana-osobnich-udaju/';
    more.textContent = t.more;
    p.appendChild(more);

    var actions = document.createElement('div');
    actions.className = 'cookie-bar__actions';
    var accept = document.createElement('button');
    accept.type = 'button'; accept.className = 'btn'; accept.textContent = t.accept;
    var reject = document.createElement('button');
    reject.type = 'button'; reject.className = 'btn btn--ghost'; reject.textContent = t.reject;
    actions.appendChild(reject);
    actions.appendChild(accept);

    accept.addEventListener('click', function () { store.set('granted'); hideBar(); grant(); });
    reject.addEventListener('click', function () { store.set('denied'); hideBar(); deny(); });

    inner.appendChild(p);
    inner.appendChild(actions);
    bar.appendChild(inner);
    document.body.appendChild(bar);
    accept.focus({ preventScroll: true });
  }

  var saved = store.get();
  if (saved === 'granted') grant();
  else if (saved !== 'denied') showBar();

  // odkaz „Nastavení cookies“ v patičce – zobrazí se jen s nastaveným měřením a znovu otevře lištu
  Array.prototype.forEach.call(document.querySelectorAll('.cookie-settings'), function (el) {
    el.removeAttribute('hidden');
    var btn = el.querySelector('button') || el;
    if (isDe && btn.tagName === 'BUTTON') btn.textContent = t.label;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      showBar();
    });
  });

  /* ---------- Konverze ---------- */
  document.addEventListener('ap:form-sent', function (e) {
    if (!granted) return;
    var page = (e && e.detail && e.detail.page) || window.location.pathname;
    adsConversion(cfg.googleAdsFormLabel);
    if (cfg.ga4Id) gtag('event', 'generate_lead', { method: 'form', page_path: page });
    sklikHit();
  });

  document.addEventListener('click', function (e) {
    if (!granted) return;
    var target = e.target;
    var a = target && target.closest ? target.closest('a[href^="tel:"]') : null;
    if (!a) return;
    adsConversion(cfg.googleAdsCallLabel);
    if (cfg.ga4Id) gtag('event', 'phone_call_click', { link_url: a.getAttribute('href') });
  });
})();
