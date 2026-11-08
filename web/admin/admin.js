/* AutoPraizler M.L. – správa aktualit (/admin/). Bez knihoven.
   Přihlášení odkazem z e-mailu (/api/admin-login, /api/admin-session), správa položek (/api/novinky).
   Obrázky se před odesláním zmenší v prohlížeči (max. 1200 px na šířku, JPEG 0.82). */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');

  var CSRF_HEADER = 'ap-admin';
  var MAX_IMAGE_WIDTH = 1200;
  var JPEG_QUALITY = 0.82;
  var MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
  var MONTHS = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];

  var $ = function (id) { return document.getElementById(id); };
  var screens = { login: $('screen-login'), wait: $('screen-wait'), app: $('screen-app') };
  var state = { items: [], editingId: null, image: { mode: 'keep', dataUrl: null, current: null }, busy: false };

  /* ---------- Mobilní menu (stejné chování jako main.js) ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = $('hlavni-menu');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Pomocné ---------- */
  function showScreen(name) {
    Object.keys(screens).forEach(function (k) { screens[k].hidden = k !== name; });
  }

  function setMsg(el, text, type) {
    if (!el) return;
    if (!text) { el.hidden = true; el.textContent = ''; el.className = el.className.replace(/\bis-\w+/g, '').trim(); return; }
    el.className = el.className.replace(/\bis-\w+/g, '').trim() + ' is-' + (type || 'info');
    el.textContent = text;
    el.hidden = false;
  }

  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return iso || '';
    return parseInt(m[3], 10) + '. ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }

  function today() {
    var d = new Date();
    var mm = String(d.getMonth() + 1), dd = String(d.getDate());
    return d.getFullYear() + '-' + (mm.length < 2 ? '0' + mm : mm) + '-' + (dd.length < 2 ? '0' + dd : dd);
  }

  function setBusy(busy) {
    state.busy = busy;
    ['btn-save', 'btn-cancel', 'btn-new', 'btn-logout', 'login-submit'].forEach(function (id) {
      var b = $(id);
      if (b) b.disabled = busy;
    });
  }

  // Volání API; vrací Promise<{ status, data }>. Při 401 přepne na přihlášení.
  function api(method, url, body) {
    var opts = {
      method: method,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'X-Requested-With': CSRF_HEADER, Accept: 'application/json' },
    };
    if (body !== undefined) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    return fetch(url, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (r.status === 401 && url.indexOf('/api/admin-session') === -1) {
          showScreen('login');
          setMsg($('login-msg'), 'Přihlášení vypršelo. Nechte si prosím poslat nový odkaz.', 'err');
        }
        return { status: r.status, data: data || {} };
      });
    });
  }

  function errorText(res, fallback) {
    if (res && res.data && typeof res.data.error === 'string') return res.data.error;
    if (res && res.status === 503) return 'Server teď není dostupný (při místním náhledu funkce neběží). Zkuste to prosím na ostrém webu.';
    return fallback;
  }

  /* ---------- Přihlášení ---------- */
  $('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = $('login-email');
    var email = input.value.trim();
    var msg = $('login-msg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      input.classList.add('is-invalid');
      setMsg(msg, 'Zadejte prosím platný e-mail.', 'err');
      input.focus();
      return;
    }
    input.classList.remove('is-invalid');
    setBusy(true);
    setMsg(msg, 'Odesílám…', 'info');
    api('POST', '/api/admin-login', { email: email }).then(function (res) {
      setBusy(false);
      if (res.status === 200 && res.data.ok) {
        setMsg(msg, res.data.message || 'Pokud je tato adresa povolená, poslali jsme na ni přihlašovací odkaz.', 'ok');
      } else {
        setMsg(msg, errorText(res, 'Odkaz se nepodařilo odeslat. Zkuste to prosím za chvíli znovu.'), 'err');
      }
    }).catch(function () {
      setBusy(false);
      setMsg(msg, 'Nepodařilo se spojit se serverem. Zkontrolujte připojení a zkuste to znovu.', 'err');
    });
  });

  $('btn-logout').addEventListener('click', function () {
    setBusy(true);
    api('DELETE', '/api/admin-session').then(function () {
      setBusy(false);
      state.items = [];
      hideForm();
      showScreen('login');
      setMsg($('login-msg'), 'Byli jste odhlášeni.', 'ok');
    }).catch(function () {
      setBusy(false);
      setMsg($('app-msg'), 'Odhlášení se nepodařilo. Zkuste to prosím znovu.', 'err');
    });
  });

  function enterApp(email) {
    $('app-email').textContent = email || '';
    showScreen('app');
    setMsg($('app-msg'), '');
    loadItems();
  }

  function exchangeToken(token) {
    showScreen('wait');
    api('POST', '/api/admin-session', { t: token }).then(function (res) {
      // odstraníme token z adresy, aby nezůstal v historii / záložkách
      try { history.replaceState(null, '', location.pathname); } catch (err) { /* nevadí */ }
      if (res.status === 200 && res.data.ok) {
        enterApp(res.data.email);
      } else {
        showScreen('login');
        setMsg($('login-msg'), errorText(res, 'Přihlašovací odkaz je neplatný nebo vypršel. Nechte si prosím poslat nový.'), 'err');
      }
    }).catch(function () {
      showScreen('login');
      setMsg($('login-msg'), 'Nepodařilo se spojit se serverem. Zkuste odkaz otevřít znovu.', 'err');
    });
  }

  function checkSession() {
    api('GET', '/api/admin-session').then(function (res) {
      if (res.status === 200 && res.data.ok) {
        enterApp(res.data.email);
      } else {
        showScreen('login');
        if (res.status !== 401) setMsg($('admin-status'), errorText(res, 'Server teď neodpovídá. Zkuste to prosím později.'), 'err');
      }
    }).catch(function () {
      showScreen('login');
      setMsg($('admin-status'), 'Nepodařilo se spojit se serverem. Zkontrolujte připojení a obnovte stránku.', 'err');
    });
  }

  /* ---------- Seznam ---------- */
  function loadItems() {
    var list = $('admin-list');
    $('admin-loading').hidden = false;
    $('admin-empty').hidden = true;
    api('GET', '/api/novinky').then(function (res) {
      $('admin-loading').hidden = true;
      if (res.status === 200 && res.data.ok && Array.isArray(res.data.items)) {
        state.items = res.data.items;
        renderList();
      } else if (res.status !== 401) {
        setMsg($('app-msg'), errorText(res, 'Seznam aktualit se nepodařilo načíst. Obnovte prosím stránku.'), 'err');
      }
    }).catch(function () {
      $('admin-loading').hidden = true;
      setMsg($('app-msg'), 'Seznam aktualit se nepodařilo načíst. Zkontrolujte připojení a obnovte stránku.', 'err');
    });
    list.textContent = '';
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderList() {
    var list = $('admin-list');
    list.textContent = '';
    $('admin-empty').hidden = state.items.length > 0;
    state.items.forEach(function (item) {
      var li = el('li', 'admin-item' + (item.id === state.editingId ? ' is-editing' : ''));
      li.setAttribute('data-id', item.id);

      var head = el('div', 'admin-item__head');
      if (item.obrazek) {
        var thumb = document.createElement('img');
        thumb.className = 'admin-item__thumb';
        thumb.src = item.obrazek;
        thumb.alt = '';
        head.appendChild(thumb);
      }
      var info = el('div');
      var meta = el('div', 'admin-item__meta');
      meta.appendChild(el('span', '', formatDate(item.datum)));
      meta.appendChild(el('span', 'badge ' + (item.publikovano ? 'badge--on' : 'badge--off'), item.publikovano ? 'Zveřejněno' : 'Skryto'));
      info.appendChild(meta);
      info.appendChild(el('p', 'admin-item__title', item.nadpis));
      head.appendChild(info);
      li.appendChild(head);

      var actions = el('div', 'admin-item__actions');
      var edit = el('button', 'btn', 'Upravit');
      edit.type = 'button';
      edit.addEventListener('click', function () { openForm(item); });
      var del = el('button', 'btn btn--danger', 'Smazat');
      del.type = 'button';
      del.addEventListener('click', function () { deleteItem(item); });
      actions.appendChild(edit);
      actions.appendChild(del);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  /* ---------- Formulář ---------- */
  var form = $('item-form');
  var fileInput = $('f-obrazek');
  var textArea = $('f-text');

  function updateCount() {
    $('f-text-count').textContent = 'Napsáno ' + textArea.value.length + ' z 5000 znaků.';
  }
  textArea.addEventListener('input', updateCount);

  function showPreview(src) {
    var box = $('image-preview');
    var img = $('image-preview-img');
    if (src) { img.src = src; box.hidden = false; } else { img.removeAttribute('src'); box.hidden = true; }
  }

  function openForm(item) {
    state.editingId = item ? item.id : null;
    $('form-title').textContent = item ? 'Upravit aktualitu' : 'Nová aktualita';
    $('f-id').value = item ? item.id : '';
    $('f-nadpis').value = item ? item.nadpis : '';
    $('f-datum').value = item ? item.datum : today();
    textArea.value = item ? item.text : '';
    $('f-publikovano').checked = item ? item.publikovano === true : false;
    fileInput.value = '';
    state.image = { mode: 'keep', dataUrl: null, current: item && item.obrazek ? item.obrazek : null };
    showPreview(state.image.current);
    updateCount();
    setMsg($('form-msg'), '');
    Array.prototype.forEach.call(form.querySelectorAll('.is-invalid'), function (f) { f.classList.remove('is-invalid'); });
    $('form-card').hidden = false;
    renderList();
    $('form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('f-nadpis').focus({ preventScroll: true });
  }

  function hideForm() {
    state.editingId = null;
    $('form-card').hidden = true;
    form.reset();
    showPreview(null);
    renderList();
  }

  $('btn-new').addEventListener('click', function () { openForm(null); });
  $('btn-cancel').addEventListener('click', function () { hideForm(); });

  $('btn-remove-image').addEventListener('click', function () {
    fileInput.value = '';
    state.image = { mode: state.image.current ? 'remove' : 'keep', dataUrl: null, current: state.image.current };
    showPreview(null);
  });

  // Zmenší obrázek v prohlížeči a vrátí data URL (JPEG).
  function resizeImage(file) {
    return new Promise(function (resolve, reject) {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
        reject(new Error('Vyberte prosím fotku ve formátu JPEG, PNG nebo WebP.'));
        return;
      }
      var reader = new FileReader();
      reader.onerror = function () { reject(new Error('Soubor se nepodařilo načíst.')); };
      reader.onload = function () {
        var img = new Image();
        img.onerror = function () { reject(new Error('Soubor se nepodařilo načíst jako obrázek.')); };
        img.onload = function () {
          try {
            var scale = Math.min(1, MAX_IMAGE_WIDTH / img.naturalWidth);
            var w = Math.max(1, Math.round(img.naturalWidth * scale));
            var h = Math.max(1, Math.round(img.naturalHeight * scale));
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff'; // průhledná PNG dostane bílé pozadí
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            var dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
            var bytes = Math.floor((dataUrl.length - dataUrl.indexOf(',') - 1) * 3 / 4);
            if (bytes > MAX_IMAGE_BYTES) {
              reject(new Error('Obrázek je i po zmenšení příliš velký. Zkuste prosím jinou fotku.'));
              return;
            }
            resolve(dataUrl);
          } catch (err) {
            reject(new Error('Obrázek se nepodařilo zpracovat.'));
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  fileInput.addEventListener('change', function () {
    var file = fileInput.files && fileInput.files[0];
    var msg = $('form-msg');
    if (!file) return;
    setMsg(msg, 'Zpracovávám obrázek…', 'info');
    resizeImage(file).then(function (dataUrl) {
      state.image = { mode: 'new', dataUrl: dataUrl, current: state.image.current };
      showPreview(dataUrl);
      setMsg(msg, '');
    }).catch(function (err) {
      fileInput.value = '';
      setMsg(msg, err.message || 'Obrázek se nepodařilo zpracovat.', 'err');
    });
  });

  function validateForm() {
    var errors = [];
    var nadpis = $('f-nadpis'), datum = $('f-datum');
    [nadpis, datum, textArea].forEach(function (f) { f.classList.remove('is-invalid'); });
    if (nadpis.value.trim().length < 3 || nadpis.value.trim().length > 120) { errors.push('Nadpis musí mít 3 až 120 znaků.'); nadpis.classList.add('is-invalid'); }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum.value)) { errors.push('Vyplňte prosím datum.'); datum.classList.add('is-invalid'); }
    if (textArea.value.trim().length < 1 || textArea.value.length > 5000) { errors.push('Vyplňte prosím text (max. 5000 znaků).'); textArea.classList.add('is-invalid'); }
    return errors;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (state.busy) return;
    var msg = $('form-msg');
    var errors = validateForm();
    if (errors.length) {
      setMsg(msg, errors.join(' '), 'err');
      var first = form.querySelector('.is-invalid');
      if (first) first.focus();
      return;
    }
    var body = {
      nadpis: $('f-nadpis').value.trim(),
      datum: $('f-datum').value,
      text: textArea.value.replace(/\r\n?/g, '\n').trim(),
      publikovano: $('f-publikovano').checked,
    };
    if (state.editingId) body.id = state.editingId;
    if (state.image.mode === 'new') body.obrazek = state.image.dataUrl;
    else if (state.image.mode === 'remove') body.obrazek = null;

    setBusy(true);
    setMsg(msg, 'Ukládám… může to chvíli trvat.', 'info');
    api('POST', '/api/novinky', body).then(function (res) {
      setBusy(false);
      if (res.status === 200 && res.data.ok) {
        var saved = res.data.item;
        var idx = -1;
        state.items.forEach(function (it, i) { if (it.id === saved.id) idx = i; });
        if (idx >= 0) state.items[idx] = saved; else state.items.unshift(saved);
        state.items.sort(function (a, b) { return a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0; });
        hideForm();
        setMsg($('app-msg'), res.data.message || 'Uloženo. Na webu se objeví do minuty až dvou.', 'ok');
        $('app-msg').scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (res.status !== 401) {
        setMsg(msg, errorText(res, 'Uložení se nepodařilo. Zkuste to prosím znovu.'), 'err');
      }
    }).catch(function () {
      setBusy(false);
      setMsg(msg, 'Nepodařilo se spojit se serverem. Zkontrolujte připojení a zkuste to znovu.', 'err');
    });
  });

  function deleteItem(item) {
    if (state.busy) return;
    if (!window.confirm('Opravdu smazat aktualitu „' + item.nadpis + '“? Tuto akci nelze vrátit.')) return;
    setBusy(true);
    setMsg($('app-msg'), 'Mažu…', 'info');
    api('DELETE', '/api/novinky?id=' + encodeURIComponent(item.id)).then(function (res) {
      setBusy(false);
      if (res.status === 200 && res.data.ok) {
        state.items = state.items.filter(function (it) { return it.id !== item.id; });
        if (state.editingId === item.id) hideForm(); else renderList();
        setMsg($('app-msg'), res.data.message || 'Smazáno. Z webu zmizí do minuty až dvou.', 'ok');
      } else if (res.status !== 401) {
        setMsg($('app-msg'), errorText(res, 'Smazání se nepodařilo. Zkuste to prosím znovu.'), 'err');
        if (res.status === 404) loadItems();
      }
    }).catch(function () {
      setBusy(false);
      setMsg($('app-msg'), 'Nepodařilo se spojit se serverem. Zkuste to prosím znovu.', 'err');
    });
  }

  /* ---------- Start ---------- */
  var params = new URLSearchParams(location.search);
  var token = params.get('t');
  if (token) exchangeToken(token);
  else checkSession();
})();
