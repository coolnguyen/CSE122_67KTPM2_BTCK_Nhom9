// ==========================================================================
// js/diner-table-order.js - Giỏ món tại bàn & Gửi đơn thời gian thực vào Bếp
// ==========================================================================

let generalOrderNote = '';

function cartPage() {
  const table = typeof getActiveTable === 'function' ? getActiveTable() : (sessionStorage.getItem('menumind:table') || 'A01');
  const cart = typeof getTableCart === 'function' ? getTableCart(table) : getStore('cart', []);
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const details = cart
    .map((c, index) => ({ ...c, index, item: menuItems.find(i => i.id === c.menuId) }))
    .filter(x => x.item);

  const subtotal = details.reduce((s, x) => s + x.item.price * x.qty, 0);
  const serviceFee = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + serviceFee;

  const payment = getTablePayment(table);
  const locked = paymentLocksOrdering(payment, table);
  const lockMessage = orderingLockMessage(payment, table);

  const kicker = document.querySelector('#cart-kicker');
  const subtitle = document.querySelector('#cart-subtitle');
  const headActions = document.querySelector('#cart-head-actions');
  const wrapper = document.querySelector('#cart-content-wrapper');

  if (kicker) kicker.textContent = `Bàn ${table}`;
  if (subtitle) {
    subtitle.textContent = locked
      ? lockMessage
      : 'Bạn có thể điều chỉnh số lượng, thêm ghi chú riêng cho bếp hoặc bỏ món trước khi gửi.';
  }
  if (headActions) {
    headActions.innerHTML = locked
      ? `<a class="button quiet" href="diner-order-status.html">Theo dõi đơn &amp; Thanh toán</a>`
      : `<a class="button quiet" href="diner-menu.html">+ Thêm món</a>`;
  }

  if (!wrapper) return;

  if (!details.length) {
    wrapper.innerHTML = emptyState(
      'Giỏ món đang trống',
      locked ? lockMessage : `Bàn ${table} chưa có món nào trong giỏ chờ gửi. Hãy khám phá thực đơn để chọn món.`,
      locked
        ? `<a class="button primary" href="diner-order-status.html">Xem tiến độ đơn Bàn ${escapeHtml(table)}</a>`
        : `<a class="button primary" href="diner-menu.html">Xem thực đơn</a>`
    );
    return;
  }

  const maxPrepTime = Math.max(...details.map(x => Number(x.item.time) || 12));

  wrapper.innerHTML = `
    <div class="checkout-layout">
      <section class="cart-list" aria-label="Các món đã chọn tại Bàn ${escapeHtml(table)}">
        ${details.map(x => `
          <article class="cart-row">
            <div class="mini-food tone-${escapeHtml(String(x.item.id).slice(-1))}" data-dish-id="${escapeHtml(x.item.id)}">
              ${dishPicture(x.item, 'mini-food-photo')}
            </div>
            <div>
              <h2>${escapeHtml(x.item.name)}</h2>
              <p>${x.note ? `Ghi chú món: ${escapeHtml(x.note)}` : `Chuẩn bị ~${x.item.time} phút · ${money(x.item.price)}/phần`}</p>
              <button type="button" class="link-button danger-text" data-remove-cart="${x.index}" ${locked ? 'disabled' : ''}>Bỏ món</button>
            </div>
            <label>Số lượng
              <input type="number" min="1" max="10" value="${x.qty}" data-cart-qty="${x.index}" ${locked ? 'disabled' : ''}>
            </label>
            <strong>${money(x.item.price * x.qty)}</strong>
          </article>
        `).join('')}
      </section>

      <aside class="bill-panel">
        <p class="kicker">Tóm tắt đơn · Thời gian dự kiến ~${maxPrepTime} phút</p>
        <h2>${details.reduce((s, x) => s + x.qty, 0)} món · Bàn ${escapeHtml(table)}</h2>
        <dl>
          <div><dt>Tạm tính</dt><dd>${money(subtotal)}</dd></div>
          <div><dt>Phí phục vụ (5%)</dt><dd>${money(serviceFee)}</dd></div>
          <div class="total"><dt>Tổng cộng</dt><dd>${money(grandTotal)}</dd></div>
        </dl>
        <label style="margin-block: 12px;">
          Ghi chú chung cho cả đơn (tùy chọn)
          <input id="order-general-note" type="text" maxlength="140" placeholder="Ví dụ: Mang nước ra trước, ít cay..." value="${escapeHtml(generalOrderNote)}" ${locked ? 'disabled' : ''}>
        </label>
        ${locked ? `<div class="order-lock-notice" role="alert"><strong>Không thể gửi thêm món</strong><span>${escapeHtml(lockMessage)}</span></div>` : ''}
        <label class="check">
          <input id="confirm-order" type="checkbox" ${locked ? 'disabled' : ''}>Tôi đã kiểm tra món, số lượng và các ghi chú
        </label>
        <button id="submit-order" type="button" class="button primary full" disabled>
          ${locked ? (payment?.status === 'paid' ? 'Phiên đã thanh toán' : 'Đã yêu cầu thanh toán') : 'Gửi đơn đến bếp'}
        </button>
        <p class="fine-print">
          ${locked
            ? 'Vui lòng nhờ nhân viên cấp phiên QR mới nếu muốn mở lượt dùng bàn mới.'
            : 'Đơn hàng sẽ hiển thị ngay lập tức trên màn hình điều phối Bếp theo thời gian thực.'}
        </p>
      </aside>
    </div>
  `;
}

