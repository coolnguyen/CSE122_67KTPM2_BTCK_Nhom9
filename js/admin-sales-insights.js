/**
 * ============================================================================
 * MENUMIND - MODULE BÁO CÁO DOANH SỐ & THỐNG KÊ THỜI GIAN THỰC (S13)
 * Nguyễn Hoàng Hải (SV3 - Leader)
 * ============================================================================
 */

const BASE_SALES_DATA = {
  'this-week': {
    label: 'Tuần này (Trực tiếp)',
    kicker: 'Doanh thu ca làm việc thời gian thực',
    baseRevenueVnd: 0,
    baseOrders: 0,
    revenueTrend: 'Bắt đầu ca',
    ordersTrend: '0 đơn',
    aovTrend: '--',
    waitTrend: '--',
    days: [
      { day: 'T2', date: 'Hôm nay', rev: 0, orders: 0, isLiveToday: true },
      { day: 'T3', date: 'Theo ca', rev: 0, orders: 0 },
      { day: 'T4', date: 'Theo ca', rev: 0, orders: 0 },
      { day: 'T5', date: 'Theo ca', rev: 0, orders: 0 },
      { day: 'T6', date: 'Theo ca', rev: 0, orders: 0 },
      { day: 'T7', date: 'Theo ca', rev: 0, orders: 0 },
      { day: 'CN', date: 'Theo ca', rev: 0, orders: 0 }
    ]
  },
  'last-week': {
    label: 'Tuần trước',
    kicker: 'Lịch sử chu kỳ tuần trước',
    baseRevenueVnd: 0,
    baseOrders: 0,
    revenueTrend: '--',
    ordersTrend: '--',
    aovTrend: '--',
    waitTrend: '--',
    days: [
      { day: 'T2', date: 'Tuần trước', rev: 0, orders: 0 },
      { day: 'T3', date: 'Tuần trước', rev: 0, orders: 0 },
      { day: 'T4', date: 'Tuần trước', rev: 0, orders: 0 },
      { day: 'T5', date: 'Tuần trước', rev: 0, orders: 0 },
      { day: 'T6', date: 'Tuần trước', rev: 0, orders: 0 },
      { day: 'T7', date: 'Tuần trước', rev: 0, orders: 0 },
      { day: 'CN', date: 'Tuần trước', rev: 0, orders: 0 }
    ]
  },
  'this-month': {
    label: 'Tháng này (Trực tiếp)',
    kicker: 'Tổng hợp tích lũy tháng thực tế',
    baseRevenueVnd: 0,
    baseOrders: 0,
    revenueTrend: 'Bắt đầu tháng',
    ordersTrend: '0 đơn',
    aovTrend: '--',
    waitTrend: '--',
    days: [
      { day: 'Tuần 1', date: '01-07', rev: 0, orders: 0 },
      { day: 'Tuần 2', date: '08-14', rev: 0, orders: 0 },
      { day: 'Tuần 3', date: '15-21', rev: 0, orders: 0 },
      { day: 'Tuần 4', date: '22-H.Nay', rev: 0, orders: 0, isLiveToday: true }
    ]
  }
};

let currentPeriod = 'this-week';

// Tính toán doanh số phát sinh trực tiếp từ các đơn hàng & thanh toán trong hệ thống
function getLiveSessionDelta() {
  const orders = getStore('orders', appData.orders || []);
  const validOrders = orders.filter(o => o.status !== 'cancelled');
  const liveRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const liveOrdersCount = validOrders.length;

  const avgWait = validOrders.length
    ? Math.round(validOrders.reduce((sum, o) => sum + getOrderWait(o), 0) / validOrders.length)
    : 13;

  return { liveRevenue, liveOrdersCount, avgWait };
}

function formatMillions(vnd) {
  return (vnd / 1000000).toFixed(1).replace('.', ',');
}

function buildPeriodSnapshot(periodKey) {
  const base = BASE_SALES_DATA[periodKey] || BASE_SALES_DATA['this-week'];
  const { liveRevenue, liveOrdersCount, avgWait } = getLiveSessionDelta();
  const isLivePeriod = periodKey === 'this-week' || periodKey === 'this-month';

  const totalRev = base.baseRevenueVnd + (isLivePeriod ? liveRevenue : 0);
  const totalOrd = base.baseOrders + (isLivePeriod ? liveOrdersCount : 0);
  const aovK = Math.round(totalRev / Math.max(1, totalOrd) / 1000);

  const days = base.days.map(d => {
    const rev = d.rev + (d.isLiveToday ? liveRevenue : 0);
    const ord = d.orders + (d.isLiveToday ? liveOrdersCount : 0);
    return { ...d, rev, orders: ord };
  });

  const maxRev = Math.max(...days.map(d => d.rev), 1);
  const chartDays = days.map(d => ({
    day: d.day,
    date: d.date,
    rev: d.rev,
    orders: d.orders,
    val: `${(d.rev / 1000000).toFixed(1)}tr`,
    height: `${Math.max(12, Math.round((d.rev / maxRev) * 96))}%`
  }));

  const csvRows = [
    'Giai đoạn,Ngày,Doanh thu (VND),Số đơn',
    ...chartDays.map(d => `${d.day},${d.date},${d.rev},${d.orders}`)
  ].join('\n');

  return {
    label: base.label,
    kicker: base.kicker,
    revenueStr: formatMillions(totalRev),
    ordersStr: totalOrd.toLocaleString('vi-VN'),
    aovStr: String(aovK),
    waitStr: String(isLivePeriod ? avgWait : 15),
    revenueTrend: base.revenueTrend,
    ordersTrend: base.ordersTrend,
    aovTrend: base.aovTrend,
    waitTrend: base.waitTrend,
    chartDays,
    csv: csvRows
  };
}

