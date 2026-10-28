// ==========================================================================
// js/kitchen-board.js - Bảng điều phối Bếp thời gian thực (S07)
// ==========================================================================

function orderCard(o) {
  const done = ['served', 'cancelled'].includes(o.status);
  const parsed = parseOrderDate(o.createdAt);
  const time = parsed
    ? parsed.date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : o.createdAt;
  const liveWait = getOrderWait(o);
  const threshold = typeof getAlertThreshold === 'function' ? getAlertThreshold() : 15;
  const isLate = liveWait >= threshold && !done;
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const doneItemsCount = (o.items || []).filter(x => x.done).length;
  const totalItemsGroup = (o.items || []).length;

  return `
    <article class="kitchen-card ${o.priority && !done ? 'priority' : ''} ${done ? 'completed' : ''}">
      <header>
        <div>
          <strong>Bàn ${escapeHtml(o.table)}</strong>
          <span>${escapeHtml(o.id)} · ${escapeHtml(time)} · Đã xong ${doneItemsCount}/${totalItemsGroup} nhóm món</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          ${o.priority && !done ? '<span class="priority-mark">⚡ Ưu tiên</span>' : ''}
          ${badge(o.status)}
        </div>
      </header>
      <ul>
        ${(o.items || []).map(x => {
          const m = menuItems.find(i => i.id === x.menuId);
          const checkMark = x.done ? '<span style="color:var(--leaf);font-weight:800;">✓</span> ' : '';
          const noteSpan = x.note ? ` <small style="color:var(--muted);">(${escapeHtml(x.note)})</small>` : '';
          return `<li>${checkMark}<b>${x.qty}×</b> ${escapeHtml(m?.name || x.menuId)}${noteSpan}</li>`;
        }).join('')}
      </ul>
      ${o.note ? `<p class="order-note">${escapeHtml(o.note)}</p>` : ''}
      <footer>
        <span class="wait ${isLate ? 'late' : ''}">${liveWait} phút chờ${isLate ? ' · Trễ' : ''}</span>
        <div>
          ${!done ? `<button type="button" class="icon-button" data-toggle-priority="${escapeHtml(o.id)}" title="${o.priority ? 'Bỏ ưu tiên' : 'Đánh dấu ưu tiên'}" aria-label="Đổi ưu tiên">⚡</button>` : ''}
          <a class="icon-button" href="kitchen-order-detail.html?id=${encodeURIComponent(o.id)}" title="Chi tiết &amp; tích món" aria-label="Xem chi tiết">⋯</a>
          <button type="button" class="button small primary" data-order-next="${escapeHtml(o.id)}" ${done ? 'disabled' : ''}>
            ${o.status === 'new' ? 'Nhận nấu' : o.status === 'cooking' ? 'Báo xong món' : o.status === 'ready' ? 'Đã giao bàn' : statusLabel(o.status)}
          </button>
        </div>
      </footer>
    </article>
  `;
}

