/* =====================================================
   TUTTY SUCOS - Application Logic
   ===================================================== */

// --- State ---
let cart = [];
let currentPage = 'home';
let currentProduct = null;

// --- Auth State ---
// Roles: null (visitor), 'pending' (registered but not approved), 'client' (approved), 'admin'
let currentUser = null; // { email, name, role, company }

function isLoggedIn() { return currentUser !== null && currentUser.role !== 'pending'; }
function isAdmin() { return currentUser && currentUser.role === 'admin'; }
function canSeePrices() { return currentUser && (currentUser.role === 'client' || currentUser.role === 'admin'); }

function loadAuth() {
  try {
    const saved = localStorage.getItem('tutty_current_user');
    if (saved) currentUser = JSON.parse(saved);
    // Ensure admin user always exists
    let users = JSON.parse(localStorage.getItem('tutty_users') || '[]');
    const adminEmail = 'admin@demo.local';
    const adminExists = users.some(u => u.email.toLowerCase() === adminEmail);
    if (!adminExists) {
      users = users.filter(u => u.role !== 'admin');
      users.unshift({ email: adminEmail, name: 'Administrador', role: 'admin', company: 'Tutty Sucos', password: 'REDACTED', cnpj: '00.000.000/0000-00' });
      localStorage.setItem('tutty_users', JSON.stringify(users));
    }
  } catch (e) {}
}

function saveAuth() {
  try {
    localStorage.setItem('tutty_current_user', JSON.stringify(currentUser));
  } catch (e) {}
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem('tutty_users') || '[]'); } catch (e) { return []; }
}

function saveUsers(users) {
  try { localStorage.setItem('tutty_users', JSON.stringify(users)); } catch (e) {}
}

function updateAuthUI() {
  // Show/hide elements based on auth state
  document.querySelectorAll('.auth-only').forEach(el => {
    el.style.display = canSeePrices() ? '' : 'none';
  });
  document.querySelectorAll('.visitor-only').forEach(el => {
    el.style.display = canSeePrices() ? 'none' : '';
  });
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin() ? '' : 'none';
  });
  // Update header user display
  const accountLink = document.querySelector('.nav-link-account');
  if (accountLink) {
    if (currentUser) {
      accountLink.querySelector('span:last-child').textContent = currentUser.name.split(' ')[0];
    } else {
      accountLink.querySelector('span:last-child').textContent = 'Entrar';
    }
  }
  // Update cart badge visibility
  const cartLink = document.getElementById('cartBtn');
  if (cartLink) {
    cartLink.style.display = canSeePrices() ? '' : 'none';
  }
  // Hide price-related nav items for visitors
  const offersLink = document.querySelector('.offers-link');
  if (offersLink) offersLink.style.display = canSeePrices() ? '' : 'none';
  const ordersLink = document.querySelector('.orders-link');
  if (ordersLink) ordersLink.style.display = canSeePrices() ? '' : 'none';
}

// --- Formatação de preço ---
function formatPrice(val) {
  return 'R$ ' + val.toFixed(2).replace('.', ',');
}

