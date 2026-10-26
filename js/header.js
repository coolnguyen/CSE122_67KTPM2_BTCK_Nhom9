// Header interaction: Mobile Navigation Drawer & Role Switcher Demo
document.addEventListener('DOMContentLoaded', () => {
  const root = document.body.dataset.root || '.';

  // 1. Mobile navigation toggle (hamburger menu)
  document.addEventListener('click', e => {
    const toggle = e.target.closest('.nav-toggle');
    if (!toggle) return;
    const nav = document.querySelector('#global-nav');
    if (!nav) return;
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('open', !isOpen);
  });

  // 2. Role Switcher Popup (Phục vụ Demo thi vấn đáp - Tiêu chí 2.4 Barem)
  const rolePill = document.querySelector('.role-pill');
  if (rolePill) {
    // Wrap role pill in switcher container
    let wrap = rolePill.parentElement;
    if (!wrap.classList.contains('role-switcher-wrap')) {
      wrap = document.createElement('div');
      wrap.className = 'role-switcher-wrap';
      rolePill.parentNode.insertBefore(wrap, rolePill);
      wrap.appendChild(rolePill);
    }

    // Role options mapping
    const pagesPath = root === '.' ? 'pages' : '.';
    const roles = [
      { id: 'diner', title: 'Thực khách', desc: 'Menu món & Gọi món bàn', icon: '🍽️', url: `${pagesPath}/diner-menu.html` },
      { id: 'kitchen', title: 'Nhân viên bếp', desc: 'Bảng Kanban & Cảnh báo trễ', icon: '👨‍🍳', url: `${pagesPath}/kitchen-board.html` },
      { id: 'manager', title: 'Quản lý nhà hàng', desc: 'Báo cáo doanh số & Thực đơn', icon: '💼', url: `${pagesPath}/manager-sales-insights.html` },
      { id: 'admin', title: 'Quản trị viên (Chủ quán)', desc: 'Sơ đồ bàn & Phân quyền', icon: '⚙️', url: `${pagesPath}/admin-table-management.html` }
    ];

    // Create dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'role-switcher-dropdown';
    dropdown.setAttribute('role', 'menu');
    dropdown.setAttribute('aria-label', 'Chuyển đổi nhanh vai trò');

    dropdown.innerHTML = `
      <div class="switcher-header">Chuyển vai trò nhanh (Demo)</div>
      ${roles.map(r => `
        <a href="${r.url}" class="switcher-item" role="menuitem">
          <span class="switcher-icon" aria-hidden="true">${r.icon}</span>
          <div>
            <div>${r.title}</div>
            <span class="switcher-desc">${r.desc}</span>
          </div>
        </a>
      `).join('')}
    `;

    wrap.appendChild(dropdown);

    // Toggle dropdown on rolePill click
    rolePill.addEventListener('click', e => {
      e.preventDefault();
      dropdown.classList.toggle('active');
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('active');
      }
    });
  }
});
