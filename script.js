/* ===== BELLEZZA - lógica =====
   Casi todo lo que vas a querer cambiar está en CONFIG y PRODUCTS. */
'use strict';

/* ---------- 1. CONFIGURACIÓN (datos del negocio) ---------- */
const CONFIG = {
  storeName: 'Bellezza',

  // WhatsApp: código de país + número, SOLO dígitos (0986 327 554 -> 595986327554)
  whatsapp: '595986327554',

  // Redes sociales. Dejá vacío ('') lo que no tengas y no se mostrará.
  instagram: 'bellezza.enc',   // usuario, sin @
  facebook: '',                // enlace completo, ej. 'https://www.facebook.com/tu-pagina'

  // Ubicación
  address: 'Juan L. Mallorquín casi 14 de Mayo, Encarnación, Paraguay', // confirmá la numeración exacta
  mapsQuery: 'Juan L. Mallorquín y 14 de Mayo, Encarnación, Paraguay',  // se usa para el mapa y "Cómo llegar"
  mapsEmbed: '',   // opcional: pegá acá el src del <iframe> de Google Maps (Compartir > Insertar un mapa)
  mapsLink: '',    // opcional: enlace real de Google Maps para el botón "Cómo llegar"

  // Horarios. Si está vacío se muestra "Consultá nuestros horarios por WhatsApp."
  hours: '',

  // Imagen principal. Vacío = foto demo. Ejemplo: 'img/hero.jpg'
  heroImage: '',

  storageKey: 'bellezza-cart'
};

/* ---------- 2. CATEGORÍAS ---------- */
const CATEGORIES = [
  { id: 'todo',       label: 'Todo' },
  { id: 'vestidos',   label: 'Vestidos' },
  { id: 'tops',       label: 'Tops' },
  { id: 'blusas',     label: 'Blusas' },
  { id: 'pantalones', label: 'Pantalones' },
  { id: 'faldas',     label: 'Faldas' },
  { id: 'conjuntos',  label: 'Conjuntos' },
  { id: 'nuevos',     label: 'Nuevos ingresos' }   // muestra los productos con nuevo: true
];

/* ---------- 3. PRODUCTOS ----------
   Los textos y PRECIOS son de ejemplo (DEMO). Para cambiar un precio, editá "price" (en guaraníes, sin puntos).

   FOTOS: cada producto usa una foto demo (demoId) hasta que cargues la real.
   Para poner la foto real:
     1) guardala en la carpeta img/productos/  (ej. img/productos/vestido-satinado.jpg)
     2) escribí la ruta en "img":  img: 'img/productos/vestido-satinado.jpg'
   Al hacerlo, la foto demo y la etiqueta "Imagen demo" desaparecen solas. */
const PRODUCTS = [
  { id: 1, cat: 'vestidos',   nuevo: true,  name: 'Vestido Satinado',  desc: 'Tela satinada con caída fluida.',          price: 189000, img: '', demoId: '1765229279658-7335ee3cdaf5' },
  { id: 2, cat: 'vestidos',   nuevo: false, name: 'Vestido Casual',    desc: 'Cómodo y fresco para el día a día.',        price: 149000, img: '', demoId: '1789110853872-f416085557fa' },
  { id: 3, cat: 'tops',       nuevo: true,  name: 'Top Básico',        desc: 'Un básico que combina con todo.',           price: 59000,  img: '', demoId: '1770294758906-c8762abb2c8b' },
  { id: 4, cat: 'blusas',     nuevo: false, name: 'Blusa Elegante',    desc: 'Corte delicado para la oficina o salir.',   price: 99000,  img: '', demoId: '1761117228880-df2425bd70da' },
  { id: 5, cat: 'pantalones', nuevo: false, name: 'Pantalón Wide Leg', desc: 'Pierna ancha y tiro alto.',                 price: 139000, img: '', demoId: '1687825515654-23620796760c' },
  { id: 6, cat: 'faldas',     nuevo: true,  name: 'Falda Mini',        desc: 'Corta y liviana, fácil de combinar.',       price: 89000,  img: '', demoId: '1704775989365-eebfd4659a23' },
  { id: 7, cat: 'conjuntos',  nuevo: false, name: 'Conjunto Casual',   desc: 'Dos piezas listas para usar juntas.',       price: 169000, img: '', demoId: '1680690517143-d813ac08cd13' },
  { id: 8, cat: 'vestidos',   nuevo: true,  name: 'Vestido de Fiesta', desc: 'Para eventos y ocasiones especiales.',      price: 249000, img: '', demoId: '1765229277675-b8466891e689' }
];