// --- Page Navigation ---
function showPage(pageId) {
  // Close cart sidebar if open
  document.getElementById('cartSidebar').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');

  // Access control: restrict certain pages
  const pricePagesOnly = ['checkout', 'orders', 'offers'];
  const adminPagesOnly = ['admin'];
  if (pricePagesOnly.includes(pageId) && !canSeePrices()) {
    showPage('login');
    return;
  }
  if (adminPagesOnly.includes(pageId) && !isAdmin()) {
    showPage('login');
    return;
  }

  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const page = document.getElementById('page-' + pageId);
  if (page) {
    page.style.display = 'block';
    currentPage = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (pageId === 'catalog') {
    renderCatalog();
  }
  if (pageId === 'offers') {
    renderOffers();
  }
  if (pageId === 'checkout') {
    renderCheckout();
  }
  if (pageId === 'admin') {
    initAdmin();
  }
  if (pageId === 'orders') {
    renderOrders();
  }
  if (pageId === 'account') {
    renderAccount();
  }
}

// --- Product Card Rendering ---
function createProductCard(product) {
  const badgesHTML = product.badges.map(b => {
    if (b === 'bestseller') return '<span class="badge badge-bestseller">Mais pedido</span>';
    if (b === 'new') return '<span class="badge badge-new">Lançamento</span>';
    if (b === 'lowcal') return '<span class="badge badge-lowcal">Baixa caloria</span>';
    if (b === 'economia') return '<span class="badge badge-economia">Economia</span>';
    return '';
  }).join('');

  const lineLabel = LINE_NAMES[product.line] || product.line;
  const packLabel = product.packaging === 'unitario' ? 'Unitário' : `Fardo c/ ${product.unitsPerPack} un.`;
  const savingsPercent = product.maxSavings;
  const showPrices = canSeePrices();

  const isPending = currentUser && currentUser.role === 'pending';
  const pricingHTML = showPrices ? `
        <div class="product-pricing">
          <div>
            <div class="product-price">${formatPrice(product.priceTiers.E)}</div>
            <div class="product-price-unit">un. (Tabela E)</div>
          </div>
          <div class="product-price-best">
            <span class="price-from">a partir de</span>
            <span class="price-best-value">${formatPrice(product.priceTiers.A)}</span>
          </div>
        </div>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCart(${product.id})">
            <span class="material-icons-outlined" style="font-size:16px">add_shopping_cart</span> Adicionar
          </button>
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); showProduct(${product.id})">Detalhes</button>
        </div>` : isPending ? `
        <div class="product-login-prompt product-pending-prompt">
          <span class="material-icons-outlined">hourglass_top</span>
          <span>Cadastro aguardando aprovação</span>
        </div>
        <div class="product-actions">
          <button class="btn btn-outline btn-sm btn-block" onclick="event.stopPropagation(); showProduct(${product.id})">
            <span class="material-icons-outlined" style="font-size:16px">visibility</span> Ver detalhes
          </button>
        </div>` : `
        <div class="product-login-prompt">
          <span class="material-icons-outlined">lock</span>
          <span>Faça login para ver preços</span>
        </div>
        <div class="product-actions">
          <button class="btn btn-outline btn-sm btn-block" onclick="event.stopPropagation(); showPage('login')">
            <span class="material-icons-outlined" style="font-size:16px">login</span> Entrar para ver preços
          </button>
        </div>`;

  const flavorColor = FLAVOR_COLORS[product.flavor] || { primary: '#FF9800', secondary: '#F57C00', accent: '#FFB74D' };
  const flavorEmoji = {
    'laranja': '🍊', 'uva': '🍇', 'goiaba': '🍑', 'maracuja': '🥭',
    'abacaxi': '🍍', 'abacaxi-hortela': '🍍', 'caju': '🥜', 'limao': '🍋',
    'manga': '🥭', 'laranja-acerola': '🍒', 'pessego': '🍑'
  };
  const emoji = flavorEmoji[product.flavor] || '🍊';
  const imageHTML = product.image
    ? `<img src="${product.image}" alt="${product.name} ${product.volume}" class="product-card-img fruit-interactive" loading="lazy">`
    : `<div class="fruit-emoji-fallback">${emoji}</div>`;

  return `
    <div class="product-card" onclick="showProduct(${product.id})" data-aos="fade-up">
      <div class="product-image fruit-card-bg" style="background: radial-gradient(ellipse at 50% 80%, ${flavorColor.primary}40 0%, ${flavorColor.accent}20 40%, transparent 70%), linear-gradient(180deg, ${flavorColor.primary}08 0%, ${flavorColor.accent}18 50%, ${flavorColor.secondary}12 100%)">
        <div class="fruit-shine"></div>
        ${imageHTML}
        <div class="fruit-shadow" style="background: radial-gradient(ellipse, ${flavorColor.primary}30 0%, transparent 70%)"></div>
        <div class="product-badges">${badgesHTML}</div>
        ${showPrices && savingsPercent > 0 ? `<div class="product-savings-badge">Até ${savingsPercent}% OFF</div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-line">${lineLabel}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-volume">${product.volume} — ${packLabel}</div>
        ${pricingHTML}
      </div>
    </div>
  `;
}

// --- Best Sellers ---
function renderBestSellers() {
  const bestSellers = PRODUCTS.filter(p => p.badges.includes('bestseller')).slice(0, 4);
  const grid = document.getElementById('bestSellersGrid');
  if (grid) {
    grid.innerHTML = bestSellers.map(createProductCard).join('');
  }
}

// --- Catalog ---
function renderCatalog(filter) {
  let products = [...PRODUCTS];

  // Apply checkbox filters
  const filterGroups = document.querySelectorAll('.filters-sidebar .filter-group');
  const checkedLines = getCheckedFromGroup(filterGroups[0]);
  const checkedFlavors = getCheckedFromGroup(filterGroups[1]);
  const checkedVolumes = getCheckedFromGroup(filterGroups[2]);
  const checkedOperations = getCheckedFromGroup(filterGroups[3]);

  if (checkedLines.length > 0) {
    products = products.filter(p => checkedLines.includes(p.line));
  }
  if (checkedFlavors.length > 0) {
    products = products.filter(p => checkedFlavors.includes(p.flavor));
  }
  if (checkedVolumes.length > 0) {
    products = products.filter(p => checkedVolumes.includes(p.volume));
  }
  if (checkedOperations.length > 0) {
    products = products.filter(p => p.operations.some(op => checkedOperations.includes(op)));
  }

  // Sorting
  const sort = document.getElementById('sortSelect');
  if (sort) {
    switch (sort.value) {
      case 'price-asc':
        products.sort((a, b) => a.priceTiers.E - b.priceTiers.E);
        break;
      case 'price-desc':
        products.sort((a, b) => b.priceTiers.E - a.priceTiers.E);
        break;
      case 'bestseller':
        products.sort((a, b) => (b.badges.includes('bestseller') ? 1 : 0) - (a.badges.includes('bestseller') ? 1 : 0));
        break;
      case 'newest':
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'savings':
        products.sort((a, b) => b.maxSavings - a.maxSavings);
        break;
    }
  }

  const grid = document.getElementById('catalogGrid');
  if (grid) {
    grid.innerHTML = products.map(createProductCard).join('');
  }

  const count = document.getElementById('resultsCount');
  if (count) {
    count.textContent = products.length + ' produto' + (products.length !== 1 ? 's' : '') + ' encontrado' + (products.length !== 1 ? 's' : '');
  }
}

function getCheckedValues(selector) {
  return Array.from(document.querySelectorAll(selector))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
}

function getCheckedFromGroup(group) {
  if (!group) return [];
  return Array.from(group.querySelectorAll('input[type="checkbox"]'))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
}

function applyFilters() {
  renderCatalog();
}

function clearFilters() {
  document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
  const sort = document.getElementById('sortSelect');
  if (sort) sort.value = 'relevance';
  renderCatalog();
}

function filterCatalog(line) {
  showPage('catalog');
  setTimeout(() => {
    clearFilters();
    const filterGroups = document.querySelectorAll('.filters-sidebar .filter-group');
    const checkboxes = filterGroups[0] ? filterGroups[0].querySelectorAll('input[type="checkbox"]') : [];
    checkboxes.forEach(cb => {
      if (cb.value === line) cb.checked = true;
    });
    renderCatalog();
  }, 100);
}

function toggleFilters() {
  const sidebar = document.getElementById('filtersSidebar');
  sidebar.classList.toggle('active');
}

// --- Product Detail ---
function showProduct(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  currentProduct = product;

  const lineLabel = LINE_NAMES[product.line] || product.line;
  const packLabel = product.packaging === 'unitario' ? 'Unitário' : `Fardo com ${product.unitsPerPack} unidades`;

  document.getElementById('productBreadcrumb').textContent = product.name;
  const showPrices = canSeePrices();

  // Build volume tiers table
  const tiers = PRICING_RULES.volumeTiers[product.volume] || {};
  const tierUnit = product.packaging === 'unitario' ? 'unidades' : 'fardos';
  const tierTableRows = ['E', 'D', 'C', 'B', 'A'].map(tier => {
    const minQty = tiers[tier] || '-';
    const price = product.priceTiers[tier];
    const savings = tier !== 'E' ? Math.round((1 - price / product.priceTiers.E) * 100) : 0;
    const tierLabel = PRICING_RULES.tierLabels[tier];
    const highlight = tier === 'A' ? ' class="tier-row-best"' : '';
    return `
      <tr${highlight}>
        <td><span class="tier-label tier-${tier.toLowerCase()}">${tier}</span></td>
        <td>${tierLabel}</td>
        <td>${minQty}+ ${tierUnit}</td>
        <td><strong>${formatPrice(price)}</strong></td>
        <td>${savings > 0 ? `<span class="tier-savings">-${savings}%</span>` : '<span class="tier-base">Base</span>'}</td>
      </tr>
    `;
  }).join('');

  const detailFlavorColor = FLAVOR_COLORS[product.flavor] || { primary: '#FF9800', secondary: '#F57C00', accent: '#FFB74D' };
  const detailImageHTML = product.image
    ? `<img src="${product.image}" alt="${product.name} ${product.volume}" class="pd-image-real fruit-detail-interactive">`
    : `<span class="material-icons-outlined">local_drink</span>`;
  const content = document.getElementById('productDetailContent');
  content.innerHTML = `
    <div class="product-detail-image">
      <div class="pd-image-main fruit-detail-bg" style="background: radial-gradient(ellipse at 50% 70%, ${detailFlavorColor.primary}30 0%, ${detailFlavorColor.accent}15 40%, transparent 70%), linear-gradient(180deg, ${detailFlavorColor.primary}10 0%, ${detailFlavorColor.accent}20 50%, ${detailFlavorColor.secondary}10 100%)">
        <div class="fruit-detail-shine"></div>
        ${detailImageHTML}
        <div class="fruit-detail-shadow" style="background: radial-gradient(ellipse, ${detailFlavorColor.primary}35 0%, transparent 65%)"></div>
      </div>
    </div>
    <div class="product-detail-info">
      <div class="pd-line">${lineLabel}</div>
      <h1 class="pd-title">${product.name} — ${product.volume}</h1>
      <p class="pd-pack-info">${packLabel}</p>

      ${showPrices ? `
      <div class="pd-price-block">
        <div class="pd-price-range">
          <div class="pd-price-main">${formatPrice(product.priceTiers.E)} <span class="pd-price-unit">/ un.</span></div>
          <div class="pd-price-best-wrapper">
            <span class="material-icons-outlined">trending_down</span>
            A partir de <strong>${formatPrice(product.priceTiers.A)}</strong> / un. na Tabela A
            <span class="pd-savings-tag">Economia de ${product.maxSavings}%</span>
          </div>
        </div>
      </div>

      <div class="pd-tier-table-wrapper">
        <h3 class="pd-section-title">
          <span class="material-icons-outlined">price_change</span>
          Tabela de Preços por Volume
        </h3>
        <p class="pd-tier-desc">Quanto mais você compra, menor o preço unitário. A tabela é definida pelo volume total do pedido.</p>
        <table class="pd-tier-table">
          <thead>
            <tr>
              <th>Tabela</th>
              <th>Categoria</th>
              <th>Mín. por Pedido</th>
              <th>Preço Unit.</th>
              <th>Economia</th>
            </tr>
          </thead>
          <tbody>
            ${tierTableRows}
          </tbody>
        </table>
        <div class="pd-min-order">
          <span class="material-icons-outlined">info</span>
          Pedido mínimo: ${formatPrice(PRICING_RULES.minOrderValue)}
        </div>
      </div>

      <div class="pd-qty-block">
        <label>Quantidade (${product.packaging === 'unitario' ? 'unidades' : 'fardos'}):</label>
        <div class="qty-controls">
          <button onclick="changeQty(-1)">−</button>
          <input type="number" id="pdQty" value="1" min="1" oninput="updateDetailPrice()">
          <button onclick="changeQty(1)">+</button>
        </div>
        <div class="qty-shortcuts">
          <button onclick="setQty(5)">+5</button>
          <button onclick="setQty(10)">+10</button>
          <button onclick="setQty(20)">+20</button>
        </div>
        <div class="pd-qty-tier-info" id="pdQtyTierInfo"></div>
      </div>

      <div class="pd-actions">
        <button class="btn btn-primary btn-lg" onclick="addToCartFromDetail()">
          <span class="material-icons-outlined">add_shopping_cart</span> Adicionar ao Carrinho
        </button>
      </div>
      ` : currentUser && currentUser.role === 'pending' ? `
      <div class="pd-login-required pd-pending-notice">
        <div class="pd-login-icon">
          <span class="material-icons-outlined">hourglass_top</span>
        </div>
        <h3>Cadastro aguardando aprovação</h3>
        <p>Seu cadastro está sendo analisado pela nossa equipe. Assim que aprovado, você terá acesso às tabelas de preços, condições comerciais e poderá realizar pedidos.</p>
        <div class="pd-pending-status">
          <span class="material-icons-outlined">schedule</span> Status: Aguardando aprovação do administrador
        </div>
      </div>
      ` : `
      <div class="pd-login-required">
        <div class="pd-login-icon">
          <span class="material-icons-outlined">lock</span>
        </div>
        <h3>Preços exclusivos para clientes cadastrados</h3>
        <p>Faça login ou solicite seu cadastro para acessar tabelas de preços, condições comerciais e realizar pedidos.</p>
        <div class="pd-login-actions">
          <button class="btn btn-primary" onclick="showPage('login')">
            <span class="material-icons-outlined">login</span> Fazer Login
          </button>
          <button class="btn btn-outline" onclick="showPage('register')">
            <span class="material-icons-outlined">person_add</span> Solicitar Cadastro
          </button>
        </div>
      </div>
      `}

      <!-- Yield Info -->
      <div class="yield-grid">
        <div class="yield-card">
          <div class="yield-number">${product.yield.cups200ml}</div>
          <div class="yield-label">copos de 200ml</div>
        </div>
        <div class="yield-card">
          <div class="yield-number">${product.yield.cups300ml}</div>
          <div class="yield-label">copos de 300ml</div>
        </div>
        <div class="yield-card">
          <div class="yield-number">${product.yield.prepTime}</div>
          <div class="yield-label">preparo</div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="pd-tabs">
        <div class="pd-tabs-nav">
          <button class="pd-tab-btn active" onclick="switchTab(this, 'tab-desc')">Descrição</button>
          <button class="pd-tab-btn" onclick="switchTab(this, 'tab-specs')">Informações Técnicas</button>
          <button class="pd-tab-btn" onclick="switchTab(this, 'tab-food')">Food Service</button>
          <button class="pd-tab-btn" onclick="switchTab(this, 'tab-docs')">Documentos</button>
        </div>

        <div class="pd-tab-content active" id="tab-desc">
          <h4>Descrição Profissional</h4>
          <p>${product.description}</p>
        </div>

        <div class="pd-tab-content" id="tab-specs">
          <h4>Informações Técnicas</h4>
          <table class="specs-table">
            <tr><td>Modo de Preparo</td><td>${product.specs.modo_preparo}</td></tr>
            <tr><td>Rendimento</td><td>${product.specs.rendimento}</td></tr>
            <tr><td>Armazenamento</td><td>${product.specs.armazenamento}</td></tr>
            <tr><td>Validade</td><td>${product.specs.validade}</td></tr>
          </table>
        </div>

        <div class="pd-tab-content" id="tab-food">
          <h4>Especificações para Food Service</h4>
          <p>Cada ${product.packaging === 'unitario' ? 'unidade' : 'fardo'} deste produto rende aproximadamente <strong>${product.yield.cups200ml} copos de 200ml</strong> ou <strong>${product.yield.cups300ml} copos de 300ml</strong>.</p>
          <p><strong>Tempo de preparo:</strong> ${product.yield.prepTime === 'Pronto' ? 'Produto pronto para servir, sem necessidade de preparo.' : 'Aproximadamente ' + product.yield.prepTime + ' para preparo.'}</p>
          <p><strong>Recomendações de uso:</strong></p>
          <ul style="padding-left:20px;color:var(--text-light);font-size:14px;line-height:1.8">
            ${product.operations.includes('hotel') ? '<li>Café da manhã de hotel: ideal para buffet com refresqueira</li>' : ''}
            ${product.operations.includes('selfservice') ? '<li>Self-service: prático para reposição contínua no buffet</li>' : ''}
            ${product.operations.includes('escola') ? '<li>Escolas: porções controladas para lanche escolar</li>' : ''}
            ${product.operations.includes('eventos') ? '<li>Eventos: alto volume com padronização de sabor</li>' : ''}
            ${product.operations.includes('industrial') ? '<li>Cozinhas industriais: rendimento otimizado para grandes volumes</li>' : ''}
          </ul>
        </div>

        <div class="pd-tab-content" id="tab-docs">
          <h4>Documentos para Download</h4>
          <div class="doc-links">
            <a href="#" class="doc-link" onclick="event.preventDefault()">
              <span class="material-icons-outlined">picture_as_pdf</span>
              Ficha Técnica — ${product.name}
            </a>
            <a href="#" class="doc-link" onclick="event.preventDefault()">
              <span class="material-icons-outlined">restaurant_menu</span>
              Tabela Nutricional
            </a>
            <a href="#" class="doc-link" onclick="event.preventDefault()">
              <span class="material-icons-outlined">verified</span>
              Laudos de Qualidade
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  updateDetailPrice();
  showPage('product');
}

function updateDetailPrice() {
  if (!currentProduct) return;
  const qty = parseInt(document.getElementById('pdQty')?.value) || 1;
  const tier = getPriceTier(currentProduct.volume, qty);
  const price = currentProduct.priceTiers[tier];
  const total = price * qty * currentProduct.unitsPerPack;
  const tierLabel = PRICING_RULES.tierLabels[tier];
  const tiers = PRICING_RULES.volumeTiers[currentProduct.volume] || {};
  const tierUnit = currentProduct.packaging === 'unitario' ? 'un.' : 'fardos';

  let nextTierMsg = '';
  const tierOrder = ['E', 'D', 'C', 'B', 'A'];
  const currentTierIdx = tierOrder.indexOf(tier);
  if (currentTierIdx < tierOrder.length - 1) {
    const nextTier = tierOrder[currentTierIdx + 1];
    const nextMin = tiers[nextTier];
    const diff = nextMin - qty;
    if (diff > 0) {
      nextTierMsg = `<span class="tier-upgrade-hint">Faltam <strong>${diff} ${tierUnit}</strong> para a Tabela ${nextTier} (${formatPrice(currentProduct.priceTiers[nextTier])}/un.)</span>`;
    }
  }

  const infoEl = document.getElementById('pdQtyTierInfo');
  if (infoEl) {
    infoEl.innerHTML = `
      <div class="qty-tier-current">
        <span class="tier-label tier-${tier.toLowerCase()}">${tier}</span>
        <span>${tierLabel} — ${formatPrice(price)}/un.</span>
        <span class="qty-tier-total">Subtotal: <strong>${formatPrice(total)}</strong></span>
      </div>
      ${nextTierMsg}
    `;
  }
}

function switchTab(btn, tabId) {
  document.querySelectorAll('.pd-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.pd-tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

function changeQty(delta) {
  const input = document.getElementById('pdQty');
  let val = parseInt(input.value) || 1;
  val = Math.max(1, val + delta);
  input.value = val;
  updateDetailPrice();
}

function setQty(val) {
  const input = document.getElementById('pdQty');
  let current = parseInt(input.value) || 0;
  input.value = current + val;
  updateDetailPrice();
}

// --- Cart ---
function addToCart(productId, qty) {
  qty = qty || 1;
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }

  updateCartUI();
  showCartNotification(product.name);
}

function addToCartFromDetail() {
  if (!currentProduct) return;
  const qty = parseInt(document.getElementById('pdQty').value) || 1;
  addToCart(currentProduct.id, qty);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    updateCartUI();
  }
}

function getCartItemPrice(product, qty) {
  // Determine tier based on quantity
  const tier = getPriceTier(product.volume, qty);
  return {
    tier: tier,
    unitPrice: product.priceTiers[tier],
    totalUnits: qty * product.unitsPerPack,
    subtotal: product.priceTiers[tier] * qty * product.unitsPerPack
  };
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalItems;

  const cartItemsDiv = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `
      <div class="cart-empty">
        <span class="material-icons-outlined">remove_shopping_cart</span>
        <p>Seu carrinho está vazio</p>
        <a href="#" onclick="showPage('catalog'); toggleCart()">Ver catálogo</a>
      </div>
    `;
    cartFooter.style.display = 'none';
    return;
  }

  cartFooter.style.display = 'block';
  let total = 0;

  cartItemsDiv.innerHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return '';
    const pricing = getCartItemPrice(product, item.qty);
    total += pricing.subtotal;
    const qtyLabel = product.packaging === 'unitario' ? 'un.' : 'fardos';

    return `
      <div class="cart-item">
        <div class="cart-item-color" style="background: ${product.gradient}">
          <span class="material-icons-outlined">local_drink</span>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-detail">${product.volume} — ${LINE_NAMES[product.line]} — <span class="tier-label tier-${pricing.tier.toLowerCase()}">${pricing.tier}</span></div>
          <div class="cart-item-price">${formatPrice(pricing.subtotal)}</div>
          <div class="cart-item-unit-price">${formatPrice(pricing.unitPrice)}/un.</div>
          <div class="cart-item-qty">
            <button onclick="updateCartQty(${product.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateCartQty(${product.id}, 1)">+</button>
            <span style="font-size:12px;color:var(--text-light)">${qtyLabel}</span>
            <button class="cart-item-remove" onclick="removeFromCart(${product.id})">Remover</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Check minimum order
  const minOrderHTML = total < PRICING_RULES.minOrderValue
    ? `<div class="cart-min-order-warning">
        <span class="material-icons-outlined">warning</span>
        Pedido mínimo: ${formatPrice(PRICING_RULES.minOrderValue)}. Faltam ${formatPrice(PRICING_RULES.minOrderValue - total)}.
      </div>`
    : '';

  document.getElementById('cartTotal').textContent = formatPrice(total);

  // Add min order warning after total
  const existingWarning = document.querySelector('.cart-min-order-warning');
  if (existingWarning) existingWarning.remove();
  if (minOrderHTML) {
    cartFooter.insertAdjacentHTML('afterbegin', minOrderHTML);
  }
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

function showCartNotification(productName) {
  const badge = document.getElementById('cartBadge');
  badge.style.transform = 'scale(1.4)';
  setTimeout(() => { badge.style.transform = 'scale(1)'; }, 300);
}

// --- Checkout ---
function renderCheckout() {
  const items = document.getElementById('checkoutItems');
  const subtotalEl = document.getElementById('checkoutSubtotal');
  const totalEl = document.getElementById('checkoutTotal');

  let total = 0;

  if (items) {
    items.innerHTML = cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return '';
      const pricing = getCartItemPrice(product, item.qty);
      total += pricing.subtotal;
      const qtyLabel = product.packaging === 'unitario' ? 'un.' : 'fardos';

      return `
        <div class="summary-item">
          <span>${product.name} ${product.volume} (${item.qty}x ${qtyLabel}) — Tab. ${pricing.tier}</span>
          <span>${formatPrice(pricing.subtotal)}</span>
        </div>
      `;
    }).join('');
  }

  if (subtotalEl) subtotalEl.textContent = formatPrice(total);
  if (totalEl) totalEl.textContent = formatPrice(total);
}

function placeOrder() {
  if (cart.length === 0) return;

  // Check minimum order
  let total = 0;
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (product) {
      const pricing = getCartItemPrice(product, item.qty);
      total += pricing.subtotal;
    }
  });

  if (total < PRICING_RULES.minOrderValue) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <span class="material-icons-outlined" style="color: var(--orange)">warning</span>
        <h2>Pedido Mínimo Não Atingido</h2>
        <p>O valor mínimo do pedido é <strong>${formatPrice(PRICING_RULES.minOrderValue)}</strong>. Seu pedido atual é de <strong>${formatPrice(total)}</strong>. Adicione mais produtos para prosseguir.</p>
        <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove();">Continuar Comprando</button>
      </div>
    `;
    document.body.appendChild(modal);
    return;
  }

  const orderNumber = 'TT-' + Date.now().toString().slice(-6);

  // Build items description
  const itensDesc = cart.map(function(item) {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return '';
    const pricing = getCartItemPrice(product, item.qty);
    const qtyLabel = product.packaging === 'unitario' ? 'un.' : 'fardos';
    return product.name + ' ' + product.volume + ' — ' + item.qty + 'x ' + qtyLabel + ' — Tab. ' + pricing.tier + ' — ' + formatPrice(pricing.subtotal);
  }).join('\n');

  // Get payment method
  const paymentRadio = document.querySelector('input[name="payment"]:checked');
  const paymentMethod = paymentRadio ? paymentRadio.value : 'boleto';

  const users = getUsers();
  const fullUser = users.find(u => u.email === (currentUser ? currentUser.email : '')) || {};

  // Disable button during submission
  const btn = document.querySelector('.btn-lg[onclick="placeOrder()"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Enviando pedido...'; }

  const body = new URLSearchParams({
    'form-name': 'pedido-tutty',
    'pedido-numero': orderNumber,
    'cliente-nome': currentUser ? currentUser.name : '',
    'cliente-email': currentUser ? currentUser.email : '',
    'cliente-empresa': currentUser ? currentUser.company : '',
    'cliente-cnpj': fullUser.cnpj || '',
    'itens': itensDesc,
    'valor-total': formatPrice(total),
    'forma-pagamento': paymentMethod,
    'data': new Date().toLocaleDateString('pt-BR')
  });

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  })
  .then(function(res) {
    if (btn) { btn.disabled = false; btn.textContent = 'Confirmar Pedido'; }
    if (res.ok) {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal">
          <span class="material-icons-outlined" style="color: var(--green)">check_circle</span>
          <h2>Pedido Enviado!</h2>
          <p>Seu pedido <strong>#${orderNumber}</strong> no valor de <strong>${formatPrice(total)}</strong> foi recebido com sucesso. Você receberá uma confirmação por e-mail.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove(); cart = []; updateCartUI(); showPage('orders');">Ver Meus Pedidos</button>
            <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove(); cart = []; updateCartUI(); showPage('home');">Voltar à Loja</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      showDemoModal('Erro no Pedido', 'Não foi possível enviar o pedido. Tente novamente ou entre em contato pelo WhatsApp: <a href="https://wa.me/5518981544334" target="_blank">(18) 98154-4334</a> ou e-mail: comercial@tuttysucos.com.br');
    }
  })
  .catch(function() {
    if (btn) { btn.disabled = false; btn.textContent = 'Confirmar Pedido'; }
    showDemoModal('Erro de Conexão', 'Verifique sua internet e tente novamente. Ou entre em contato pelo WhatsApp: <a href="https://wa.me/5518981544334" target="_blank">(18) 98154-4334</a>');
  });
}

