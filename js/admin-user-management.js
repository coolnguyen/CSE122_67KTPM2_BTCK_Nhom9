function staffDirectory() {
  const remoteStaff = getStore('staff', appData.staff || []);
  const currentStaff = getAuthSession()?.staff;
  const directory = Array.isArray(remoteStaff) ? [...remoteStaff] : [];
  if (currentStaff?.email && !directory.some(item => String(item.email).toLowerCase() === String(currentStaff.email).toLowerCase())) {
    directory.unshift({ ...currentStaff, shift: currentStaff.shift || 'Chưa thiết lập', currentSession: true });
  }
  return directory;
}

function adminUsersPage() {
  const remoteStaff = getStore('staff', appData.staff || []);
  const staff = staffDirectory();
  const warningEl = document.querySelector('#directory-warning-slot');
  const tableEl = document.querySelector('#user-table');

  if (warningEl) {
    warningEl.innerHTML = !remoteStaff.length
      ? `<div class="account-directory-warning" role="status"><strong>Supabase chưa cho phép tải danh sách nhân viên.</strong><span>Đang hiển thị tài khoản hiện tại. Hãy chạy lại <code>supabase/repair-staff-directory.sql</code>, sau đó đăng xuất và đăng nhập lại.</span></div>`
      : '';
  }
  if (tableEl) tableEl.innerHTML = userTable(staff);
}

function userTable(staff) {
  const currentEmail = String(getAuthSession()?.staff?.email || '').toLowerCase();
  const roles = { kitchen: 'Nhân viên bếp', manager: 'Quản lý', admin: 'Quản trị', service: 'Phục vụ' };
  const rows = staff.map(user => {
    const name = String(user.name || user.email || 'Tài khoản');
    const email = String(user.email || 'Chưa có email');
    const isCurrent = email.toLowerCase() === currentEmail;
    return `<tr><td data-label="Nhân viên"><div class="table-title"><span class="avatar">${escapeHtml(name.split(' ').slice(-1)[0]?.[0] || '?')}</span><div><strong>${escapeHtml(name)}${isCurrent ? ' <small class="current-account">Bạn</small>' : ''}</strong><small>${escapeHtml(email)}</small></div></div></td><td data-label="Vai trò">${escapeHtml(roles[user.role] || user.role || 'Chưa gán')}</td><td data-label="Ca làm">${escapeHtml(user.shift || 'Chưa thiết lập')}</td><td data-label="Trạng thái">${badge(user.status || 'active')}</td><td data-label="Thao tác"><button class="link-button ${user.status === 'active' ? 'danger-text' : ''}" data-toggle-user="${escapeHtml(user.id)}" ${isCurrent ? 'disabled title="Không thể vô hiệu hóa tài khoản đang đăng nhập"' : ''}>${isCurrent ? 'Đang đăng nhập' : user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}</button></td></tr>`;
  }).join('');
  return `<table><thead><tr><th>Nhân viên</th><th>Vai trò</th><th>Ca làm</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${rows || '<tr><td colspan="5"><div class="table-empty-state"><strong>Chưa có hồ sơ tài khoản</strong><span>Hãy đồng bộ tài khoản Supabase Authentication với bảng staff.</span></div></td></tr>'}</tbody></table>`;
}

document.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b) return;

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
      const tableEl = document.querySelector('#user-table');
      if (tableEl) tableEl.innerHTML = userTable(users);
      toast('Đã cập nhật tài khoản trên Supabase');
    } catch (error) {
      b.disabled = false;
      toast(`Không thể cập nhật tài khoản: ${error.message}`, 'error');
    }
  }
});

document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.id !== 'add-user-form') return;
  e.preventDefault();
  if (!f.reportValidity()) return;

  const fd = new FormData(f);
  const users = getStore('staff', appData.staff);
  const profile = {
    name: String(fd.get('name') || '').trim(),
    email: String(fd.get('email') || '').trim().toLowerCase(),
    role: String(fd.get('role') || ''),
    shift: String(fd.get('shift') || '')
  };
  if (staffDirectory().some(user => String(user.email).toLowerCase() === profile.email)) {
    toast('Email đã tồn tại', 'error');
    return;
  }
  const button = f.querySelector('button[type="submit"]');
  if (button) { button.disabled = true; button.textContent = 'Đang tạo...'; }

  try {
    const saved = typeof createStaffProfileRemote === 'function' ? await createStaffProfileRemote(profile) : profile;
    if (!saved) throw new Error('Supabase không trả về hồ sơ vừa tạo');
    users.push(saved);
    appData.staff = users;
    setStore('staff', users);
    document.querySelector('#user-dialog')?.close();
    const tableEl = document.querySelector('#user-table');
    if (tableEl) tableEl.innerHTML = userTable(staffDirectory());
    f.reset();
    toast('Đã tạo hồ sơ nhân viên trên Supabase');
  } catch (error) {
    toast(`Không thể tạo hồ sơ: ${error.message}`, 'error');
  } finally {
    if (button) { button.disabled = false; button.textContent = 'Tạo hồ sơ'; }
  }
});

bootPage(adminUsersPage);
