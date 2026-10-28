// ==========================================================================
// js/diner-order-status.js - Theo dõi tiến độ đơn, Thanh toán & Đánh giá thời gian thực
// ==========================================================================

function calculateOrderTotal(order) {
  if (Number(order.total) > 0) return Number(order.total);
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const sub = (order.items || []).reduce((s, x) => {
    const m = menuItems.find(i => i.id === x.menuId);
    return s + (Number(x.unitPrice || m?.price || 0) * Number(x.qty || 1));
  }, 0);
  return Math.round(sub * 1.05);
}

function paymentPanel(orders, table) {
  const payment = getTablePayment(table);
  const activeOrders = orders.filter(o => o.status !== 'cancelled');
  const total = activeOrders.reduce((sum, o) => sum + calculateOrderTotal(o), 0);

  if (payment?.status === 'paid') {
    return `
      <section class="surface payment-panel payment-confirmed">
        <span class="payment-confirm-icon" aria-hidden="true">✓</span>
        <p class="kicker">Thanh toán phiên bàn · ${escapeHtml(payment.reference || '')}</p>
        <h2>Đã hoàn tất thanh toán (${money(payment.amount || total)})</h2>
        <p>Cảm ơn quý khách đã dùng bữa tại MenuMind! Bàn ${escapeHtml(table)} đã hoàn tất hóa đơn.</p>
        <button type="button" class="button quiet full" data-action="start-new-session" style="margin-top:12px;">
          ↻ Mở lượt khách mới tại Bàn ${escapeHtml(table)}
        </button>
      </section>
    `;
  }

  const pending = payment?.status === 'pending';
  const methodLabels = { cash: 'Tiền mặt', card: 'Thẻ tín dụng', bank_transfer: 'Chuyển khoản' };

  return `
    <form id="payment-form" class="surface payment-panel">
      <p class="kicker">Thanh toán phiên Bàn ${escapeHtml(table)}</p>
      <div class="payment-total">
        <span>Tổng cộng ${activeOrders.length} lần gọi (đã gồm 5% phí phục vụ)</span>
        <strong>${money(total)}</strong>
      </div>
      ${pending ? `
        <div class="order-lock-notice" style="margin-bottom:14px;padding:12px;border-radius:8px;background:var(--blue-soft);">
          <strong>⌛ Đang chờ thu ngân xác nhận (${escapeHtml(methodLabels[payment.method] || payment.method)})</strong>
          <p style="margin:4px 0 0;font-size:.78rem;">Mã phiếu: ${escapeHtml(payment.reference || '—')} · Nhân viên đang tới Bàn ${escapeHtml(table)}.</p>
        </div>
      ` : ''}
      <fieldset class="payment-methods" ${pending ? 'disabled' : ''}>
        <legend>Chọn phương thức thanh toán</legend>
        <label>
          <input type="radio" name="method" value="cash" required ${(!payment?.method || payment?.method === 'cash') ? 'checked' : ''}>
          <span><b>₫</b><strong>Tiền mặt</strong><small>Thanh toán trực tiếp với nhân viên tại bàn</small></span>
        </label>
        <label>
          <input type="radio" name="method" value="card" required ${payment?.method === 'card' ? 'checked' : ''}>
          <span><b>▣</b><strong>Thẻ tín dụng / POS</strong><small>Quẹt hoặc chạm thẻ tại bàn</small></span>
        </label>
        <label>
          <input type="radio" name="method" value="bank_transfer" required ${payment?.method === 'bank_transfer' ? 'checked' : ''}>
          <span><b>↗</b><strong>Chuyển khoản QR</strong><small>Nhận mã VietQR từ nhân viên</small></span>
        </label>
      </fieldset>
      <button class="button primary full" type="submit" ${total <= 0 || pending ? 'disabled' : ''}>
        ${pending ? 'Đã gửi yêu cầu thanh toán' : 'Yêu cầu thanh toán'}
      </button>
      <p class="fine-print">Yêu cầu được đồng bộ tức thì tới quầy Thu ngân &amp; Quản lý theo thời gian thực.</p>
    </form>
  `;
}

function feedbackFormMarkup() {
  return `
    <form id="feedback-form" class="surface feedback-form">
      <p class="kicker">Đánh giá phiên bàn</p>
      <h2 tabindex="-1">Trải nghiệm của bạn thế nào?</h2>
      <fieldset class="rating">
        <legend>Chọn số sao</legend>
        ${[5, 4, 3, 2, 1].map(n => `
          <label>
            <input type="radio" name="rating" value="${n}" ${n === 5 ? 'checked' : ''} required>
            <span>★</span>
            <span class="sr-only">${n} sao</span>
          </label>
        `).join('')}
      </fieldset>
      <label>Chia sẻ thêm
        <textarea name="text" rows="3" minlength="8" required placeholder="Hương vị món ăn, tốc độ phục vụ, không gian... (tối thiểu 8 ký tự)"></textarea>
      </label>
      <button class="button primary full" type="submit">Gửi phản hồi tới Quản lý</button>
    </form>
  `;
}