// --- Orders ---
function renderOrders() {
  const container = document.getElementById('ordersContent');
  if (!container) return;
  if (isLoggedIn()) {
    container.innerHTML = `
      <div class="orders-empty">
        <span class="material-icons-outlined" style="font-size:64px;color:#ccc">receipt_long</span>
        <h3>Nenhum pedido realizado</h3>
        <p>Você ainda não fez nenhum pedido. Explore nosso catálogo e faça seu primeiro pedido!</p>
        <button class="btn btn-primary" onclick="showPage('catalog')">
          <span class="material-icons-outlined">shopping_bag</span> Ir para o Catálogo
        </button>
      </div>`;
  } else {
    container.innerHTML = `
      <div class="login-prompt">
        <span class="material-icons-outlined">lock</span>
        <h3>Faça login para ver seus pedidos</h3>
        <p>Acesse sua conta para visualizar o histórico de pedidos, repetir compras e acompanhar entregas.</p>
        <button class="btn btn-primary" onclick="showPage('login')">Fazer Login</button>
        <p class="mt-1">Não tem conta? <a href="#" onclick="showPage('register')">Cadastre sua empresa</a></p>
      </div>`;
  }
}

// --- Account ---
let currentAccountTab = 'painel';

function switchAccountTab(tab, linkEl) {
  currentAccountTab = tab;
  // Update active link
  document.querySelectorAll('.account-nav a').forEach(a => a.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');
  renderAccountContent();
}

function renderAccount() {
  const container = document.querySelector('.account-content');
  if (!container) return;
  if (isLoggedIn()) {
    currentAccountTab = 'painel';
    // Reset active nav
    document.querySelectorAll('.account-nav a').forEach((a, i) => {
      a.classList.toggle('active', i === 0);
    });
    renderAccountContent();
  } else {
    container.innerHTML = `
      <div class="login-prompt">
        <span class="material-icons-outlined">lock</span>
        <h3>Faça login para acessar sua conta</h3>
        <p>Gerencie pedidos, listas de compra, endereços e equipamentos em um só lugar.</p>
        <button class="btn btn-primary" onclick="showPage('login')">Fazer Login</button>
        <p class="mt-1">Não tem conta? <a href="#" onclick="showPage('register')">Cadastre sua empresa</a></p>
      </div>`;
  }
}

function renderAccountContent() {
  const container = document.querySelector('.account-content');
  if (!container || !isLoggedIn()) return;

  const userData = JSON.parse(localStorage.getItem('tutty_users') || '[]');
  const user = userData.find(u => u.email === currentUser.email) || currentUser;
  const savedAddresses = JSON.parse(localStorage.getItem('tutty_addresses_' + currentUser.email) || '[]');
  const savedLists = JSON.parse(localStorage.getItem('tutty_lists_' + currentUser.email) || '[]');
  const savedRecurring = JSON.parse(localStorage.getItem('tutty_recurring_' + currentUser.email) || '[]');
  const savedEquipments = JSON.parse(localStorage.getItem('tutty_equipments_' + currentUser.email) || '[]');

  const tabs = {
    painel: `
      <div class="account-panel">
        <div class="account-welcome">
          <h2>Olá, ${currentUser.name}!</h2>
          <p>Bem-vindo à sua área de cliente. Gerencie seus pedidos, endereços e dados da empresa.</p>
        </div>
        <div class="account-info-grid">
          <div class="account-info-card">
            <span class="material-icons-outlined" style="font-size:36px;color:#1B5E20">business</span>
            <h4>Empresa</h4>
            <p>${currentUser.company || '—'}</p>
          </div>
          <div class="account-info-card">
            <span class="material-icons-outlined" style="font-size:36px;color:#E65100">email</span>
            <h4>E-mail</h4>
            <p>${currentUser.email}</p>
          </div>
          <div class="account-info-card">
            <span class="material-icons-outlined" style="font-size:36px;color:#2E7D32">verified_user</span>
            <h4>Status</h4>
            <p><span class="badge badge-approved">${currentUser.role === 'admin' ? 'Administrador' : 'Cliente Aprovado'}</span></p>
          </div>
          <div class="account-info-card">
            <span class="material-icons-outlined" style="font-size:36px;color:#F57C00">shopping_cart</span>
            <h4>Pedidos</h4>
            <p>0 pedidos realizados</p>
          </div>
        </div>
        <div class="account-quick-actions">
          <h3>Acesso Rápido</h3>
          <div class="quick-actions-grid">
            <button class="quick-action-btn" onclick="showPage('catalog')">
              <span class="material-icons-outlined">shopping_bag</span>
              <span>Fazer Pedido</span>
            </button>
            <button class="quick-action-btn" onclick="switchAccountTab('listas', document.querySelectorAll('.account-nav a')[2])">
              <span class="material-icons-outlined">list_alt</span>
              <span>Minhas Listas</span>
            </button>
            <button class="quick-action-btn" onclick="switchAccountTab('enderecos', document.querySelectorAll('.account-nav a')[4])">
              <span class="material-icons-outlined">location_on</span>
              <span>Endereços</span>
            </button>
            <button class="quick-action-btn" onclick="switchAccountTab('empresa', document.querySelectorAll('.account-nav a')[6])">
              <span class="material-icons-outlined">settings</span>
              <span>Dados da Empresa</span>
            </button>
          </div>
        </div>
      </div>`,

    pedidos: `
      <div class="account-tab-content">
        <div class="tab-header">
          <h2><span class="material-icons-outlined">receipt_long</span> Meus Pedidos</h2>
        </div>
        <div class="empty-state">
          <span class="material-icons-outlined">inventory_2</span>
          <h3>Nenhum pedido realizado</h3>
          <p>Você ainda não fez nenhum pedido. Explore nosso catálogo e faça seu primeiro pedido!</p>
          <button class="btn btn-primary" onclick="showPage('catalog')">
            <span class="material-icons-outlined">shopping_bag</span> Ir para o Catálogo
          </button>
        </div>
      </div>`,

    listas: `
      <div class="account-tab-content">
        <div class="tab-header">
          <h2><span class="material-icons-outlined">list_alt</span> Listas de Compra</h2>
          <button class="btn btn-primary btn-sm" onclick="createNewList()">
            <span class="material-icons-outlined">add</span> Nova Lista
          </button>
        </div>
        <p class="tab-description">Crie listas personalizadas para agilizar suas compras recorrentes.</p>
        ${savedLists.length > 0 ? `
          <div class="lists-grid">
            ${savedLists.map((list, i) => `
              <div class="list-card">
                <div class="list-card-header">
                  <h4>${list.name}</h4>
                  <span class="list-count">${list.items.length} itens</span>
                </div>
                <p class="list-date">Criada em ${list.date}</p>
                <div class="list-actions">
                  <button class="btn btn-primary btn-sm" onclick="addListToCart(${i})">
                    <span class="material-icons-outlined">add_shopping_cart</span> Adicionar ao Carrinho
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="deleteList(${i})">
                    <span class="material-icons-outlined">delete</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <span class="material-icons-outlined">playlist_add</span>
            <h3>Nenhuma lista criada</h3>
            <p>Crie uma lista de compras para facilitar pedidos recorrentes. Adicione seus produtos favoritos e recompre com um clique.</p>
            <button class="btn btn-primary" onclick="createNewList()">
              <span class="material-icons-outlined">add</span> Criar Primeira Lista
            </button>
          </div>
        `}
      </div>`,

    recorrentes: `
      <div class="account-tab-content">
        <div class="tab-header">
          <h2><span class="material-icons-outlined">autorenew</span> Pedidos Recorrentes</h2>
        </div>
        <p class="tab-description">Configure pedidos automáticos para nunca ficar sem estoque.</p>
        ${savedRecurring.length > 0 ? `
          <div class="recurring-list">
            ${savedRecurring.map((rec, i) => `
              <div class="recurring-card">
                <div class="recurring-info">
                  <h4>${rec.name}</h4>
                  <p>Frequência: ${rec.frequency} · Próximo: ${rec.nextDate}</p>
                  <p class="recurring-total">Total estimado: ${formatPrice(rec.total)}</p>
                </div>
                <div class="recurring-status">
                  <span class="badge ${rec.active ? 'badge-approved' : 'badge-pending'}">${rec.active ? 'Ativo' : 'Pausado'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <span class="material-icons-outlined">event_repeat</span>
            <h3>Nenhum pedido recorrente</h3>
            <p>Automatize seus pedidos! Configure a frequência (semanal, quinzenal, mensal) e os produtos serão entregues automaticamente.</p>
            <div class="recurring-how-it-works">
              <h4>Como funciona:</h4>
              <div class="how-steps">
                <div class="how-step">
                  <span class="step-icon">1</span>
                  <p>Faça um pedido no catálogo</p>
                </div>
                <div class="how-step">
                  <span class="step-icon">2</span>
                  <p>No checkout, marque "Tornar recorrente"</p>
                </div>
                <div class="how-step">
                  <span class="step-icon">3</span>
                  <p>Escolha a frequência desejada</p>
                </div>
                <div class="how-step">
                  <span class="step-icon">4</span>
                  <p>Receba automaticamente!</p>
                </div>
              </div>
            </div>
          </div>
        `}
      </div>`,

    enderecos: `
      <div class="account-tab-content">
        <div class="tab-header">
          <h2><span class="material-icons-outlined">location_on</span> Endereços de Entrega</h2>
          <button class="btn btn-primary btn-sm" onclick="showAddressForm()">
            <span class="material-icons-outlined">add</span> Novo Endereço
          </button>
        </div>
        <p class="tab-description">Gerencie seus endereços de entrega para agilizar os pedidos.</p>
        <div id="addressFormContainer"></div>
        ${savedAddresses.length > 0 ? `
          <div class="addresses-grid">
            ${savedAddresses.map((addr, i) => `
              <div class="address-card ${addr.isDefault ? 'address-default' : ''}">
                ${addr.isDefault ? '<span class="badge badge-approved">Principal</span>' : ''}
                <h4>${addr.label}</h4>
                <p>${addr.street}, ${addr.number}</p>
                <p>${addr.neighborhood} · ${addr.city}/${addr.state}</p>
                <p>CEP: ${addr.cep}</p>
                ${addr.complement ? `<p>Complemento: ${addr.complement}</p>` : ''}
                ${addr.reference ? `<p class="addr-ref">Ref: ${addr.reference}</p>` : ''}
                <div class="address-actions">
                  ${!addr.isDefault ? `<button class="btn btn-outline btn-sm" onclick="setDefaultAddress(${i})">Tornar principal</button>` : ''}
                  <button class="btn btn-outline btn-sm btn-danger" onclick="deleteAddress(${i})">
                    <span class="material-icons-outlined">delete</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <span class="material-icons-outlined">add_location</span>
            <h3>Nenhum endereço cadastrado</h3>
            <p>Adicione endereços de entrega para agilizar o processo de compra.</p>
            <button class="btn btn-primary" onclick="showAddressForm()">
              <span class="material-icons-outlined">add</span> Adicionar Endereço
            </button>
          </div>
        `}
      </div>`,

    equipamentos: `
      <div class="account-tab-content">
        <div class="tab-header">
          <h2><span class="material-icons-outlined">build</span> Equipamentos em Comodato</h2>
        </div>
        <p class="tab-description">Equipamentos cedidos pela Tutty Sucos para sua operação em regime de comodato.</p>
        ${savedEquipments.length > 0 ? `
          <div class="equipment-list">
            ${savedEquipments.map(eq => `
              <div class="equipment-card">
                <span class="material-icons-outlined equipment-icon">${eq.icon || 'kitchen'}</span>
                <div class="equipment-info">
                  <h4>${eq.name}</h4>
                  <p>Modelo: ${eq.model} · Patrimônio: ${eq.patrimony}</p>
                  <p>Desde: ${eq.since}</p>
                </div>
                <span class="badge badge-approved">${eq.status}</span>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <span class="material-icons-outlined">kitchen</span>
            <h3>Nenhum equipamento em comodato</h3>
            <p>A Tutty Sucos oferece equipamentos em comodato para clientes com volume recorrente.</p>
            <div class="equipment-info-box">
              <h4><span class="material-icons-outlined">info</span> Equipamentos disponíveis:</h4>
              <ul class="equipment-available">
                <li><span class="material-icons-outlined">blender</span> <strong>Refresqueiras</strong> — Máquinas de suco para buffets e self-service</li>
                <li><span class="material-icons-outlined">kitchen</span> <strong>Dispensers refrigerados</strong> — Para cafés da manhã de hotéis</li>
                <li><span class="material-icons-outlined">countertops</span> <strong>Displays e expositores</strong> — Para pontos de venda</li>
              </ul>
              <p class="equipment-note">* Disponibilidade sujeita a análise de volume de compra e contrato mínimo.</p>
              <button class="btn btn-primary" onclick="requestEquipment()">
                <span class="material-icons-outlined">mail</span> Solicitar Equipamento
              </button>
            </div>
          </div>
        `}
      </div>`,

    empresa: `
      <div class="account-tab-content">
        <div class="tab-header">
          <h2><span class="material-icons-outlined">settings</span> Dados da Empresa</h2>
        </div>
        <p class="tab-description">Mantenha seus dados atualizados para emissão de notas fiscais e entregas.</p>
        <form class="company-form" onsubmit="saveCompanyData(event)">
          <div class="form-section">
            <h3><span class="material-icons-outlined">business</span> Informações da Empresa</h3>
            <div class="form-grid-2">
              <div class="form-group">
                <label>Razão Social</label>
                <input type="text" value="${user.razaoSocial || user.company || ''}" id="compRazaoSocial" placeholder="Razão Social completa">
              </div>
              <div class="form-group">
                <label>Nome Fantasia</label>
                <input type="text" value="${user.nomeFantasia || user.company || ''}" id="compNomeFantasia" placeholder="Nome Fantasia">
              </div>
              <div class="form-group">
                <label>CNPJ</label>
                <input type="text" value="${user.cnpj || ''}" id="compCNPJ" placeholder="00.000.000/0000-00" readonly style="background:#f5f5f5">
              </div>
              <div class="form-group">
                <label>Inscrição Estadual</label>
                <input type="text" value="${user.inscricaoEstadual || ''}" id="compIE" placeholder="Inscrição Estadual">
              </div>
            </div>
          </div>
          <div class="form-section">
            <h3><span class="material-icons-outlined">person</span> Responsável</h3>
            <div class="form-grid-2">
              <div class="form-group">
                <label>Nome do Responsável</label>
                <input type="text" value="${user.responsavel || user.name || ''}" id="compResponsavel" placeholder="Nome completo">
              </div>
              <div class="form-group">
                <label>Cargo</label>
                <input type="text" value="${user.cargo || ''}" id="compCargo" placeholder="Ex: Gerente de Compras">
              </div>
              <div class="form-group">
                <label>E-mail</label>
                <input type="email" value="${user.email || ''}" id="compEmail" placeholder="email@empresa.com.br">
              </div>
              <div class="form-group">
                <label>Telefone</label>
                <input type="tel" value="${user.telefone || ''}" id="compTelefone" placeholder="(00) 00000-0000">
              </div>
            </div>
          </div>
          <div class="form-section">
            <h3><span class="material-icons-outlined">local_shipping</span> Endereço Fiscal</h3>
            <div class="form-grid-2">
              <div class="form-group">
                <label>CEP</label>
                <input type="text" value="${user.cep || ''}" id="compCEP" placeholder="00000-000">
              </div>
              <div class="form-group">
                <label>Rua</label>
                <input type="text" value="${user.rua || ''}" id="compRua" placeholder="Logradouro">
              </div>
              <div class="form-group">
                <label>Número</label>
                <input type="text" value="${user.numero || ''}" id="compNumero" placeholder="Nº">
              </div>
              <div class="form-group">
                <label>Complemento</label>
                <input type="text" value="${user.complemento || ''}" id="compComplemento" placeholder="Sala, Andar, etc.">
              </div>
              <div class="form-group">
                <label>Bairro</label>
                <input type="text" value="${user.bairro || ''}" id="compBairro" placeholder="Bairro">
              </div>
              <div class="form-group">
                <label>Cidade</label>
                <input type="text" value="${user.cidade || ''}" id="compCidade" placeholder="Cidade">
              </div>
              <div class="form-group">
                <label>Estado</label>
                <select id="compEstado">
                  <option value="">Selecione</option>
                  ${['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf =>
                    `<option value="${uf}" ${(user.estado || '') === uf ? 'selected' : ''}>${uf}</option>`
                  ).join('')}
                </select>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              <span class="material-icons-outlined">save</span> Salvar Alterações
            </button>
          </div>
        </form>
      </div>`
  };

  container.innerHTML = tabs[currentAccountTab] || tabs.painel;
}

// --- Account Helper Functions ---
function createNewList() {
  const name = prompt('Nome da lista de compra:');
  if (!name) return;
  const lists = JSON.parse(localStorage.getItem('tutty_lists_' + currentUser.email) || '[]');
  lists.push({ name, items: [], date: new Date().toLocaleDateString('pt-BR') });
  localStorage.setItem('tutty_lists_' + currentUser.email, JSON.stringify(lists));
  renderAccountContent();
  showDemoModal('Lista Criada', `A lista "<strong>${name}</strong>" foi criada com sucesso. Adicione produtos a ela pelo catálogo.`);
}

function deleteList(index) {
  if (!confirm('Excluir esta lista?')) return;
  const lists = JSON.parse(localStorage.getItem('tutty_lists_' + currentUser.email) || '[]');
  lists.splice(index, 1);
  localStorage.setItem('tutty_lists_' + currentUser.email, JSON.stringify(lists));
  renderAccountContent();
}

function addListToCart(index) {
  showDemoModal('Em breve', 'A funcionalidade de adicionar lista ao carrinho estará disponível em breve!');
}

function showAddressForm() {
  const container = document.getElementById('addressFormContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="address-form-card">
      <h4>Novo Endereço</h4>
      <div class="form-grid-2">
        <div class="form-group">
          <label>Apelido</label>
          <input type="text" id="addrLabel" placeholder="Ex: Matriz, Filial, Depósito">
        </div>
        <div class="form-group">
          <label>CEP</label>
          <input type="text" id="addrCEP" placeholder="00000-000">
        </div>
        <div class="form-group">
          <label>Rua</label>
          <input type="text" id="addrStreet" placeholder="Logradouro">
        </div>
        <div class="form-group">
          <label>Número</label>
          <input type="text" id="addrNumber" placeholder="Nº">
        </div>
        <div class="form-group">
          <label>Bairro</label>
          <input type="text" id="addrNeighborhood" placeholder="Bairro">
        </div>
        <div class="form-group">
          <label>Cidade</label>
          <input type="text" id="addrCity" placeholder="Cidade">
        </div>
        <div class="form-group">
          <label>Estado</label>
          <input type="text" id="addrState" placeholder="UF" maxlength="2">
        </div>
        <div class="form-group">
          <label>Complemento</label>
          <input type="text" id="addrComplement" placeholder="Sala, Andar...">
        </div>
        <div class="form-group full-width">
          <label>Referência</label>
          <input type="text" id="addrReference" placeholder="Ponto de referência">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary btn-sm" onclick="saveAddress()">
          <span class="material-icons-outlined">save</span> Salvar
        </button>
        <button class="btn btn-outline btn-sm" onclick="document.getElementById('addressFormContainer').innerHTML=''">Cancelar</button>
      </div>
    </div>`;
}

function saveAddress() {
  const addr = {
    label: document.getElementById('addrLabel').value || 'Endereço',
    cep: document.getElementById('addrCEP').value,
    street: document.getElementById('addrStreet').value,
    number: document.getElementById('addrNumber').value,
    neighborhood: document.getElementById('addrNeighborhood').value,
    city: document.getElementById('addrCity').value,
    state: document.getElementById('addrState').value,
    complement: document.getElementById('addrComplement').value,
    reference: document.getElementById('addrReference').value,
    isDefault: false
  };
  if (!addr.street || !addr.city) {
    showDemoModal('Erro', 'Preencha pelo menos Rua e Cidade.');
    return;
  }
  const addresses = JSON.parse(localStorage.getItem('tutty_addresses_' + currentUser.email) || '[]');
  if (addresses.length === 0) addr.isDefault = true;
  addresses.push(addr);
  localStorage.setItem('tutty_addresses_' + currentUser.email, JSON.stringify(addresses));
  renderAccountContent();
  showDemoModal('Endereço Salvo', `O endereço "<strong>${addr.label}</strong>" foi adicionado com sucesso.`);
}

function deleteAddress(index) {
  if (!confirm('Excluir este endereço?')) return;
  const addresses = JSON.parse(localStorage.getItem('tutty_addresses_' + currentUser.email) || '[]');
  addresses.splice(index, 1);
  if (addresses.length > 0 && !addresses.some(a => a.isDefault)) addresses[0].isDefault = true;
  localStorage.setItem('tutty_addresses_' + currentUser.email, JSON.stringify(addresses));
  renderAccountContent();
}

function setDefaultAddress(index) {
  const addresses = JSON.parse(localStorage.getItem('tutty_addresses_' + currentUser.email) || '[]');
  addresses.forEach((a, i) => a.isDefault = (i === index));
  localStorage.setItem('tutty_addresses_' + currentUser.email, JSON.stringify(addresses));
  renderAccountContent();
}

function requestEquipment() {
  if (!currentUser) { showPage('login'); return; }

  const btn = document.querySelector('.btn-equipment') || event.target;
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const users = getUsers();
  const fullUser = users.find(u => u.email === currentUser.email) || {};

  const body = new URLSearchParams({
    'form-name': 'equipment-request',
    'nome': currentUser.name || '',
    'email': currentUser.email || '',
    'empresa': currentUser.company || '',
    'cnpj': fullUser.cnpj || '',
    'telefone': fullUser.phone || '',
    'mensagem': 'Solicitação de equipamento em comodato — ' + new Date().toLocaleDateString('pt-BR')
  });

  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  })
  .then(function(res) {
    btn.disabled = false;
    btn.textContent = originalText;
    if (res.ok) {
      showDemoModal('Solicitação Enviada!', 'Sua solicitação de equipamento em comodato foi registrada com sucesso. Nossa equipe comercial entrará em contato em até 48 horas úteis para avaliar sua operação e disponibilidade.');
    } else {
      showDemoModal('Erro ao Enviar', 'Não foi possível enviar sua solicitação. Tente novamente ou entre em contato pelo WhatsApp: <a href="https://wa.me/5518981544334" target="_blank">(18) 98154-4334</a> ou e-mail: comercial@tuttysucos.com.br');
    }
  })
  .catch(function() {
    btn.disabled = false;
    btn.textContent = originalText;
    showDemoModal('Erro de Conexão', 'Verifique sua internet e tente novamente. Ou entre em contato pelo WhatsApp: <a href="https://wa.me/5518981544334" target="_blank">(18) 98154-4334</a>');
  });
}

function saveCompanyData(event) {
  event.preventDefault();
  const users = JSON.parse(localStorage.getItem('tutty_users') || '[]');
  const userIndex = users.findIndex(u => u.email === currentUser.email);
  if (userIndex >= 0) {
    users[userIndex].razaoSocial = document.getElementById('compRazaoSocial').value;
    users[userIndex].nomeFantasia = document.getElementById('compNomeFantasia').value;
    users[userIndex].inscricaoEstadual = document.getElementById('compIE').value;
    users[userIndex].responsavel = document.getElementById('compResponsavel').value;
    users[userIndex].cargo = document.getElementById('compCargo').value;
    users[userIndex].telefone = document.getElementById('compTelefone').value;
    users[userIndex].cep = document.getElementById('compCEP').value;
    users[userIndex].rua = document.getElementById('compRua').value;
    users[userIndex].numero = document.getElementById('compNumero').value;
    users[userIndex].complemento = document.getElementById('compComplemento').value;
    users[userIndex].bairro = document.getElementById('compBairro').value;
    users[userIndex].cidade = document.getElementById('compCidade').value;
    users[userIndex].estado = document.getElementById('compEstado').value;
    localStorage.setItem('tutty_users', JSON.stringify(users));
  }
  showDemoModal('Dados Salvos', 'Os dados da empresa foram atualizados com sucesso!');
}

// --- Offers ---
function renderOffers() {
  // Show products with highest savings potential and bestsellers
  const offerProducts = PRODUCTS
    .filter(p => p.badges.includes('bestseller') || p.isNew || p.maxSavings >= 17)
    .sort((a, b) => b.maxSavings - a.maxSavings)
    .slice(0, 8);
  const grid = document.getElementById('offersGrid');
  if (!grid) return;

  grid.innerHTML = offerProducts.map(product => {
    const lineLabel = LINE_NAMES[product.line] || product.line;
    const packLabel = product.packaging === 'unitario' ? 'Unitário' : `Fardo c/ ${product.unitsPerPack} un.`;

    return `
      <div class="offer-card">
        <span class="offer-badge">Até -${product.maxSavings}%</span>
        <div class="offer-image" style="background: ${product.gradient}">
          <span class="material-icons-outlined">local_drink</span>
        </div>
        <div class="offer-info">
          <h3>${product.name}</h3>
          <p>${lineLabel} — ${product.volume} — ${packLabel}</p>
          <div class="offer-prices">
            <span class="offer-old-price">${formatPrice(product.priceTiers.E)}/un.</span>
            <span class="offer-new-price">${formatPrice(product.priceTiers.A)}/un.</span>
          </div>
          <div class="offer-tier-info">na Tabela A (${PRICING_RULES.tierLabels.A})</div>
          <button class="btn btn-primary btn-block btn-sm" onclick="showProduct(${product.id})">
            <span class="material-icons-outlined" style="font-size:16px">visibility</span> Ver Tabela de Preços
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// --- Search ---
function initSearch() {
  const input = document.getElementById('searchInput');
  const suggestions = document.getElementById('searchSuggestions');

  input.addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    if (query.length < 2) {
      suggestions.classList.remove('active');
      return;
    }

    const results = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.flavor.toLowerCase().includes(query) ||
      p.line.toLowerCase().includes(query) ||
      (LINE_NAMES[p.line] || '').toLowerCase().includes(query) ||
      (FLAVOR_NAMES[p.flavor] || '').toLowerCase().includes(query) ||
      p.volume.toLowerCase().includes(query)
    ).slice(0, 8);

    if (results.length === 0) {
      suggestions.classList.remove('active');
      return;
    }

    suggestions.innerHTML = results.map(p => `
      <div class="search-suggestion" onclick="showProduct(${p.id}); document.getElementById('searchSuggestions').classList.remove('active'); document.getElementById('searchInput').value = '';">
        <span class="material-icons-outlined">local_drink</span>
        <div>
          <strong>${p.name}</strong> — ${p.volume}
          <div style="font-size:12px;color:var(--text-light)">${LINE_NAMES[p.line]}${canSeePrices() ? ` | ${formatPrice(p.priceTiers.A)} ~ ${formatPrice(p.priceTiers.E)}/un.` : ''}</div>
        </div>
      </div>
    `).join('');

    suggestions.classList.add('active');
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const query = this.value.trim();
      if (query.length >= 2) {
        showPage('catalog');
        suggestions.classList.remove('active');
        this.value = '';
      }
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-bar')) {
      suggestions.classList.remove('active');
    }
  });
}

// --- Mobile Menu ---
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('active');
}

// --- FAQ ---
function toggleFaq(el) {
  el.classList.toggle('active');
}

// --- Auth ---
function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('input[type="email"]').value.trim();
  const password = form.querySelector('input[type="password"]').value;

  if (!email || !password) {
    showDemoModal('Erro', 'Preencha e-mail e senha.');
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    showDemoModal('Erro de Login', 'E-mail ou senha inválidos. Verifique suas credenciais.');
    return;
  }

  if (user.role === 'pending') {
    showDemoModal('Cadastro Pendente', 'Seu cadastro ainda está aguardando aprovação do administrador. Você será notificado quando o acesso for liberado.');
    return;
  }

  currentUser = { email: user.email, name: user.name, role: user.role, company: user.company };
  saveAuth();
  updateAuthUI();
  showPage('home');
  showDemoModal('Bem-vindo!', `Olá, ${user.name}! Você está logado como <strong>${user.role === 'admin' ? 'Administrador' : 'Cliente'}</strong>. Agora você tem acesso completo às tabelas de preços e pode realizar pedidos.`);
}

function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input');
  const company = inputs[0]?.value.trim();
  const cnpj = inputs[1]?.value.trim();
  const name = inputs[2]?.value.trim();
  const email = inputs[3]?.value.trim();
  const phone = inputs[4]?.value.trim();
  const password = inputs[5]?.value;

  if (!company || !cnpj || !name || !email || !password) {
    showDemoModal('Erro', 'Preencha todos os campos obrigatórios.');
    return;
  }

  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    showDemoModal('E-mail já cadastrado', 'Este e-mail já está registrado. Tente fazer login ou use outro e-mail.');
    return;
  }

  users.push({
    email: email,
    name: name,
    role: 'pending',
    company: company,
    cnpj: cnpj,
    phone: phone || '',
    password: password
  });
  saveUsers(users);

  showDemoModal('Cadastro Enviado!', 'Seu cadastro foi enviado para análise. O administrador irá avaliar e aprovar seu acesso. Você receberá acesso às tabelas de preços assim que aprovado.');
  showPage('login');
}

