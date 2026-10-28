/**
 * ============================================================================
 * MENUMIND - MODULE CÀI ĐẶT HỆ THỐNG NHÀ HÀNG THỜI GIAN THỰC (S16)
 * Nguyễn Hoàng Hải (SV3 - Leader)
 * ============================================================================
 */

const DEFAULT_SETTINGS = {
  name: 'MenuMind Bistro',
  phone: '024 7300 1220',
  currency: 'VND',
  alerts: true,
  alertTime: 15,
  dark: false,
  language: 'vi'
};

function getSystemSettings() {
  return getStore('settings', DEFAULT_SETTINGS);
}

function populateSettingsForm(cfg) {
  const nameInput = document.querySelector('#setting-name');
  const phoneInput = document.querySelector('#setting-phone');
  const currencySelect = document.querySelector('#setting-currency');
  const alertsInput = document.querySelector('#setting-alerts');
  const alertTimeInput = document.querySelector('#setting-alert-time');
  const darkInput = document.querySelector('#setting-dark');
  const langSelect = document.querySelector('#setting-lang');

  if (nameInput) nameInput.value = cfg.name || DEFAULT_SETTINGS.name;
  if (phoneInput) phoneInput.value = cfg.phone || DEFAULT_SETTINGS.phone;
  if (currencySelect) currencySelect.value = cfg.currency || DEFAULT_SETTINGS.currency;
  if (alertsInput) alertsInput.checked = Boolean(cfg.alerts);
  if (alertTimeInput) alertTimeInput.value = cfg.alertTime || DEFAULT_SETTINGS.alertTime;
  if (darkInput) darkInput.checked = Boolean(cfg.dark);
  if (langSelect) langSelect.value = cfg.language || DEFAULT_SETTINGS.language;

  document.documentElement.classList.toggle('high-contrast', Boolean(cfg.dark));
}

function settingsPage() {
  const cfg = getSystemSettings();
  populateSettingsForm(cfg);
}

document.addEventListener('input', e => {
  const target = e.target;
  if (target.id === 'setting-name') {
    const err = document.querySelector('#err-setting-name');
    if (err) { err.textContent = ''; err.classList.remove('active'); }
  }
  if (target.id === 'setting-phone') {
    const err = document.querySelector('#err-setting-phone');
    if (err) { err.textContent = ''; err.classList.remove('active'); }
  }
  if (target.id === 'setting-alert-time') {
    const err = document.querySelector('#err-setting-alert-time');
    if (err) { err.textContent = ''; err.classList.remove('active'); }
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'setting-dark') {
    document.documentElement.classList.toggle('high-contrast', e.target.checked);
  }
});

document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.id !== 'settings-form') return;
  e.preventDefault();

  const fd = new FormData(f);
  const name = String(fd.get('name') || '').trim();
  const phone = String(fd.get('phone') || '').trim();
  const alertTime = parseInt(fd.get('alertTime'), 10);
  const currency = String(fd.get('currency') || 'VND');
  const alerts = fd.has('alerts');
  const dark = fd.has('dark');
  const language = String(fd.get('language') || 'vi');

  const errName = document.querySelector('#err-setting-name');
  const errPhone = document.querySelector('#err-setting-phone');
  const errAlertTime = document.querySelector('#err-setting-alert-time');

  let isValid = true;

  if (!name || name.length < 3) {
    if (errName) {
      errName.textContent = 'Tên nhà hàng phải có ít nhất 3 ký tự.';
      errName.classList.add('active');
    }
    isValid = false;
  }

  const phoneRegex = /^[0-9\s+()-]{9,15}$/;
  if (!phone || !phoneRegex.test(phone)) {
    if (errPhone) {
      errPhone.textContent = 'Vui lòng nhập số điện thoại hợp lệ (9 đến 15 số).';
      errPhone.classList.add('active');
    }
    isValid = false;
  }

  if (isNaN(alertTime) || alertTime < 5 || alertTime > 60) {
    if (errAlertTime) {
      errAlertTime.textContent = 'Thời gian cảnh báo phải từ 5 đến 60 phút.';
      errAlertTime.classList.add('active');
    }
    isValid = false;
  }

  if (!isValid) return;

  const submitButton = document.querySelector('#btn-save-settings');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Đang lưu cài đặt...';
  }

  try {
    const updatedSettings = {
      name,
      phone,
      currency,
      alerts,
      alertTime,
      dark,
      language,
      updatedAt: new Date().toISOString()
    };

    setStore('settings', updatedSettings);
    applySystemSettingsToDOM();

    toast('Đã lưu cấu hình hệ thống và đồng bộ sang toàn bộ các màn hình!');
  } catch (error) {
    toast(`Không thể lưu cấu hình: ${error.message}`, 'error');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Lưu cài đặt';
    }
  }
});

document.addEventListener('click', async e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.id === 'btn-reset-production') {
    const confirmed = window.confirm(
      'CHUYỂN SANG TRẠNG THÁI VẬN HÀNH THẬT (ZERO-STATE)?\n\n' +
      '• Toàn bộ đơn hàng và thanh toán thử nghiệm sẽ được xóa.\n' +
      '• Toàn bộ 12 bàn ăn đưa về trạng thái Trống (sẵn sàng đón khách).\n' +
      '• Báo cáo doanh số bắt đầu tính từ 0 ₫ cho ca làm việc mới.\n' +
      '• Danh mục thực đơn 24 món ăn vẫn được giữ nguyên 100%.\n\n' +
      'Bạn có chắc chắn muốn thực hiện?'
    );
    if (!confirmed) return;

    if (typeof resetToProductionClean === 'function') {
      await resetToProductionClean();
    }
    toast('✓ Đã khởi tạo trạng thái vận hành sạch thành công! Bếp và bàn ăn đã sẵn sàng đón khách thật.', 'info');
    setTimeout(() => location.reload(), 500);
    return;
  }

  if (b.id === 'btn-load-demo-data') {
    const confirmed = window.confirm(
      'NẠP DỮ LIỆU MẪU SINH ĐỘNG (DEMO SHOWCASE)?\n\n' +
      '• Nạp lại các đơn hàng đang chế biến tại Bếp.\n' +
      '• Nạp trạng thái các bàn đang dùng bữa và yêu cầu thanh toán.\n' +
      '• Kích hoạt biểu đồ doanh số 48,6 triệu và nhận xét thực khách.\n\n' +
      'Chế độ này rất phù hợp để trình diễn đầy đủ tính năng cho chủ nhà hàng hoặc giảng viên.'
    );
    if (!confirmed) return;

    if (typeof loadShowcaseDemoData === 'function') {
      await loadShowcaseDemoData();
    }
    toast('✓ Đã nạp lại dữ liệu mẫu sinh động thành công!', 'info');
    setTimeout(() => location.reload(), 500);
    return;
  }

  if (b.id === 'btn-reset-defaults') {
    const confirmed = window.confirm('Bạn có chắc chắn muốn khôi phục toàn bộ cấu hình hiển thị nhà hàng về mặc định không?');
    if (!confirmed) return;

    setStore('settings', DEFAULT_SETTINGS);
    populateSettingsForm(DEFAULT_SETTINGS);
    applySystemSettingsToDOM();

    document.querySelectorAll('.field-error').forEach(el => {
      el.textContent = '';
      el.classList.remove('active');
    });

    toast('Đã khôi phục cài đặt hiển thị về mặc định!', 'info');
  }
});

bootPage(settingsPage);
