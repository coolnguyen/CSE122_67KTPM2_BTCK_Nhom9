/**
 * MenuMind - Trung tâm phản hồi khách & AI-3 Feedback Theme Extractor (TASK-14 / S14)
 * Nguyễn Hoàng Hải (SV3 - Leader)
 * Tiêu chí: Đầy đủ 6 bước AI trên UI, AI Failure/Uncertainty UX, Lưu localStorage thật
 */
const DEFAULT_FEEDBACK = [
  { id: 'f01', table: 'A02', rating: 5, text: 'Cá hồi áp chảo rất tươi và ngon, nhân viên phục vụ tận tình chu đáo.', theme: 'Hương vị món', status: 'new' },
  { id: 'f02', table: 'C01', rating: 3, text: 'Món ăn ngon vừa miệng nhưng khung giờ tối chờ món chính hơi lâu (khoảng 25 phút).', theme: 'Thời gian chờ', status: 'new' },
  { id: 'f03', table: 'B02', rating: 5, text: 'Không gian sân vườn thoáng đãng, các món chay phong phú và thanh đạm.', theme: 'Không gian', status: 'replied' },
  { id: 'f04', table: 'A06', rating: 4, text: 'Mì xào hải sản đậm đà, tôm tươi nhưng hơi cay so với khẩu vị trẻ nhỏ.', theme: 'Khẩu vị', status: 'new' },
  { id: 'f05', table: 'B04', rating: 2, text: 'Bàn ngoài vườn phải nhắc nhân viên 2 lần mới có thêm nước lọc và khăn lạnh.', theme: 'Thái độ phục vụ', status: 'new' },
  { id: 'f06', table: 'A01', rating: 5, text: 'Salad vườn rất giòn và sốt chanh mật ong đặc biệt, chắc chắn sẽ quay lại!', theme: 'Hương vị món', status: 'replied' },
  { id: 'f07', table: 'B03', rating: 3, text: 'Giờ cao điểm phục vụ lên món hơi chậm, mong quán cải thiện tốc độ ra món.', theme: 'Thời gian chờ', status: 'new' }
];

