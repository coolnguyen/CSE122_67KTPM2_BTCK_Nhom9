// ==========================================================================
// js/kitchen-wait-time-alerts.js - Cảnh báo đơn trễ & AI-2 Kitchen Load Predictor (S09)
// ==========================================================================

let thresholdInitialized = false;

function kitchenAlertsPage() {
  const allOrders = getStore('orders', appData.orders || []);
  const activeOrders = allOrders.filter(o => ['new', 'cooking', 'ready', 'cancel_requested'].includes(o.status));
  const thresholdSelect = document.querySelector('#alert-threshold');

  if (thresholdSelect && !thresholdInitialized) {
    const defaultThreshold = typeof getAlertThreshold === 'function' ? getAlertThreshold() : 15;
    if (![...thresholdSelect.options].some(opt => Number(opt.value) === defaultThreshold)) {
      const opt = document.createElement('option');
      opt.value = String(defaultThreshold);
      opt.textContent = `${defaultThreshold} phút (Cài đặt)`;
      thresholdSelect.appendChild(opt);
    }
    thresholdSelect.value = String(defaultThreshold);
    thresholdInitialized = true;
  }

  const threshold = +(thresholdSelect?.value || (typeof getAlertThreshold === 'function' ? getAlertThreshold() : 15));
  const lateOrders = activeOrders.filter(o => getOrderWait(o) >= threshold);

  const title = document.querySelector('#alert-summary-title');
  const list = document.querySelector('#alert-list');
  if (title) title.textContent = `${lateOrders.length} đơn vượt ngưỡng (${threshold} phút)`;
  if (list) list.innerHTML = renderAlerts(activeOrders, threshold);

  // Tự động cập nhật số đơn và nhân sự thực tế vào form AI-2 nếu người dùng chưa sửa
  const loadForm = document.querySelector('#load-form');
  if (loadForm && !loadForm.dataset.userEdited) {
    const ordersInput = loadForm.querySelector('input[name="orders"]');
    const staffInput = loadForm.querySelector('input[name="staff"]');
    const activeKitchenStaff = getStore('staff', appData.staff || []).filter(s => s.role === 'kitchen' && s.status === 'active').length || 2;
    if (ordersInput) ordersInput.value = Math.max(1, activeOrders.length);
    if (staffInput) staffInput.value = Math.max(1, activeKitchenStaff);
  }
}

function renderAlerts(orders, threshold) {
  const list = orders
    .map(o => ({ ...o, liveWait: getOrderWait(o) }))
    .filter(o => o.liveWait >= threshold)
    .sort((a, b) => b.liveWait - a.liveWait);

  return list.length
    ? list.map(o => `
        <article class="alert-row">
          <div class="alert-time">
            <strong>${o.liveWait}</strong>
            <span>phút</span>
          </div>
          <div>
            <h3><a href="kitchen-order-detail.html?id=${encodeURIComponent(o.id)}">Bàn ${escapeHtml(o.table)} · ${escapeHtml(o.id)}</a></h3>
            <p>${(o.items || []).reduce((s, x) => s + Number(x.qty || 1), 0)} phần món · ${escapeHtml(o.note || 'Không có ghi chú')}</p>
          </div>
          ${badge(o.status)}
          <button type="button" class="button small ${o.priority ? 'quiet' : 'primary'}" data-priority-order="${escapeHtml(o.id)}">
            ${o.priority ? '⚡ Đã ưu tiên' : '⚡ Ưu tiên ngay'}
          </button>
        </article>
      `).join('')
    : emptyState('Không có đơn trễ', `Tất cả đơn đang chế biến đều nằm dưới ngưỡng ${threshold} phút.`);
}

