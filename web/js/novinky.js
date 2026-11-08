/* AutoPraizler M.L. – aktuality: načte /data/novinky.json a vykreslí zveřejněné položky.
   Úvodní stránka: <section id="aktuality" hidden> s .aktuality__list → poslední 3 + odkaz na /novinky/.
   Stránka /novinky/: #novinky-list → všechny zveřejněné aktuality.
   Bez knihoven; text je prostý (odstavce oddělené prázdným řádkem) a vždy se escapuje. */
(function () {
  'use strict';

  var MONTHS = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];

  function formatDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return '';
    return parseInt(m[3], 10) + '. ' + MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1];
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function paragraphs(text) {
    var frag = document.createDocumentFragment();
    String(text || '').replace(/\r\n?/g, '\n').split(/\n\s*\n/).forEach(function (chunk) {
      var p = chunk.trim();
      if (!p) return;
      var para = el('p');
      var lines = p.split('\n');
      lines.forEach(function (line, i) {
        if (i) para.appendChild(document.createElement('br'));
        para.appendChild(document.createTextNode(line));
      });
      frag.appendChild(para);
    });
    return frag;
  }

  function safeImageSrc(src) {
    // povolíme jen obrázky z vlastní složky /data/obrazky/
    return typeof src === 'string' && /^\/data\/obrazky\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(src) ? src : null;
  }

  function renderItem(item, headingTag, variant) {
    var art = el('article', 'aktualita aktualita--' + variant);
    if (item.id) art.id = 'a-' + String(item.id).replace(/[^a-z0-9-]/gi, '');
    var img = safeImageSrc(item.obrazek);
    if (img) {
      art.className += ' aktualita--has-img';
      var fig = el('div', 'aktualita__img');
      var image = document.createElement('img');
      image.src = img;
      image.alt = '';
      image.loading = 'lazy';
      fig.appendChild(image);
      art.appendChild(fig);
    }
    var body = el('div', 'aktualita__body');
    var time = el('time', 'aktualita__date', formatDate(item.datum));
    time.setAttribute('datetime', item.datum || '');
    body.appendChild(time);
    body.appendChild(el(headingTag, 'aktualita__title', item.nadpis || ''));
    var text = el('div', 'aktualita__text');
    text.appendChild(paragraphs(item.text));
    body.appendChild(text);
    art.appendChild(body);
    return art;
  }

  function published(items) {
    return items.filter(function (it) {
      return it && it.publikovano === true && typeof it.nadpis === 'string' && typeof it.datum === 'string';
    }).sort(function (a, b) {
      return a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0;
    });
  }

  function renderHome(section, items) {
    var list = section.querySelector('.aktuality__list');
    if (!list) return;
    var shown = items.slice(0, 3);
    if (!shown.length) return; // sekce zůstane skrytá, stránka vypadá jako dřív
    shown.forEach(function (it) { list.appendChild(renderItem(it, 'h3', 'card')); });
    list.className += ' aktuality__list--' + shown.length;
    var more = section.querySelector('.aktuality__more');
    if (more) more.hidden = false;
    section.hidden = false;
  }

  function renderPage(container, items) {
    if (!items.length) {
      container.appendChild(el('p', 'aktuality__empty', 'Zatím tu nejsou žádné aktuality. Sledujte nás, brzy něco přibude.'));
      return;
    }
    items.forEach(function (it) { container.appendChild(renderItem(it, 'h2', 'row')); });
  }

  var home = document.getElementById('aktuality');
  var page = document.getElementById('novinky-list');
  if (!home && !page) return;

  fetch('/data/novinky.json', { cache: 'no-store', credentials: 'omit' })
    .then(function (r) { return r.ok ? r.json() : { items: [] }; })
    .then(function (data) {
      var items = published(data && Array.isArray(data.items) ? data.items : []);
      if (home) renderHome(home, items);
      if (page) renderPage(page, items);
    })
    .catch(function () {
      if (page) page.appendChild(el('p', 'aktuality__empty', 'Aktuality se nepodařilo načíst. Zkuste prosím obnovit stránku.'));
    });
})();