/* ---------- 4. UTILIDADES ---------- */
const $ = sel => document.querySelector(sel);
const fmt = n => 'Gs. ' + new Intl.NumberFormat('es-PY').format(n);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const waLink = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const findProduct = id => PRODUCTS.find(p => p.id === id);
const isDemo = p => !p.img;
const demoUrl = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;
const imgOf = (p, w, h) => p.img || demoUrl(p.demoId, w, h);
const buyMessage = p => `Hola ${CONFIG.storeName}! Me interesa este producto: ${p.name} (${fmt(p.price)}). ¿Está disponible?`;

// Imagen de respaldo (SVG) si alguna foto no carga
const fallbackSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750"><rect width="100%" height="100%" fill="#e6d9cb"/><text x="50%" y="50%" fill="#6b5043" font-family="Georgia,serif" font-size="40" text-anchor="middle">Bellezza</text></svg>';
document.addEventListener('error', e => {
  if (e.target.tagName === 'IMG' && !e.target.dataset.failed) {
    e.target.dataset.failed = '1';
    e.target.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(fallbackSvg);
  }
}, true);

// Imágenes que ya fallaron antes de que este script cargara (ej. la principal)
window.addEventListener('load', () => {
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth === 0 && !img.dataset.failed) img.dispatchEvent(new Event('error'));
  });
});

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- 5. ESTADO ---------- */
let filter = 'todo';
let cart = []; // [{ id, qty }]
try { cart = JSON.parse(localStorage.getItem(CONFIG.storageKey)) || []; } catch (e) { cart = []; }
if (!Array.isArray(cart)) cart = [];
cart = cart.filter(i => i && findProduct(i.id) && i.qty > 0); // descarta datos inválidos

function saveCart() {
  try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(cart)); } catch (e) { /* modo privado: se ignora */ }
}

/* ---------- 6. CARRITO ---------- */
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  updateCart();
  toast(findProduct(id).name + ' agregado al carrito');
  const b = $('#cartCount');
  b.classList.add('bump');
  setTimeout(() => b.classList.remove('bump'), 250);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeFromCart(id);
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

const cartTotal = () => cart.reduce((s, i) => s + findProduct(i.id).price * i.qty, 0);
const cartCount = () => cart.reduce((s, i) => s + i.qty, 0);

// Mensaje de WhatsApp con productos, cantidades y total
function checkoutMessage() {
  const lines = cart.map(i => {
    const p = findProduct(i.id);
    return `- ${i.qty} x ${p.name} (${fmt(p.price * i.qty)})`;
  });
  return `Hola ${CONFIG.storeName}! Quiero hacer este pedido:\n\n${lines.join('\n')}\n\nTotal: ${fmt(cartTotal())}`;
}

/* ---------- 7. RENDER ---------- */
function visibleProducts() {
  if (filter === 'todo') return PRODUCTS;
  if (filter === 'nuevos') return PRODUCTS.filter(p => p.nuevo);
  return PRODUCTS.filter(p => p.cat === filter);
}

