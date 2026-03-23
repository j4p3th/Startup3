/* ============================================
   J's Digital — Electronics & Tech
   app.js
   ============================================ */

'use strict';

/* ============================================
   DATA
   ============================================ */
const EMOJIS = [
  '🎧','💻','📱','🖥️','⌨️','🖱️','📷','🎮',
  '📺','🔊','🎵','⌚','🔋','💡','📡','🕹️',
  '🖨️','📠','💾','🔌'
];

let selectedEmoji = '💻';

let products = [
  {
    id: 1,
    name: 'Sony WH-1000XM6',
    cat: 'audio',
    price: 22999,
    old: 25999,
    desc: 'Industry-leading noise cancellation with 40-hour battery life. Multipoint connection to 2 devices simultaneously. Premium over-ear comfort with foldable design.',
    badge: 'sale',
    emoji: '🎧',
    specs: [
      { l: 'Battery',      v: '40 Hours' },
      { l: 'Noise Cancel', v: 'ANC Pro'  },
      { l: 'Driver',       v: '30mm'     },
      { l: 'Connectivity', v: 'BT 5.3'  }
    ]
  },
  {
    id: 2,
    name: 'MacBook Air M4',
    cat: 'computing',
    price: 74995,
    old: null,
    desc: "Powered by the all-new M4 chip. Ultra-thin 11mm profile, 18-hour battery, and a stunning 13.6\" Liquid Retina display. The world's best thin & light laptop.",
    badge: 'new',
    emoji: '💻',
    specs: [
      { l: 'Chip',    v: 'Apple M4'  },
      { l: 'RAM',     v: '16GB'      },
      { l: 'Storage', v: '512GB SSD' },
      { l: 'Battery', v: '18 Hours'  }
    ]
  },
  {
    id: 3,
    name: 'iPhone 16 Pro',
    cat: 'mobile',
    price: 69995,
    old: null,
    desc: 'Titanium design with A18 Pro chip. 5x telephoto camera system with 48MP main sensor. ProMotion 120Hz display, 4K120 video recording.',
    badge: 'featured',
    emoji: '📱',
    specs: [
      { l: 'Chip',    v: 'A18 Pro'       },
      { l: 'Camera',  v: '48MP Triple'    },
      { l: 'Display', v: '6.3" ProMotion' },
      { l: 'Storage', v: '256GB'          }
    ]
  },
  {
    id: 4,
    name: 'LG C4 OLED 55"',
    cat: 'computing',
    price: 89995,
    old: 109999,
    desc: 'Perfect blacks, infinite contrast. α9 AI Processor Gen7, Dolby Vision IQ, and 144Hz gaming-ready panel with NVIDIA G-SYNC and AMD FreeSync Premium.',
    badge: 'sale',
    emoji: '📺',
    specs: [
      { l: 'Panel',      v: 'OLED evo'   },
      { l: 'Resolution', v: '4K UHD'     },
      { l: 'Refresh',    v: '144Hz'      },
      { l: 'HDR',        v: 'Dolby Vision' }
    ]
  },
  {
    id: 5,
    name: 'Logitech MX Keys S',
    cat: 'accessories',
    price: 7499,
    old: null,
    desc: 'Perfectly crafted for efficiency. Smart backlighting, comfortable low-profile keys, and seamless multi-device switching. Compatible with Mac, Windows, and Linux.',
    badge: '',
    emoji: '⌨️',
    specs: [
      { l: 'Connectivity', v: 'BT / USB-C'    },
      { l: 'Devices',      v: 'Up to 3'        },
      { l: 'Battery',      v: '10 Days'        },
      { l: 'Backlight',    v: 'Smart Adaptive' }
    ]
  },
  {
    id: 6,
    name: 'PS5 DualSense Edge',
    cat: 'gaming',
    price: 8499,
    old: null,
    desc: 'The ultra-customizable wireless controller for PlayStation 5. Interchangeable stick caps and back buttons, remappable controls, and adjustable trigger dead zones.',
    badge: 'new',
    emoji: '🎮',
    specs: [
      { l: 'Connectivity', v: 'BT 5.1'          },
      { l: 'Battery',      v: '~6 Hours'         },
      { l: 'Haptics',      v: 'Adaptive Triggers' },
      { l: 'Platform',     v: 'PS5 / PC'          }
    ]
  },
  {
    id: 7,
    name: 'Apple Watch Ultra 2',
    cat: 'accessories',
    price: 54995,
    old: null,
    desc: 'The most rugged and capable Apple Watch. Titanium case, up to 60 hours battery, precision dual-frequency GPS, and 100m water resistance.',
    badge: '',
    emoji: '⌚',
    specs: [
      { l: 'Case',      v: 'Titanium 49mm' },
      { l: 'Battery',   v: '60 Hours'       },
      { l: 'Water Res.', v: '100m'          },
      { l: 'GPS',       v: 'Dual Frequency' }
    ]
  },
  {
    id: 8,
    name: 'Sony A7 IV',
    cat: 'accessories',
    price: 149995,
    old: 159999,
    desc: 'Full-frame mirrorless powerhouse. 33MP BSI-CMOS sensor, 4K 60fps video, 759 phase-detection AF points, and 10fps burst. Redefined hybrid excellence.',
    badge: 'sale',
    emoji: '📷',
    specs: [
      { l: 'Sensor',    v: '33MP Full-Frame'  },
      { l: 'Video',     v: '4K 60fps'         },
      { l: 'AF Points', v: '759 Phase-Detect' },
      { l: 'Burst',     v: '10 fps'           }
    ]
  }
];

