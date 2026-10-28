/**
 * ============================================================================
 * MENUMIND - MODULE QUẢN LÝ THỰC ĐƠN & BẢNG GIÁ THỜI GIAN THỰC (S12)
 * Nguyễn Hoàng Hải (SV3 - Leader)
 * ============================================================================
 */

function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function getMenuItems() {
  return getStore('menuItems', appData.menuItems || []);
}

function renderMenuTableRows(items) {
  return items.map(item => `
    <tr>
      <td data-label="Món">
        <div class="table-title">
          <span class="tiny-food" data-dish-id="${escapeHtml(item.id)}">
            ${dishPicture(item, 'tiny-food-photo')}
          </span>
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <small>${item.time || 15} phút · ★ ${item.rating || '5.0'}${item.spicy ? ' · ' + '🌶️'.repeat(item.spicy) : ''}</small>
          </div>
        </div>
      </td>
      <td data-label="Danh mục">${escapeHtml(item.category)}</td>
      <td data-label="Giá"><strong>${money(item.price)}</strong></td>
      <td data-label="Lượt gọi">${item.orders || 0}</td>
      <td data-label="Trạng thái">${badge(item.available ? 'active' : 'inactive')}</td>
      <td data-label="Thao tác">
        <div style="display:inline-flex;gap:10px;align-items:center;">
          <button type="button" class="link-button" data-edit-dish="${escapeHtml(item.id)}">Sửa</button>
          <button 
            type="button"
            class="link-button ${item.available ? 'danger-text' : ''}" 
            data-toggle-dish="${escapeHtml(item.id)}">
            ${item.available ? 'Tạm ẩn' : 'Mở bán'}
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function applyMenuFilters() {
  const query = (document.querySelector('#manager-menu-search')?.value || '').trim().toLowerCase();
  const categoryFilter = document.querySelector('#manager-menu-category-filter')?.value || 'all';
  const statusFilter = document.querySelector('#manager-menu-status-filter')?.value || 'all';

  const allItems = getMenuItems();

  const filtered = allItems.filter(item => {
    const name = String(item.name || '').toLowerCase();
    const category = String(item.category || '').toLowerCase();
    const matchesQuery = !query || name.includes(query) || category.includes(query);
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'available' ? item.available : !item.available);
    return matchesQuery && matchesCategory && matchesStatus;
  });

  const tableEl = document.querySelector('#manager-menu-table');
  const countBadge = document.querySelector('#menu-count-badge');

  if (countBadge) {
    countBadge.textContent = `Hiển thị ${filtered.length}/${allItems.length} món ăn (${allItems.filter(i => i.available).length} đang mở bán)`;
  }

  if (!tableEl) return;

  if (filtered.length === 0) {
    tableEl.innerHTML = `
      <div class="table-empty-state">
        <span class="empty-icon" aria-hidden="true">🔍</span>
        <h3>Không tìm thấy món ăn phù hợp</h3>
        <p>Không có món nào khớp với từ khóa tìm kiếm và bộ lọc hiện tại.</p>
        <button type="button" class="button quiet" id="btn-reset-menu-filters">Xóa bộ lọc</button>
      </div>
    `;
  } else {
    tableEl.innerHTML = `
      <table>
        <thead>
          <tr>
            <th scope="col">Món</th>
            <th scope="col">Danh mục</th>
            <th scope="col">Giá</th>
            <th scope="col">Lượt gọi</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${renderMenuTableRows(filtered)}
        </tbody>
      </table>
    `;
  }
}

function managerMenuPage() {
  applyMenuFilters();
}

function openDishModal(dish = null) {
  const dialog = document.querySelector('#dish-dialog');
  const form = document.querySelector('#add-dish-form');
  const title = document.querySelector('#dialog-title');
  const editIdInput = document.querySelector('#edit-dish-id');
  const nameInput = document.querySelector('#dish-name');
  const catInput = document.querySelector('#dish-category');
  const priceInput = document.querySelector('#dish-price');
  const timeInput = document.querySelector('#dish-prep-time');
  const spicyInput = document.querySelector('#dish-spicy-level');
  const descInput = document.querySelector('#dish-description');
  const preview = document.querySelector('#dish-image-preview');

  if (!dialog || !form) return;
  form.reset();
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('active');
  });
  if (preview) preview.hidden = true;

  if (dish) {
    if (title) title.textContent = `Chỉnh sửa món: ${dish.name}`;
    if (editIdInput) editIdInput.value = dish.id;
    if (nameInput) nameInput.value = dish.name || '';
    if (catInput) catInput.value = dish.category || 'Món chính';
    if (priceInput) priceInput.value = dish.price || 10000;
    if (timeInput) timeInput.value = dish.time || 15;
    if (spicyInput) spicyInput.value = String(dish.spicy || 0);
    if (descInput) descInput.value = dish.description || '';
  } else {
    if (title) title.textContent = 'Thêm món mới';
    if (editIdInput) editIdInput.value = '';
  }

  dialog.showModal();
}

const debouncedMenuSearch = debounce(() => {
  applyMenuFilters();
}, 300);

document.addEventListener('input', e => {
  if (e.target.id === 'manager-menu-search') {
    debouncedMenuSearch();
  }
  if (e.target.id === 'dish-name') {
    const err = document.querySelector('#err-dish-name');
    if (err) { err.textContent = ''; err.classList.remove('active'); }
  }
  if (e.target.id === 'dish-price') {
    const err = document.querySelector('#err-dish-price');
    if (err) { err.textContent = ''; err.classList.remove('active'); }
  }
  if (e.target.id === 'dish-description') {
    const err = document.querySelector('#err-dish-desc');
    if (err) { err.textContent = ''; err.classList.remove('active'); }
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'manager-menu-category-filter' || e.target.id === 'manager-menu-status-filter') {
    applyMenuFilters();
  }

  if (e.target.id === 'dish-image') {
    const preview = document.querySelector('#dish-image-preview');
    const image = preview?.querySelector('img');
    const file = e.target.files?.[0];
    if (!preview || !image || !file) {
      if (preview) preview.hidden = true;
      return;
    }
    try {
      if (image.dataset.objectUrl) URL.revokeObjectURL(image.dataset.objectUrl);
      const objectUrl = URL.createObjectURL(file);
      image.dataset.objectUrl = objectUrl;
      image.src = objectUrl;
      const caption = preview.querySelector('figcaption');
      if (caption) caption.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
      preview.hidden = false;
    } catch {
      e.target.value = '';
      preview.hidden = true;
    }
  }
});

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.id === 'btn-open-add-dish') {
    openDishModal(null);
    return;
  }

  if (b.dataset.editDish) {
    const items = getMenuItems();
    const item = items.find(x => x.id === b.dataset.editDish);
    if (item) openDishModal(item);
    return;
  }

  if (b.id === 'btn-reset-menu-filters') {
    const searchInput = document.querySelector('#manager-menu-search');
    const catSelect = document.querySelector('#manager-menu-category-filter');
    const statusSelect = document.querySelector('#manager-menu-status-filter');
    if (searchInput) searchInput.value = '';
    if (catSelect) catSelect.value = 'all';
    if (statusSelect) statusSelect.value = 'all';
    applyMenuFilters();
    toast('Đã đặt lại bộ lọc thực đơn về mặc định');
    return;
  }

  if (b.dataset.toggleDish) {
    const items = getMenuItems();
    const item = items.find(x => x.id === b.dataset.toggleDish);
    if (!item) return;

    item.available = !item.available;
    setStore('menuItems', items);
    appData.menuItems = items;
    applyMenuFilters();

    const actionText = item.available ? 'Mở bán lại' : 'Tạm ẩn';
    toast(`Đã ${actionText.toLowerCase()} món "${item.name}"`);

    if (typeof updateMenuRemote === 'function') {
      updateMenuRemote(item).catch(console.warn);
    }
  }
});

document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.id !== 'add-dish-form') return;
  e.preventDefault();

  const fd = new FormData(f);
  const editId = String(fd.get('editId') || '').trim();
  const name = String(fd.get('name') || '').trim();
  const category = String(fd.get('category') || 'Món chính');
  const price = parseInt(fd.get('price'), 10);
  const prepTime = Math.max(1, parseInt(fd.get('time'), 10) || 15);
  const spicyLevel = Math.max(0, parseInt(fd.get('spicy'), 10) || 0);
  const description = String(fd.get('description') || '').trim();
  const file = fd.get('image');

  const errName = document.querySelector('#err-dish-name');
  const errPrice = document.querySelector('#err-dish-price');
  const errDesc = document.querySelector('#err-dish-desc');

  let isValid = true;

  if (!name || name.length < 3) {
    if (errName) {
      errName.textContent = 'Tên món ăn phải có ít nhất 3 ký tự.';
      errName.classList.add('active');
    }
    isValid = false;
  }

  if (isNaN(price) || price < 10000) {
    if (errPrice) {
      errPrice.textContent = 'Giá bán phải tối thiểu 10.000₫.';
      errPrice.classList.add('active');
    }
    isValid = false;
  }

  if (!description || description.length < 10) {
    if (errDesc) {
      errDesc.textContent = 'Mô tả món ăn phải có ít nhất 10 ký tự.';
      errDesc.classList.add('active');
    }
    isValid = false;
  }

  if (!isValid) return;

  const submitButton = document.querySelector('#btn-save-dish');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Đang lưu món...';
  }

  try {
    const items = getMenuItems();
    const id = editId || uid('m');
    const existingItem = editId ? items.find(x => x.id === editId) : null;

    let imagePath = existingItem?.image || 'assets/images/menu/m01.jpg';
    if (file && file.size > 0 && typeof uploadMenuImage === 'function') {
      const uploaded = await uploadMenuImage(file, id).catch(() => null);
      if (uploaded?.publicUrl) imagePath = uploaded.publicUrl;
      else if (typeof uploaded === 'string' && uploaded) imagePath = uploaded;
    }

    if (existingItem) {
      existingItem.name = name;
      existingItem.category = category;
      existingItem.price = price;
      existingItem.time = prepTime;
      existingItem.spicy = spicyLevel;
      existingItem.vegetarian = category === 'Món chay' || existingItem.vegetarian;
      existingItem.image = imagePath;
      existingItem.description = description;
      if (typeof updateMenuRemote === 'function') {
        updateMenuRemote(existingItem).catch(console.warn);
      }
    } else {
      const newDish = {
        id,
        name,
        category,
        price,
        time: prepTime,
        spicy: spicyLevel,
        vegetarian: category === 'Món chay',
        available: true,
        rating: 5.0,
        orders: 0,
        emoji: '🍽️',
        image: imagePath,
        description,
        tags: ['mới', category.toLowerCase()]
      };
      items.unshift(newDish);
    }

    setStore('menuItems', items);
    appData.menuItems = items;

    document.querySelector('#dish-dialog')?.close();
    f.reset();
    const preview = document.querySelector('#dish-image-preview');
    if (preview) preview.hidden = true;

    applyMenuFilters();
    toast(existingItem ? `Đã cập nhật món "${name}"` : `Đã thêm món "${name}" vào thực đơn`);
  } catch (error) {
    toast(`Không thể lưu món: ${error.message}`, 'error');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Lưu món';
    }
  }
});

bootPage(managerMenuPage);
