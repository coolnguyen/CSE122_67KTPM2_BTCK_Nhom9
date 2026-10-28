// ==========================================================================
// js/kitchen-order-detail.js - Chi tiết đơn chế biến & Tích hoàn thành từng món (S08)
// ==========================================================================

let currentSelectedOrderId = new URLSearchParams(location.search).get('id')?.trim() || '';

function kitchenDetailPage() {
  const orders = getStore('orders', appData.orders || []);
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const wrapper = document.querySelector('#kitchen-detail-wrapper');
  if (!wrapper) return;

  if (!orders.length) {
    wrapper.innerHTML = `
      ${pageHead('Chi tiết đơn', 'Chưa có đơn hàng trong bếp', 'Khi thực khách gửi đơn từ bàn, đơn sẽ xuất hiện tại đây.', '<a class="button primary" href="kitchen-board.html">Mở bảng đơn</a>')}
      ${emptyState('Không có đơn nào', 'Hãy quay lại bảng điều phối bếp.')}
    `;
    return;
  }

  // Nếu truy cập từ Sidebar không có ?id=, tự động chọn đơn ưu tiên / đang nấu đầu tiên
  let o = orders.find(order => String(order.id) === currentSelectedOrderId);
  if (!o) {
    const activeOrders = orders.filter(x => !['served', 'cancelled'].includes(x.status));
    o = activeOrders.find(x => x.priority) || activeOrders[0] || orders[0];
    if (o) currentSelectedOrderId = o.id;
  }

  const parsed = parseOrderDate(o.createdAt);
  const createdTimeLabel = parsed
    ? parsed.date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : o.createdAt;
  const liveWait = getOrderWait(o);
  const doneCount = (o.items || []).filter(x => x.done).length;
  const totalGroups = (o.items || []).length;

  const orderSwitcherOptions = orders.map(ord => `
    <option value="${escapeHtml(ord.id)}" ${ord.id === o.id ? 'selected' : ''}>
      ${escapeHtml(ord.id)} · Bàn ${escapeHtml(ord.table)} (${escapeHtml(statusLabel(ord.status))})
    </option>
  `).join('');

  wrapper.innerHTML = `
    ${pageHead(
      `Chi tiết ${escapeHtml(o.id)}${o.priority ? ' · ⚡ ĐƠN ƯU TIÊN' : ''}`,
      `Bàn ${escapeHtml(o.table)} · ${(o.items || []).reduce((s, x) => s + Number(x.qty || 1), 0)} phần món`,
      `Gửi lúc ${escapeHtml(createdTimeLabel)} · Đã hoàn thành ${doneCount}/${totalGroups} nhóm món.`,
      `<div class="head-actions">
        <label class="compact-field">Chọn nhanh đơn
          <select id="kitchen-order-switcher" aria-label="Chuyển đổi đơn chế biến">
            ${orderSwitcherOptions}
          </select>
        </label>
        <a class="button quiet" href="kitchen-board.html">Về bảng bếp</a>
      </div>`
    )}
    <div class="detail-layout">
      ${o.status === 'cancel_requested' ? `
        <div class="surface" style="grid-column: 1 / -1; border: 2px solid #ea580c; background: #fffdfa; padding: 16px 20px; border-radius: 10px; box-shadow: 0 4px 18px rgba(234, 88, 12, 0.18);">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap;">
            <div>
              <h3 style="color: #c2410c; margin: 0 0 4px; font-size: 1.1rem; display: flex; align-items: center; gap: 6px;">
                ⚠️ THỰC KHÁCH BÀN ${escapeHtml(o.table)} YÊU CẦU HỦY ĐƠN HÀNG
              </h3>
              <p style="margin: 0; color: #9a3412; font-size: .84rem;">
                Yêu cầu gửi lúc ${o.cancelRequestedAt ? new Date(o.cancelRequestedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : createdTimeLabel} (${liveWait} phút chờ). Bếp trưởng vui lòng kiểm tra thực tế trên chảo để xử lý:
              </p>
            </div>
            <div style="display: flex; gap: 10px;">
              <button type="button" class="button small danger" data-approve-cancel="${escapeHtml(o.id)}">✓ Chấp nhận hủy</button>
              <button type="button" class="button small quiet" data-reject-cancel="${escapeHtml(o.id)}">✕ Từ chối (Món đang nấu)</button>
            </div>
          </div>
        </div>
      ` : ''}
      <section class="surface">
        <div class="section-title compact">
          <div>
            <p class="kicker">Danh sách chế biến (${doneCount}/${totalGroups} hoàn tất)</p>
            <h2>Các món trong đơn</h2>
          </div>
          ${badge(o.status)}
        </div>
        ${(o.items || []).map((x, n) => {
          const m = menuItems.find(i => i.id === x.menuId);
          return `
            <article class="prep-row" style="${x.done ? 'opacity:.72;background:var(--paper);' : ''}">
              <span>${n + 1}</span>
              <div>
                <h3>${x.qty} × ${escapeHtml(m?.name || x.menuId)} <small style="font-weight:500;">(~${m?.time || 12} phút)</small></h3>
                <p>${escapeHtml(x.note || 'Chế biến theo công thức tiêu chuẩn')}</p>
              </div>
              <label class="check">
                <input type="checkbox" data-prep-item-index="${n}" data-prep-order="${escapeHtml(o.id)}" ${x.done ? 'checked' : ''} ${['served', 'cancelled'].includes(o.status) ? 'disabled' : ''}>
                ${x.done ? 'Đã xong ✓' : 'Hoàn thành'}
              </label>
            </article>
          `;
        }).join('')}
        <div class="order-note">
          <strong>Ghi chú chung của đơn</strong>
          <p>${escapeHtml(o.note || 'Không có ghi chú')}</p>
        </div>
      </section>

      <aside class="order-panel">
        <p class="kicker">Tiến độ đơn · Bàn ${escapeHtml(o.table)}</p>
        <h2>${liveWait} phút chờ</h2>
        <label>
          Chuyển trạng thái
          <select id="order-status">
            ${['cancel_requested', 'new', 'cooking', 'ready', 'served', 'cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${statusLabel(s)}</option>`).join('')}
          </select>
        </label>
        <label>
          Ghi chú điều phối / bếp
          <textarea id="kitchen-note" rows="3" placeholder="Thông báo cho phục vụ hoặc ca sau...">${escapeHtml(o.note || '')}</textarea>
        </label>
        <button type="button" class="button primary full" data-update-order="${escapeHtml(o.id)}">Lưu cập nhật</button>
        <button type="button" class="button quiet full" data-priority-order="${escapeHtml(o.id)}">
          ${o.priority ? '⚡ Bỏ đánh dấu ưu tiên' : '⚡ Đánh dấu ưu tiên'}
        </button>
      </aside>
    </div>
  `;
}

document.addEventListener('change', e => {
  if (e.target.id === 'kitchen-order-switcher') {
    currentSelectedOrderId = e.target.value;
    const url = new URL(location.href);
    url.searchParams.set('id', currentSelectedOrderId);
    history.replaceState({}, '', url);
    kitchenDetailPage();
    return;
  }

  // Lưu trạng thái tích hoàn thành từng món theo thời gian thực
  if (e.target.dataset.prepItemIndex !== undefined) {
    const orderId = e.target.dataset.prepOrder;
    const itemIdx = Number(e.target.dataset.prepItemIndex);
    const orders = getStore('orders', appData.orders || []);
    const o = orders.find(x => x.id === orderId);
    if (!o || !Array.isArray(o.items) || !o.items[itemIdx]) return;

    o.items[itemIdx].done = e.target.checked;
    const allDone = o.items.every(item => item.done);
    const anyDone = o.items.some(item => item.done);

    if (allDone && ['new', 'cooking'].includes(o.status)) {
      o.status = 'ready';
      toast(`Tất cả món của đơn ${o.id} (Bàn ${o.table}) đã chế biến xong → Chuyển sang Chờ phục vụ!`);
    } else if (anyDone && o.status === 'new') {
      o.status = 'cooking';
      toast(`Đơn ${o.id} đã bắt đầu chế biến`);
    }

    o.updatedAt = new Date().toISOString();
    setStore('orders', orders);
    kitchenDetailPage();
  }
});

document.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.approveCancel) {
    const orderId = b.dataset.approveCancel;
    const orders = getStore('orders', appData.orders || []);
    const o = orders.find(x => x.id === orderId);
    if (!o) return;
    const ok = window.confirm(`Xác nhận CHẤP NHẬN HỦY đơn ${orderId} (Bàn ${o.table})?\n\nĐơn sẽ được đánh dấu đã hủy và tự động khấu trừ khỏi hóa đơn của khách.`);
    if (!ok) return;

    o.status = 'cancelled';
    o.cancelledBy = 'kitchen';
    o.cancelApprovedAt = new Date().toISOString();
    o.wait = getOrderWait(o);
    o.updatedAt = new Date().toISOString();

    setStore('orders', orders);
    if (typeof updateOrderRemote === 'function') updateOrderRemote(o).catch(console.warn);

    realtimeChannel?.postMessage({
      type: 'store:update',
      key: 'orders',
      action: 'cancel_approved',
      orderId: o.id,
      table: o.table,
      timestamp: Date.now(),
      sourcePage: 'kitchen-detail'
    });

    toast(`✓ Đã chấp thuận hủy đơn ${orderId} cho Bàn ${o.table}`);
    setTimeout(() => { location.href = 'kitchen-board.html'; }, 350);
    return;
  }

  if (b.dataset.rejectCancel) {
    const orderId = b.dataset.rejectCancel;
    const orders = getStore('orders', appData.orders || []);
    const o = orders.find(x => x.id === orderId);
    if (!o) return;
    const ok = window.confirm(`Xác nhận TỪ CHỐI hủy đơn ${orderId} (Bàn ${o.table})?\n\nThông báo sẽ được gửi tức thì tới khách rằng món ăn đã lên chảo/bếp và không thể hủy.`);
    if (!ok) return;

    o.status = 'cooking';
    o.cancelRejected = true;
    o.cancelRejectReason = 'Món ăn đã được sơ chế và đang nấu trên bếp.';
    o.updatedAt = new Date().toISOString();

    setStore('orders', orders);
    if (typeof updateOrderRemote === 'function') updateOrderRemote(o).catch(console.warn);

    realtimeChannel?.postMessage({
      type: 'store:update',
      key: 'orders',
      action: 'cancel_rejected',
      orderId: o.id,
      table: o.table,
      timestamp: Date.now(),
      sourcePage: 'kitchen-detail'
    });

    toast(`✕ Đã từ chối hủy đơn ${orderId}. Tiếp tục chế biến món.`);
    kitchenDetailPage();
    return;
  }

  if (b.dataset.updateOrder) {
    const orders = getStore('orders', appData.orders || []);
    const o = orders.find(x => x.id === b.dataset.updateOrder);
    if (!o) return;
    const old = { status: o.status, note: o.note };
    o.status = document.querySelector('#order-status')?.value || o.status;
    o.note = document.querySelector('#kitchen-note')?.value.trim() || '';
    o.updatedAt = new Date().toISOString();

    if (['ready', 'served'].includes(o.status) && Array.isArray(o.items)) {
      o.items.forEach(item => { item.done = true; });
    }
    if (['served', 'cancelled'].includes(o.status)) {
      o.wait = getOrderWait(o);
    }

    b.disabled = true;
    b.textContent = 'Đang lưu...';
    try {
      if (typeof updateOrderRemote === 'function') await updateOrderRemote(o);
      setStore('orders', orders);
      toast(`Đã lưu cập nhật đơn ${o.id} (${statusLabel(o.status)})`);
      setTimeout(() => { location.href = 'kitchen-board.html'; }, 350);
    } catch (error) {
      Object.assign(o, old);
      b.disabled = false;
      b.textContent = 'Lưu cập nhật';
      toast(`Không thể cập nhật: ${error.message}`, 'error');
    }
  }

  if (b.dataset.priorityOrder) {
    const orders = getStore('orders', appData.orders || []);
    const o = orders.find(x => x.id === b.dataset.priorityOrder);
    if (!o) return;
    o.priority = !o.priority;
    o.updatedAt = new Date().toISOString();
    if (typeof updateOrderRemote === 'function') updateOrderRemote(o).catch(console.warn);
    setStore('orders', orders);
    toast(o.priority ? `Đã ưu tiên đơn ${o.id}` : `Đã bỏ ưu tiên đơn ${o.id}`);
    kitchenDetailPage();
  }
});

bootPage(kitchenDetailPage);
