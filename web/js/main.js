/* AutoPraizler M.L. – vlastní skripty (bez knihoven) */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobilní menu ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('hlavni-menu');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Objevování při rolování ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Tlačítko nahoru ---------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    var onScroll = function () {
      toTop.classList.toggle('is-visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Slider na úvodu ---------- */
  var hero = document.querySelector('.hero');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero__slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero__dot'));
    var prev = hero.querySelector('.hero__arrow--prev');
    var next = hero.querySelector('.hero__arrow--next');
    var status = hero.querySelector('.hero__status');
    var current = 0;
    var timer = null;
    var INTERVAL = 6000;

    var show = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, idx) {
        var active = idx === current;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      dots.forEach(function (d, idx) { d.setAttribute('aria-pressed', idx === current ? 'true' : 'false'); });
      if (status) status.textContent = 'Snímek ' + (current + 1) + ' z ' + slides.length;
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
    var start = function () {
      stop();
      if (reduceMotion || slides.length < 2) return;
      timer = setInterval(function () { show(current + 1); }, INTERVAL);
    };

    if (prev) prev.addEventListener('click', function () { show(current - 1); start(); });
    if (next) next.addEventListener('click', function () { show(current + 1); start(); });
    dots.forEach(function (d, idx) { d.addEventListener('click', function () { show(idx); start(); }); });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', function (e) { if (!hero.contains(e.relatedTarget)) start(); });
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(current - 1); }
      if (e.key === 'ArrowRight') { show(current + 1); }
    });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

    // dotykové přejetí
    var touchX = null;
    hero.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; stop(); }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) show(dx < 0 ? current + 1 : current - 1);
      touchX = null;
      start();
    }, { passive: true });

    show(0);
    start();
  }

  /* ---------- Galerie: zvětšení fotky ---------- */
  var galleryLinks = document.querySelectorAll('.gallery a[href]');
  if (galleryLinks.length && typeof HTMLDialogElement === 'function') {
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="Zavřít">' +
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<img alt="">' +
      '<p class="lightbox__caption"></p>';
    document.body.appendChild(dlg);
    var dlgImg = dlg.querySelector('img');
    var dlgCap = dlg.querySelector('.lightbox__caption');
    dlg.querySelector('.lightbox__close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

    galleryLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var thumb = a.querySelector('img');
        dlgImg.src = a.getAttribute('href');
        dlgImg.alt = thumb ? thumb.alt : '';
        dlgCap.textContent = thumb ? thumb.alt : '';
        dlg.showModal();
      });
    });
  }

  /* ---------- Mapa na kliknutí ---------- */
  var mapBtn = document.querySelector('.map-load');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var box = mapBtn.closest('.map-box');
      var src = mapBtn.getAttribute('data-src');
      if (!box || !src) return;
      var iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = 'Mapa – AutoPraizler M.L., U Mlékárny 844/8A, Mariánské Lázně';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      box.innerHTML = '';
      box.appendChild(iframe);
      box.classList.add('is-loaded');
    });
  }

  /* ---------- Kontaktní formulář ---------- */
  var form = document.querySelector('form.form[data-endpoint]');
  if (form) {
    var statusEl = document.getElementById('form-status');
    var okText = 'Děkujeme, zpráva byla odeslána. Ozveme se Vám co nejdříve.';
    var errText = 'Zprávu se nepodařilo odeslat. Zavolejte nám prosím na +420 728 920 290 nebo napište na servis@autopraizler.cz.';

    var setStatus = function (kind, text) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.className = 'form-status ' + (kind === 'ok' ? 'is-ok' : 'is-err');
      statusEl.focus();
    };

    // stav po odeslání bez JavaScriptu (přesměrování z /api/kontakt)
    var params = new URLSearchParams(window.location.search);
    if (params.get('odeslano') === '1') setStatus('ok', okText);
    if (params.get('chyba') === '1') setStatus('err', errText);

    var markInvalid = function (field, invalid) {
      field.classList.toggle('is-invalid', invalid);
      field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.jmeno;
      var email = form.elements.email;
      var message = form.elements.zprava;
      var consent = form.elements.souhlas;
      var valid = true;

      var nameOk = name.value.trim().length >= 2 && name.value.trim().length <= 100;
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
      var msgOk = message.value.trim().length >= 5 && message.value.trim().length <= 3000;
      markInvalid(name, !nameOk); markInvalid(email, !emailOk); markInvalid(message, !msgOk);
      valid = nameOk && emailOk && msgOk && consent.checked;
      if (!consent.checked) consent.focus();
      if (!valid) {
        var first = form.querySelector('.is-invalid');
        if (first) first.focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      var payload = {
        jmeno: name.value.trim(),
        email: email.value.trim(),
        telefon: form.elements.telefon.value.trim(),
        termin: form.elements.termin.value.trim(),
        zprava: message.value.trim(),
        souhlas: consent.checked ? '1' : '',
        website: form.elements.website.value
      };

      fetch(form.getAttribute('data-endpoint'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (res.ok && data.ok) {
            setStatus('ok', okText);
            form.reset();
          } else {
            setStatus('err', (data && data.error) ? data.error : errText);
          }
        });
      }).catch(function () {
        setStatus('err', errText);
      }).then(function () {
        btn.disabled = false;
      });
    });
  }
})();
