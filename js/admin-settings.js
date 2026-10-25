function settingsPage() {
  const cfg = getStore('settings', { name: 'MenuMind Bistro', phone: '024 7300 1220', currency: 'VND', alerts: true, dark: false });
  const nameInput = document.querySelector('#setting-name');
  const phoneInput = document.querySelector('#setting-phone');
  const alertsInput = document.querySelector('#setting-alerts');
  const darkInput = document.querySelector('#setting-dark');

  if (nameInput) nameInput.value = cfg.name || 'MenuMind Bistro';
  if (phoneInput) phoneInput.value = cfg.phone || '024 7300 1220';
  if (alertsInput) alertsInput.checked = Boolean(cfg.alerts);
  if (darkInput) darkInput.checked = Boolean(cfg.dark);
}

document.addEventListener('submit', e => {
  const f = e.target;
  if (f.id !== 'settings-form') return;
  e.preventDefault();
  const fd = new FormData(f);
  setStore('settings', {
    name: fd.get('name'),
    phone: fd.get('phone'),
    currency: fd.get('currency'),
    alerts: fd.has('alerts'),
    dark: fd.has('dark')
  });
  document.documentElement.classList.toggle('high-contrast', fd.has('dark'));
  toast('Đã lưu cài đặt');
});

bootPage(settingsPage);