function handleLogout() {
  currentUser = null;
  cart = [];
  try { localStorage.removeItem('tutty_current_user'); } catch (e) {}
  updateAuthUI();
  updateCartUI();
  showPage('home');
}

function showDemoModal(title, message) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <span class="material-icons-outlined">info</span>
      <h2>${title}</h2>
      <p>${message}</p>
      <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove();">Entendido</button>
    </div>
  `;
  document.body.appendChild(modal);
}

// --- Header scroll effect ---
function initHeaderScroll() {
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = 'var(--shadow-sm)';
    }
  });
}

// --- Admin Panel ---
function initAdmin() {
  if (!isAdmin()) {
    showPage('login');
    showDemoModal('Acesso Restrito', 'Apenas administradores podem acessar o painel administrativo.');
    return;
  }

  // Min order
  const minOrderInput = document.getElementById('adminMinOrder');
  if (minOrderInput) {
    minOrderInput.value = PRICING_RULES.minOrderValue;
  }

  // Volume tiers table
  renderAdminVolumeTiers();
  renderAdminProducts();
  renderAdminUsers();
}

function renderAdminVolumeTiers() {
  const container = document.getElementById('adminVolumeTiers');
  if (!container) return;

  const volumes = Object.keys(PRICING_RULES.volumeTiers);
  const tierUnit = (vol) => (vol === 'Bag 5L' || vol === 'Galão 5L') ? 'un.' : 'fardos';

  let html = `<table class="admin-volume-table">
    <thead>
      <tr>
        <th>Volume</th>
        <th>Un./Fardo</th>
        <th>Tab. A</th>
        <th>Tab. B</th>
        <th>Tab. C</th>
        <th>Tab. D</th>
        <th>Tab. E</th>
      </tr>
    </thead>
    <tbody>`;

  volumes.forEach(vol => {
    const tiers = PRICING_RULES.volumeTiers[vol];
    const units = PRICING_RULES.unitsPerPack[vol];
    html += `<tr>
      <td><strong>${vol}</strong></td>
      <td>${units} ${tierUnit(vol)}</td>
      <td><input type="number" class="admin-small-input" data-vol="${vol}" data-tier="A" value="${tiers.A}" min="1"></td>
      <td><input type="number" class="admin-small-input" data-vol="${vol}" data-tier="B" value="${tiers.B}" min="1"></td>
      <td><input type="number" class="admin-small-input" data-vol="${vol}" data-tier="C" value="${tiers.C}" min="1"></td>
      <td><input type="number" class="admin-small-input" data-vol="${vol}" data-tier="D" value="${tiers.D}" min="1"></td>
      <td><input type="number" class="admin-small-input" data-vol="${vol}" data-tier="E" value="${tiers.E}" min="1"></td>
    </tr>`;
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderAdminProducts() {
  const body = document.getElementById('adminProductsBody');
  if (!body) return;

  const lineFilter = document.getElementById('adminLineFilter')?.value || '';
  const volFilter = document.getElementById('adminVolumeFilter')?.value || '';

  let products = [...PRODUCTS];
  if (lineFilter) products = products.filter(p => p.line === lineFilter);
  if (volFilter) products = products.filter(p => p.volume === volFilter);

  body.innerHTML = products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td><strong>${p.name}</strong><br><small>${LINE_NAMES[p.line]}</small></td>
      <td>${p.volume}</td>
      <td><input type="number" class="admin-price-input" data-id="${p.id}" data-tier="A" value="${p.priceTiers.A}" step="0.01" min="0"></td>
      <td><input type="number" class="admin-price-input" data-id="${p.id}" data-tier="B" value="${p.priceTiers.B}" step="0.01" min="0"></td>
      <td><input type="number" class="admin-price-input" data-id="${p.id}" data-tier="C" value="${p.priceTiers.C}" step="0.01" min="0"></td>
      <td><input type="number" class="admin-price-input" data-id="${p.id}" data-tier="D" value="${p.priceTiers.D}" step="0.01" min="0"></td>
      <td><input type="number" class="admin-price-input" data-id="${p.id}" data-tier="E" value="${p.priceTiers.E}" step="0.01" min="0"></td>
    </tr>
  `).join('');
}

