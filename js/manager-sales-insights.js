function salesPage() {
  const ranksEl = document.querySelector('#top-dish-ranks');
  if (ranksEl) {
    ranksEl.innerHTML = [...appData.menuItems].sort((a, b) => b.orders - a.orders).slice(0, 5).map((i, n) => `<div class="rank-row"><span>${n + 1}</span><div><strong>${escapeHtml(i.name)}</strong><small>${i.orders} lượt gọi</small></div><b>${money(i.price * i.orders)}</b></div>`).join('');
  }
}

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.action === 'export-csv') {
    const csv = 'Ngày,Doanh thu\n18/10,6200000\n19/10,7800000\n20/10,5400000';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'menumind-doanh-thu.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Đã xuất báo cáo CSV');
  }
});

bootPage(salesPage);