let cart          = {};
let currentFilter = 'all';
let currentSearch = '';
let nextId        = 9;

/* ============================================
   AUTH STATE
   ============================================ */
let currentUser = null;

function loadAuth() {
  try {
    const stored = localStorage.getItem('jd_session');
    if (stored) currentUser = JSON.parse(stored);
  } catch(e) { currentUser = null; }
  renderUserNav();
}

function saveSession(user) {
  currentUser = user;
  localStorage.setItem('jd_session', JSON.stringify(user));
  renderUserNav();
}

function clearSession() {
  currentUser = null;
  localStorage.removeItem('jd_session');
  renderUserNav();
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem('jd_users') || '[]'); }
  catch(e) { return []; }
}

function saveUsers(users) {
  localStorage.setItem('jd_users', JSON.stringify(users));
}

function renderUserNav() {
  const nav = document.getElementById('userNav');
  if (!nav) return;
  if (currentUser) {
    const initials = (currentUser.fname[0] + currentUser.lname[0]).toUpperCase();
    nav.innerHTML = `
      <div class="user-pill">
        <div class="user-avatar">${initials}</div>
        <span class="user-name">${currentUser.fname}</span>
        <button class="user-logout" onclick="handleLogout()">Sign Out</button>
      </div>`;
  } else {
    nav.innerHTML = `<button class="login-btn" onclick="openAuth()">Sign In</button>`;
  }
}

function openAuth() {
  switchToLogin();
  document.getElementById('authModal').classList.add('open');
}

function closeAuth() {
  document.getElementById('authModal').classList.remove('open');
}

function closeAuthModal(e) {
  if (e.target === document.getElementById('authModal')) closeAuth();
}

function switchToRegister() {
  document.getElementById('loginPanel').style.display = 'none';
  document.getElementById('registerPanel').style.display = '';
}

function switchToLogin() {
  document.getElementById('registerPanel').style.display = 'none';
  document.getElementById('loginPanel').style.display = '';
}

function handleLogin() {
  const email = document.getElementById('l-email').value.trim().toLowerCase();
  const pass  = document.getElementById('l-pass').value;
  if (!email || !pass) { showToast('Please fill all fields'); return; }
  const users = getUsers();
  const user  = users.find(u => u.email === email && u.pass === pass);
  if (!user) { showToast('Invalid email or password'); return; }
  saveSession(user);
  closeAuth();
  showToast('Welcome back, ' + user.fname + '!');
}