function feedbackAreaMarkup(table, orders) {
  const feedbackList = getStore('feedback', appData.feedback || []);
  const tableFeedbacks = feedbackList.filter(f => String(f.table).toUpperCase() === String(table).toUpperCase());
  const canLeaveFeedback = paymentLocksOrdering(undefined, table) || orders.some(o => o.status !== 'cancelled');

  let existingMarkup = '';
  if (tableFeedbacks.length > 0) {
    existingMarkup = tableFeedbacks.slice(0, 2).map(item => {
      const stars = '★'.repeat(Math.max(1, Math.min(5, Number(item.rating) || 5)));
      const replyBlock = (item.status === 'replied' && item.reply) ? `
        <div style="margin-top:10px;padding:10px 12px;border-radius:8px;background:var(--blue-soft);border-left:3px solid var(--leaf);">
          <strong style="font-size:.76rem;color:var(--leaf);">💬 Phản hồi từ Quản lý nhà hàng:</strong>
          <p style="margin:4px 0 0;font-size:.8rem;color:var(--ink);">${escapeHtml(item.reply)}</p>
        </div>
      ` : `<small style="display:block;margin-top:6px;">Trạng thái: Đã chuyển tới Quản lý (${escapeHtml(item.theme || 'Đánh giá')})</small>`;

      return `
        <section class="surface feedback-thanks" style="margin-bottom:12px;text-align:left;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>Đánh giá Bàn ${escapeHtml(table)}</strong>
            <span style="color:var(--citrus);">${stars}</span>
          </div>
          <p style="margin:6px 0 0;color:var(--ink);">“${escapeHtml(item.text)}”</p>
          ${replyBlock}
        </section>
      `;
    }).join('');
  }

  if (!canLeaveFeedback) return existingMarkup;

  return `
    ${existingMarkup}
    <section class="surface feedback-invite">
      <div>
        <p class="kicker">Tiếng nói thực khách</p>
        <h2>${tableFeedbacks.length ? 'Gửi thêm góp ý cho nhà hàng' : 'Chia sẻ trải nghiệm của bạn'}</h2>
      </div>
      <button class="button quiet full" type="button" data-action="open-feedback">☆ Viết đánh giá trải nghiệm</button>
    </section>
  `;
}

function renderFeedbackArea() {
  const table = typeof getActiveTable === 'function' ? getActiveTable() : 'A01';
  const orders = getStore('orders', appData.orders || []).filter(o => o.table === table);
  const area = document.querySelector('#feedback-area');
  if (!area) return;
  area.innerHTML = feedbackAreaMarkup(table, orders);
}

function showFeedbackDialog() {
  document.querySelector('#feedback-dialog')?.remove();
  const popup = document.createElement('dialog');
  popup.id = 'feedback-dialog';
  popup.className = 'feedback-dialog';
  popup.setAttribute('aria-labelledby', 'feedback-dialog-title');
  popup.innerHTML = `
    <header class="dialog-head">
      <h2 id="feedback-dialog-title">Đánh giá phiên bàn</h2>
      <button class="icon-button" type="button" data-close="feedback-dialog" aria-label="Đóng form đánh giá">×</button>
    </header>
    ${feedbackFormMarkup()}
  `;
  document.body.append(popup);
  popup.addEventListener('close', () => popup.remove(), { once: true });
  popup.showModal();
  popup.querySelector('.feedback-form h2')?.focus();
}

function showPaymentRequestPopup() {
  document.querySelector('#payment-request-dialog')?.remove();
  const popup = document.createElement('dialog');
  popup.id = 'payment-request-dialog';
  popup.className = 'payment-request-dialog';
  popup.innerHTML = `
    <div class="payment-popup-content">
      <span class="payment-wait-icon" aria-hidden="true">⌛</span>
      <h2>Quý khách vui lòng chờ nhân viên hỗ trợ tới bàn</h2>
      <p>Yêu cầu thanh toán đã được hiển thị trực tiếp trên màn hình Thu ngân.</p>
      <button class="button primary" data-close="payment-request-dialog" data-action="reveal-feedback-invite">Đã hiểu</button>
    </div>
  `;
  document.body.append(popup);
  document.body.classList.add('payment-dialog-open');
  popup.addEventListener('close', () => {
    document.body.classList.remove('payment-dialog-open');
  }, { once: true });
  popup.showModal();
}

