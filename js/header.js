// ==========================================================================
// Quản lý Dark / Light Theme, Điều hướng Header & Đồng bộ Bàn/Vai trò
// ==========================================================================

const THEME_STORAGE_KEY = 'menumind:theme';

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.querySelector('.theme-toggle');
  if (btn) {
    const isDark = theme === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối');
    btn.setAttribute('title', isDark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
}

// Khởi tạo ngay lập tức khi load để tránh chớp màn hình
applyTheme(getPreferredTheme());

function mountThemeButton() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let headerActions = header.querySelector('.header-actions');
  const rolePill = header.querySelector('.role-pill');

  if (!headerActions) {
    headerActions = document.createElement('div');
    headerActions.className = 'header-actions';
    if (rolePill) {
      rolePill.parentNode.insertBefore(headerActions, rolePill);
      headerActions.appendChild(rolePill);
    } else {
      header.appendChild(headerActions);
    }
  }

  if (!headerActions.querySelector('.theme-toggle')) {
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Chuyển đổi giao diện Sáng/Tối');
    btn.setAttribute('title', 'Chuyển đổi giao diện Sáng / Tối');
    btn.innerHTML = `
      <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
      <span class="sr-only">Chế độ sáng/tối</span>
    `;
    headerActions.insertBefore(btn, headerActions.firstChild);
    applyTheme(getPreferredTheme());
  }
}

window.addEventListener('storage', e => {
  if (e.key === THEME_STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
    applyTheme(e.newValue);
  }
});

document.addEventListener('click', e => {
  const toggle = e.target.closest('.nav-toggle');
  if (toggle) {
    const nav = document.querySelector('#global-nav');
    if (!nav) return;
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('open', !isOpen);
    return;
  }

  const themeBtn = e.target.closest('.theme-toggle');
  if (themeBtn) {
    toggleTheme();
    return;
  }
});

function initHeaderAndNav() {
  syncGlobalNav();
  mountThemeButton();
  updateRolePill();
  syncSidebar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderAndNav);
} else {
  initHeaderAndNav();
}

// ==========================================================================
// ĐỒNG BỘ THANH ĐIỀU HƯỚNG CHÍNH (GLOBAL NAV) KHÔNG BAO GIỜ MẤT OPTION
// ==========================================================================
function syncGlobalNav() {
  const nav = document.querySelector('#global-nav');
  if (!nav) return;

  const isRoot = document.body.dataset.root === '.' || !location.pathname.includes('/pages/');
  const prefix = isRoot ? 'pages/' : '';
  const rootPrefix = isRoot ? '' : '../';
  const currentPageKey = document.body.dataset.page || '';
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  const isTableOrder = currentFile === 'index.html' || currentPageKey === 'home';
  const isMenu = ['menu', 'dish-detail'].includes(currentPageKey) || currentFile.includes('menu') || currentFile.includes('dish-detail');
  const isStatus = ['status', 'cart'].includes(currentPageKey) || currentFile.includes('order-status') || currentFile.includes('table-order');
  const isStaff = ['login', 'admin', 'manager', 'kitchen'].some(k => currentPageKey.startsWith(k)) || currentFile === 'login.html';

  nav.innerHTML = `
    <a href="${rootPrefix}index.html#dining-spaces"${isTableOrder ? ' class="active" aria-current="page"' : ''}>Chọn bàn QR</a>
    <a href="${prefix}diner-menu.html"${isMenu ? ' class="active" aria-current="page"' : ''}>Thực đơn</a>
    <a href="${prefix}diner-order-status.html"${isStatus ? ' class="active" aria-current="page"' : ''}>Theo dõi đơn</a>
    <a href="${prefix}login.html"${isStaff ? ' class="active" aria-current="page"' : ''}>Khu vực nhân viên</a>
  `;
}