function handleRegister() {
  const fname = document.getElementById('r-fname').value.trim();
  const lname = document.getElementById('r-lname').value.trim();
  const email = document.getElementById('r-email').value.trim().toLowerCase();
  const pass  = document.getElementById('r-pass').value;
  const pass2 = document.getElementById('r-pass2').value;
  if (!fname || !lname || !email || !pass) { showToast('Please fill all fields'); return; }
  if (pass.length < 6)  { showToast('Password must be at least 6 characters'); return; }
  if (pass !== pass2)   { showToast('Passwords do not match'); return; }
  const users = getUsers();
  if (users.find(u => u.email === email)) { showToast('Email already registered'); return; }
  const newUser = { fname, lname, email, pass };
  users.push(newUser);
  saveUsers(users);
  saveSession(newUser);
  closeAuth();
  showToast('Account created! Welcome, ' + fname + '!');
}

function handleLogout() {
  const name = currentUser ? currentUser.fname : 'User';
  clearSession();
  cart = {};
  updateCart();
  showToast('Goodbye, ' + name + '!');
}

/* ============================================
   EMOJI PICKER
   ============================================ */
function initEmojiPicker() {
  const ep = document.getElementById('emojiPicker');
  ep.innerHTML = EMOJIS.map(e =>
    `<div class="emoji-opt${e === selectedEmoji ? ' selected' : ''}"
          onclick="selectEmoji('${e}')">${e}</div>`
  ).join('');
}

function selectEmoji(e) {
  selectedEmoji = e;
  document.querySelectorAll('.emoji-opt').forEach(el => {
    el.classList.toggle('selected', el.textContent === e);
  });
}

/* ============================================
   FILTERING & SEARCH
   ============================================ */
function filteredProducts() {
  return products.filter(p => {
    const matchCat =
      currentFilter === 'all'      ||
      p.cat === currentFilter      ||
      (currentFilter === 'sale'     && p.badge === 'sale')     ||
      (currentFilter === 'new'      && p.badge === 'new')      ||
      (currentFilter === 'featured' && p.badge === 'featured');

    const matchSearch =
      !currentSearch ||
      p.name.toLowerCase().includes(currentSearch) ||
      p.cat.toLowerCase().includes(currentSearch)  ||
      p.desc.toLowerCase().includes(currentSearch);

    return matchCat && matchSearch;
  });
}

function setFilter(f) {
  currentFilter = f;
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.filter-chip').forEach(el => el.classList.remove('active'));

  if (f === 'all') {
    document.querySelectorAll('.nav-link')[0].classList.add('active');
    document.querySelectorAll('.filter-chip')[0].classList.add('active');
  }
  renderProducts();
}

function handleSearch(v) {
  currentSearch = v.toLowerCase();
  renderProducts();
}

/* ============================================
   RENDER PRODUCTS
   ============================================ */
function renderProducts() {
  const grid = document.getElementById('productGrid');
  const fp   = filteredProducts();

  document.getElementById('productCount').textContent =
    `${fp.length} item${fp.length !== 1 ? 's' : ''}`;
  document.getElementById('totalProducts').textContent = products.length;

  if (!fp.length) {
    grid.innerHTML = `<div style="padding:4rem;text-align:center;color:var(--muted);
      font-size:0.75rem;letter-spacing:0.12em;grid-column:1/-1">NO PRODUCTS FOUND</div>`;
    return;
  }

  grid.innerHTML = fp.map(p => `
    <div class="product-card" onclick="openPreview(${p.id})">
      <div class="card-overlay"></div>
      <div class="card-img">
        ${p.badge ? `<span class="card-badge ${p.badge}">${p.badge.toUpperCase()}</span>` : ''}
        <span class="emoji">${p.emoji}</span>
      </div>
      <div class="card-body">
        <span class="card-cat">${p.cat}</span>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc.substring(0, 80)}…</div>
      </div>
      <div class="card-footer">
        <div>
          <div class="card-price">₱${p.price.toLocaleString()}</div>
          ${p.old ? `<div class="card-price-old">₱${p.old.toLocaleString()}</div>` : ''}
        </div>
        <button class="add-to-cart"
          onclick="event.stopPropagation(); addToCart(${p.id})">+ Cart</button>
      </div>
    </div>
  `).join('');
}

/* ============================================
   PRODUCT PREVIEW MODAL
   ============================================ */
