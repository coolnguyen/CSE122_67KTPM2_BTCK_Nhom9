// ==========================================================================
// js/index.js - MenuMind Bistro: Thương hiệu Ẩm Thực & Khám Phá Không Gian Bàn
// ==========================================================================

let homeZoneFilter = 'Tất cả';

function homePage() {
  const tables = getStore('tables', appData.tables || []);
  const orders = getStore('orders', appData.orders || []);
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const payments = getStore('payments', appData.payments || []);

  // 1. Cập nhật Món Ăn Bếp Trưởng (Chef's Signature Dish)
  const topDish = [...menuItems]
    .filter(m => m.available)
    .sort((a, b) => (b.orders || 0) - (a.orders || 0))[0] || menuItems[0];

  const topDishName = document.querySelector('#hero-top-dish-name');
  const topDishDesc = document.querySelector('#hero-top-dish-desc');
  const topDishCategory = document.querySelector('#hero-top-category');
  const topDishPrice = document.querySelector('#hero-top-price');
  const topDishRating = document.querySelector('#hero-top-rating');
  const topDishTime = document.querySelector('#hero-top-time');
  const topDishImg = document.querySelector('#hero-top-img');
  const topEmojiEl = document.querySelector('#hero-top-emoji');

  if (topDish) {
    if (topDishName) topDishName.textContent = topDish.name;
    if (topDishDesc) topDishDesc.textContent = topDish.description || '';
    if (topDishCategory) topDishCategory.textContent = `${topDish.category} Thượng Hạng`;
    if (topDishPrice) topDishPrice.textContent = money(topDish.price);
    if (topDishRating) topDishRating.textContent = `★ ${topDish.rating} (${topDish.orders || 128} lượt gọi)`;
    if (topDishTime) topDishTime.textContent = `⏱ ~${topDish.time || 18} phút`;
    if (topDishImg && typeof dishImage === 'function') {
      topDishImg.src = dishImage(topDish);
      topDishImg.alt = topDish.name;
    }
    if (topEmojiEl) topEmojiEl.textContent = topDish.emoji || '🍽️';
  }

  // 2. Render bộ lọc không gian (Khu vực nhà hàng)
  const zones = ['Tất cả', ...new Set(tables.map(t => t.zone))];
  const zoneBar = document.querySelector('#home-zone-filter');
  if (zoneBar) {
    zoneBar.innerHTML = zones.map(z => `
      <button type="button" class="chip ${homeZoneFilter === z ? 'active' : ''}" data-home-zone="${escapeHtml(z)}">
        ${escapeHtml(z)}
      </button>
    `).join('');
  }

  // 3. Render danh sách bàn ăn & không gian thưởng thức
  const filteredTables = homeZoneFilter === 'Tất cả'
    ? tables
    : tables.filter(t => t.zone === homeZoneFilter);

  const grid = document.querySelector('#home-table-grid');
  if (!grid) return;

  const currentSelectedTable = typeof getActiveTable === 'function' ? getActiveTable() : 'A01';

  grid.innerHTML = filteredTables.map(t => {
    const tableOrders = orders.filter(o => o.table === t.id && o.status !== 'cancelled');
    const activeTableOrders = tableOrders.filter(o => ['new', 'cooking', 'ready'].includes(o.status));
    const pendingPayment = payments.find(p => p.table_code === t.id && p.status === 'pending');
    const isCleaning = t.status === 'cleaning';
    const isSelected = t.id === currentSelectedTable;

    let statusText = 'Sẵn sàng đón khách';
    if (isCleaning) {
      statusText = 'Đang dọn dẹp & sát khuẩn';
    } else if (pendingPayment) {
      statusText = `Đang thanh toán (${money(pendingPayment.amount)})`;
    } else if (activeTableOrders.length > 0) {
      statusText = `${activeTableOrders.length} món đang phục vụ`;
    } else if (t.status === 'occupied') {
      statusText = 'Bàn đang có khách';
    }

    return `
      <article class="home-table-card ${escapeHtml(t.status)}">
        <header>
          <strong>Bàn ${escapeHtml(t.id)}${isSelected ? ' <small style="font-size:.72rem;color:var(--leaf);font-weight:600;">(Đang chọn)</small>' : ''}</strong>
          ${badge(pendingPayment ? 'pending' : t.status)}
        </header>
        <div class="home-table-meta">
          <span>Khu vực: ${escapeHtml(t.zone)}</span>
          <span>${t.seats} chỗ ngồi</span>
        </div>
        <small>${escapeHtml(statusText)}</small>
        <div class="home-table-actions">
          ${isCleaning
            ? `<button type="button" class="button small quiet" disabled>Đang dọn dẹp</button>`
            : `<button type="button" class="button small primary" data-enter-table="${escapeHtml(t.id)}">
                 ${t.status === 'occupied' ? 'Mở thực đơn bàn' : 'Quét QR / Ngồi bàn này'}
               </button>`
          }
          ${tableOrders.length > 0 && !isCleaning
            ? `<button type="button" class="button small quiet" data-track-table="${escapeHtml(t.id)}">Theo dõi đơn</button>`
            : ''
          }
        </div>
      </article>
    `;
  }).join('');
}

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.homeZone) {
    homeZoneFilter = b.dataset.homeZone;
    homePage();
    return;
  }

  if (b.dataset.enterTable) {
    const code = b.dataset.enterTable;
    const tables = getStore('tables', appData.tables || []);
    const target = tables.find(t => t.id === code);
    if (target && target.status === 'cleaning') {
      toast(`Bàn ${code} đang được dọn dẹp, quý khách vui lòng chọn bàn khác`, 'error');
      return;
    }
    if (target && (target.status === 'available' || target.status === 'reserved')) {
      target.status = 'occupied';
      setStore('tables', tables);
    }
    const qr = setActiveTable(code);
    location.href = `pages/diner-menu.html?table=${encodeURIComponent(qr.table)}&id=${encodeURIComponent(qr.token)}`;
    return;
  }

  if (b.dataset.trackTable) {
    const code = b.dataset.trackTable;
    const qr = setActiveTable(code);
    location.href = `pages/diner-order-status.html?table=${encodeURIComponent(qr.table)}&id=${encodeURIComponent(qr.token)}`;
  }
});

bootPage(homePage);
