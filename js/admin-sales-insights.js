/**
 * ============================================================================
 * MENUMIND - MODULE BÁO CÁO DOANH SỐ & THỐNG KÊ THỜI GIAN THỰC (S13)
 * Nguyễn Hoàng Hải (SV3 - Leader)
 * ============================================================================
 */

const BASE_SALES_DATA = {
  'this-week': {
    label: 'Tuần này (Trực tiếp)',
    kicker: 'Chu kỳ 7 ngày gần nhất + Doanh thu phiên hiện tại',
    baseRevenueVnd: 48600000,
    baseOrders: 326,
    revenueTrend: '+12,4%',
    ordersTrend: '+8,1%',
    aovTrend: '+3,2%',
    waitTrend: '−2 phút',
    days: [
      { day: 'T2', date: '20/10/2026', rev: 6200000, orders: 42 },
      { day: 'T3', date: '21/10/2026', rev: 7800000, orders: 53 },
      { day: 'T4', date: '22/10/2026', rev: 5400000, orders: 38 },
      { day: 'T5', date: '23/10/2026', rev: 8800000, orders: 60 },
      { day: 'T6', date: '24/10/2026', rev: 7200000, orders: 49 },
      { day: 'T7', date: '25/10/2026', rev: 9600000, orders: 65 },
      { day: 'H.Nay', date: '27/10/2026', rev: 3600000, orders: 19, isLiveToday: true }
    ]
  },
  'last-week': {
    label: 'Tuần trước',
    kicker: 'Chu kỳ 7 ngày trước',
    baseRevenueVnd: 43200000,
    baseOrders: 301,
    revenueTrend: '+5,2%',
    ordersTrend: '+4,0%',
    aovTrend: '+1,5%',
    waitTrend: '0 phút',
    days: [
      { day: 'T2', date: '13/10/2026', rev: 5500000, orders: 38 },
      { day: 'T3', date: '14/10/2026', rev: 6400000, orders: 44 },
      { day: 'T4', date: '15/10/2026', rev: 5100000, orders: 35 },
      { day: 'T5', date: '16/10/2026', rev: 7300000, orders: 51 },
      { day: 'T6', date: '17/10/2026', rev: 6800000, orders: 47 },
      { day: 'T7', date: '18/10/2026', rev: 8200000, orders: 58 },
      { day: 'CN', date: '19/10/2026', rev: 3900000, orders: 28 }
    ]
  },
  'this-month': {
    label: 'Tháng này (Trực tiếp)',
    kicker: 'Tổng hợp từ đầu tháng + Phiên trực tiếp',
    baseRevenueVnd: 186400000,
    baseOrders: 1280,
    revenueTrend: '+15,8%',
    ordersTrend: '+10,2%',
    aovTrend: '+4,1%',
    waitTrend: '−1 phút',
    days: [
      { day: 'Tuần 1', date: '01/10-07/10', rev: 43200000, orders: 301 },
      { day: 'Tuần 2', date: '08/10-14/10', rev: 48600000, orders: 326 },
      { day: 'Tuần 3', date: '15/10-21/10', rev: 46100000, orders: 318 },
      { day: 'Tuần 4', date: '22/10-28/10', rev: 48500000, orders: 335, isLiveToday: true }
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
  const sorted = [...menuItems].sort((a, b) => (b.orders || 0) - (a.orders || 0)).slice(0, 5);

  if (sorted.length === 0) {
    ranksEl.innerHTML = '<p class="fine-print">Chưa có dữ liệu gọi món.</p>';
    return;
  }

  ranksEl.innerHTML = sorted.map((item, index) => `
    <div class="rank-row">
      <span aria-hidden="true">${index + 1}</span>
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <small>${item.orders || 0} lượt gọi · ${escapeHtml(item.category || 'Món')}</small>
      </div>
      <b>${money((item.price || 0) * (item.orders || 0))}</b>
    </div>
  `).join('');
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
