function updateCartCount() {
  const n = getStore('cart', []).reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = n);
}

function addToCart(id, qty = 1, note = '') {
  if (paymentLocksOrdering()) {
    toast(orderingLockMessage(), 'error');
    return false;
  }
  const cart = getStore('cart', []);
  const found = cart.find(i => i.menuId === id && i.note === note);
  if (found) {
    found.qty += qty;
  } else {
    cart.push({ menuId: id, qty, note });
  }
  setStore('cart', cart);
  updateCartCount();
  toast('Đã thêm món vào giỏ');
  return true;
}