// Categorías: cada una usa la foto del primer producto que le corresponde
function renderCats() {
  $('#cats').innerHTML = CATEGORIES.map(c => {
    const sample = c.id === 'todo' ? null : (c.id === 'nuevos' ? PRODUCTS.find(p => p.nuevo) : PRODUCTS.find(p => p.cat === c.id));
    const visual = sample
      ? `<img src="${imgOf(sample, 240, 300)}" alt="" width="112" height="140" loading="lazy">`
      : esc(c.label);
    return `
      <button type="button" class="cat" data-cat="${c.id}" aria-pressed="${c.id === filter}">
        <span class="cat__img">${visual}</span>
        <span class="cat__name">${esc(c.label)}</span>
      </button>`;
  }).join('');
}

function renderProducts(animate) {
  const list = visibleProducts();
  const grid = $('#productGrid');
  grid.innerHTML = list.map(p => `
    <article class="card">
      <div class="card__media">
        <img src="${imgOf(p, 600, 750)}" alt="${esc(p.name)}${isDemo(p) ? ' (imagen demo)' : ''}" loading="lazy" width="600" height="750">
        ${p.nuevo ? '<span class="tag-new">Nuevo</span>' : ''}
        ${isDemo(p) ? '<span class="demo-tag">Imagen demo</span>' : ''}
      </div>
      <div class="card__body">
        <div class="card__top">
          <h3>${esc(p.name)}</h3>
          <span class="price">${fmt(p.price)}</span>
        </div>
        <p>${esc(p.desc)}</p>
        <div class="card__btns">
          <a class="btn btn--primary" href="${waLink(buyMessage(p))}" target="_blank" rel="noopener noreferrer">Comprar por WhatsApp</a>
          <button type="button" class="btn btn--line" data-add="${p.id}">Agregar al carrito</button>
        </div>
      </div>
    </article>`).join('');

  const cat = CATEGORIES.find(c => c.id === filter);
  const n = list.length;
  $('#resultsNote').textContent = (filter === 'todo' ? '' : cat.label + ': ') + n + (n === 1 ? ' producto' : ' productos');

  if (animate) { // pequeña animación solo cuando la persona cambia de categoría
    grid.classList.remove('fade');
    void grid.offsetWidth;
    grid.classList.add('fade');
  }
}

function setFilter(id) {
  filter = id;
  document.querySelectorAll('.cat').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === id)));
  renderProducts(true);
  // Si los productos quedan fuera de la vista (celular), baja hasta ellos
  const top = $('#productGrid').getBoundingClientRect().top;
  if (top > window.innerHeight * 0.75) $('#resultsNote').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateCart() {
  const list = $('#cartItems');
  if (!cart.length) {
    list.innerHTML = '<li class="empty">Tu carrito está vacío.<br>Agregá prendas para armar tu pedido.</li>';
  } else {
    list.innerHTML = cart.map(i => {
      const p = findProduct(i.id);
      return `
      <li class="item">
        <img src="${imgOf(p, 128, 160)}" alt="" width="64" height="80">
        <div>
          <h4>${esc(p.name)}</h4>
          <small>${fmt(p.price)} c/u</small>
          <div class="qty">
            <button type="button" data-dec="${p.id}" aria-label="Quitar una unidad de ${esc(p.name)}">&minus;</button>
            <span aria-live="polite">${i.qty}</span>
            <button type="button" data-inc="${p.id}" aria-label="Agregar una unidad de ${esc(p.name)}">+</button>
          </div>
        </div>
        <div class="item__side">
          <strong>${fmt(p.price * i.qty)}</strong><br>
          <button type="button" class="item__rm" data-rm="${p.id}" aria-label="Quitar ${esc(p.name)} del carrito">Quitar</button>
        </div>
      </li>`;
    }).join('');
  }
  $('#subtotal').textContent = fmt(cartTotal());
  $('#total').textContent = fmt(cartTotal());
  $('#cartCount').textContent = cartCount();
  $('#cartFoot').hidden = !cart.length;
  $('#checkout').href = cart.length ? waLink(checkoutMessage()) : '#';
  saveCart();
}