function getFeedbackList() {
  let feedback = getStore('feedback', null);
  if (!Array.isArray(feedback) || feedback.length === 0) {
    feedback = (Array.isArray(appData.feedback) && appData.feedback.length > 0) ? appData.feedback : DEFAULT_FEEDBACK;
    setStore('feedback', feedback);
    if (appData) appData.feedback = feedback;
  }
  return feedback;
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
          <footer>
            <span class="tag">${escapeHtml(item.theme || 'Chưa phân loại')}</span>
            <button type="button" class="link-button" data-reply-feedback="${escapeHtml(item.id)}">
              ${item.status === 'replied' ? 'Xem phản hồi' : 'Phản hồi khách'}
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

// Hàm AI-3: Feedback Theme Extractor (Bao phủ đủ 6 bước và Kịch bản Failure UX)
function runThemeAI(form) {
  const feedback = getFeedbackList();
  const goal = (new FormData(form).get('goal') || '').trim();
  const el = document.querySelector('#theme-result');
  if (!el) return;

  if (!feedback.length) {
    el.innerHTML = `
      <div class="ai-warning">
        <strong>Chưa có dữ liệu phản hồi</strong>
        <p>Hệ thống cần ít nhất 3 nhận xét từ khách để tiến hành khai phá chủ đề.</p>
      </div>
    `;
    return;
  }

  // Kịch bản AI Failure / Uncertainty UX (Barem: khi nhập quá ngắn dưới 10 ký tự)
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

  // Bước 2 trên UI: Processing (Hiển thị Loading Spinner)
  el.innerHTML = `
    <div class="ai-loading">
      <span></span>
      <p>AI đang khai phá và phân nhóm ${feedback.length} phản hồi của khách...</p>
    </div>
  `;

  // Giả lập xử lý mô hình AI NLP trong 800ms
  setTimeout(() => {
    // Bước 3, 4, 5 trên UI: Output + Explainability + User Control
    el.innerHTML = `
      <article class="ai-answer">
        <span class="confidence">Độ tin cậy: <strong>88%</strong> (Rất cao)</span>
        <h3>3 Chủ đề nổi bật được phân nhóm:</h3>
        <ol class="theme-list">
          <li><span>1. Thời gian chờ lên món</span><b>38%</b></li>
          <li><span>2. Hương vị món ăn</span><b>34%</b></li>
          <li><span>3. Thái độ phục vụ tại bàn</span><b>28%</b></li>
        </ol>

        <label for="ai-theme-copy" class="sr-only">Đề xuất hành động của AI</label>
        <textarea id="ai-theme-copy" rows="3" aria-label="Đề xuất hành động từ AI">Ưu tiên tăng cường 1 nhân sự phụ bếp khung giờ cao điểm 18:30–19:30 để giảm độ trễ món chính.</textarea>

        <details>
          <summary>Vì sao AI đề xuất kết quả này?</summary>
          <p>Thuật toán trích xuất các từ khóa xuất hiện lặp lại nhiều lần: "chờ lâu", "chậm", "nhắc nước", tập trung 80% vào các bàn khu vực vườn và sảnh ngoài.</p>
        </details>

        <div class="ai-actions">
          <button type="button" class="button small primary" data-action="save-theme">Lưu insight</button>
          <button type="button" class="button small quiet" data-action="edit-ai">Chỉnh sửa</button>
          <button type="button" class="link-button" data-action="rerun-theme">Tạo lại</button>
          <button type="button" class="link-button danger-text" data-action="reject-ai">Từ chối</button>
        </div>
      </article>
    `;
  }, 800);
}

// Bắt các sự kiện tương tác AI và Phản hồi khách
document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;

  // Bấm chip gợi ý trong Failure UX
  if (b.dataset.prompt) {
    const input = document.querySelector('#theme-form input[name="goal"]');
    if (input) {
      input.value = b.dataset.prompt;
      input.focus();
    }
  }

  const action = b.dataset.action;

  // Bước 6 trên UI: Save / Apply vào localStorage thật
  if (action === 'save-theme') {
    const textProposal = document.querySelector('#ai-theme-copy')?.value || '';
    const decision = {
      type: 'feedback-theme-extraction',
      proposal: textProposal,
      confidence: '88%',
      savedAt: new Date().toISOString()
    };
    setStore('aiDecision', decision);
    toast('Đã lưu kết quả phân tích AI vào hệ thống');
  }

  // User Control: Chỉnh sửa trực tiếp
  if (action === 'edit-ai') {
    const textarea = document.querySelector('#ai-theme-copy');
    if (textarea) {
      textarea.focus();
      textarea.select();
      toast('Bạn có thể chỉnh sửa trực tiếp nội dung đề xuất', 'info');
    }
  }

  // User Control: Chạy lại
  if (action === 'rerun-theme') {
    document.querySelector('#theme-form')?.requestSubmit();
  }

  // User Control: Từ chối kết quả
  if (action === 'reject-ai') {
    const res = document.querySelector('#theme-result');
    if (res) {
      res.innerHTML = emptyState('Đã hủy bỏ đề xuất', 'Bạn có thể thay đổi mục tiêu phân tích để AI gợi ý lại.');
    }
    toast('Đã từ chối gợi ý của AI', 'info');
  }

  // Modal phản hồi khách
  if (b.dataset.replyFeedback) {
    const feedback = getFeedbackList();
    const item = feedback.find(f => f.id === b.dataset.replyFeedback);
    if (item) {
      item.status = 'replied';
      setStore('feedback', feedback);
      feedbackPage();
      toast(`Đã gửi phản hồi cảm ơn tới Bàn ${item.table}`);
    }
  }
});

// Bắt sự kiện submit form AI
document.addEventListener('submit', e => {
  if (e.target.id === 'theme-form') {
    e.preventDefault();
    runThemeAI(e.target);
  }
});

// Khởi chạy trang
bootPage(feedbackPage);
