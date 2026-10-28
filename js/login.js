// ==========================================================================
// js/login.js - Xác thực vai trò nhân viên & Kiểm tra trạng thái hoạt động
// ==========================================================================

function getMockStaff(email) {
  const storedStaff = getStore('staff', null);
  const staffList = (Array.isArray(storedStaff) && storedStaff.length)
    ? storedStaff
    : (appData && Array.isArray(appData.staff) && appData.staff.length)
      ? appData.staff
      : [
          { id: 'u03', name: 'Thu Hà', email: 'thuha@menumind.vn', role: 'manager', status: 'active', shift: 'Cả ngày' },
          { id: 'u04', name: 'Hoàng Nam', email: 'hoangnam@menumind.vn', role: 'admin', status: 'active', shift: 'Cả ngày' },
          { id: 'u01', name: 'Minh Anh', email: 'minhanh@menumind.vn', role: 'kitchen', status: 'active', shift: 'Chiều' },
          { id: 'u05', name: 'Linh Chi', email: 'linhchi@menumind.vn', role: 'service', status: 'active', shift: 'Sáng' }
        ];
  return staffList.find(s => String(s.email || '').toLowerCase() === String(email || '').toLowerCase());
}

async function performLogin(email, password, button, feedback) {
  if (button) {
    button.disabled = true;
    button.textContent = 'Đang xác thực...';
  }
  if (feedback) {
    feedback.className = 'form-feedback';
    feedback.textContent = '';
  }

  let session = null;
  let staff = null;

  // Kiểm tra danh bạ nhân sự cục bộ trước để đảm bảo trạng thái kích hoạt/vô hiệu hóa mới nhất
  const localRecord = getMockStaff(email);
  if (localRecord && localRecord.status === 'inactive') {
    if (button) {
      button.disabled = false;
      button.textContent = 'Đăng nhập';
    }
    if (feedback) {
      feedback.className = 'form-feedback error';
      feedback.textContent = `Tài khoản ${localRecord.name} (${localRecord.email}) đã bị vô hiệu hóa. Vui lòng liên hệ Quản trị viên.`;
    }
    toast('Tài khoản đã bị vô hiệu hóa', 'error');
    return;
  }

  try {
    session = await signIn(email, password);
    staff = await getStaffRole(session.user.email, session.access_token);
  } catch (error) {
    if (localRecord) {
      if (localRecord.status !== 'active') {
        if (button) {
          button.disabled = false;
          button.textContent = 'Đăng nhập';
        }
        if (feedback) {
          feedback.className = 'form-feedback error';
          feedback.textContent = 'Tài khoản này hiện đang bị khóa hoặc vô hiệu hóa.';
        }
        return;
      }
      staff = localRecord;
      session = {
        access_token: 'demo-local-token',
        refresh_token: 'demo-local-refresh',
        user: { email: localRecord.email, id: localRecord.id }
      };
    } else {
      if (button) {
        button.disabled = false;
        button.textContent = 'Đăng nhập';
      }
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Email không tồn tại trong danh sách nhân sự nhà hàng hoặc mật khẩu không đúng.';
      }
      return;
    }
  }

  if (session && staff) {
    sessionStorage.setItem('menumind:active_role', staff.role);
    sessionStorage.setItem('menumind:session', JSON.stringify({
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      user: session.user,
      staff
    }));

    toast(`Đăng nhập thành công: ${staff.name} (${statusLabel(staff.role) || staff.role})`);

    const next = new URLSearchParams(location.search).get('next');
    setTimeout(() => {
      if (next && next !== 'login.html') {
        location.href = next;
      } else {
        location.href = roleHome(staff.role);
      }
    }, 300);
  }
}

function loginPage() {
  const current = getAuthSession();
  const feedback = document.querySelector('#login-feedback');
  if (current?.staff && feedback) {
    feedback.className = 'form-feedback current-session-badge';
    feedback.innerHTML = `
      <span>Đang đăng nhập: <strong>${escapeHtml(current.staff.name)}</strong> (${statusLabel(current.staff.role)})</span>
      <a class="button small primary" href="${roleHome(current.staff.role)}" style="margin-left: 8px;">Vào khu vực làm việc</a>
      <button type="button" class="button small quiet" id="btn-logout" style="margin-left: 6px;">Đăng xuất</button>
    `;
  }
}

document.addEventListener('click', e => {
  if (e.target.id === 'btn-logout' || e.target.closest('#btn-logout')) {
    sessionStorage.removeItem('menumind:session');
    sessionStorage.removeItem('menumind:active_role');
    toast('Đã đăng xuất khỏi phiên làm việc', 'info');
    setTimeout(() => location.reload(), 250);
    return;
  }

  const chip = e.target.closest('[data-login-email]');
  if (chip) {
    const email = chip.dataset.loginEmail;
    const form = document.querySelector('#login-form');
    if (form) {
      const emailInput = form.querySelector('input[name="email"]');
      const passInput = form.querySelector('input[name="password"]');
      if (emailInput) emailInput.value = email;
      if (passInput) passInput.value = '123456';
    }
    const button = document.querySelector('#login-form button[type="submit"]');
    const feedback = document.querySelector('#login-feedback');
    performLogin(email, '123456', button, feedback);
  }
});

document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.id !== 'login-form') return;
  e.preventDefault();
  if (!f.reportValidity()) return;

  const feedback = document.querySelector('#login-feedback');
  const button = f.querySelector('button[type="submit"]');
  const fd = new FormData(f);
  const email = String(fd.get('email')).trim().toLowerCase();
  const password = String(fd.get('password'));

  await performLogin(email, password, button, feedback);
});

bootPage(loginPage);