function renderSalesDashboard(periodKey = currentPeriod) {
  currentPeriod = periodKey;
  const snap = buildPeriodSnapshot(periodKey);

  const revEl = document.querySelector('#metric-revenue');
  const revTrend = document.querySelector('#metric-revenue-trend');
  const ordersEl = document.querySelector('#metric-orders');
  const ordersTrend = document.querySelector('#metric-orders-trend');
  const aovEl = document.querySelector('#metric-aov');
  const aovTrend = document.querySelector('#metric-aov-trend');
  const waitEl = document.querySelector('#metric-wait');
  const waitTrend = document.querySelector('#metric-wait-trend');
  const kickerEl = document.querySelector('#chart-kicker');

  if (revEl) revEl.innerHTML = `${snap.revenueStr}<small> tr</small>`;
  if (revTrend) {
    revTrend.textContent = snap.revenueTrend;
    revTrend.className = 'trend-up';
  }
  if (ordersEl) ordersEl.textContent = snap.ordersStr;
  if (ordersTrend) {
    ordersTrend.textContent = snap.ordersTrend;
    ordersTrend.className = 'trend-up';
  }
  if (aovEl) aovEl.innerHTML = `${snap.aovStr}<small>k</small>`;
  if (aovTrend) {
    aovTrend.textContent = snap.aovTrend;
    aovTrend.className = 'trend-up';
  }
  if (waitEl) waitEl.innerHTML = `${snap.waitStr}<small>′</small>`;
  if (waitTrend) {
    waitTrend.textContent = snap.waitTrend;
    waitTrend.className = 'down';
  }
  if (kickerEl) kickerEl.textContent = snap.kicker;

  const chartEl = document.querySelector('#sales-chart');
  if (chartEl) {
    chartEl.innerHTML = snap.chartDays.map(d => `
      <div>
        <span style="height: ${d.height}">
          ${d.val ? `<b>${d.val}</b>` : ''}
        </span>
        <small>${escapeHtml(d.day)}</small>
      </div>
    `).join('');
  }

  renderTopDishes();
}

function renderTopDishes() {
  const ranksEl = document.querySelector('#top-dish-ranks');
  if (!ranksEl) return;

  const menuItems = getStore('menuItems', appData.menuItems || []);
  const sorted = [...menuItems].filter(m => (m.orders || 0) > 0).sort((a, b) => (b.orders || 0) - (a.orders || 0)).slice(0, 5);

  if (sorted.length === 0) {
    ranksEl.innerHTML = '<div style="text-align: center; padding: 32px 14px; color: var(--muted);"><p style="margin: 0; font-size: 0.92rem; font-weight: 600;">Chưa có lượt gọi món phát sinh trong ca làm việc.</p><small style="display: block; margin-top: 6px;">Bảng xếp hạng món bán chạy sẽ tự động cập nhật ngay khi thực khách gọi món.</small></div>';
    return;
  }

  const maxOrders = Math.max(...sorted.map(d => d.orders || 1));

  ranksEl.innerHTML = sorted.map((d, index) => {
    const pct = Math.round(((d.orders || 0) / maxOrders) * 100);
    const revenue = ((d.orders || 0) * (d.price || 0)).toLocaleString('vi-VN');
    const badgeClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-normal';

    return `
      <div class="dish-rank-row">
        <span class="rank-badge ${badgeClass}">#${index + 1}</span>
        <div class="dish-rank-info">
          <div class="dish-rank-title">
            <strong>${escapeHtml(d.name)}</strong>
            <span class="rank-revenue">${revenue} đ</span>
          </div>
          <div class="dish-progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
            <span style="width: ${pct}%"></span>
          </div>
          <div class="dish-meta-sub">
            <small>${escapeHtml(d.category || 'Món chính')}</small>
            <small><strong>${d.orders || 0}</strong> lượt gọi</small>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function salesPage() {
  const select = document.querySelector('#period-select');
  renderSalesDashboard(select?.value || currentPeriod || 'this-week');
}

document.addEventListener('change', e => {
  if (e.target.id === 'period-select') {
    const period = e.target.value;
    renderSalesDashboard(period);
    toast(`Đã cập nhật số liệu: ${BASE_SALES_DATA[period]?.label || 'Kỳ đã chọn'}`);
  }
});

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.action === 'export-csv' || b.id === 'btn-export-csv') {
    const snap = buildPeriodSnapshot(currentPeriod);
    const csvContent = '\uFEFF' + snap.csv;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `menumind-bao-cao-${currentPeriod}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast(`Xuất báo cáo CSV thành công (${snap.label})`);
  }
});

bootPage(salesPage);