function runLoadAI(form) {
  const fd = new FormData(form);
  const n = Math.max(1, +fd.get('orders') || 1);
  const s = Math.max(1, +fd.get('staff') || 1);
  const el = document.querySelector('#load-result');
  if (!el) return;

  const activeOrders = getStore('orders', appData.orders || []).filter(o => ['new', 'cooking', 'ready', 'cancel_requested'].includes(o.status));
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const complexDishesCount = activeOrders.reduce((acc, o) => {
    const hasLongDish = (o.items || []).some(x => {
      const m = menuItems.find(i => i.id === x.menuId);
      return (m?.time || 15) >= 16;
    });
    return acc + (hasLongDish ? 1 : 0);
  }, 0);

  if (n / s > 8) {
    el.innerHTML = `
      <div class="ai-warning" role="alert">
        <p class="confidence">Độ tin cậy: <strong>40%</strong> (Quá tải cao)</p>
        <strong>AI cảnh báo vượt ngưỡng an toàn bếp</strong>
        <p>Tỷ lệ tải hiện tại là <strong>${(n / s).toFixed(1)} đơn/đầu bếp</strong> (vượt ngưỡng tối đa 8 đơn/người). Khuyến nghị điều động thêm nhân sự ca phụ hoặc tạm khóa nhận món phức tạp.</p>
      </div>
    `;
    return;
  }

  el.innerHTML = `<div class="ai-loading"><span></span><p>Đang phân tích nhịp bếp &amp; thời gian chuẩn bị món...</p></div>`;
  setTimeout(() => {
    const mins = Math.round(7 + (n / s) * 3.5 + complexDishesCount * 1.2);
    const loadPct = Math.min(98, Math.round((n / (s * 6)) * 100));
    const confidence = Math.max(72, Math.min(96, 95 - Math.round(n / s * 2)));

    el.innerHTML = `
      <article class="ai-answer">
        <p class="confidence">Độ tin cậy <strong>${confidence}%</strong> · Tải bếp ${loadPct}%</p>
        <h3>Thời gian chờ dự kiến: ${mins}–${mins + 4} phút</h3>
        <p id="ai-load-copy">Ưu tiên đẩy nhanh các đơn vượt ngưỡng chờ, mở thêm quầy sơ chế nhanh và gom nhóm các món trùng nguyên liệu trong 20 phút tới.</p>
        <details>
          <summary>Vì sao AI đưa ra dự báo này?</summary>
          <ul>
            <li>Tỷ lệ tải: ${n} đơn / ${s} nhân sự bếp (${(n / s).toFixed(1)} đơn/người)</li>
            <li>Công suất trạm bếp ước tính: ${loadPct}%</li>
            <li>Phát hiện ${complexDishesCount} đơn hiện tại có món chế biến lâu (≥ 16 phút)</li>
          </ul>
        </details>
        <div class="ai-actions">
          <button type="button" class="button small primary" data-action="apply-load-plan">Áp dụng &amp; Ưu tiên đơn trễ</button>
          <button type="button" class="button small quiet" data-action="edit-ai">Sửa kế hoạch</button>
          <button type="button" class="link-button" data-action="rerun-load">Tạo lại</button>
          <button type="button" class="link-button danger-text" data-action="reject-ai">Từ chối</button>
        </div>
      </article>
    `;
  }, 450);
}

document.addEventListener('input', e => {
  if (e.target.closest('#load-form')) {
    e.target.closest('#load-form').dataset.userEdited = 'true';
  }
});

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.priorityOrder) {
    const orders = getStore('orders', appData.orders || []);
    const o = orders.find(x => x.id === b.dataset.priorityOrder);
    if (!o) return;
    o.priority = !o.priority;
    o.updatedAt = new Date().toISOString();
    if (typeof updateOrderRemote === 'function') updateOrderRemote(o).catch(console.warn);
    setStore('orders', orders);
    toast(o.priority ? `Đã ưu tiên đơn ${o.id} (Bàn ${o.table})` : `Đã bỏ ưu tiên đơn ${o.id}`);
    kitchenAlertsPage();
  }

  const action = b.dataset.action;
  if (action === 'apply-load-plan') {
    const threshold = +(document.querySelector('#alert-threshold')?.value || 15);
    const orders = getStore('orders', appData.orders || []);
    let prioritizedCount = 0;
    orders.forEach(o => {
      if (['new', 'cooking', 'ready'].includes(o.status) && getOrderWait(o) >= threshold && !o.priority) {
        o.priority = true;
        prioritizedCount++;
      }
    });
    if (prioritizedCount > 0) setStore('orders', orders);
    setStore('aiDecision', {
      type: action,
      content: document.querySelector('#ai-load-copy')?.innerText || '',
      savedAt: new Date().toISOString()
    });
    kitchenAlertsPage();
    toast(`Đã áp dụng kế hoạch AI và tự động gắn cờ ưu tiên ${prioritizedCount} đơn trễ!`);
  }
  if (action === 'edit-ai') {
    const p = b.closest('.ai-answer')?.querySelector('p[id], textarea');
    if (p) {
      p.contentEditable = 'true';
      p.focus();
      toast('Bạn có thể sửa nội dung kế hoạch điều phối trước khi áp dụng', 'info');
    }
  }
  if (action === 'rerun-load') {
    document.querySelector('#load-form')?.requestSubmit();
  }
  if (action === 'reject-ai') {
    const res = b.closest('.ai-result');
    if (res) res.innerHTML = emptyState('Đã từ chối gợi ý', 'Bạn có thể điều chỉnh thông số đầu vào và thử lại.');
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'alert-threshold') {
    kitchenAlertsPage();
  }
});

document.addEventListener('submit', e => {
  if (e.target.id === 'load-form') {
    e.preventDefault();
    runLoadAI(e.target);
  }
});

bootPage(kitchenAlertsPage);
