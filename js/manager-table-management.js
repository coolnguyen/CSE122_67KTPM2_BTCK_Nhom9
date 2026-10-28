// ==========================================================================
// js/manager-table-management.js - Quản lý Sơ đồ bàn & Phiên QR thời gian thực (S10)
// ==========================================================================

function adminTablesPage() {
  const tables = getStore('tables', appData.tables || []);
  const totalEl = document.querySelector('#tables-total-count');
  const availEl = document.querySelector('#tables-available-count');
  const occEl = document.querySelector('#tables-occupied-count');
  const cleanEl = document.querySelector('#tables-cleaning-count');
  const grid = document.querySelector('#admin-table-grid');

  if (totalEl) totalEl.textContent = tables.length;
  if (availEl) availEl.textContent = tables.filter(t => t.status === 'available').length;
  if (occEl) occEl.textContent = tables.filter(t => t.status === 'occupied').length;
  if (cleanEl) cleanEl.textContent = tables.filter(t => t.status === 'cleaning').length;
  if (grid) grid.innerHTML = tableGrid(tables);
}

function tableGrid(tables) {
  const orders = getStore('orders', appData.orders || []);
  const payments = getStore('payments', appData.payments || []);

  return tables.map(t => {
    const activeOrders = orders.filter(o => o.table === t.id && ['new', 'cooking', 'ready'].includes(o.status));
    const totalTableOrders = orders.filter(o => o.table === t.id && o.status !== 'cancelled');
    const pendingPayment = payments.find(p => p.table_code === t.id && p.status === 'pending');

    let activityLine = `${escapeHtml(t.zone)} · ${t.seats} chỗ`;
    if (pendingPayment) {
      activityLine += ` · 💳 Chờ thu ${money(pendingPayment.amount)}`;
    } else if (activeOrders.length > 0) {
      activityLine += ` · 🍳 ${activeOrders.length} đơn đang chế biến`;
    } else if (totalTableOrders.length > 0 && t.status === 'occupied') {
      activityLine += ` · ✓ Đã phục vụ ${totalTableOrders.length} đơn`;
    }

    return `
      <article class="admin-table ${escapeHtml(t.status)}">
        <header>
          <strong>${escapeHtml(t.id)}</strong>
          ${badge(pendingPayment ? 'pending' : t.status)}
        </header>
        <p>${activityLine}</p>
        <label>Trạng thái
          <select data-table-status="${escapeHtml(t.id)}">
            ${['available', 'occupied', 'reserved', 'cleaning'].map(s => `<option value="${s}" ${t.status === s ? 'selected' : ''}>${statusLabel(s)}</option>`).join('')}
          </select>
        </label>
        <div class="table-session-actions">
          ${t.status === 'cleaning'
            ? `<button type="button" class="button small primary" data-finish-clean="${escapeHtml(t.id)}">✓ Đã dọn xong</button>`
            : `<button type="button" class="button small primary" data-create-qr="${escapeHtml(t.id)}">Cấp QR mới</button>`
          }
          <button type="button" class="button small quiet" data-close-qr="${escapeHtml(t.id)}" ${t.status === 'available' ? 'disabled' : ''}>Kết thúc lượt</button>
        </div>
      </article>
    `;
  }).join('');
}

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.finishClean) {
    const tableId = b.dataset.finishClean;
    const tables = getStore('tables', appData.tables || []);
    const target = tables.find(x => x.id === tableId);
    if (target) {
      target.status = 'available';
      setStore('tables', tables);
      adminTablesPage();
      toast(`Bàn ${tableId} đã dọn xong và sẵn sàng đón khách mới!`);
    }
    return;
  }

  if (b.dataset.createQr) {
    const tableId = b.dataset.createQr;
    b.disabled = true;
    b.textContent = 'Đang tạo...';
    if (typeof createQrSession === 'function') {
      createQrSession(tableId)
        .then(qr => {
          adminTablesPage();
          showQrDialog(qr.table_code, qr.token, qr.expires_at);
          toast(`Đã cấp phiên QR mới cho Bàn ${tableId}`);
        })
        .catch(error => toast(error.message || 'Không thể tạo QR', 'error'))
        .finally(() => {
          b.disabled = false;
          b.textContent = 'Cấp QR mới';
        });
    }
  }

  if (b.dataset.closeQr) {
    const tableId = b.dataset.closeQr;
    if (!window.confirm(`Kết thúc lượt dùng Bàn ${tableId} và chuyển sang trạng thái Đang dọn?`)) return;
    b.disabled = true;
    if (typeof closeQrSession === 'function') {
      closeQrSession(tableId)
        .then(() => {
          adminTablesPage();
          toast(`Đã kết thúc lượt dùng Bàn ${tableId} → Chuyển sang Đang dọn`);
        })
        .catch(error => {
          b.disabled = false;
          toast(error.message || 'Không thể đóng phiên', 'error');
        });
    }
  }

  if (b.dataset.copyQr !== undefined) {
    const input = document.querySelector('#qr-order-url');
    if (input) {
      navigator.clipboard?.writeText(input.value || '')
        .then(() => toast('Đã chép liên kết QR vào bộ nhớ tạm'))
        .catch(() => {
          input.select();
          toast('Đã chọn liên kết QR để sao chép');
        });
    }
  }
});

document.addEventListener('change', e => {
  if (e.target.dataset.tableStatus) {
    const tables = getStore('tables', appData.tables || []);
    const t = tables.find(x => x.id === e.target.dataset.tableStatus);
    if (!t) return;
    t.status = e.target.value;
    if (t.status === 'occupied' && typeof ensureTableSession === 'function') {
      ensureTableSession(t.id, false);
    }
    setStore('tables', tables);
    adminTablesPage();
    toast(`Đã cập nhật trạng thái Bàn ${t.id} → ${statusLabel(t.status)}`);
    if (typeof remoteWrite === 'function' && typeof remoteEnabled !== 'undefined' && remoteEnabled) {
      remoteWrite('tables', 'PATCH', { status: t.status }, `?code=eq.${encodeURIComponent(t.id)}`, getAuthSession()?.accessToken).catch(console.warn);
    }
  }
});

document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.id !== 'add-table-form') return;
  e.preventDefault();
  if (!f.reportValidity()) return;

  const fd = new FormData(f);
  const tables = getStore('tables', appData.tables || []);
  const id = String(fd.get('id')).trim().toUpperCase();
  const button = f.querySelector('button[type="submit"]');

  if (tables.some(t => t.id === id)) {
    toast(`Mã bàn ${id} đã tồn tại trong sơ đồ`, 'error');
    return;
  }
  const table = { id, zone: fd.get('zone'), seats: +fd.get('seats'), status: 'available' };
  if (button) {
    button.disabled = true;
    button.textContent = 'Đang tạo...';
  }

  try {
    if (typeof createTableRemote === 'function') await createTableRemote(table);
    tables.push(table);
    appData.tables = tables;
    setStore('tables', tables);
    document.querySelector('#table-dialog')?.close();
    adminTablesPage();
    f.reset();
    toast(`Đã tạo bàn ${id} (${table.zone} · ${table.seats} chỗ)`);
  } catch (error) {
    console.warn(error);
    toast(`Không thể tạo bàn: ${error.message}`, 'error');
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = 'Tạo bàn';
    }
  }
});

bootPage(adminTablesPage);