function saveAdminChanges() {
  // Save min order
  const minOrder = parseFloat(document.getElementById('adminMinOrder')?.value);
  if (!isNaN(minOrder)) {
    PRICING_RULES.minOrderValue = minOrder;
  }

  // Save volume tiers
  document.querySelectorAll('.admin-small-input').forEach(input => {
    const vol = input.dataset.vol;
    const tier = input.dataset.tier;
    const val = parseInt(input.value);
    if (!isNaN(val) && PRICING_RULES.volumeTiers[vol]) {
      PRICING_RULES.volumeTiers[vol][tier] = val;
    }
  });

  // Save product prices
  document.querySelectorAll('.admin-price-input').forEach(input => {
    const id = parseInt(input.dataset.id);
    const tier = input.dataset.tier;
    const val = parseFloat(input.value);
    const product = PRODUCTS.find(p => p.id === id);
    if (product && !isNaN(val)) {
      product.priceTiers[tier] = val;
    }
  });

  // Recalculate derived fields
  PRODUCTS.forEach(p => {
    const liters = { '300ml': 0.3, '900ml': 0.9, '1.5L': 1.5, '2L': 2, '3L': 3, 'Bag 5L': 5, 'Galão 5L': 5 };
    p.price = p.priceTiers.E;
    p.pricePerBox = +(p.priceTiers.E * p.unitsPerPack).toFixed(2);
    p.pricePerLiter = +(p.priceTiers.E / (liters[p.volume] || 1)).toFixed(2);
    p.maxSavings = Math.round((1 - p.priceTiers.A / p.priceTiers.E) * 100);
    p.bestPrice = p.priceTiers.A;
  });

  // Save to localStorage
  try {
    localStorage.setItem('tutty_pricing_rules', JSON.stringify(PRICING_RULES));
    localStorage.setItem('tutty_products_prices', JSON.stringify(
      PRODUCTS.map(p => ({ id: p.id, priceTiers: p.priceTiers }))
    ));
  } catch (e) {}

  showDemoModal('Alterações Salvas!', 'Todos os preços e regras foram atualizados com sucesso. As mudanças já estão refletidas no catálogo e no carrinho.');
}