function updateRolePill() {
  const rolePill = document.querySelector('.role-pill');
  if (!rolePill) return;
  const currentPageKey = document.body.dataset.page || '';
  const isDinerPage = ['home', 'menu', 'dish-detail', 'cart', 'status'].includes(currentPageKey);
  const session = typeof getAuthSession === 'function' ? getAuthSession() : null;

  if (isDinerPage && currentPageKey !== 'home') {
    const table = typeof getActiveTable === 'function' ? getActiveTable() : (sessionStorage.getItem('menumind:table') || 'A01');
    rolePill.innerHTML = `<span class="pulse-dot"></span>Bàn ${escapeHtml(table)}`;
    rolePill.setAttribute('title', `Đang phục vụ Bàn ${table} · Nhấn để đổi vai trò`);
    return;
  }

  if (session?.staff?.role) {
    const roleLabels = { manager: 'Quản lý', admin: 'Quản trị', kitchen: 'Bếp', service: 'Phục vụ' };
    const label = roleLabels[session.staff.role] || session.staff.role;
    rolePill.innerHTML = `<span class="pulse-dot"></span>${escapeHtml(session.staff.name || label)} (${label})`;
    rolePill.setAttribute('title', `Tài khoản: ${session.staff.name || session.staff.email} (${label})`);
  }
}

// ==========================================================================
// ĐỒNG BỘ THANH ĐIỀU HƯỚNG BÊN (SIDEBAR NAVIGATION) - KHÔNG BAO GIỜ BỊ MẤT OPTION
// ==========================================================================
function syncSidebar() {
  const sideNav = document.querySelector('.side-nav');
  if (!sideNav) return;

  const session = typeof getAuthSession === 'function' ? getAuthSession() : null;
  const currentPageKey = document.body.dataset.page || '';
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  let role = session?.staff?.role;
  if (!role) {
    if (currentPageKey.startsWith('kitchen-')) role = 'kitchen';
    else role = 'admin';
  }

  const ICONS = {
    account: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    tables: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
    menu: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    sales: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
    payments: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
    feedback: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    switchRole: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
    kitchenBoard: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
    kitchenDetail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    kitchenAlerts: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
  };

  const managementNav = [
    { href: 'admin-user-management.html', pages: ['admin-users'], label: 'Tài khoản', icon: ICONS.account },
    { href: 'manager-table-management.html', pages: ['manager-tables', 'admin-tables'], label: 'Bàn ăn & QR', icon: ICONS.tables },
    { href: 'manager-menu-management.html', pages: ['manager-menu'], label: 'Thực đơn', icon: ICONS.menu },
    { href: 'admin-sales-insights.html', pages: ['admin-sales', 'admin-sales-insights', 'manager-sales'], label: 'Bán hàng', icon: ICONS.sales },
    { href: 'manager-payment-requests.html', pages: ['manager-payments'], label: 'Thanh toán', icon: ICONS.payments },
    { href: 'manager-feedback-center.html', pages: ['manager-feedback'], label: 'Phản hồi', icon: ICONS.feedback },
    { href: 'admin-settings.html', pages: ['admin-settings'], label: 'Cài đặt', icon: ICONS.settings },
    { href: 'login.html', pages: ['login'], label: 'Đổi vai trò', icon: ICONS.switchRole }
  ];

  const kitchenNav = [
    { href: 'kitchen-board.html', pages: ['kitchen-board'], label: 'Bảng đơn', icon: ICONS.kitchenBoard },
    { href: 'kitchen-order-detail.html', pages: ['kitchen-detail'], label: 'Chi tiết đơn', icon: ICONS.kitchenDetail },
    { href: 'kitchen-wait-time-alerts.html', pages: ['kitchen-alerts'], label: 'Cảnh báo chờ', icon: ICONS.kitchenAlerts },
    { href: 'login.html', pages: ['login'], label: 'Đổi vai trò', icon: ICONS.switchRole }
  ];

  let navItems = [];
  if (role === 'kitchen') {
    sideNav.setAttribute('aria-label', 'Điều hướng bếp');
    navItems = kitchenNav;
  } else {
    // Không gian Quản lý & Quản trị: Luôn giữ đầy đủ 8 danh mục cốt lõi, không bao giờ bị mất option khi chuyển trang
    sideNav.setAttribute('aria-label', 'Điều hướng quản lý');
    navItems = managementNav;
  }

  if (!navItems.length) return;

  sideNav.innerHTML = `
    <p>Không gian làm việc</p>
    ${navItems.map(item => {
      const isMatch = item.href === currentFile || (item.pages && item.pages.includes(currentPageKey));
      const activeAttr = isMatch ? ' class="active" aria-current="page"' : '';
      return `<a${activeAttr} href="${item.href}"><span aria-hidden="true">${item.icon}</span>${item.label}</a>`;
    }).join('\n    ')}
  `;
}
