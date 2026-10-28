// ==========================================================================
// js/diner-menu.js - Thực đơn thông minh tại bàn & AI-1 Taste Recommender
// ==========================================================================

const initialMenuQuery = new URLSearchParams(location.search).get('q') || '';
let menuFilters = { q: initialMenuQuery.trim(), category: 'Tất cả', sort: 'popular' };
let tasteCandidateIndex = 0;
let lastTasteSignature = '';

function normalizeMenuText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeMenuTextWithAccents(value) {
  return String(value || '')
    .normalize('NFC')
    .toLocaleLowerCase('vi-VN')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function matchesMenuQuery(item, query) {
  const rawQuery = String(query || '');
  const accentSensitive = normalizeMenuTextWithAccents(rawQuery) !== normalizeMenuText(rawQuery);
  const normalize = accentSensitive ? normalizeMenuTextWithAccents : normalizeMenuText;
  const terms = normalize(rawQuery).split(' ').filter(Boolean);
  if (!terms.length) return true;
  const tags = Array.isArray(item.tags) ? item.tags.join(' ') : String(item.tags || '');
  const words = normalize(`${item.name || ''} ${item.category || ''} ${item.description || ''} ${tags}`).split(' ').filter(Boolean);
  return terms.every(term => words.some(word => word === term || (term.length >= 2 && word.startsWith(term))));
}

function containsAvoidedIngredient(item, avoid) {
  return String(avoid || '')
    .split(',')
    .map(term => term.trim())
    .filter(Boolean)
    .some(term => matchesMenuQuery(item, term));
}

function dinerMenuPage() {
  const table = typeof getActiveTable === 'function' ? getActiveTable() : (sessionStorage.getItem('menumind:table') || 'A01');
  const tables = getStore('tables', appData.tables || []);
  const tableKicker = document.querySelector('.page-head .kicker');
  if (tableKicker) {
    const options = tables
      .filter(t => t.status !== 'cleaning' || t.id === table)
      .map(t => `<option value="${escapeHtml(t.id)}" ${t.id === table ? 'selected' : ''}>Bàn ${escapeHtml(t.id)} (${escapeHtml(t.zone)})</option>`)
      .join('');
    tableKicker.innerHTML = `Thực đơn tại bàn · <select id="diner-table-switcher" aria-label="Đổi bàn phục vụ" style="display:inline-block;width:auto;padding:3px 8px;font-size:.75rem;font-weight:700;border-radius:6px;margin-left:4px;">${options}</select>`;
  }

  const searchInput = document.querySelector('#menu-search');
  if (searchInput && menuFilters.q && !searchInput.value) {
    searchInput.value = menuFilters.q;
  }

  renderCategories();
  renderMenu();
  if (typeof updateCartCount === 'function') updateCartCount();
}

function renderCategories() {
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const cats = ['Tất cả', ...new Set(menuItems.map(i => i.category))];
  const container = document.querySelector('#category-filter');
  if (container) {
    container.innerHTML = cats
      .map(c => `<button type="button" class="chip ${menuFilters.category === c ? 'active' : ''}" data-category="${escapeHtml(c)}">${escapeHtml(c)}</button>`)
      .join('');
  }
}

function renderMenu() {
  const menuItems = getStore('menuItems', appData.menuItems || []);
  let items = menuItems.filter(
    i => i.available && (menuFilters.category === 'Tất cả' || i.category === menuFilters.category) && matchesMenuQuery(i, menuFilters.q)
  );
  if (menuFilters.sort === 'price-low') items.sort((a, b) => a.price - b.price);
  if (menuFilters.sort === 'time') items.sort((a, b) => a.time - b.time);
  if (menuFilters.sort === 'popular') items.sort((a, b) => (b.orders || 0) - (a.orders || 0));

  const grid = document.querySelector('#menu-grid');
  const countEl = document.querySelector('#menu-count');
  if (countEl) countEl.textContent = items.length;
  if (grid) {
    grid.innerHTML = items.length
      ? items.map(dishCard).join('')
      : emptyState(
          'Không thấy món phù hợp',
          'Thử từ khóa khác hoặc xóa bộ lọc hiện tại.',
          `<button class="button quiet" data-action="clear-filter">Xóa bộ lọc</button>`
        );
  }
}

function dishCard(i) {
  const locked = paymentLocksOrdering();
  return `
    <article class="dish-card">
      <a class="dish-visual tone-${escapeHtml(String(i.id).slice(-1))}" data-dish-id="${escapeHtml(i.id)}" href="diner-dish-detail.html?id=${encodeURIComponent(i.id)}" aria-label="Xem ${escapeHtml(i.name)}">
        ${dishPicture(i, 'dish-photo')}
        <small>${i.time} phút</small>
      </a>
      <div class="dish-body">
        <div class="dish-meta">
          <span>${escapeHtml(i.category)}</span>
          <span>★ ${i.rating} · ${i.orders || 0} lượt</span>
        </div>
        <h3><a href="diner-dish-detail.html?id=${encodeURIComponent(i.id)}">${escapeHtml(i.name)}</a></h3>
        <p>${escapeHtml(i.description)}</p>
        <div class="dish-foot">
          <strong>${money(i.price)}</strong>
          <button class="add-button" data-add="${escapeHtml(i.id)}" ${locked ? 'disabled title="Phiên bàn đã khóa gọi món"' : ''} aria-label="Thêm ${escapeHtml(i.name)} vào giỏ">+</button>
        </div>
      </div>
    </article>
  `;
}

function tasteScore(item, taste) {
  let score = Number(item.rating || 0) + Math.min(3, Number(item.orders || 0) / 50);
  const category = normalizeMenuText(item.category);
  if (taste === 'Thuần chay') score += item.vegetarian ? 12 : -100;
  if (taste === 'Thanh nhẹ') {
    if (item.vegetarian) score += 3;
    if (['khai vi', 'mon chay', 'do uong'].includes(category)) score += 4;
    ['thanh', 'tuoi', 'salad', 'rau', 'chanh'].forEach(term => {
      if (matchesMenuQuery(item, term)) score += 2;
    });
    score -= Number(item.spicy || 0) * 2;
  }
  if (taste === 'Đậm đà') {
    ['dam', 'nuong', 'sot', 'tieu', 'bo', 'heo', 'ca hoi'].forEach(term => {
      if (matchesMenuQuery(item, term)) score += 2;
    });
    if (category === 'do uong') score -= 6;
  }
  if (taste === 'Cay ấm') {
    score += Number(item.spicy || 0) * 5;
    ['cay', 'tieu', 'gung', 'ot', 'ca ri', 'thai'].forEach(term => {
      if (matchesMenuQuery(item, term)) score += 2;
    });
  }
  return score;
}

function runTasteAI(form, nextCandidate = false) {
  const result = document.querySelector('#taste-result');
  if (!result) return;
  const fields = new FormData(form);
  const taste = String(fields.get('taste') || '');
  const avoid = String(fields.get('avoid') || '').trim();
  const signature = `${taste}|${avoid.toLowerCase()}`;

  if (signature !== lastTasteSignature) {
    tasteCandidateIndex = 0;
    lastTasteSignature = signature;
  } else if (nextCandidate) {
    tasteCandidateIndex += 1;
  }

  if (!taste) {
    result.innerHTML = '<div class="ai-warning"><strong>AI chưa đủ dữ liệu</strong><p>Hãy chọn ít nhất một khẩu vị để nhận gợi ý chính xác.</p></div>';
    return;
  }

  const menuItems = getStore('menuItems', appData.menuItems || []);
  result.innerHTML = `<div class="ai-loading"><span></span><p>Đang đối chiếu khẩu vị với ${menuItems.filter(x => x.available).length} món đang phục vụ...</p></div>`;

  setTimeout(() => {
    const matches = menuItems
      .filter(item => item.available && !containsAvoidedIngredient(item, avoid) && (taste !== 'Thuần chay' || item.vegetarian))
      .sort((a, b) => tasteScore(b, taste) - tasteScore(a, taste));

    if (!matches.length) {
      result.innerHTML = `
        <div class="ai-warning" role="alert">
          <p class="confidence">Độ tin cậy: <strong>35%</strong> (Thấp)</p>
          <strong>Không tìm thấy món khớp hoàn toàn</strong>
          <p>Không có món nào vừa hợp “${escapeHtml(taste)}” vừa tránh “${escapeHtml(avoid)}”. Hãy điều chỉnh lại nguyên liệu cần tránh.</p>
        </div>
      `;
      return;
    }

    const pick = matches[tasteCandidateIndex % matches.length];
    const drinkPairing = menuItems.find(m => m.available && m.category === 'Đồ uống' && !containsAvoidedIngredient(m, avoid));
    const confidence = Math.min(98, Math.max(76, Math.round(78 + tasteScore(pick, taste) - (tasteCandidateIndex % matches.length) * 2)));
    const avoidReason = avoid ? `<li>Đã loại trừ hoàn toàn các món chứa “${escapeHtml(avoid)}”</li>` : '';
    const pairingNote = (drinkPairing && drinkPairing.id !== pick.id)
      ? `<li>Gợi ý dùng kèm: <strong>${escapeHtml(drinkPairing.name)}</strong> (${money(drinkPairing.price)})</li>`
      : '';

    result.innerHTML = `
      <article class="ai-answer">
        <p class="confidence">Độ phù hợp <strong>${confidence}%</strong> · Phương án ${(tasteCandidateIndex % matches.length) + 1}/${matches.length}</p>
        <h3>${escapeHtml(pick.emoji || '🍽️')} ${escapeHtml(pick.name)} (${money(pick.price)})</h3>
        <p contenteditable="false" id="ai-taste-copy">${escapeHtml(pick.description)}</p>
        <details>
          <summary>Vì sao AI gợi ý món này?</summary>
          <ul>
            <li>Khớp ưu tiên khẩu vị “${escapeHtml(taste)}”</li>
            ${avoidReason}
            <li>Đánh giá thực khách ${pick.rating}/5 (${pick.orders || 0} lượt gọi)</li>
            <li>Thời gian bếp chuẩn bị khoảng ${pick.time} phút</li>
            ${pairingNote}
          </ul>
        </details>
        <div class="ai-actions">
          <button type="button" class="button small primary" data-ai-accept="${escapeHtml(pick.id)}">Thêm vào giỏ</button>
          <button type="button" class="button small quiet" data-action="edit-ai">Sửa ghi chú</button>
          <button type="button" class="link-button" data-action="regenerate-taste">Đổi gợi ý khác</button>
          <button type="button" class="link-button danger-text" data-action="reject-ai">Từ chối</button>
        </div>
      </article>
    `;
  }, 400);
}

document.addEventListener('click', e => {
  const b = e.target.closest('button, a');
  if (!b) return;

  if (b.dataset.category) {
    menuFilters.category = b.dataset.category;
    renderCategories();
    renderMenu();
  }
  if (b.dataset.add) {
    if (typeof addToCart === 'function') addToCart(b.dataset.add);
  }
  if (b.dataset.aiAccept) {
    if (typeof addToCart === 'function') {
      const customNote = document.querySelector('#ai-taste-copy')?.isContentEditable
        ? document.querySelector('#ai-taste-copy')?.textContent?.trim()
        : '';
      addToCart(b.dataset.aiAccept, 1, customNote ? `Gợi ý AI: ${customNote.slice(0, 60)}` : '');
    }
  }
  if (b.dataset.action === 'clear-filter') {
    menuFilters = { q: '', category: 'Tất cả', sort: 'popular' };
    const searchInput = document.querySelector('#menu-search');
    if (searchInput) searchInput.value = '';
    renderCategories();
    renderMenu();
  }
  if (b.dataset.action === 'edit-ai') {
    const p = b.closest('.ai-answer')?.querySelector('p[id], textarea');
    if (p) {
      p.contentEditable = 'true';
      p.focus();
      toast('Bạn có thể chỉnh sửa ghi chú gợi ý trước khi thêm vào giỏ', 'info');
    }
  }
  if (b.dataset.action === 'reject-ai') {
    const res = b.closest('.ai-result');
    if (res) res.innerHTML = emptyState('Đã từ chối gợi ý', 'Bạn có thể điều chỉnh khẩu vị và thử lại.');
  }
  if (b.dataset.action === 'regenerate-taste') {
    const form = document.querySelector('#taste-form');
    if (form) runTasteAI(form, true);
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'menu-search') {
    menuFilters.q = e.target.value.trim().toLowerCase();
    renderMenu();
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'menu-sort') {
    menuFilters.sort = e.target.value;
    renderMenu();
  }
  if (e.target.id === 'diner-table-switcher') {
    const newTable = e.target.value;
    setActiveTable(newTable);
    dinerMenuPage();
    toast(`Đã chuyển sang thực đơn Bàn ${newTable}`, 'info');
  }
});

document.addEventListener('submit', e => {
  if (e.target.id === 'taste-form') {
    e.preventDefault();
    runTasteAI(e.target, false);
  }
});

bootPage(dinerMenuPage);