function statusPageV2() {
  const table = typeof getActiveTable === 'function' ? getActiveTable() : (sessionStorage.getItem('menumind:table') || 'A01');
  const tables = getStore('tables', appData.tables || []);
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const allOrders = getStore('orders', appData.orders || []);
  const orders = allOrders
    .filter(o => !table || o.table === table)
    .sort((a, b) => {
      const da = parseOrderDate(a.createdAt)?.date?.getTime() || 0;
      const db = parseOrderDate(b.createdAt)?.date?.getTime() || 0;
      return db - da;
    });

  const wrapper = document.querySelector('#status-content-wrapper');
  if (!wrapper) return;

  const tableOptions = tables
    .map(t => `<option value="${escapeHtml(t.id)}" ${t.id === table ? 'selected' : ''}>Bàn ${escapeHtml(t.id)} (${escapeHtml(statusLabel(t.status))})</option>`)
    .join('');
  const tableSwitcherHtml = `
    <label class="compact-field" style="font-size:.78rem;">
      Xem bàn
      <select id="status-table-switcher" aria-label="Chuyển bàn theo dõi" style="min-width:150px;padding:7px 10px;">
        ${tableOptions}
      </select>
    </label>
  `;

  if (!orders.length) {
    wrapper.innerHTML = `
      ${pageHead(
        `Bàn ${escapeHtml(table)}`,
        'Bàn này chưa có đơn gọi món',
        'Mọi lần gọi món trong phiên QR sẽ được cập nhật tiến độ thời gian thực tại đây.',
        `${tableSwitcherHtml}<a class="button primary" href="diner-menu.html">+ Mở thực đơn gọi món</a>`
      )}
      ${emptyState(
        `Chưa có đơn tại Bàn ${escapeHtml(table)}`,
        'Hãy chọn món từ thực đơn hoặc chuyển sang bàn đang có khách để theo dõi.',
        '<a class="button primary" href="diner-menu.html">Xem thực đơn</a>'
      )}
    `;
    return;
  }

  const openCount = orders.filter(o => ['new', 'cooking', 'ready'].includes(o.status)).length;
  const cards = orders.map((order, index) => {
    const steps = ['new', 'cooking', 'ready', 'served'];
    const current = steps.indexOf(order.status);
    const itemCount = (order.items || []).reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
    const parsedDate = parseOrderDate(order.createdAt);
    const createdLabel = parsedDate
      ? parsedDate.date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      : order.createdAt;
    const liveWait = getOrderWait(order);
    const orderTotal = calculateOrderTotal(order);
    const canCancel = order.status === 'new' && !paymentLocksOrdering(undefined, table);

    return `
      <article class="surface session-order-card">
        <header>
          <div>
            <p class="kicker">Lần gọi món ${orders.length - index}${order.priority ? ' · ⚡ Ưu tiên' : ''}</p>
            <h2>${escapeHtml(order.id)}</h2>
            <small>Gửi lúc ${escapeHtml(createdLabel)} · ${itemCount} món · Chờ ${liveWait} phút</small>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            ${badge(order.status)}
            ${canCancel ? `<button type="button" class="button small danger" data-cancel-order="${escapeHtml(order.id)}">Hủy đơn</button>` : ''}
          </div>
        </header>
        <div class="mini-order-progress" aria-label="Tiến độ đơn ${escapeHtml(order.id)}">
          ${steps.map((step, i) => `
            <span class="${order.status === 'cancelled' ? 'cancelled' : i < current ? 'done' : i === current ? 'current' : ''}">
              ${i < current ? '✓' : i + 1}
              <small>${['Đã nhận', 'Đang nấu', 'Chờ phục vụ', 'Đã phục vụ'][i]}</small>
            </span>
          `).join('')}
        </div>
        <div class="order-items">
          ${(order.items || []).map(x => {
            const m = menuItems.find(i => i.id === x.menuId);
            const unitPrice = Number(x.unitPrice || m?.price || 0);
            const doneBadge = x.done ? ' <small style="color:var(--leaf);font-weight:700;">(✓ Đã chế biến)</small>' : '';
            return `
              <div class="order-line">
                <span>${x.qty} × ${escapeHtml(m?.name || x.menuId)}${doneBadge}${x.note ? ` <small>— ${escapeHtml(x.note)}</small>` : ''}</span>
                <strong>${money(x.qty * unitPrice)}</strong>
              </div>
            `;
          }).join('')}
          <div class="order-line" style="border-bottom:0;padding-top:12px;">
            <span><strong>Tổng đơn (gồm 5% phí phục vụ)</strong></span>
            <strong>${money(orderTotal)}</strong>
          </div>
        </div>
        ${order.note ? `<p class="fine-print" style="text-align:left;">Ghi chú: ${escapeHtml(order.note)}</p>` : ''}
      </article>
    `;
  }).join('');

  const locked = paymentLocksOrdering(undefined, table);
  const addOrderAction = locked
    ? `<span class="button primary is-disabled" aria-disabled="true">Đã khóa gọi món</span>`
    : `<a class="button primary" href="diner-menu.html">+ Gọi thêm món</a>`;

  wrapper.innerHTML = `
    ${pageHead(
      `Bàn ${escapeHtml(table)} · Đồng bộ thời gian thực`,
      'Theo dõi tất cả lần gọi món',
      `${orders.length} đơn thuộc phiên Bàn ${escapeHtml(table)}. Trạng thái tự động cập nhật khi Bếp và Thu ngân thao tác.`,
      `<div class="head-actions">${tableSwitcherHtml}${addOrderAction}</div>`
    )}
    <section class="metric-strip">
      <div><span>Tổng lần gọi</span><strong>${orders.length}</strong></div>
      <div><span>Đơn đang xử lý</span><strong>${openCount}</strong></div>
      <div><span>Đã phục vụ</span><strong>${orders.filter(o => o.status === 'served').length}</strong></div>
      <div><span>Tổng số món</span><strong>${orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.items || []).reduce((n, x) => n + Number(x.qty || 1), 0), 0)}</strong></div>
    </section>
    <div class="content-grid wide-right">
      <section class="session-order-list">${cards}</section>
      <aside class="checkout-sidebar">
        ${paymentPanel(orders, table)}
        <div id="feedback-area" aria-live="polite">${feedbackAreaMarkup(table, orders)}</div>
      </aside>
    </div>
  `;
}