/* ---------- 8. DATOS DEL NEGOCIO EN LA PÁGINA ---------- */
function fillBusinessInfo() {
  // Todos los enlaces con data-wa abren WhatsApp con ese mensaje
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = waLink(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });

  const n = CONFIG.whatsapp;
  $('#waText').textContent = `+${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 9)} ${n.slice(9)}`.trim();

  document.querySelectorAll('.js-ig').forEach(a => {
    if (!CONFIG.instagram) { a.hidden = true; return; }
    a.href = `https://www.instagram.com/${CONFIG.instagram}/`;
    if (a.closest('.info')) a.textContent = '@' + CONFIG.instagram;
  });

  if (CONFIG.facebook) {
    const fb = $('#fbLink');
    fb.href = CONFIG.facebook;
    fb.hidden = false;
  }

  $('#addrText').textContent = CONFIG.address;
  $('#hoursText').textContent = CONFIG.hours || 'Consultá nuestros horarios por WhatsApp.';
  $('#routeBtn').href = CONFIG.mapsLink || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONFIG.mapsQuery)}`;

  // Imagen principal propia (si la hay)
  if (CONFIG.heroImage) {
    $('#heroImg').src = CONFIG.heroImage;
    $('#heroTag').hidden = true;
  }

  // Mapa de Google Maps
  const f = document.createElement('iframe');
  f.src = CONFIG.mapsEmbed || `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapsQuery)}&z=17&output=embed`;
  f.title = 'Mapa con la ubicación de Bellezza en Encarnación';
  f.loading = 'lazy';
  f.referrerPolicy = 'no-referrer-when-downgrade';
  f.setAttribute('allowfullscreen', '');
  $('#mapBox').appendChild(f);
}

/* ---------- 9. PANEL DEL CARRITO Y MENÚ ---------- */
const cartEl = $('#cart'), overlay = $('#overlay'), openBtn = $('#openCart');

function toggleCart(open) {
  cartEl.classList.toggle('open', open);
  cartEl.setAttribute('aria-hidden', String(!open));
  openBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('show'));
    $('#closeCart').focus();
  } else {
    overlay.classList.remove('show');
    setTimeout(() => { overlay.hidden = true; }, 300);
    openBtn.focus();
  }
}

function toggleMenu(open) {
  $('#menu').classList.toggle('open', open);
  $('#burger').setAttribute('aria-expanded', String(open));
  $('#burger').setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}

/* ---------- 10. EVENTOS ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-add],[data-inc],[data-dec],[data-rm],[data-cat]');
  if (!t) return;
  if (t.dataset.add) addToCart(+t.dataset.add);
  if (t.dataset.inc) changeQty(+t.dataset.inc, 1);
  if (t.dataset.dec) changeQty(+t.dataset.dec, -1);
  if (t.dataset.rm) removeFromCart(+t.dataset.rm);
  if (t.dataset.cat) setFilter(t.dataset.cat);
});

openBtn.addEventListener('click', () => toggleCart(true));
$('#closeCart').addEventListener('click', () => toggleCart(false));
overlay.addEventListener('click', () => toggleCart(false));
$('#clearCart').addEventListener('click', clearCart);
$('#checkout').addEventListener('click', e => { if (!cart.length) e.preventDefault(); });
$('#burger').addEventListener('click', () => toggleMenu(!$('#menu').classList.contains('open')));
$('#menu').addEventListener('click', e => { if (e.target.tagName === 'A') toggleMenu(false); });

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (cartEl.classList.contains('open')) toggleCart(false);
  toggleMenu(false);
});

window.addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', window.scrollY > 10), { passive: true });

/* ---------- 11. INICIO ---------- */
$('#year').textContent = new Date().getFullYear();
fillBusinessInfo();
renderCats();
renderProducts(false);
updateCart();
