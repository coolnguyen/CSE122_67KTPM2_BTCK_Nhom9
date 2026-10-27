function getMockStaff(email) {
  const staffList = (appData && Array.isArray(appData.staff) && appData.staff.length)
    ? appData.staff
    : [
        { id: 'u03', name: 'Thu Hà', email: 'thuha@menumind.vn', role: 'manager', status: 'active', shift: 'Cả ngày' },
        { id: 'u04', name: 'Hoàng Nam', email: 'hoangnam@menumind.vn', role: 'admin', status: 'active', shift: 'Cả ngày' },
        { id: 'u01', name: 'Minh Anh', email: 'minhanh@menumind.vn', role: 'kitchen', status: 'active', shift: 'Chiều' },
        { id: 'u05', name: 'Linh Chi', email: 'linhchi@menumind.vn', role: 'service', status: 'active', shift: 'Sáng' }
      ];
  return staffList.find(s => s.email.toLowerCase() === email.toLowerCase());
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

  try {
    session = await signIn(email, password);
    staff = await getStaffRole(session.user.email, session.access_token);
  } catch (error) {
    console.warn('Đăng nhập trực tuyến không thành công, sử dụng tài khoản cục bộ:', error.message);
    const mock = getMockStaff(email);
    if (mock) {
      staff = mock;
      session = {
        access_token: 'demo-local-token',
        refresh_token: 'demo-local-refresh',
        user: { email: mock.email, id: mock.id }
      };
    } else {
      if (button) {
        button.disabled = false;
        button.textContent = 'Đăng nhập';
      }
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = error.message || 'Email hoặc mật khẩu không chính xác.';
      }
      return;
    }
  }

  if (session && staff) {
    sessionStorage.setItem('menumind:session', JSON.stringify({
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      user: session.user,
      staff
    }));

    toast(`Đăng nhập thành công với vai trò ${statusLabel(staff.role) || staff.role}`);

    const next = new URLSearchParams(location.search).get('next');
    setTimeout(() => {
      if (next && next !== 'login.html') {
        location.href = next;
      } else {
        location.href = roleHome(staff.role);
      }
    }, 350);
  }
}

function loginPage() {
  const current = getAuthSession();
  const feedback = document.querySelector('#login-feedback');
  if (current?.staff && feedback) {
    feedback.className = 'form-feedback current-session-badge';
    feedback.innerHTML = `
      <span>Đang đăng nhập: <strong>${escapeHtml(current.staff.name)}</strong> (${statusLabel(current.staff.role)})</span>
      <button type="button" class="button small quiet" id="btn-logout" style="margin-left: 8px;">Đăng xuất</button>
    `;
  }
}

document.addEventListener('click', e => {
  // Nút đăng xuất
  if (e.target.id === 'btn-logout' || e.target.closest('#btn-logout')) {
    sessionStorage.removeItem('menumind:session');
    toast('Đã đăng xuất khỏi phiên làm việc', 'info');
    setTimeout(() => location.reload(), 300);
    return;
  }

  // Nút đăng nhập nhanh bằng chip tài khoản mẫu
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
