// ==========================================================================
// js/diner-cart.js - Quản lý Giỏ món theo từng Bàn ăn (Per-Table Isolation)
// Đảm bảo giỏ món giữa các bàn không bao giờ bị xung đột hay ghi đè lẫn nhau.
// ==========================================================================

function getTableCart(tableCode = (typeof getActiveTable === 'function' ? getActiveTable() : 'A01')) {
  const code = String(tableCode || 'A01').trim().toUpperCase();
  const carts = getStore('carts', null);
  if (carts && typeof carts === 'object' && Array.isArray(carts[code])) {
    return carts[code];
  }
  const legacyCart = getStore('cart', []);
  return Array.isArray(legacyCart) ? legacyCart : [];
}

function setTableCart(cartItems, tableCode = (typeof getActiveTable === 'function' ? getActiveTable() : 'A01')) {
  const code = String(tableCode || 'A01').trim().toUpperCase();
  const normalized = Array.isArray(cartItems) ? cartItems : [];
  const carts = getStore('carts', {}) || {};
  carts[code] = normalized;
  setStore('carts', carts);
  setStore('cart', normalized, true);
  updateCartCount();
}

function updateCartCount() {
  const dineIn = typeof getDineInTable === 'function' ? getDineInTable() : null;
  const cart = dineIn ? getTableCart(dineIn) : [];
  const count = (Array.isArray(cart) ? cart : []).reduce(
    (total, item) => total + Math.max(1, Number.parseInt(item?.qty, 10) || 1),
    0
  );

  document.querySelectorAll('#cart-count').forEach(element => {
    element.textContent = count;
  });
  return count;
}

function openTableSelectPrompt(pendingDish = null) {
  const dialog = document.querySelector('#table-select-dialog');
  if (dialog) {
    if (pendingDish) {
      dialog.dataset.pendingDish = JSON.stringify(pendingDish);
    } else {
      delete dialog.dataset.pendingDish;
    }
    dialog.showModal();
    return;
  }
  toast('Quý khách đang xem thực đơn tham khảo. Vui lòng quét mã QR tại bàn để gọi món hoặc đặt bàn trước nếu chưa đến quán!', 'info');
}

function addToCart(id, quantity = 1, note = '') {
  // Nếu là khách tham khảo trực tuyến chưa ngồi tại bàn
  if (typeof isDineIn === 'function' && !isDineIn()) {
    openTableSelectPrompt({ id, quantity, note });
    return false;
  }

  const tableCode = typeof getActiveTable === 'function' ? getActiveTable() : 'A01';
  if (paymentLocksOrdering(undefined, tableCode)) {
    toast(orderingLockMessage(undefined, tableCode), 'error');
    return false;
  }

  const tables = getStore('tables', appData.tables || []);
  const tableObj = tables.find(t => t.id === tableCode);
  if (tableObj && tableObj.status === 'cleaning') {
    toast(`Bàn ${tableCode} đang được nhân viên dọn dẹp. Vui lòng chọn bàn khác.`, 'error');
    return false;
  }

  const menuId = String(id || '');
  const qty = Math.min(10, Math.max(1, Number.parseInt(quantity, 10) || 1));
  const normalizedNote = String(note || '').trim();
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const menuItem = menuItems.find(item => String(item.id) === menuId && item.available);

  if (!menuItem) {
    toast('Món này hiện đã tạm hết hoặc ngừng phục vụ', 'error');
    return false;
  }

  const cart = getTableCart(tableCode);
  const existingItem = cart.find(item =>
    String(item.menuId ?? item.id ?? '') === menuId &&
    String(item.note || '').trim() === normalizedNote
  );

  if (existingItem) {
    existingItem.menuId = menuId;
    delete existingItem.id;
    existingItem.qty = Math.min(10, Math.max(1, Number.parseInt(existingItem.qty, 10) || 1) + qty);
  } else {
    cart.push({ menuId, qty, note: normalizedNote });
  }

  setTableCart(cart, tableCode);
  toast(`Đã thêm ${qty} × ${menuItem.name} vào giỏ Bàn ${tableCode}`);
  return true;
}

window.getTableCart = getTableCart;
window.setTableCart = setTableCart;
window.openTableSelectPrompt = openTableSelectPrompt;
window.addEventListener('pageshow', updateCartCount);
window.addEventListener('storage', event => {
  if (event.key === 'menumind:cart' || event.key === 'menumind:carts') updateCartCount();
});