function resetAdminChanges() {
  try {
    localStorage.removeItem('tutty_pricing_rules');
    localStorage.removeItem('tutty_products_prices');
  } catch (e) {}
  showDemoModal('Valores Restaurados', 'Os valores padrão foram restaurados. Recarregue a página para aplicar.');
}

function exportPrices() {
  let csv = 'ID,Produto,Linha,Volume,Tabela A,Tabela B,Tabela C,Tabela D,Tabela E\n';
  PRODUCTS.forEach(p => {
    csv += `${p.id},"${p.name}",${LINE_NAMES[p.line]},${p.volume},${p.priceTiers.A},${p.priceTiers.B},${p.priceTiers.C},${p.priceTiers.D},${p.priceTiers.E}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'tutty_tabela_precos.csv';
  link.click();
}

function renderAdminUsers() {
  const container = document.getElementById('adminUsersBody');
  if (!container) return;

  const users = getUsers();
  container.innerHTML = users.map((u, i) => {
    const roleBadge = u.role === 'admin' ? '<span class="role-badge role-admin">Admin</span>'
      : u.role === 'client' ? '<span class="role-badge role-client">Cliente</span>'
      : '<span class="role-badge role-pending">Pendente</span>';
    const actions = u.role === 'pending' ? `
      <button class="btn btn-primary btn-sm" onclick="approveUser('${u.email}')">Aprovar</button>
      <button class="btn btn-outline btn-sm" onclick="rejectUser('${u.email}')">Rejeitar</button>
    ` : u.role === 'client' ? `
      <button class="btn btn-outline btn-sm" onclick="revokeUser('${u.email}')">Revogar</button>
    ` : '<span style="color:var(--text-light);font-size:12px">Sistema</span>';

    return `<tr>
      <td><strong>${u.name}</strong></td>
      <td>${u.company || '-'}</td>
      <td>${u.cnpj || '-'}</td>
      <td>${u.email}</td>
      <td>${roleBadge}</td>
      <td>${actions}</td>
    </tr>`;
  }).join('');
}

function approveUser(email) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    user.role = 'client';
    saveUsers(users);
    renderAdminUsers();
    showDemoModal('Usuário Aprovado', `O cadastro de <strong>${user.name}</strong> (${user.company}) foi aprovado. O cliente agora pode acessar preços e fazer pedidos.`);
  }
}

function rejectUser(email) {
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx !== -1) {
    const user = users[idx];
    users.splice(idx, 1);
    saveUsers(users);
    renderAdminUsers();
    showDemoModal('Cadastro Rejeitado', `O cadastro de <strong>${user.name}</strong> foi removido.`);
  }
}

function revokeUser(email) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    user.role = 'pending';
    saveUsers(users);
    renderAdminUsers();
    showDemoModal('Acesso Revogado', `O acesso de <strong>${user.name}</strong> foi revogado. O cliente não poderá mais ver preços.`);
  }
}

function loadSavedPrices() {
  try {
    const savedRules = localStorage.getItem('tutty_pricing_rules');
    if (savedRules) {
      const rules = JSON.parse(savedRules);
      PRICING_RULES.minOrderValue = rules.minOrderValue;
      Object.keys(rules.volumeTiers).forEach(vol => {
        if (PRICING_RULES.volumeTiers[vol]) {
          PRICING_RULES.volumeTiers[vol] = rules.volumeTiers[vol];
        }
      });
    }

    const savedPrices = localStorage.getItem('tutty_products_prices');
    if (savedPrices) {
      const prices = JSON.parse(savedPrices);
      prices.forEach(saved => {
        const product = PRODUCTS.find(p => p.id === saved.id);
        if (product) {
          product.priceTiers = saved.priceTiers;
          // Recalculate
          const liters = { '300ml': 0.3, '900ml': 0.9, '1.5L': 1.5, '2L': 2, '3L': 3, 'Bag 5L': 5, 'Galão 5L': 5 };
          product.price = product.priceTiers.E;
          product.pricePerBox = +(product.priceTiers.E * product.unitsPerPack).toFixed(2);
          product.pricePerLiter = +(product.priceTiers.E / (liters[product.volume] || 1)).toFixed(2);
          product.maxSavings = Math.round((1 - product.priceTiers.A / product.priceTiers.E) * 100);
          product.bestPrice = product.priceTiers.A;
        }
      });
    }
  } catch (e) {}
}

// --- Init ---
// --- Scroll Animations (Intersection Observer) ---
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        // Stagger children animations
        const children = entry.target.querySelectorAll('[data-aos]');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('aos-animate'), i * 80);
        });
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  document.querySelectorAll('.section, .benefit-card, .category-card, .step-card, .trust-item, .target-badge, .op-card, .pillar, [data-aos]').forEach(el => {
    el.classList.add('aos-init');
    observer.observe(el);
  });

  // Parallax on hero
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroBg = hero.querySelector('.hero-bg');
      if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(${1 + scrolled * 0.0003})`;
      }
      // Floating fruit elements parallax
      document.querySelectorAll('.floating-fruit').forEach((fruit, i) => {
        const speed = 0.1 + (i * 0.05);
        fruit.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
      });
    }, { passive: true });
  }
}

// --- Hero Image Slideshow ---
function initHeroSlideshow() {
  const banners = [
    'images/bg/banner-integral.jpg',
    'images/bg/banner-nectar.jpg'
  ];
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let current = 0;
  heroBg.style.backgroundImage = `url(${banners[0]})`;

  setInterval(() => {
    current = (current + 1) % banners.length;
    heroBg.style.opacity = '0';
    setTimeout(() => {
      heroBg.style.backgroundImage = `url(${banners[current]})`;
      heroBg.style.opacity = '0.15';
    }, 600);
  }, 8000);
}

document.addEventListener('DOMContentLoaded', function () {
  loadAuth();
  loadSavedPrices();
  renderBestSellers();
  initSearch();
  initHeaderScroll();
  updateAuthUI();
  initScrollAnimations();
  initHeroSlideshow();
});
