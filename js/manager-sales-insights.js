/**
 * MenuMind - Báo cáo doanh số & Thống kê (TASK-13 / S13)
 * Nguyễn Hoàng Hải (SV3 - Leader)
 * Tiêu chí: Lọc động theo kỳ, Biểu đồ trực quan, Xuất CSV, Responsive & A11y
 */

const SALES_DATA = {
  'this-week': {
    label: 'Tuần này',
    kicker: 'Chu kỳ 7 ngày gần nhất',
    metrics: {
      revenue: '48,6',
      revenueUnit: ' tr',
      revenueTrend: '+12,4%',
      revenueTrendClass: 'trend-up',
      orders: '326',
      ordersTrend: '+8,1%',
      ordersTrendClass: 'trend-up',
      aov: '149',
      aovUnit: 'k',
      aovTrend: '+3,2%',
      aovTrendClass: 'trend-up',
      wait: '13',
      waitUnit: '′',
      waitTrend: '−2 phút',
      waitTrendClass: 'down'
    },
    days: [
      { day: 'T2', val: '6.2tr', height: '62%' },
      { day: 'T3', val: '7.8tr', height: '78%' },
      { day: 'T4', val: '5.4tr', height: '54%' },
      { day: 'T5', val: '8.8tr', height: '88%' },
      { day: 'T6', val: '7.2tr', height: '72%' },
      { day: 'T7', val: '9.6tr', height: '96%' },
      { day: 'CN', val: '8.4tr', height: '84%' }
    ],
    csv: 'Thứ,Ngày,Doanh thu (VND),Số đơn\nThứ 2,20/10/2026,6200000,42\nThứ 3,21/10/2026,7800000,53\nThứ 4,22/10/2026,5400000,38\nThứ 5,23/10/2026,8800000,60\nThứ 6,24/10/2026,7200000,49\nThứ 7,25/10/2026,9600000,65\nChủ Nhật,26/10/2026,8400000,57'
  },
  'last-week': {
    label: 'Tuần trước',
    kicker: 'Chu kỳ 7 ngày trước',
    metrics: {
      revenue: '43,2',
      revenueUnit: ' tr',
      revenueTrend: '+5,2%',
      revenueTrendClass: 'trend-up',
      orders: '301',
      ordersTrend: '+4,0%',
      ordersTrendClass: 'trend-up',
      aov: '144',
      aovUnit: 'k',
      aovTrend: '+1,5%',
      aovTrendClass: 'trend-up',
      wait: '15',
      waitUnit: '′',
      waitTrend: '0 phút',
      waitTrendClass: 'trend-up'
    },
    days: [
      { day: 'T2', val: '5.5tr', height: '55%' },
      { day: 'T3', val: '6.4tr', height: '64%' },
      { day: 'T4', val: '5.1tr', height: '51%' },
      { day: 'T5', val: '7.3tr', height: '73%' },
      { day: 'T6', val: '6.8tr', height: '68%' },
      { day: 'T7', val: '8.2tr', height: '82%' },
      { day: 'CN', val: '7.5tr', height: '75%' }
    ],
    csv: 'Thứ,Ngày,Doanh thu (VND),Số đơn\nThứ 2,13/10/2026,5500000,38\nThứ 3,14/10/2026,6400000,44\nThứ 4,15/10/2026,5100000,35\nThứ 5,16/10/2026,7300000,51\nThứ 6,17/10/2026,6800000,47\nThứ 7,18/10/2026,8200000,58\nChủ Nhật,19/10/2026,7500000,52'
  },
  'this-month': {
    label: 'Tháng này',
    kicker: 'Tổng hợp từ đầu tháng',
    metrics: {
      revenue: '186,4',
      revenueUnit: ' tr',
      revenueTrend: '+15,8%',
      revenueTrendClass: 'trend-up',
      orders: '1.280',
      ordersTrend: '+10,2%',
      ordersTrendClass: 'trend-up',
      aov: '146',
      aovUnit: 'k',
      aovTrend: '+4,1%',
      aovTrendClass: 'trend-up',
      wait: '14',
      waitUnit: '′',
      waitTrend: '−1 phút',
      waitTrendClass: 'down'
    },
    days: [
      { day: 'T1', val: '43.2tr', height: '72%' },
      { day: 'T2', val: '48.6tr', height: '81%' },
      { day: 'T3', val: '46.1tr', height: '77%' },
      { day: 'T4', val: '48.5tr', height: '81%' },
      { day: 'T5', val: '0tr', height: '0%' },
      { day: '—', val: '', height: '0%' },
      { day: '—', val: '', height: '0%' }
    ],
    csv: 'Tuần,Giai đoạn,Doanh thu (VND),Số đơn\nTuần 1,01/10-07/10,43200000,301\nTuần 2,08/10-14/10,48600000,326\nTuần 3,15/10-21/10,46100000,318\nTuần 4,22/10-28/10,48500000,335'
  }
};

