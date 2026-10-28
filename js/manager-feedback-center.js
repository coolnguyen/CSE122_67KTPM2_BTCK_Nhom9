/**
 * ============================================================================
 * MENUMIND - MODULE TRUNG TÂM PHẢN HỒI & AI-3 FEEDBACK THEME EXTRACTOR (S14)
 * Nguyễn Hoàng Hải (SV3 - Leader)
 * ============================================================================
 */

const DEFAULT_FEEDBACK = [];

function getFeedbackList() {
  const stored = getStore('feedback', null);
  if (Array.isArray(stored)) {
    return stored;
  }
  const initial = Array.isArray(appData.feedback) ? appData.feedback : [];
  setStore('feedback', initial, true);
  return initial;
}

function feedbackPage() {
  const feedback = getFeedbackList();
  const ratings = feedback.map(item => Number(item.rating)).filter(value => value >= 1 && value <= 5);
  const average = ratings.length ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1).replace('.', ',') : '—';
  const positive = ratings.length ? Math.round(ratings.filter(value => value >= 4).length * 100 / ratings.length) : 0;
  const needsImprovement = ratings.length ? 100 - positive : 0;

  const items = feedback.length
    ? feedback.map(item => {
      const rating = Math.max(1, Math.min(5, Number(item.rating) || 1));
      const hasReplied = item.status === 'replied' || Boolean(item.reply);
      const replyContent = item.reply || (hasReplied ? 'MenuMind xin chân thành cảm ơn quý khách đã gửi nhận xét đánh giá cho nhà hàng!' : '');

      const replyHtml = hasReplied ? `
        <div class="feedback-reply">
          <div class="reply-header">
            <strong>💬 Phản hồi của Quản lý:</strong>
            <span class="reply-time">${item.repliedAt ? new Date(item.repliedAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : 'Đã gửi'}</span>
          </div>
          <p class="reply-body">${escapeHtml(replyContent)}</p>
        </div>
      ` : '';

      return `
        <article class="feedback-item">
          <header>
            <div>
              <strong>Bàn ${escapeHtml(item.table || '—')}</strong>
              <span aria-label="${rating} trên 5 sao">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span>
            </div>
            ${badge(item.status || 'new')}
          </header>
          <blockquote>“${escapeHtml(item.text || '')}”</blockquote>
          ${replyHtml}
          <footer>
            <span class="tag">${escapeHtml(item.theme || 'Chưa phân loại')}</span>
            <button type="button" class="button small ${hasReplied ? 'quiet' : 'primary'}" data-reply-feedback="${escapeHtml(item.id)}">
              ${hasReplied ? '✏️ Xem & Sửa phản hồi' : '💬 Phản hồi khách'}
            </button>
          </footer>
        </article>
      `;
    }).join('')
    : emptyState('Chưa có phản hồi', 'Đánh giá của khách sau khi dùng bữa sẽ xuất hiện tại đây.');

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
  const allFeedback = getFeedbackList();
  const fd = new FormData(form);
  const source = String(fd.get('source') || 'all');
  const goal = String(fd.get('goal') || '').trim();
  const el = document.querySelector('#theme-result');
  if (!el) return;

  const targetFeedback = source === 'low'
    ? allFeedback.filter(f => Number(f.rating) <= 3)
    : allFeedback;

  if (!targetFeedback.length) {
    el.innerHTML = `
      <div class="ai-warning">
        <strong>Chưa có dữ liệu phản hồi ở nhóm này</strong>
        <p>Hiện không có phản hồi nào thuộc bộ lọc đã chọn để AI tiến hành khai phá chủ đề.</p>
      </div>
    `;
    return;
  }

  if (goal.length < 10) {
    el.innerHTML = `
      <div class="ai-warning" role="alert">
        <span class="confidence low">Độ tin cậy thấp: <strong>32%</strong></span>
        <strong>Yêu cầu quá ngắn để AI phân tích chính xác</strong>
        <p>Mục tiêu phân tích cần ít nhất 10 ký tự. Bạn có thể chọn một trong các gợi ý dưới đây:</p>
        <div class="prompt-chips">
          <button type="button" data-prompt="Tìm vấn đề phục vụ giờ cao điểm">Vấn đề phục vụ</button>
          <button type="button" data-prompt="Tìm món ăn cần cải thiện hương vị">Món cần cải thiện</button>
          <button type="button" data-prompt="Đánh giá thái độ nhân viên sảnh">Thái độ nhân viên</button>
        </div>
      </div>
    `;
    return;
  }

  el.innerHTML = `
    <div class="ai-loading">
      <span></span>
      <p>AI đang khai phá và phân nhóm ${targetFeedback.length} phản hồi thực tế...</p>
    </div>
  `;

  setTimeout(() => {
    // Tính toán tỷ lệ chủ đề thực tế từ danh sách feedback
    const counts = {};
    targetFeedback.forEach(item => {
      const t = item.theme || 'Dịch vụ chung';
      counts[t] = (counts[t] || 0) + 1;
    });
    const topThemes = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count], idx) => ({
        rank: idx + 1,
        name,
        pct: Math.round((count / targetFeedback.length) * 100)
      }));

    const sampleTables = [...new Set(targetFeedback.slice(0, 4).map(f => `Bàn ${f.table}`))].join(', ');
    const topIssue = topThemes[0]?.name || 'Thời gian chờ';

    let proposalText = 'Ưu tiên tăng cường 1 nhân sự phụ bếp khung giờ cao điểm 18:30–20:00 và rà soát tốc độ phục vụ khu vực bàn vườn.';
    if (topIssue.includes('Hương vị') || goal.toLowerCase().includes('món')) {
      proposalText = 'Giữ chuẩn công thức món Cá hồi áp chảo & Salad vườn đang được khen nhiều, đồng thời thêm tùy chọn giảm cay cho trẻ nhỏ.';
    } else if (topIssue.includes('Thái độ') || goal.toLowerCase().includes('nhân viên')) {
      proposalText = 'Phân công cố định 1 nhân viên trực khu vực Sân vườn để chủ động châm nước lọc và hỗ trợ khách không cần nhắc lại.';
    }

    el.innerHTML = `
      <article class="ai-answer">
        <span class="confidence">Độ tin cậy: <strong>91%</strong> (${targetFeedback.length} mẫu đánh giá)</span>
        <h3>Chủ đề nổi bật được phân nhóm:</h3>
        <ol class="theme-list">
          ${topThemes.map(t => `<li><span>${t.rank}. ${escapeHtml(t.name)}</span><b>${t.pct}%</b></li>`).join('')}
        </ol>

        <label for="ai-theme-copy" class="sr-only">Đề xuất hành động của AI</label>
        <textarea id="ai-theme-copy" rows="3" aria-label="Đề xuất hành động từ AI">${escapeHtml(proposalText)}</textarea>

        <details>
          <summary>Vì sao AI đề xuất kết quả này?</summary>
          <p>Thuật toán tổng hợp trực tiếp từ ${targetFeedback.length} đánh giá tại ${escapeHtml(sampleTables)} theo mục tiêu “${escapeHtml(goal)}”.</p>
        </details>

        <div class="ai-actions">
          <button type="button" class="button small primary" data-action="save-theme">Lưu insight</button>
          <button type="button" class="button small quiet" data-action="edit-ai">Chỉnh sửa</button>
          <button type="button" class="link-button" data-action="rerun-theme">Tạo lại</button>
          <button type="button" class="link-button danger-text" data-action="reject-ai">Từ chối</button>
        </div>
      </article>
    `;
  }, 550);
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

  if (b.dataset.replyTemplate) {
    const messageInput = document.querySelector('#reply-message');
    if (messageInput) {
      messageInput.value = b.dataset.replyTemplate;
      messageInput.focus();
    }
  }

  const action = b.dataset.action;

  if (action === 'save-theme') {
    const textProposal = document.querySelector('#ai-theme-copy')?.value || '';
    const decision = {
      type: 'feedback-theme-extraction',
      proposal: textProposal,
      confidence: '91%',
      savedAt: new Date().toISOString()
    };
    setStore('aiDecision', decision);
    toast('Đã lưu kết quả phân tích AI vào hệ thống');
  }

  if (action === 'edit-ai') {
    const textarea = document.querySelector('#ai-theme-copy');
    if (textarea) {
      textarea.focus();
      textarea.select();
      toast('Bạn có thể chỉnh sửa trực tiếp nội dung đề xuất', 'info');
    }
  }

  if (action === 'rerun-theme') {
    document.querySelector('#theme-form')?.requestSubmit();
  }

  if (action === 'reject-ai') {
    const res = document.querySelector('#theme-result');
    if (res) {
      res.innerHTML = emptyState('Đã hủy bỏ đề xuất', 'Bạn có thể thay đổi mục tiêu phân tích để AI gợi ý lại.');
    }
    toast('Đã từ chối gợi ý của AI', 'info');
  }

  if (b.dataset.replyFeedback) {
    const feedback = getFeedbackList();
    const item = feedback.find(f => f.id === b.dataset.replyFeedback);
    if (!item) return;

    const dialog = document.querySelector('#reply-dialog');
    const idInput = document.querySelector('#reply-feedback-id');
    const tableEl = document.querySelector('#reply-customer-table');
    const starsEl = document.querySelector('#reply-customer-stars');
    const textEl = document.querySelector('#reply-customer-text');
    const messageInput = document.querySelector('#reply-message');

    if (dialog && idInput && messageInput) {
      idInput.value = item.id;
      if (tableEl) tableEl.textContent = `Bàn ${item.table || '—'}`;
      const rating = Math.max(1, Math.min(5, Number(item.rating) || 5));
      if (starsEl) starsEl.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      if (textEl) textEl.textContent = `“${item.text || ''}”`;
      messageInput.value = item.reply || '';
      dialog.showModal();
    }
  }
});

document.addEventListener('submit', e => {
  if (e.target.id === 'theme-form') {
    e.preventDefault();
    runThemeAI(e.target);
  }

  if (e.target.id === 'reply-feedback-form') {
    e.preventDefault();
    const form = e.target;
    const id = form.querySelector('#reply-feedback-id')?.value;
    const replyText = form.querySelector('#reply-message')?.value?.trim();

    if (!id || !replyText) {
      toast('Vui lòng nhập nội dung phản hồi', 'error');
      return;
    }

    const feedback = getFeedbackList();
    const item = feedback.find(f => f.id === id);
    if (item) {
      item.status = 'replied';
      item.reply = replyText;
      item.repliedAt = new Date().toISOString();
      setStore('feedback', feedback);
      if (appData) appData.feedback = feedback;

      feedbackPage();
      const dialog = document.querySelector('#reply-dialog');
      if (dialog) dialog.close();
      toast(`Đã gửi phản hồi thành công tới Bàn ${item.table}!`);
    }
  }
});

bootPage(feedbackPage);
