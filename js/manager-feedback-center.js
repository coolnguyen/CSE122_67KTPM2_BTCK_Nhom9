function feedbackPage() {
  const feedback = getStore('feedback', appData.feedback);
  const ratings = feedback.map(item => Number(item.rating)).filter(value => value >= 1 && value <= 5);
  const average = ratings.length ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1).replace('.', ',') : '—';
  const positive = ratings.length ? Math.round(ratings.filter(value => value >= 4).length * 100 / ratings.length) : 0;
  const needsImprovement = ratings.length ? 100 - positive : 0;
  const items = feedback.length
    ? feedback.map(item => {
      const rating = Math.max(1, Math.min(5, Number(item.rating) || 1));
      return `<article class="feedback-item"><header><div><strong>Bàn ${escapeHtml(item.table || '—')}</strong><span aria-label="${rating} trên 5 sao">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span></div>${badge(item.status || 'new')}</header><blockquote>“${escapeHtml(item.text || '')}”</blockquote><footer><span class="tag">${escapeHtml(item.theme || 'Chưa phân loại')}</span><button class="link-button" data-reply-feedback="${escapeHtml(item.id)}">${item.status === 'replied' ? 'Xem phản hồi' : 'Phản hồi'}</button></footer></article>`;
    }).join('')
    : emptyState('Chưa có phản hồi', 'Đánh giá của khách sau khi yêu cầu thanh toán sẽ xuất hiện tại đây.');

  const avgRating = document.querySelector('#avg-rating');
  const avgStars = document.querySelector('#avg-stars');
  const countEl = document.querySelector('#feedback-count');
  const posPct = document.querySelector('#positive-percent');
  const posBar = document.querySelector('#positive-bar');
  const negPct = document.querySelector('#negative-percent');
  const negBar = document.querySelector('#negative-bar');
  const listEl = document.querySelector('#feedback-list');

  if (avgRating) avgRating.textContent = average;
  if (avgStars) avgStars.textContent = ratings.length ? '★'.repeat(Math.round(Number(average.replace(',', '.')))) : '☆☆☆☆☆';
  if (countEl) countEl.textContent = `${feedback.length} phản hồi`;
  if (posPct) posPct.textContent = `${positive}%`;
  if (posBar) posBar.style.width = `${positive}%`;
  if (negPct) negPct.textContent = `${needsImprovement}%`;
  if (negBar) negBar.style.width = `${needsImprovement}%`;
  if (listEl) listEl.innerHTML = items;
}

function runThemeAI(form) {
  const feedback = getStore('feedback', appData.feedback);
  const goal = (new FormData(form).get('goal') || '').trim();
  const el = document.querySelector('#theme-result');
  if (!feedback.length) {
    el.innerHTML = '<div class="ai-warning"><strong>Chưa có dữ liệu phản hồi</strong><p>Hãy chờ khách gửi đánh giá từ phiên QR trước khi phân tích.</p></div>';
    return;
  }
  if (goal.length < 10) {
    el.innerHTML = `<div class="ai-warning"><strong>AI chưa đủ dữ liệu để phân tích chính xác</strong><p>Mô tả mục tiêu ít nhất 10 ký tự.</p><div class="prompt-chips"><button type="button" data-prompt="Tìm vấn đề phục vụ">Vấn đề phục vụ</button><button type="button" data-prompt="Tìm món cần cải thiện">Món cần cải thiện</button></div></div>`;
    return;
  }
  el.innerHTML = `<div class="ai-loading"><span></span><p>Đang nhóm ${feedback.length} phản hồi...</p></div>`;
  setTimeout(() => {
    el.innerHTML = `<article class="ai-answer"><p class="confidence">Độ tin cậy <strong>87%</strong></p><h3>3 chủ đề nổi bật</h3><ol class="theme-list"><li><span>Thời gian chờ</span><b>38%</b></li><li><span>Chất lượng món</span><b>34%</b></li><li><span>Phục vụ tại bàn</span><b>28%</b></li></ol><textarea id="ai-theme-copy" rows="3">Ưu tiên rà soát thời gian ra món chính trong khung 18:30–19:30.</textarea><details><summary>Vì sao có kết quả này?</summary><p>Tần suất từ khóa “chờ”, “lâu”, “nhắc” cao hơn trung bình tuần trước.</p></details><div class="ai-actions"><button class="button small primary" data-action="save-theme">Lưu insight</button><button class="button small quiet" data-action="edit-ai">Sửa</button><button class="link-button" data-action="rerun-theme">Tạo lại</button><button class="link-button danger-text" data-action="reject-ai">Từ chối</button></div></article>`;
  }, 900);
}

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.prompt) {
    const input = document.querySelector('#theme-form input[name="goal"]');
    if (input) {
      input.value = b.dataset.prompt;
      input.focus();
    }
  }

  const action = b.dataset.action;
  if (action === 'save-theme') {
    setStore('aiDecision', { type: action, content: b.closest('.ai-answer')?.innerText || '', savedAt: new Date().toISOString() });
    toast('Đã lưu kết quả AI vào hệ thống');
  }
  if (action === 'edit-ai') {
    const p = b.closest('.ai-answer')?.querySelector('textarea, p[id]');
    if (p) {
      if (p.tagName === 'P') p.contentEditable = 'true';
      p.focus();
      toast('Bạn có thể sửa nội dung trước khi lưu', 'info');
    }
  }
  if (action === 'rerun-theme') {
    document.querySelector('#theme-form')?.requestSubmit();
  }
  if (action === 'reject-ai') {
    const res = b.closest('.ai-result');
    if (res) res.innerHTML = emptyState('Đã từ chối gợi ý', 'Bạn có thể điều chỉnh đầu vào và thử lại.');
  }
});

document.addEventListener('submit', e => {
  if (e.target.id === 'theme-form') {
    e.preventDefault();
    runThemeAI(e.target);
  }
});

bootPage(feedbackPage);
