/**
 * MenuMind - Quản lý tài khoản nhân sự (TASK-15 / S15)
 * Nguyễn Hoàng Hải (SV3 - Leader)
 * Tuân thủ tiêu chuẩn: Debounce 300ms, Lọc đa tiêu chí, 4 Trạng thái giao diện, Form validation & A11y
 */

function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function staffDirectory() {
  const remoteStaff = getStore('staff', appData.staff || []);
  const currentStaff = getAuthSession()?.staff;
  const directory = Array.isArray(remoteStaff) ? [...remoteStaff] : [];
  if (currentStaff?.email && !directory.some(item => String(item.email).toLowerCase() === String(currentStaff.email).toLowerCase())) {
    directory.unshift({ ...currentStaff, shift: currentStaff.shift || 'Chưa thiết lập', currentSession: true });
  }
  return directory;
}

function roleDisplayName(role) {
  const roles = {
    kitchen: 'Nhân viên bếp',
    manager: 'Quản lý',
    admin: 'Quản trị viên',
    service: 'Phục vụ'
  };
  return roles[role] || role || 'Chưa gán';
}

function renderUserTableRows(staffList) {
  const currentEmail = String(getAuthSession()?.staff?.email || '').toLowerCase();

  return staffList.map(user => {
    const name = String(user.name || user.email || 'Tài khoản');
    const email = String(user.email || 'Chưa có email');
    const isCurrent = email.toLowerCase() === currentEmail;
    const initial = escapeHtml((name.split(' ').slice(-1)[0] || '?')[0].toUpperCase());

    return `
      <tr>
        <td data-label="Nhân viên">
          <div class="table-title">
            <span class="avatar" aria-hidden="true">${initial}</span>
            <div>
              <strong>${escapeHtml(name)}${isCurrent ? ' <small class="current-account">Bạn</small>' : ''}</strong>
              <small>${escapeHtml(email)}</small>
            </div>
          </div>
        </td>
        <td data-label="Vai trò">${escapeHtml(roleDisplayName(user.role))}</td>
        <td data-label="Ca làm">${escapeHtml(user.shift || 'Linh hoạt')}</td>
        <td data-label="Trạng thái">${badge(user.status || 'active')}</td>
        <td data-label="Thao tác">
          <button 
            type="button"
            class="link-button ${user.status === 'active' ? 'danger-text' : ''}" 
            data-toggle-user="${escapeHtml(user.id)}" 
            ${isCurrent ? 'disabled title="Không thể vô hiệu hóa tài khoản đang đăng nhập"' : ''}>
            ${isCurrent ? 'Đang đăng nhập' : user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function applyFilters() {
  const query = (document.querySelector('#user-search')?.value || '').trim().toLowerCase();
  const roleFilter = document.querySelector('#user-role-filter')?.value || 'all';
  const statusFilter = document.querySelector('#user-status-filter')?.value || 'all';

  const allStaff = staffDirectory();

  const filtered = allStaff.filter(user => {
    const name = String(user.name || '').toLowerCase();
    const email = String(user.email || '').toLowerCase();
    const matchesQuery = !query || name.includes(query) || email.includes(query);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (user.status || 'active') === statusFilter;
    return matchesQuery && matchesRole && matchesStatus;
  });

  const tableEl = document.querySelector('#user-table');
  const countBadge = document.querySelector('#user-count-badge');

  if (countBadge) {
    countBadge.textContent = `Hiển thị ${filtered.length}/${allStaff.length} nhân sự`;
  }

  if (!tableEl) return;

  if (filtered.length === 0) {
    // 3. Empty State (Bao phủ trạng thái rỗng có nút CTA)
    tableEl.innerHTML = `
      <div class="table-empty-state">
        <span class="empty-icon" aria-hidden="true">🔍</span>
        <h3>Không tìm thấy nhân viên phù hợp</h3>
        <p>Không có nhân sự nào khớp với từ khóa tìm kiếm và bộ lọc hiện tại.</p>
        <button type="button" class="button quiet" id="btn-reset-filters">Đặt lại bộ lọc</button>
      </div>
    `;
  } else {
    // 1. Normal State (Bao phủ trạng thái bình thường có bảng dữ liệu)
    tableEl.innerHTML = `
      <table>
        <thead>
          <tr>
            <th scope="col">Nhân viên</th>
            <th scope="col">Vai trò</th>
            <th scope="col">Ca làm</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${renderUserTableRows(filtered)}
        </tbody>
      </table>
    `;
  }
}

function adminUsersPage() {
  const remoteStaff = getStore('staff', appData.staff || []);
  const warningEl = document.querySelector('#directory-warning-slot');

  // 4. Error State handling for remote connection
  if (warningEl) {
    warningEl.innerHTML = !remoteStaff.length
      ? `<div class="account-directory-warning" role="status">
          <strong>Supabase chưa đồng bộ danh sách nhân viên.</strong>
          <span>Đang sử dụng dữ liệu cục bộ. Bạn có thể nhấn thử lại hoặc tiếp tục thao tác offline.</span>
          <div><button type="button" class="button quiet small" onclick="location.reload()">Thử lại</button></div>
        </div>`
      : '';
  }

  applyFilters();
}

// Bắt sự kiện tìm kiếm với Debounce 300ms (Tiêu chí 4.4)
const debouncedSearch = debounce(() => {
  applyFilters();
}, 300);

document.addEventListener('input', e => {
  if (e.target.id === 'user-search') {
    debouncedSearch();
  }

  // Clear inline error khi người dùng gõ sửa trong form
  if (e.target.id === 'add-user-name') {
    const err = document.querySelector('#err-name');
    if (err) { err.textContent = ''; err.classList.remove('active'); }
  }
  if (e.target.id === 'add-user-email') {
    const err = document.querySelector('#err-email');
    if (err) { err.textContent = ''; err.classList.remove('active'); }
  }
});

// Bắt sự kiện thay đổi bộ lọc đồng thời (Tiêu chí 4.4)
document.addEventListener('change', e => {
  if (e.target.id === 'user-role-filter' || e.target.id === 'user-status-filter') {
    applyFilters();
  }
});

// Bắt sự kiện click (CTA đặt lại bộ lọc, toggle user, close dialog)
document.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b) return;

  // Nút CTA trong Empty State
  if (b.id === 'btn-reset-filters') {
    const searchInput = document.querySelector('#user-search');
    const roleSelect = document.querySelector('#user-role-filter');
    const statusSelect = document.querySelector('#user-status-filter');
    if (searchInput) searchInput.value = '';
    if (roleSelect) roleSelect.value = 'all';
    if (statusSelect) statusSelect.value = 'all';
    applyFilters();
    toast('Đã đặt lại tất cả bộ lọc');
    return;
  }

  // Bật / Tắt trạng thái nhân viên
  if (b.dataset.toggleUser) {
    const users = getStore('staff', appData.staff);
    const user = users.find(item => item.id === b.dataset.toggleUser);
    if (!user) return;
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    b.disabled = true;
    try {
      const saved = typeof setStaffStatusRemote === 'function' ? await setStaffStatusRemote(user.id, nextStatus) : null;
      Object.assign(user, saved || { status: nextStatus });
      appData.staff = users;
      setStore('staff', users);
      applyFilters();
      toast(`Đã ${nextStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản ${user.name || user.email}`);
    } catch (error) {
      b.disabled = false;
      toast(`Không thể cập nhật tài khoản: ${error.message}`, 'error');
    }
  }
});

// Biểu mẫu (Form) Validation & Submit (Tiêu chí 4.4)
document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.id !== 'add-user-form') return;
  e.preventDefault();

  const fd = new FormData(f);
  const name = String(fd.get('name') || '').trim();
  const email = String(fd.get('email') || '').trim().toLowerCase();
  const role = String(fd.get('role') || 'kitchen');
  const shift = String(fd.get('shift') || 'Sáng');

  const errName = document.querySelector('#err-name');
  const errEmail = document.querySelector('#err-email');
  let isValid = true;

  // Validate họ tên
  if (!name || name.length < 3) {
    if (errName) {
      errName.textContent = 'Họ và tên phải có ít nhất 3 ký tự.';
      errName.classList.add('active');
    }
    isValid = false;
  }

  // Validate định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    if (errEmail) {
      errEmail.textContent = 'Vui lòng nhập địa chỉ email hợp lệ.';
      errEmail.classList.add('active');
    }
    isValid = false;
  } else {
    // Validate trùng lặp email
    const allStaff = staffDirectory();
    if (allStaff.some(u => String(u.email).toLowerCase() === email)) {
      if (errEmail) {
        errEmail.textContent = 'Email này đã tồn tại trong danh sách nhân sự.';
        errEmail.classList.add('active');
      }
      isValid = false;
    }
  }

  if (!isValid) return;

  const profile = {
    id: uid('u'),
    name,
    email,
    role,
    shift,
    status: 'active'
  };

  const button = document.querySelector('#btn-submit-user');
  if (button) {
    button.disabled = true;
    button.textContent = 'Đang tạo hồ sơ...';
  }

  try {
    const users = getStore('staff', appData.staff || []);
    const saved = typeof createStaffProfileRemote === 'function' ? await createStaffProfileRemote(profile) : profile;
    users.push(saved || profile);
    appData.staff = users;
    setStore('staff', users);

    document.querySelector('#user-dialog')?.close();
    f.reset();
    applyFilters();
    toast(`Đã thêm nhân viên ${name} thành công`);
  } catch (error) {
    toast(`Không thể tạo hồ sơ: ${error.message}`, 'error');
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = 'Tạo hồ sơ';
    }
  }
});

// Khởi tạo trang
bootPage(adminUsersPage);