async function submitOrder() {
  const table = typeof getActiveTable === 'function' ? getActiveTable() : (sessionStorage.getItem('menumind:table') || 'A01');
  const cart = typeof getTableCart === 'function' ? getTableCart(table) : getStore('cart', []);
  if (!cart.length) return;

  const button = document.querySelector('#submit-order');
  if (button) {
    button.disabled = true;
    button.textContent = 'Đang đồng bộ...';
  }

  try {
    await ensureQrOrderingOpen();
    if (button) button.textContent = 'Đang gửi đơn đến bếp...';

    const menuItems = getStore('menuItems', appData.menuItems || []);
    const orders = getStore('orders', appData.orders || []);
    const tables = getStore('tables', appData.tables || []);
    const sessions = typeof getLocalSessions === 'function' ? getLocalSessions() : {};
    const activeSession = sessions[table] || (typeof ensureTableSession === 'function' ? ensureTableSession(table, false) : null);

    const items = cart.map(x => {
      const menuItem = menuItems.find(i => i.id === x.menuId);
      if (menuItem) {
        menuItem.orders = (Number(menuItem.orders) || 0) + (Number(x.qty) || 1);
      }
      return {
        menuId: x.menuId,
        qty: Math.max(1, Number(x.qty) || 1),
        note: String(x.note || '').trim(),
        unitPrice: menuItem?.price || 0,
        done: false
      };
    });

    const subtotal = items.reduce((sum, x) => sum + (x.unitPrice || 0) * x.qty, 0);
    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + serviceFee;

    const noteInput = document.querySelector('#order-general-note');
    const customNote = String(noteInput?.value || generalOrderNote || '').trim();

    const order = {
      id: `MM-${Date.now().toString().slice(-6)}`,
      table,
      diningSessionId: activeSession?.id || null,
      createdAt: new Date().toISOString(),
      status: 'new',
      priority: false,
      wait: 0,
      items,
      subtotal,
      serviceFee,
      total,
      note: customNote || 'Đơn gửi trực tiếp từ QR tại bàn'
    };

    if (typeof createOrderRemote === 'function') {
      await createOrderRemote(order);
    }

    // 1. Lưu thực đơn với số lượt gọi mới tăng theo thời gian thực
    setStore('menuItems', menuItems);

    // 2. Đảm bảo trạng thái bàn chuyển sang 'occupied' (Đang dùng)
    const tableObj = tables.find(t => t.id === table);
    if (tableObj && tableObj.status !== 'occupied') {
      tableObj.status = 'occupied';
      setStore('tables', tables);
    }

    // 3. Lưu đơn hàng mới và phát tín hiệu thời gian thực sang Bếp
    orders.unshift(order);
    setStore('orders', orders);
    setStore('lastOrder', order, true);

    // 4. Làm trống giỏ hàng của bàn hiện tại
    if (typeof setTableCart === 'function') {
      setTableCart([], table);
    } else {
      setStore('cart', []);
    }
    generalOrderNote = '';

    toast(`Đã gửi đơn ${order.id} (Bàn ${table}) tới Bếp!`);
    setTimeout(() => {
      location.href = 'diner-order-status.html';
    }, 450);
  } catch (error) {
    console.warn(error);
    if (error.code === 'ORDER_LOCKED' || paymentLocksOrdering(undefined, table)) {
      if (button) {
        button.disabled = true;
        button.textContent = getTablePayment(table)?.status === 'paid' ? 'Phiên đã thanh toán' : 'Không thể gửi đơn';
      }
    } else if (button) {
      button.disabled = false;
      button.textContent = 'Gửi đơn đến bếp';
    }
    toast(error.message || 'Không thể gửi đơn. Vui lòng thử lại.', 'error');
  }
}

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.removeCart !== undefined) {
    const table = typeof getActiveTable === 'function' ? getActiveTable() : 'A01';
    const cart = typeof getTableCart === 'function' ? getTableCart(table) : getStore('cart', []);
    cart.splice(+b.dataset.removeCart, 1);
    if (typeof setTableCart === 'function') setTableCart(cart, table);
    else setStore('cart', cart);
    cartPage();
  }
  if (b.id === 'submit-order') {
    submitOrder();
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'order-general-note') {
    generalOrderNote = e.target.value;
    return;
  }
  if (e.target.dataset.cartQty !== undefined) {
    const table = typeof getActiveTable === 'function' ? getActiveTable() : 'A01';
    const cart = typeof getTableCart === 'function' ? getTableCart(table) : getStore('cart', []);
    const idx = +e.target.dataset.cartQty;
    if (cart[idx]) {
      cart[idx].qty = Math.min(10, Math.max(1, +e.target.value || 1));
      if (typeof setTableCart === 'function') setTableCart(cart, table);
      else setStore('cart', cart);
      cartPage();
    }
  }
  if (e.target.id === 'confirm-order') {
    const submitBtn = document.querySelector('#submit-order');
    if (submitBtn) {
      submitBtn.disabled = !e.target.checked || paymentLocksOrdering();
    }
  }
});

bootPage(cartPage);
