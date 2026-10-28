// ==========================================================================
// js/diner-dish-detail.js - Chi tiết món ăn & Tùy chỉnh khẩu phần theo bàn
// ==========================================================================

function estimateNutrition(item) {
  const cat = String(item.category || '');
  if (cat === 'Đồ uống') return { cal: '~140 kcal', protein: '2 g' };
  if (cat === 'Tráng miệng') return { cal: '~320 kcal', protein: '6 g' };
  if (cat === 'Khai vị') return { cal: '~240 kcal', protein: '9 g' };
  if (cat === 'Món chay') return { cal: '~360 kcal', protein: '16 g' };
  if (cat === 'Bữa sáng') return { cal: '~390 kcal', protein: '18 g' };
  return { cal: '~540 kcal', protein: '34 g' };
}

function dishDetailPage() {
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const id = new URLSearchParams(location.search).get('id') || 'm01';
  const i = menuItems.find(x => x.id === id) || menuItems[0];
  if (!i) return;

  const visual = document.querySelector('#detail-visual');
  const img = document.querySelector('#dish-img');
  const cat = document.querySelector('#dish-category');
  const time = document.querySelector('#dish-time');
  const rating = document.querySelector('#dish-rating');
  const tags = document.querySelector('#dish-tags');
  const name = document.querySelector('#dish-name');
  const desc = document.querySelector('#dish-desc');
  const calEl = document.querySelector('#dish-cal');
  const proteinEl = document.querySelector('#dish-protein');
  const spicy = document.querySelector('#dish-spicy');
  const price = document.querySelector('#dish-price');
  const menuIdInput = document.querySelector('#dish-menuId');
  const total = document.querySelector('#dish-total');
  const form = document.querySelector('#dish-form');
  const qtyInput = document.querySelector('#dish-qty');
  const submitBtn = form?.querySelector('button[type="submit"]');

  const nut = estimateNutrition(i);

  if (visual) visual.className = `detail-visual tone-${String(i.id).slice(-1)}`;
  if (img) {
    img.src = dishImage(i);
    img.alt = i.name;
  }
  if (cat) cat.textContent = i.category;
  if (time) time.textContent = `${i.time} phút chuẩn bị`;
  if (rating) rating.textContent = `★ ${i.rating} · ${i.orders || 0} lượt gọi`;
  if (tags) tags.textContent = (i.tags || []).join(' · ');
  if (name) name.textContent = i.name;
  if (desc) desc.textContent = i.description;
  if (calEl) calEl.textContent = nut.cal;
  if (proteinEl) proteinEl.textContent = nut.protein;
  if (spicy) spicy.textContent = '🌶️'.repeat(i.spicy || 0) || 'Không cay';
  if (price) price.textContent = money(i.price);
  if (menuIdInput) menuIdInput.value = i.id;

  const currentQty = Math.max(1, Number(qtyInput?.value || 1));
  if (total) total.textContent = money(i.price * currentQty);
  if (form) form.dataset.price = i.price;

  if (submitBtn) {
    if (!i.available) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Món tạm hết hàng';
    } else if (paymentLocksOrdering()) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Phiên bàn đã khóa gọi món';
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Thêm vào giỏ';
    }
  }
}

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.step) {
    const q = document.querySelector('#dish-qty');
    if (q) {
      q.value = Math.min(10, Math.max(1, +q.value + +b.dataset.step));
      q.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'dish-qty') {
    const form = document.querySelector('#dish-form');
    const totalEl = document.querySelector('#dish-total');
    if (form && totalEl) {
      totalEl.textContent = money(+form.dataset.price * Math.max(1, +e.target.value));
    }
  }
});

document.addEventListener('submit', e => {
  const f = e.target;
  if (f.id !== 'dish-form') return;
  e.preventDefault();
  const fd = new FormData(f);
  const menuId = String(fd.get('menuId') || '');
  const button = f.querySelector('button[type="submit"]');
  const menuItems = getStore('menuItems', appData.menuItems || []);

  if (!menuItems.some(item => item.id === menuId && item.available)) {
    toast('Món này hiện không thể thêm vào giỏ', 'error');
    return;
  }
  if (typeof addToCart === 'function') {
    if (!addToCart(menuId, +fd.get('qty'), String(fd.get('note') || ''))) return;
  }
  if (button) {
    button.disabled = true;
    button.textContent = 'Đã thêm vào giỏ ✓';
  }
  setTimeout(() => {
    location.href = 'diner-menu.html';
  }, 400);
});

bootPage(dishDetailPage);