function kitchenBoardPageV2() {
  const orders = getStore('orders', appData.orders || []);
  const rank = { new: 0, cooking: 1, ready: 2, served: 3, cancelled: 4 };
  const sorted = [...orders].sort((a, b) => {
    const aDone = ['served', 'cancelled'].includes(a.status);
    const bDone = ['served', 'cancelled'].includes(b.status);
    if (aDone !== bDone) return Number(aDone) - Number(bDone);
    if (!aDone && a.priority !== b.priority) return Number(b.priority) - Number(a.priority);
    if ((rank[a.status] ?? 9) !== (rank[b.status] ?? 9)) return (rank[a.status] ?? 9) - (rank[b.status] ?? 9);
    return getOrderWait(b) - getOrderWait(a);
  });

  const limit = getStore('kitchenLimit', 'all');
  const statusFilter = getStore('kitchenStatusFilter', 'all');

  const activeAll = sorted.filter(o => !['served', 'cancelled'].includes(o.status));
  const filteredActive = statusFilter === 'all'
    ? activeAll
    : activeAll.filter(o => o.status === statusFilter);
  const visibleActive = limit === 'all' ? filteredActive : filteredActive.slice(0, Number(limit));
  const completed = sorted.filter(o => ['served', 'cancelled'].includes(o.status)).slice(0, 6);

  const avgWait = activeAll.length
    ? Math.round(activeAll.reduce((sum, o) => sum + getOrderWait(o), 0) / activeAll.length)
    : 0;

  const wrapper = document.querySelector('#kitchen-board-wrapper');
  if (wrapper) {
    wrapper.innerHTML = `
      ${pageHead(
        'Hàng đợi trực tiếp · Thời gian thực',
        'Bảng điều phối bếp',
        'Đơn ưu tiên và chờ lâu được đẩy lên đầu. Mọi thao tác đồng bộ tức thì sang màn hình Thực khách.',
        `<div class="head-actions">
          <label class="compact-field">Trạng thái
            <select id="kitchen-status-filter">
              <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>Tất cả đang nấu (${activeAll.length})</option>
              <option value="new" ${statusFilter === 'new' ? 'selected' : ''}>Mới nhận (${orders.filter(o => o.status === 'new').length})</option>
              <option value="cooking" ${statusFilter === 'cooking' ? 'selected' : ''}>Đang nấu (${orders.filter(o => o.status === 'cooking').length})</option>
              <option value="ready" ${statusFilter === 'ready' ? 'selected' : ''}>Chờ phục vụ (${orders.filter(o => o.status === 'ready').length})</option>
            </select>
          </label>
          <label class="compact-field">Hiển thị
            <select id="kitchen-limit">
              <option value="3" ${limit === '3' ? 'selected' : ''}>3 đơn</option>
              <option value="6" ${limit === '6' ? 'selected' : ''}>6 đơn</option>
              <option value="all" ${limit === 'all' ? 'selected' : ''}>Tất cả</option>
            </select>
          </label>
        </div>`
      )}
      <section class="metric-strip">
        <div><span>Chưa thực hiện</span><strong>${orders.filter(o => o.status === 'new').length}</strong></div>
        <div><span>Đang chế biến</span><strong>${orders.filter(o => o.status === 'cooking').length}</strong></div>
        <div><span>Chờ phục vụ</span><strong>${orders.filter(o => o.status === 'ready').length}</strong></div>
        <div><span>Chờ trung bình</span><strong>${avgWait}′</strong></div>
      </section>
      <section class="queue-section">
        <div class="section-title compact">
          <div>
            <p class="kicker">Cần xử lý trước</p>
            <h2>Đơn đang hoạt động · ${visibleActive.length}</h2>
          </div>
        </div>
        <div class="board kitchen-queue-grid">
          ${visibleActive.length ? visibleActive.map(orderCard).join('') : emptyState('Đã xử lý hết', 'Không còn đơn đang chờ ở bộ lọc hiện tại.')}
        </div>
      </section>
      <section class="queue-section completed-queue">
        <div class="section-title compact">
          <div>
            <p class="kicker">Lịch sử gần đây</p>
            <h2>Đơn đã hoàn tất · ${completed.length}</h2>
          </div>
        </div>
        <div class="kitchen-queue-grid">
          ${completed.length ? completed.map(orderCard).join('') : emptyState('Chưa có đơn hoàn tất', 'Đơn đã phục vụ sẽ được chuyển xuống khu vực này.')}
        </div>
      </section>
    `;
  }
}

document.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.togglePriority) {
    const orders = getStore('orders', appData.orders || []);
    const o = orders.find(x => x.id === b.dataset.togglePriority);
    if (!o) return;
    o.priority = !o.priority;
    o.updatedAt = new Date().toISOString();
    setStore('orders', orders);
    if (typeof updateOrderRemote === 'function') updateOrderRemote(o).catch(console.warn);
    kitchenBoardPageV2();
    toast(o.priority ? `Đã gắn cờ ưu tiên đơn ${o.id} (Bàn ${o.table})` : `Đã bỏ ưu tiên đơn ${o.id}`);
    return;
  }

  if (b.dataset.orderNext) {
    const orders = getStore('orders', appData.orders || []);
    const o = orders.find(x => x.id === b.dataset.orderNext);
    const next = { new: 'cooking', cooking: 'ready', ready: 'served' };
    if (!o) return;
    const oldStatus = o.status;
    o.status = next[o.status] || o.status;
    o.updatedAt = new Date().toISOString();

    if (['ready', 'served'].includes(o.status) && Array.isArray(o.items)) {
      o.items.forEach(item => { item.done = true; });
    }
    if (o.status === 'served') {
      o.wait = getOrderWait(o);
    }

    b.disabled = true;
    try {
      if (typeof updateOrderRemote === 'function') await updateOrderRemote(o);
      setStore('orders', orders);
      kitchenBoardPageV2();
      toast(`Đơn ${o.id} (Bàn ${o.table}) → ${statusLabel(o.status)}`);
    } catch (error) {
      o.status = oldStatus;
      b.disabled = false;
      toast(`Không thể cập nhật: ${error.message}`, 'error');
    }
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'kitchen-limit') {
    setStore('kitchenLimit', e.target.value, true);
    kitchenBoardPageV2();
  }
  if (e.target.id === 'kitchen-status-filter') {
    setStore('kitchenStatusFilter', e.target.value, true);
    kitchenBoardPageV2();
  }
});

bootPage(kitchenBoardPageV2);
