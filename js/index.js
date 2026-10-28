// ==========================================================================
// js/index.js - Trang chủ MenuMind: Nhịp phục vụ & Chọn bàn QR thời gian thực
// ==========================================================================

let homeZoneFilter = 'Tất cả';

function homePage() {
  const tables = getStore('tables', appData.tables || []);
  const orders = getStore('orders', appData.orders || []);
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const payments = getStore('payments', appData.payments || []);

  // 1. Cập nhật Hero Quick Facts & Service Pulse thời gian thực
  const activeOrders = orders.filter(o => ['new', 'cooking', 'ready'].includes(o.status));
  const capacityPct = Math.min(100, Math.round((activeOrders.length / 10) * 100));
  const topDish = [...menuItems].filter(m => m.available).sort((a, b) => (b.orders || 0) - (a.orders || 0))[0];

  const factTables = document.querySelector('#hero-fact-tables');
  const factDishes = document.querySelector('#hero-fact-dishes');
  const kitchenStatus = document.querySelector('#hero-kitchen-status');
  const kitchenDetail = document.querySelector('#hero-kitchen-detail');
  const topDishEl = document.querySelector('#hero-top-dish');
  const topEmojiEl = document.querySelector('#hero-top-emoji');

  if (factTables) factTables.textContent = `${tables.length} bàn`;
  if (factDishes) factDishes.textContent = `${menuItems.filter(m => m.available).length} món`;
  if (kitchenStatus) {
    kitchenStatus.textContent = capacityPct >= 80 ? 'Bếp đang cao điểm' : 'Bếp đang ổn định';
  }
  if (kitchenDetail) {
    kitchenDetail.textContent = `${activeOrders.length} đơn đang chế biến · ${capacityPct}% công suất`;
  }
  if (topDish) {
    if (topDishEl) topDishEl.textContent = `${topDish.name} · ★ ${topDish.rating}`;
    if (topEmojiEl) topEmojiEl.textContent = topDish.emoji || '🍽️';
  }

  // 2. Cập nhật chỉ số bàn thời gian thực
  const availCount = document.querySelector('#home-avail-count');
  const occCount = document.querySelector('#home-occ-count');
  const activeOrdersEl = document.querySelector('#home-active-orders');
  const cleanCount = document.querySelector('#home-clean-count');

  if (availCount) availCount.textContent = tables.filter(t => t.status === 'available').length;
  if (occCount) occCount.textContent = tables.filter(t => t.status === 'occupied').length;
  if (activeOrdersEl) activeOrdersEl.textContent = activeOrders.length;
  if (cleanCount) cleanCount.textContent = tables.filter(t => t.status === 'cleaning').length;

  // 3. Render bộ lọc khu vực
  const zones = ['Tất cả', ...new Set(tables.map(t => t.zone))];
  const zoneBar = document.querySelector('#home-zone-filter');
  if (zoneBar) {
    zoneBar.innerHTML = zones.map(z => `
      <button type="button" class="chip ${homeZoneFilter === z ? 'active' : ''}" data-home-zone="${escapeHtml(z)}">
        ${escapeHtml(z)}
      </button>
    `).join('');
  }

  // 4. Render danh sách bàn ăn tương tác trực tiếp
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

    let orderInfo = 'Chưa có đơn trong phiên';
    if (pendingPayment) {
      orderInfo = `Chờ thanh toán · ${money(pendingPayment.amount)}`;
    } else if (tableOrders.length > 0) {
      orderInfo = `${tableOrders.length} lần gọi (${activeTableOrders.length} đang xử lý)`;
    }

    return `
      <article class="home-table-card ${escapeHtml(t.status)}">
        <header>
          <strong>Bàn ${escapeHtml(t.id)}${isSelected ? ' <small style="font-size:.7rem;color:var(--leaf);">• Đang chọn</small>' : ''}</strong>
          ${badge(pendingPayment ? 'pending' : t.status)}
        </header>
        <div class="home-table-meta">
          <span>Khu vực: ${escapeHtml(t.zone)}</span>
          <span>${t.seats} chỗ ngồi</span>
        </div>
        <small>${escapeHtml(orderInfo)}</small>
        <div class="home-table-actions">
          ${isCleaning
            ? `<button type="button" class="button small quiet" disabled>Đang dọn bàn</button>`
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
      toast(`Bàn ${code} đang được dọn dẹp, vui lòng chọn bàn khác`, 'error');
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