document.addEventListener('click', async e => {
  const b = e.target.closest('button, a');
  if (!b) return;
  const action = b.dataset.action;

  if (b.dataset.cancelOrder) {
    const orderId = b.dataset.cancelOrder;
    const orders = getStore('orders', appData.orders || []);
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    if (order.status !== 'new') {
      toast('Đơn đã được bếp chế biến nên không thể tự hủy', 'error');
      return;
    }
    if (!window.confirm(`Bạn có chắc muốn hủy đơn ${orderId} không?`)) return;
    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    setStore('orders', orders);
    statusPageV2();
    toast(`Đã hủy đơn ${orderId}`, 'info');
    return;
  }

  if (action === 'start-new-session') {
    const table = typeof getActiveTable === 'function' ? getActiveTable() : 'A01';
    await createQrSession(table);
    setActiveTable(table);
    toast(`Đã mở lượt khách mới cho Bàn ${table}`);
    statusPageV2();
    return;
  }

  if (action === 'reveal-feedback-invite') {
    renderFeedbackArea();
  }
  if (action === 'open-feedback') {
    showFeedbackDialog();
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'status-table-switcher') {
    const newTable = e.target.value;
    setActiveTable(newTable);
    statusPageV2();
    toast(`Đang xem tiến độ Bàn ${newTable}`, 'info');
  }
});

document.addEventListener('submit', async e => {
  const f = e.target;
  const formId = f.id;
  const table = typeof getActiveTable === 'function' ? getActiveTable() : 'A01';

  if (formId === 'payment-form') {
    e.preventDefault();
    const button = f.querySelector('button[type="submit"]');
    const method = new FormData(f).get('method');
    if (button) {
      button.disabled = true;
      button.textContent = 'Đang gửi yêu cầu...';
    }
    try {
      const payment = await requestPayment(method, table);
      setStore('payment', payment, true);
      statusPageV2();
      showPaymentRequestPopup();
      toast(`Đã gửi yêu cầu thanh toán Bàn ${table} tới Thu ngân`);
    } catch (error) {
      if (button) {
        button.disabled = false;
        button.textContent = 'Yêu cầu thanh toán';
      }
      toast(`Không thể gửi yêu cầu: ${error.message}`, 'error');
    }
  }

  if (formId === 'feedback-form') {
    e.preventDefault();
    const fd = new FormData(f);
    const rating = Number(fd.get('rating'));
    const message = String(fd.get('text') || '').trim();
    const button = f.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Đang gửi phản hồi...';
    }
    try {
      await submitQrFeedback(rating, message, table);
      f.closest('dialog')?.close();
      renderFeedbackArea();
      toast('Cảm ơn bạn đã gửi đánh giá! Quản lý nhà hàng đã nhận được phản hồi.');
    } catch (error) {
      if (button) {
        button.disabled = false;
        button.textContent = 'Gửi phản hồi tới Quản lý';
      }
      toast(`Không thể gửi phản hồi: ${error.message}`, 'error');
    }
  }
});

bootPage(statusPageV2);
