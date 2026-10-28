// ==========================================================================
// js/index.js - MenuMind Bistro: Thương hiệu Ẩm Thực & Khám Phá Không Gian Bàn
// ==========================================================================

let homeZoneFilter = 'Tất cả';

// ==========================================================================
// 1. CHEF'S SIGNATURE CAROUSEL CONTROLLER
// ==========================================================================
const SIGNATURE_DISH_IDS = ['m01', 'm02', 'm12', 'm04', 'm07'];
let heroCarouselIndex = 0;
let heroCarouselTimer = null;
let heroCarouselDishes = [];
let heroCarouselBound = false;

function getFeaturedDishes(menuItems) {
  const curated = SIGNATURE_DISH_IDS
    .map(id => menuItems.find(m => m.id === id && m.available !== false))
    .filter(Boolean);

  if (curated.length >= 3) return curated;

  // Dự phòng: Lấy top món đánh giá cao nhất nếu dữ liệu thay đổi
  const sorted = [...menuItems]
    .filter(m => m.available !== false)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return sorted.slice(0, 5);
}

function mountHeroCarousel(menuItems) {
  const wrapper = document.querySelector('#hero-carousel');
  const track = document.querySelector('#carousel-track');
  const dotsContainer = document.querySelector('#carousel-dots');
  const counterCurrent = document.querySelector('#carousel-current');
  const counterTotal = document.querySelector('#carousel-total');
  const prevBtn = document.querySelector('#carousel-prev');
  const nextBtn = document.querySelector('#carousel-next');

  if (!wrapper || !track) return;

  heroCarouselDishes = getFeaturedDishes(menuItems);
  if (!heroCarouselDishes.length) return;

  const total = heroCarouselDishes.length;
  if (heroCarouselIndex >= total) heroCarouselIndex = 0;

  // Render các slide món ăn tinh hoa
  track.innerHTML = heroCarouselDishes.map((dish, idx) => {
    const tags = Array.isArray(dish.tags) && dish.tags.length > 0
      ? dish.tags.join(' · ')
      : `${dish.category || 'Món chính'} · Thượng hạng`;
    const editionCode = `N° 0${idx + 1}`;
    const ratingText = dish.rating ? `Đánh giá ${dish.rating} / 5.0` : 'Đánh giá 4.9 / 5.0';
    const prepTime = dish.time ? `Chế biến ~${dish.time} phút` : 'Chế biến ~15 phút';
    const imgSrc = typeof dishImage === 'function' ? dishImage(dish) : (dish.image || 'assets/images/menu/m01.jpg');

    return `
      <article class="carousel-slide ${idx === heroCarouselIndex ? 'active' : ''}" data-slide-index="${idx}" aria-label="${escapeHtml(dish.name)}">
        <div class="masterpiece-card">
          <div class="dish-visual-frame">
            <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(dish.name)}" class="hero-dish-photo" loading="${idx === 0 ? 'eager' : 'lazy'}">
            <div class="dish-overlay-gradient"></div>
            <span class="curated-badge">Chef's Signature · ${escapeHtml(dish.category || 'Món chính')}</span>
            <span class="dish-badge-price">${money(dish.price)}</span>
          </div>
          <div class="dish-story-body">
            <div class="dish-story-head">
              <div>
                <span class="dish-category-tag">${escapeHtml(tags)}</span>
                <h2>${escapeHtml(dish.name)}</h2>
              </div>
              <span class="dish-edition">${editionCode}</span>
            </div>
            <p>${escapeHtml(dish.description || 'Hương vị tinh tế được tuyển chọn từ nguyên liệu tươi ngon thượng hạng.')}</p>
            <div class="dish-story-foot">
              <a href="pages/diner-dish-detail.html?id=${encodeURIComponent(dish.id)}" class="button small quiet view-dish-btn">Xem chi tiết món →</a>
              <div class="dish-highlights">
                <span class="rating-badge">${escapeHtml(ratingText)}</span>
                <span class="prep-badge">${escapeHtml(prepTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Render chấm tròn định vị (dots)
  if (dotsContainer) {
    dotsContainer.innerHTML = heroCarouselDishes.map((_, idx) => `
      <button type="button" class="carousel-dot ${idx === heroCarouselIndex ? 'active' : ''}" data-index="${idx}" aria-label="Đến món số ${idx + 1}"></button>
    `).join('');
  }

  // Cập nhật tổng số slide
  if (counterTotal) {
    counterTotal.textContent = String(total).padStart(2, '0');
  }

  function updateCarouselUI() {
    track.style.transform = `translateX(-${heroCarouselIndex * 100}%)`;

    if (counterCurrent) {
      counterCurrent.textContent = String(heroCarouselIndex + 1).padStart(2, '0');
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === heroCarouselIndex);
      });
    }

    const slides = track.querySelectorAll('.carousel-slide');
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === heroCarouselIndex);
    });
  }

  function nextSlide() {
    heroCarouselIndex = (heroCarouselIndex + 1) % total;
    updateCarouselUI();
  }

  function prevSlide() {
    heroCarouselIndex = (heroCarouselIndex - 1 + total) % total;
    updateCarouselUI();
  }

  function goToSlide(idx) {
    heroCarouselIndex = Math.max(0, Math.min(idx, total - 1));
    updateCarouselUI();
  }

  function startAutoPlay() {
    stopAutoPlay();
    heroCarouselTimer = setInterval(nextSlide, 4500);
  }

  function stopAutoPlay() {
    if (heroCarouselTimer) {
      clearInterval(heroCarouselTimer);
      heroCarouselTimer = null;
    }
  }

  // Chỉ gắn bộ lắng nghe sự kiện một lần duy nhất
  if (!heroCarouselBound) {
    heroCarouselBound = true;

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoPlay();
      });
    }

    if (dotsContainer) {
      dotsContainer.addEventListener('click', e => {
        const dot = e.target.closest('.carousel-dot');
        if (dot && dot.dataset.index !== undefined) {
          goToSlide(parseInt(dot.dataset.index, 10));
          startAutoPlay();
        }
      });
    }

    // Tạm dừng khi rê chuột hoặc chạm vào slide để khách đọc mô tả món
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
    wrapper.addEventListener('focusin', stopAutoPlay);
    wrapper.addEventListener('focusout', startAutoPlay);

    // Hỗ trợ vuốt tay mượt mà trên Mobile & Tablet (Touch Swipe)
    let touchStartX = 0;
    let touchStartY = 0;

    wrapper.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      stopAutoPlay();
    }, { passive: true });

    wrapper.addEventListener('touchend', e => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoPlay();
    }, { passive: true });

    // Hỗ trợ phím mũi tên bàn phím khi trỏ chuột vào vùng slide
    window.addEventListener('keydown', e => {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (wrapper.matches(':hover') || wrapper.contains(document.activeElement)) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
          startAutoPlay();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextSlide();
          startAutoPlay();
        }
      }
    });
  }

  updateCarouselUI();
  startAutoPlay();
}

// ==========================================================================
// 2. MAIN HOMEPAGE RENDER CONTROLLER
// ==========================================================================
function homePage() {
  const tables = getStore('tables', appData.tables || []);
  const orders = getStore('orders', appData.orders || []);
  const menuItems = getStore('menuItems', appData.menuItems || []);
  const payments = getStore('payments', appData.payments || []);

  // 1. Khởi động Carousel món ăn tinh hoa bếp trưởng
  mountHeroCarousel(menuItems);

  // 2. Render bộ lọc không gian (Khu vực nhà hàng)
  const zones = ['Tất cả', ...new Set(tables.map(t => t.zone))];
  const zoneBar = document.querySelector('#home-zone-filter');
  if (zoneBar) {
    zoneBar.innerHTML = zones.map(z => `
      <button type="button" class="chip ${homeZoneFilter === z ? 'active' : ''}" data-home-zone="${escapeHtml(z)}">
        ${escapeHtml(z)}
      </button>
    `).join('');
  }

  // 3. Render danh sách bàn ăn & không gian thưởng thức
  const filteredTables = homeZoneFilter === 'Tất cả'
    ? tables
    : tables.filter(t => t.zone === homeZoneFilter);

  const grid = document.querySelector('#home-table-grid');
  if (!grid) return;

  const currentSelectedTable = typeof getActiveTable === 'function' ? getActiveTable() : 'A01';

  grid.innerHTML = filteredTables.map(t => {
    const tableOrders = orders.filter(o => o.table === t.id && o.status !== 'cancelled');
    const activeTableOrders = tableOrders.filter(o => ['new', 'cooking', 'ready'].includes(o.status));
    const pendingPayment = payments.find(p => p.table_code === t.id && p.status === 'pending');
    const isCleaning = t.status === 'cleaning';
    const isSelected = t.id === currentSelectedTable;

    let statusText = 'Sẵn sàng đón khách';
    if (isCleaning) {
      statusText = 'Đang dọn dẹp & sát khuẩn';
    } else if (pendingPayment) {
      statusText = `Đang thanh toán (${money(pendingPayment.amount)})`;
    } else if (activeTableOrders.length > 0) {
      statusText = `${activeTableOrders.length} món đang phục vụ`;
    } else if (t.status === 'occupied') {
      statusText = 'Bàn đang có khách';
    }

    return `
      <article class="home-table-card ${escapeHtml(t.status)}">
        <header>
          <strong>Bàn ${escapeHtml(t.id)}${isSelected ? ' <small style="font-size:.72rem;color:var(--leaf);font-weight:600;">(Đang chọn)</small>' : ''}</strong>
          ${badge(pendingPayment ? 'pending' : t.status)}
        </header>
        <div class="home-table-meta">
          <span>Khu vực: ${escapeHtml(t.zone)}</span>
          <span>${t.seats} chỗ ngồi</span>
        </div>
        <small>${escapeHtml(statusText)}</small>
        <div class="home-table-actions">
          ${isCleaning
            ? `<button type="button" class="button small quiet" disabled>Đang dọn dẹp</button>`
            : `<button type="button" class="button small primary" data-enter-table="${escapeHtml(t.id)}">
                 ${t.status === 'occupied' ? 'Mở thực đơn bàn' : 'Quét QR / Ngồi bàn này'}
               </button>`
          }
          ${tableOrders.length > 0 && !isCleaning
            ? `<button type="button" class="button small quiet" data-track-table="${escapeHtml(t.id)}">Theo dõi đơn</button>`
            : ''
          }
        </div>
      </article>
    `;
  }).join('');
}

document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.homeZone) {
    homeZoneFilter = b.dataset.homeZone;
    homePage();
    return;
  }

  if (b.dataset.enterTable) {
    const code = b.dataset.enterTable;
    const tables = getStore('tables', appData.tables || []);
    const target = tables.find(t => t.id === code);
    if (target && target.status === 'cleaning') {
      toast(`Bàn ${code} đang được dọn dẹp, quý khách vui lòng chọn bàn khác`, 'error');
      return;
    }
    if (target && (target.status === 'available' || target.status === 'reserved')) {
      target.status = 'occupied';
      setStore('tables', tables);
    }
    const qr = setActiveTable(code);
    location.href = `pages/diner-menu.html?table=${encodeURIComponent(qr.table)}&id=${encodeURIComponent(qr.token)}`;
    return;
  }

  if (b.dataset.trackTable) {
    const code = b.dataset.trackTable;
    const qr = setActiveTable(code);
    location.href = `pages/diner-order-status.html?table=${encodeURIComponent(qr.table)}&id=${encodeURIComponent(qr.token)}`;
  }
});

bootPage(homePage);
