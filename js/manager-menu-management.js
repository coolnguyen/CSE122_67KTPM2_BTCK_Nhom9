function managerMenuPage() {
  const items = getStore('menuItems', appData.menuItems);
  const tableEl = document.querySelector('#manager-menu-table');
  if (tableEl) tableEl.innerHTML = menuTable(items);
}

function menuTable(items) {
  return `<table><thead><tr><th>Món</th><th>Danh mục</th><th>Giá</th><th>Lượt gọi</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${items.map(i => `<tr><td data-label="Món"><div class="table-title"><span class="tiny-food tone-${i.id.slice(-1)}" data-dish-id="${escapeHtml(i.id)}">${dishPicture(i, 'tiny-food-photo')}</span><div><strong>${escapeHtml(i.name)}</strong><small>${i.time} phút · ★ ${i.rating}</small></div></div></td><td data-label="Danh mục">${escapeHtml(i.category)}</td><td data-label="Giá"><strong>${money(i.price)}</strong></td><td data-label="Lượt gọi">${i.orders}</td><td data-label="Trạng thái">${badge(i.available ? 'active' : 'inactive')}</td><td data-label="Thao tác"><button class="link-button" data-toggle-dish="${escapeHtml(i.id)}">${i.available ? 'Tạm ẩn' : 'Mở bán'}</button></td></tr>`).join('')}</tbody></table>`;
}

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.toggleDish) {
    const items = getStore('menuItems', appData.menuItems);
    const i = items.find(x => x.id === b.dataset.toggleDish);
    if (!i) return;
    i.available = !i.available;
    setStore('menuItems', items);
    const tableEl = document.querySelector('#manager-menu-table');
    if (tableEl) tableEl.innerHTML = menuTable(items);
    toast('Đã cập nhật tình trạng bán');
    if (typeof updateMenuRemote === 'function') updateMenuRemote(i).catch(console.warn);
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'dish-image') {
    const preview = document.querySelector('#dish-image-preview');
    const image = preview?.querySelector('img');
    const file = e.target.files?.[0];
    if (!preview || !image || !file) {
      if (preview) preview.hidden = true;
      return;
    }
    try {
      if (typeof validateMenuImage === 'function') validateMenuImage(file);
      if (image.dataset.objectUrl) URL.revokeObjectURL(image.dataset.objectUrl);
      const objectUrl = URL.createObjectURL(file);
      image.dataset.objectUrl = objectUrl;
      image.src = objectUrl;
      const caption = preview.querySelector('figcaption');
      if (caption) caption.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
      preview.hidden = false;
    } catch (error) {
      e.target.value = '';
      preview.hidden = true;
      toast(error.message, 'error');
    }
  }

  if (e.target.id === 'manager-menu-filter') {
    const val = e.target.value;
    const items = getStore('menuItems', appData.menuItems);
    const filtered = val === 'all' ? items : items.filter(i => val === 'available' ? i.available : !i.available);
    const tableEl = document.querySelector('#manager-menu-table');
    if (tableEl) tableEl.innerHTML = menuTable(filtered);
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'manager-menu-search') {
    const q = e.target.value.trim().toLowerCase();
    const items = getStore('menuItems', appData.menuItems);
    const filtered = items.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    const tableEl = document.querySelector('#manager-menu-table');
    if (tableEl) tableEl.innerHTML = menuTable(filtered);
  }
});

document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.id !== 'add-dish-form') return;
  e.preventDefault();
  if (!f.reportValidity()) return;

  const fd = new FormData(f);
  const file = fd.get('image');
  const items = getStore('menuItems', appData.menuItems);
  const id = uid('m');
  const button = f.querySelector('button[type="submit"]');
  let uploaded = null;
  button.disabled = true;
  button.textContent = 'Đang tải ảnh...';

  try {
    if (typeof validateMenuImage === 'function') validateMenuImage(file);
    if (typeof uploadMenuImage === 'function') {
      uploaded = await uploadMenuImage(file, id);
    }
    button.textContent = 'Đang lưu món...';
    const newDishData = {
      id,
      name: String(fd.get('name')).trim(),
      category: fd.get('category'),
      price: +fd.get('price'),
      time: 15,
      spicy: 0,
      vegetarian: false,
      available: true,
      rating: 0,
      orders: 0,
      emoji: '🍽️',
      image: uploaded?.publicUrl || '',
      description: String(fd.get('description')).trim(),
      tags: ['món mới']
    };
    const item = typeof createMenuItemRemote === 'function' ? await createMenuItemRemote(newDishData) : newDishData;
    items.push(item);
    appData.menuItems = items;
    setStore('menuItems', items);
    document.querySelector('#dish-dialog')?.close();
    const tableEl = document.querySelector('#manager-menu-table');
    if (tableEl) tableEl.innerHTML = menuTable(items);
    const previewImage = document.querySelector('#dish-image-preview img');
    if (previewImage?.dataset.objectUrl) URL.revokeObjectURL(previewImage.dataset.objectUrl);
    f.reset();
    const preview = document.querySelector('#dish-image-preview');
    if (preview) preview.hidden = true;
    toast('Đã tải ảnh và tạo món mới trên Supabase');
  } catch (error) {
    if (uploaded?.objectName && typeof removeMenuImage === 'function') {
      await removeMenuImage(uploaded.objectName).catch(console.warn);
    }
    toast(`Không thể tạo món: ${error.message}`, 'error');
  } finally {
    button.disabled = false;
    button.textContent = 'Lưu món';
  }
});

bootPage(managerMenuPage);