let currentPeriod = 'this-week';

function renderSalesDashboard(periodKey) {
  const data = SALES_DATA[periodKey] || SALES_DATA['this-week'];
  currentPeriod = periodKey;

  // 1. Cập nhật các thẻ chỉ số (Metric Cards)
  const revEl = document.querySelector('#metric-revenue');
  const revTrend = document.querySelector('#metric-revenue-trend');
  const ordersEl = document.querySelector('#metric-orders');
  const ordersTrend = document.querySelector('#metric-orders-trend');
  const aovEl = document.querySelector('#metric-aov');
  const aovTrend = document.querySelector('#metric-aov-trend');
  const waitEl = document.querySelector('#metric-wait');
  const waitTrend = document.querySelector('#metric-wait-trend');
  const kickerEl = document.querySelector('#chart-kicker');

  if (revEl) revEl.innerHTML = `${data.metrics.revenue}<small>${data.metrics.revenueUnit}</small>`;
  if (revTrend) {
    revTrend.textContent = data.metrics.revenueTrend;
    revTrend.className = data.metrics.revenueTrendClass;
  }

  if (ordersEl) ordersEl.textContent = data.metrics.orders;
  if (ordersTrend) {
    ordersTrend.textContent = data.metrics.ordersTrend;
    ordersTrend.className = data.metrics.ordersTrendClass;
  }

  if (aovEl) aovEl.innerHTML = `${data.metrics.aov}<small>${data.metrics.aovUnit}</small>`;
  if (aovTrend) {
    aovTrend.textContent = data.metrics.aovTrend;
    aovTrend.className = data.metrics.aovTrendClass;
  }

  if (waitEl) waitEl.innerHTML = `${data.metrics.wait}<small>${data.metrics.waitUnit}</small>`;
  if (waitTrend) {
    waitTrend.textContent = data.metrics.waitTrend;
    waitTrend.className = data.metrics.waitTrendClass;
  }

  if (kickerEl) kickerEl.textContent = data.kicker;

  // 2. Cập nhật biểu đồ cột (Bar Chart)
  const chartEl = document.querySelector('#sales-chart');
  if (chartEl) {
    chartEl.innerHTML = data.days.map(d => `
      <div>
        <span style="height: ${d.height}">
          ${d.val ? `<b>${d.val}</b>` : ''}
        </span>
        <small>${d.day}</small>
      </div>
    `).join('');
  }

  // 3. Cập nhật Top món bán chạy
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
  renderSalesDashboard('this-week');
}

// Bắt sự kiện thay đổi kỳ báo cáo (Dropdown Select)
document.addEventListener('change', e => {
  if (e.target.id === 'period-select') {
    const period = e.target.value;
    renderSalesDashboard(period);
    toast(`Đã cập nhật số liệu: ${SALES_DATA[period]?.label || 'Kỳ đã chọn'}`);
  }
});

// Bắt sự kiện xuất file CSV
document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.action === 'export-csv' || b.id === 'btn-export-csv') {
    const data = SALES_DATA[currentPeriod] || SALES_DATA['this-week'];
    const csvContent = '\uFEFF' + data.csv; // Thêm BOM để hiển thị tiếng Việt UTF-8 chuẩn trong Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `menumind-bao-cao-${currentPeriod}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast(`Thành công (${data.label})`);
  }
});

// Khởi chạy trang
bootPage(salesPage);

