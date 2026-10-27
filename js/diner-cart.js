function updateCartCount() {
  const cart = getStore('cart', []);
  const count = Array.isArray(cart)
    ? cart.reduce((total, item) => total + Math.max(0, Number(item.qty) || 0), 0)
    : 0;
  const countEl = document.querySelector('#cart-count');

  if (countEl) countEl.textContent = count;
  return count;
}

function addToCart(menuId, quantity = 1, note = '') {
  if (paymentLocksOrdering()) {
    toast(orderingLockMessage(), 'error');
    return false;
  }

  const item = appData.menuItems.find(menuItem => menuItem.id === menuId && menuItem.available);
  if (!item) {
    toast('Món này hiện không thể thêm vào giỏ', 'error');
    return false;
  }

  const qty = Math.min(10, Math.max(1, Math.trunc(Number(quantity) || 1)));
  const normalizedNote = String(note || '').trim();
  const storedCart = getStore('cart', []);
  const cart = Array.isArray(storedCart) ? storedCart : [];
  const existingItem = cart.find(cartItem => cartItem.menuId === menuId && String(cartItem.note || '').trim() === normalizedNote);

  if (existingItem) {
    existingItem.qty = Math.min(10, Math.max(1, (Number(existingItem.qty) || 0) + qty));
  } else {
    cart.push({ menuId, qty, note: normalizedNote });
  }

  setStore('cart', cart);
  updateCartCount();
  toast(`Đã thêm ${item.name} vào giỏ`);
  return true;
}

window.addEventListener('pageshow', updateCartCount);
window.addEventListener('storage', event => {
  if (event.key === 'menumind:cart') updateCartCount();
});