function openPreview(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const specs = p.specs || [];

  document.getElementById('previewContent').innerHTML = `
    <div class="modal-img">
      <span style="position:relative;z-index:1;font-size:5rem">${p.emoji}</span>
    </div>
    <div class="modal-body">
      <div class="modal-cat">
        ${p.cat}
        ${p.badge
          ? ` · <span style="color:var(--accent2);text-transform:uppercase">${p.badge}</span>`
          : ''}
      </div>
      <div class="modal-name">${p.name}</div>
      <div class="modal-desc">${p.desc}</div>
      ${specs.length
        ? `<div class="modal-specs">
            ${specs.map(s =>
              `<div class="spec">
                <div class="spec-label">${s.l}</div>
                <div class="spec-val">${s.v}</div>
               </div>`
            ).join('')}
           </div>`
        : ''}
      <div class="modal-footer">
        <div>
          <div class="modal-price">₱${p.price.toLocaleString()}</div>
          ${p.old ? `<div class="card-price-old">Was ₱${p.old.toLocaleString()}</div>` : ''}
        </div>
        <div class="modal-actions">
          <button class="btn-close" onclick="closePreview()">Close</button>
          <button class="btn-primary"
            onclick="addToCart(${p.id}); closePreview()">Add to Cart</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('previewModal').classList.add('open');
}

function closePreview(e) {
  if (!e || e.target === document.getElementById('previewModal')) {
    document.getElementById('previewModal').classList.remove('open');
  }
}

/* ============================================
   ADD PRODUCT
   ============================================ */
function openAddProduct() {
  selectedEmoji = '💻';
  initEmojiPicker();

  ['f-name','f-price','f-old','f-desc','f-s1l','f-s1v','f-s2l','f-s2v'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('f-badge').value = '';
  document.getElementById('addModal').classList.add('open');
}

function closeAdd() {
  document.getElementById('addModal').classList.remove('open');
}

function closeAddModal(e) {
  if (e.target === document.getElementById('addModal')) closeAdd();
}

function submitProduct() {
  const name  = document.getElementById('f-name').value.trim();
  const price = parseFloat(document.getElementById('f-price').value);
  const desc  = document.getElementById('f-desc').value.trim();

  if (!name || !price || !desc) {
    showToast('Please fill required fields');
    return;
  }

  const old  = parseFloat(document.getElementById('f-old').value) || null;
  const s1l  = document.getElementById('f-s1l').value.trim();
  const s1v  = document.getElementById('f-s1v').value.trim();
  const s2l  = document.getElementById('f-s2l').value.trim();
  const s2v  = document.getElementById('f-s2v').value.trim();
  const specs = [];
  if (s1l && s1v) specs.push({ l: s1l, v: s1v });
  if (s2l && s2v) specs.push({ l: s2l, v: s2v });

  products.push({
    id:    nextId++,
    name,
    cat:   document.getElementById('f-cat').value,
    price,
    old,
    desc,
    badge: document.getElementById('f-badge').value,
    emoji: selectedEmoji,
    specs
  });

  closeAdd();
  renderProducts();
  showToast('Product added!');
}

/* ============================================
   CART
   ============================================ */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
  showToast('Added to cart');
}

function removeFromCart(id) {
  delete cart[id];
  updateCart();
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  updateCart();
}

function updateCart() {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById('cartCount').textContent = count;

  const items = document.getElementById('cartItems');
  const keys  = Object.keys(cart);

  if (!keys.length) {
    items.innerHTML = `<div class="cart-empty">— Your cart is empty —</div>`;
  } else {
    items.innerHTML = keys.map(id => {
      const p = products.find(x => x.id == id);
      if (!p) return '';
      return `
        <div class="cart-item">
          <span class="cart-item-emoji">${p.emoji}</span>
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">₱${(p.price * cart[id]).toLocaleString()}</div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
              <span class="qty-num">${cart[id]}</span>
              <button class="qty-btn" onclick="changeQty(${id}, 1)">+</button>
            </div>
          </div>
          <button class="cart-remove" onclick="removeFromCart(${id})">✕</button>
        </div>`;
    }).join('');
  }

  const total = keys.reduce((sum, id) => {
    const p = products.find(x => x.id == id);
    return sum + (p ? p.price * cart[id] : 0);
  }, 0);

  document.getElementById('cartTotal').textContent = `₱${total.toLocaleString()}`;
}

function toggleCart() {
  document.getElementById('cartPanel').classList.toggle('open');
}

/* ============================================
   CHECKOUT
   ============================================ */
function openCheckout() {
  const keys = Object.keys(cart);
  if (!keys.length) { showToast('Your cart is empty'); return; }

  const subtotal = keys.reduce((sum, id) => {
    const p = products.find(x => x.id == id);
    return sum + (p ? p.price * cart[id] : 0);
  }, 0);
  const shipping = 150;
  const tax      = Math.round(subtotal * 0.12);

  document.getElementById('cartPanel').classList.remove('open');

  document.getElementById('checkoutContent').innerHTML = `
    <div class="form-header">
      <span class="form-title">Checkout</span>
      <button class="cart-close"
        onclick="document.getElementById('checkoutModal').classList.remove('open')">✕</button>
    </div>
    <div class="checkout-step">
      <h3>Order Summary</h3>
      <div class="order-items">
        ${keys.map(id => {
          const p = products.find(x => x.id == id);
          return p
            ? `<div class="order-item">
                <span class="order-item-name">${p.emoji} ${p.name} ×${cart[id]}</span>
                <span class="order-item-price">₱${(p.price * cart[id]).toLocaleString()}</span>
               </div>`
            : '';
        }).join('')}
      </div>
      <div class="order-summary">
        <div class="order-row"><span>Subtotal</span><span>₱${subtotal.toLocaleString()}</span></div>
        <div class="order-row"><span>Shipping</span><span>₱${shipping.toLocaleString()}</span></div>
        <div class="order-row"><span>VAT (12%)</span><span>₱${tax.toLocaleString()}</span></div>
        <div class="order-row total">
          <span>Total</span>
          <span>₱${(subtotal + shipping + tax).toLocaleString()}</span>
        </div>
      </div>
      <h3>Shipping Details</h3>
      <div style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1rem">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input class="form-input" id="c-fn" placeholder="Juan">
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input class="form-input" id="c-ln" placeholder="Dela Cruz">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" id="c-em" type="email" placeholder="juan@email.com">
        </div>
        <div class="form-group">
          <label class="form-label">Address</label>
          <input class="form-input" id="c-addr" placeholder="Street, Barangay, City">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input class="form-input" id="c-ph" placeholder="+63 9XX XXX XXXX">
          </div>
          <div class="form-group">
            <label class="form-label">Payment</label>
            <select class="form-select" id="c-pay">
              <option>GCash</option>
              <option>Maya</option>
              <option>Bank Transfer</option>
              <option>Cash on Delivery</option>
              <option>Credit Card</option>
            </select>
          </div>
        </div>
      </div>
      <button class="btn-primary"
        style="width:100%;padding:0.9rem;font-size:0.9rem"
        onclick="placeOrder()">Place Order →</button>
    </div>
  `;

  document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckoutModal(e) {
  if (e.target === document.getElementById('checkoutModal')) {
    document.getElementById('checkoutModal').classList.remove('open');
  }
}

function placeOrder() {
  const fn   = document.getElementById('c-fn')?.value.trim();
  const em   = document.getElementById('c-em')?.value.trim();
  const addr = document.getElementById('c-addr')?.value.trim();

  if (!fn || !em || !addr) {
    showToast('Please fill all required fields');
    return;
  }

  const orderId = 'JD-' + Math.floor(Math.random() * 900000 + 100000);

  document.getElementById('checkoutContent').innerHTML = `
    <div class="success-state">
      <div class="success-icon">✅</div>
      <div class="success-title">Order Confirmed!</div>
      <p class="success-sub">
        Thank you, ${fn}!<br>
        Your order <strong style="color:var(--accent)">${orderId}</strong> has been placed.<br>
        You'll receive a confirmation at ${em}.<br>
        Expected delivery: 24–48 hours.
      </p>
      <button class="btn-primary" style="margin-top:2rem"
        onclick="
          document.getElementById('checkoutModal').classList.remove('open');
          cart = {};
          updateCart();
        ">Continue Shopping</button>
    </div>
  `;
}

/* ============================================
   TOAST NOTIFICATION
   ============================================ */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadAuth();
  renderProducts();
  updateCart();
});
