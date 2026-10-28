// ==========================================================================
// js/common.js - MenuMind Core Runtime, State Store & Real-Time Sync Engine
// ==========================================================================

const ROOT = document.body.dataset.root || '.';
const PAGE = document.body.dataset.page || 'home';
const pageTitle = document.body.dataset.title || 'MenuMind';

const fallbackData = {"menuItems": [{"id": "m01", "name": "Cá hồi áp chảo sốt chanh", "category": "Món chính", "price": 189000, "time": 18, "spicy": 0, "vegetarian": false, "available": true, "rating": 4.9, "orders": 128, "emoji": "🐟", "image": "assets/images/menu/m01.jpg", "description": "Cá hồi áp chảo da giòn, sốt chanh bơ, rau xanh và khoai nghiền.", "tags": ["giàu đạm", "bán chạy"]}, {"id": "m02", "name": "Sườn bò nướng sốt tiêu", "category": "Món chính", "price": 219000, "time": 20, "spicy": 1, "vegetarian": false, "available": true, "rating": 4.8, "orders": 102, "emoji": "🥩", "image": "assets/images/menu/m02.jpg", "description": "Sườn bò nướng mềm, sốt tiêu đen, cà chua và rau củ theo mùa.", "tags": ["đậm vị", "bán chạy"]}, {"id": "m03", "name": "Salad vườn sốt chanh", "category": "Khai vị", "price": 89000, "time": 9, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.7, "orders": 88, "emoji": "🥗", "image": "assets/images/menu/m03.jpg", "description": "Xà lách non, cà chua bi, bánh mì giòn và sốt chanh mật ong.", "tags": ["tươi mát", "ít calo"]}, {"id": "m04", "name": "Salad ngũ sắc hạt điều", "category": "Món chay", "price": 99000, "time": 10, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.8, "orders": 76, "emoji": "🥗", "image": "assets/images/menu/m04.jpg", "description": "Rau xanh, bơ, đậu gà, củ quả giòn và sốt mè rang nhà làm.", "tags": ["thuần chay", "nhiều chất xơ"]}, {"id": "m05", "name": "Mì xào tôm kiểu Thái", "category": "Món chính", "price": 139000, "time": 14, "spicy": 1, "vegetarian": false, "available": true, "rating": 4.7, "orders": 94, "emoji": "🍜", "image": "assets/images/menu/m05.jpg", "description": "Mì xào dai mềm, tôm tươi, giá hẹ và sốt me chua ngọt.", "tags": ["hải sản", "hơi cay"]}, {"id": "m06", "name": "Cà ri gà kem dừa", "category": "Món chính", "price": 149000, "time": 17, "spicy": 2, "vegetarian": false, "available": true, "rating": 4.6, "orders": 61, "emoji": "🍛", "image": "assets/images/menu/m06.jpg", "description": "Gà mềm nấu cà ri, nước cốt dừa, khoai củ và gia vị ấm.", "tags": ["thơm béo", "cay vừa"]}, {"id": "m07", "name": "Brownie kem vani", "category": "Tráng miệng", "price": 69000, "time": 7, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.9, "orders": 143, "emoji": "🍨", "image": "assets/images/menu/m07.jpg", "description": "Brownie chocolate ấm dùng cùng kem vani và sốt caramel.", "tags": ["ngọt dịu", "dùng nóng"]}, {"id": "m08", "name": "Trà đào cam sả", "category": "Đồ uống", "price": 49000, "time": 4, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.6, "orders": 112, "emoji": "🍹", "image": "assets/images/menu/m08.jpg", "description": "Trà đen, đào miếng, cam vàng và sả tươi, phục vụ lạnh.", "tags": ["không cồn", "thanh mát"]}, {"id": "m09", "name": "Bánh xếp rau củ chiên giòn", "category": "Khai vị", "price": 79000, "time": 9, "spicy": 1, "vegetarian": true, "available": true, "rating": 4.6, "orders": 67, "emoji": "🥟", "image": "assets/images/menu/m09.jpg", "description": "Bánh xếp nhân rau củ, vỏ giòn nhẹ, dùng cùng sốt me cay.", "tags": ["món chay", "giòn ngon"]}, {"id": "m10", "name": "Mì xào nấm rau củ", "category": "Món chay", "price": 109000, "time": 12, "spicy": 1, "vegetarian": true, "available": true, "rating": 4.7, "orders": 81, "emoji": "🍝", "image": "assets/images/menu/m10.jpg", "description": "Mì trứng xào nấm, cải thìa và rau củ với nước tương ít mặn.", "tags": ["món chay", "nhanh"]}, {"id": "m11", "name": "Cơm chiên Dương Châu", "category": "Món chính", "price": 119000, "time": 12, "spicy": 0, "vegetarian": false, "available": true, "rating": 4.8, "orders": 136, "emoji": "🍚", "image": "assets/images/menu/m11.jpg", "description": "Cơm chiên tơi hạt cùng tôm, trứng, rau củ và hành lá.", "tags": ["phổ biến", "không cay"]}, {"id": "m12", "name": "Sushi cá hồi cuộn bơ", "category": "Món chính", "price": 169000, "time": 16, "spicy": 0, "vegetarian": false, "available": true, "rating": 4.9, "orders": 97, "emoji": "🍣", "image": "assets/images/menu/m12.jpg", "description": "Cá hồi tươi, bơ, cơm giấm và rong biển, dùng cùng gừng hồng.", "tags": ["hải sản", "tươi sống"]}, {"id": "m13", "name": "Pizza gà nướng nấm", "category": "Món chính", "price": 179000, "time": 19, "spicy": 0, "vegetarian": false, "available": true, "rating": 4.7, "orders": 79, "emoji": "🍕", "image": "assets/images/menu/m13.jpg", "description": "Đế bánh mỏng giòn, gà nướng, nấm, hành tím và phô mai mozzarella.", "tags": ["chia sẻ", "phô mai"]}, {"id": "m14", "name": "Spaghetti hải sản", "category": "Món chính", "price": 159000, "time": 17, "spicy": 1, "vegetarian": false, "available": true, "rating": 4.8, "orders": 91, "emoji": "🍝", "image": "assets/images/menu/m14.jpg", "description": "Mì Ý sốt cà chua, tôm, mực, cà chua bi và thảo mộc.", "tags": ["hải sản", "kiểu Ý"]}, {"id": "m15", "name": "Cơm gạo lứt ức gà", "category": "Món chính", "price": 129000, "time": 14, "spicy": 0, "vegetarian": false, "available": true, "rating": 4.6, "orders": 64, "emoji": "🥙", "image": "assets/images/menu/m15.jpg", "description": "Gạo lứt, ức gà nướng, cà chua, rau xanh và sốt sữa chua.", "tags": ["eat clean", "giàu đạm"]}, {"id": "m16", "name": "Bánh mì bơ trứng lòng đào", "category": "Bữa sáng", "price": 79000, "time": 8, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.7, "orders": 73, "emoji": "🍳", "image": "assets/images/menu/m16.jpg", "description": "Bánh mì nướng, bơ nghiền, trứng lòng đào và xà lách non.", "tags": ["bữa sáng", "nhanh"]}, {"id": "m17", "name": "Pancake dâu việt quất", "category": "Tráng miệng", "price": 79000, "time": 10, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.8, "orders": 105, "emoji": "🥞", "image": "assets/images/menu/m17.jpg", "description": "Pancake mềm, dâu tươi, việt quất, chuối và mật ong.", "tags": ["trái cây", "ngọt dịu"]}, {"id": "m18", "name": "Cà phê latte", "category": "Đồ uống", "price": 45000, "time": 5, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.8, "orders": 151, "emoji": "☕", "image": "assets/images/menu/m18.jpg", "description": "Espresso rang vừa hòa cùng sữa tươi đánh nóng mịn.", "tags": ["cà phê", "phục vụ nóng"]}, {"id": "m19", "name": "Mocktail chanh dây", "category": "Đồ uống", "price": 59000, "time": 5, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.5, "orders": 58, "emoji": "🍸", "image": "assets/images/menu/m19.jpg", "description": "Chanh dây, cam, soda và syrup thảo mộc, hoàn toàn không cồn.", "tags": ["không cồn", "chua ngọt"]}, {"id": "m20", "name": "Bánh kem phúc bồn tử", "category": "Tráng miệng", "price": 75000, "time": 6, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.8, "orders": 86, "emoji": "🍰", "image": "assets/images/menu/m20.jpg", "description": "Cốt bánh vani mềm, kem sữa nhẹ và phúc bồn tử tươi.", "tags": ["trái cây", "bán chạy"]}, {"id": "m21", "name": "Salad đậu hũ sốt mè", "category": "Món chay", "price": 109000, "time": 11, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.7, "orders": 69, "emoji": "🥗", "image": "assets/images/menu/m21.jpg", "description": "Đậu hũ áp chảo, bắp, bơ, bắp cải tím và sốt mè rang.", "tags": ["thuần chay", "giàu đạm"]}, {"id": "m22", "name": "Ravioli nấm sốt kem", "category": "Món chay", "price": 139000, "time": 15, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.6, "orders": 43, "emoji": "🍝", "image": "assets/images/menu/m22.jpg", "description": "Pasta nhân nấm, sốt kem thảo mộc và phô mai parmesan.", "tags": ["kiểu Ý", "thơm béo"]}, {"id": "m23", "name": "Soda dâu chanh", "category": "Đồ uống", "price": 49000, "time": 4, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.7, "orders": 93, "emoji": "🥤", "image": "assets/images/menu/m23.jpg", "description": "Dâu tươi, chanh xanh, bạc hà và soda mát lạnh.", "tags": ["không cồn", "trái cây"]}, {"id": "m24", "name": "Salad phô mai rau củ", "category": "Khai vị", "price": 119000, "time": 11, "spicy": 0, "vegetarian": true, "available": true, "rating": 4.7, "orders": 74, "emoji": "🥗", "image": "assets/images/menu/m24.jpg", "description": "Xà lách romaine, dưa leo, phô mai, cà chua và sốt thảo mộc.", "tags": ["món chay", "tươi mát"]}], "orders": [{"id": "MM-2410", "table": "B04", "createdAt": "18:42", "status": "new", "priority": false, "wait": 6, "subtotal": 367000, "serviceFee": 18350, "total": 385350, "items": [{"menuId": "m03", "qty": 1, "unitPrice": 89000, "done": false}, {"menuId": "m05", "qty": 2, "unitPrice": 139000, "done": false}], "note": "Một phần mì không hành"}, {"id": "MM-2409", "table": "A02", "createdAt": "18:35", "status": "cooking", "priority": true, "wait": 13, "subtotal": 516000, "serviceFee": 25800, "total": 541800, "items": [{"menuId": "m01", "qty": 2, "unitPrice": 189000, "done": true}, {"menuId": "m07", "qty": 2, "unitPrice": 69000, "done": false}], "note": "Cá hồi chín vừa"}, {"id": "MM-2408", "table": "C01", "createdAt": "18:31", "status": "cooking", "priority": false, "wait": 17, "subtotal": 318000, "serviceFee": 15900, "total": 333900, "items": [{"menuId": "m02", "qty": 1, "unitPrice": 219000, "done": false}, {"menuId": "m04", "qty": 1, "unitPrice": 99000, "done": true}], "note": "Dị ứng đậu phộng"}, {"id": "MM-2407", "table": "A06", "createdAt": "18:24", "status": "ready", "priority": true, "wait": 23, "subtotal": 417000, "serviceFee": 20850, "total": 437850, "items": [{"menuId": "m05", "qty": 3, "unitPrice": 139000, "done": true}], "note": "Mang món cùng lúc"}, {"id": "MM-2406", "table": "B02", "createdAt": "18:18", "status": "served", "priority": false, "wait": 26, "subtotal": 367000, "serviceFee": 18350, "total": 385350, "items": [{"menuId": "m06", "qty": 2, "unitPrice": 149000, "done": true}, {"menuId": "m07", "qty": 1, "unitPrice": 69000, "done": true}], "note": ""}, {"id": "MM-2405", "table": "S01", "createdAt": "18:08", "status": "cancelled", "priority": false, "wait": 8, "subtotal": 219000, "serviceFee": 10950, "total": 229950, "items": [{"menuId": "m02", "qty": 1, "unitPrice": 219000, "done": false}], "note": "Khách đổi lịch"}], "tables": [{"id": "A01", "zone": "Cửa sổ", "seats": 2, "status": "available"}, {"id": "A02", "zone": "Cửa sổ", "seats": 4, "status": "occupied"}, {"id": "A03", "zone": "Cửa sổ", "seats": 4, "status": "reserved"}, {"id": "A04", "zone": "Cửa sổ", "seats": 2, "status": "available"}, {"id": "A05", "zone": "Cửa sổ", "seats": 6, "status": "cleaning"}, {"id": "A06", "zone": "Cửa sổ", "seats": 4, "status": "occupied"}, {"id": "B01", "zone": "Vườn", "seats": 4, "status": "available"}, {"id": "B02", "zone": "Vườn", "seats": 6, "status": "occupied"}, {"id": "B03", "zone": "Vườn", "seats": 2, "status": "available"}, {"id": "B04", "zone": "Vườn", "seats": 4, "status": "occupied"}, {"id": "C01", "zone": "Riêng", "seats": 8, "status": "occupied"}, {"id": "S01", "zone": "Quầy", "seats": 1, "status": "available"}], "feedback": [{"id": "f01", "table": "A02", "rating": 5, "text": "Cá hồi áp chảo rất tươi và ngon, nhân viên phục vụ tận tình chu đáo.", "theme": "Hương vị món", "status": "new", "createdAt": "2026-10-27T11:20:00Z"}, {"id": "f02", "table": "C01", "rating": 3, "text": "Món ăn ngon vừa miệng nhưng khung giờ tối chờ món chính hơi lâu (khoảng 25 phút).", "theme": "Thời gian chờ", "status": "new", "createdAt": "2026-10-27T11:45:00Z"}, {"id": "f03", "table": "B02", "rating": 5, "text": "Không gian sân vườn thoáng đãng, các món chay phong phú và thanh đạm.", "theme": "Không gian", "status": "replied", "reply": "MenuMind xin chân thành cảm ơn quý khách! Rất vui vì quý khách đã có trải nghiệm thư thái tại sân vườn nhà hàng.", "repliedAt": "2026-10-26T20:15:00Z", "createdAt": "2026-10-26T19:50:00Z"}, {"id": "f04", "table": "A06", "rating": 4, "text": "Mì xào hải sản đậm đà, tôm tươi nhưng hơi cay so với khẩu vị trẻ nhỏ.", "theme": "Khẩu vị", "status": "new", "createdAt": "2026-10-27T12:10:00Z"}, {"id": "f05", "table": "B04", "rating": 2, "text": "Bàn ngoài vườn phải nhắc nhân viên 2 lần mới có thêm nước lọc và khăn lạnh.", "theme": "Thái độ phục vụ", "status": "new", "createdAt": "2026-10-27T12:30:00Z"}, {"id": "f06", "table": "A01", "rating": 5, "text": "Salad vườn rất giòn và sốt chanh mật ong đặc biệt, chắc chắn sẽ quay lại!", "theme": "Hương vị món", "status": "replied", "reply": "MenuMind cảm ơn quý khách rất nhiều! Hẹn gặp lại quý khách trong những bữa ăn sắp tới nhé!", "repliedAt": "2026-10-26T21:00:00Z", "createdAt": "2026-10-26T20:30:00Z"}, {"id": "f07", "table": "B03", "rating": 3, "text": "Giờ cao điểm phục vụ lên món hơi chậm, mong quán cải thiện tốc độ ra món.", "theme": "Thời gian chờ", "status": "new", "createdAt": "2026-10-27T13:05:00Z"}], "staff": [{"id": "u01", "name": "Minh Anh", "email": "minhanh@menumind.vn", "role": "kitchen", "status": "active", "shift": "Chiều (14:00 - 22:00)"}, {"id": "u02", "name": "Quốc Bảo", "email": "quocbao@menumind.vn", "role": "kitchen", "status": "active", "shift": "Tối (17:00 - 23:00)"}, {"id": "u03", "name": "Thu Hà", "email": "thuha@menumind.vn", "role": "manager", "status": "active", "shift": "Cả ngày"}, {"id": "u04", "name": "Hoàng Nam", "email": "hoangnam@menumind.vn", "role": "admin", "status": "active", "shift": "Cả ngày"}, {"id": "u05", "name": "Linh Chi", "email": "linhchi@menumind.vn", "role": "service", "status": "active", "shift": "Sáng (06:00 - 14:00)"}], "payments": [{"id": "p01", "table_code": "A02", "reference": "HD-A02-091", "method": "cash", "amount": 541800, "status": "pending", "created_at": "2026-10-27T12:45:00Z"}, {"id": "p02", "table_code": "B02", "reference": "HD-B02-092", "method": "bank_transfer", "amount": 385350, "status": "pending", "created_at": "2026-10-27T13:10:00Z"}, {"id": "p03", "table_code": "A04", "reference": "HD-A04-089", "method": "card", "amount": 640000, "status": "paid", "created_at": "2026-10-27T11:30:00Z", "paid_at": "2026-10-27T12:00:00Z"}, {"id": "p04", "table_code": "A05", "reference": "HD-A05-088", "method": "cash", "amount": 459900, "status": "paid", "created_at": "2026-10-27T10:15:00Z", "paid_at": "2026-10-27T10:45:00Z"}]};
let appData = fallbackData;
let currentRenderFn = null;
let realtimeTickerId = null;

const paths = {
  home: `${ROOT}/index.html`,
  login: `${ROOT}/pages/login.html`,
  menu: `${ROOT}/pages/diner-menu.html`,
  cart: `${ROOT}/pages/diner-table-order.html`,
  status: `${ROOT}/pages/diner-order-status.html`,
  kitchen: `${ROOT}/pages/kitchen-board.html`,
  manager: `${ROOT}/pages/manager-menu-management.html`,
  admin: `${ROOT}/pages/admin-user-management.html`
};

// Kênh đồng bộ thời gian thực liên tab (BroadcastChannel)
const realtimeChannel = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('menumind:realtime')
  : null;

function getStore(key, fallback) {
  try {
    const raw = localStorage.getItem(`menumind:${key}`);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStore(key, value, silent = false) {
  try {
    localStorage.setItem(`menumind:${key}`, JSON.stringify(value));
    if (appData && ['menuItems', 'orders', 'tables', 'feedback', 'staff', 'payments'].includes(key)) {
      appData[key] = value;
    }
    if (!silent) {
      const payload = { type: 'store:update', key, timestamp: Date.now(), sourcePage: PAGE };
      realtimeChannel?.postMessage(payload);
      window.dispatchEvent(new CustomEvent('menumind:update', { detail: payload }));
    }
  } catch (err) {
    console.error(`Lỗi lưu dữ liệu [${key}]:`, err);
  }
}

// Định dạng tiền tệ theo cài đặt hệ thống (VND / USD)
const money = value => {
  const num = Number(value) || 0;
  const cfg = getStore('settings', null);
  if (cfg?.currency === 'USD') {
    const usd = num / 25000;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usd);
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

const uid = prefix => `${prefix}-${Date.now().toString(36).toUpperCase()}`;
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[ch]));
window.escapeHTML = escapeHtml;
window.escapeHtml = escapeHtml;

// Quản lý mốc thời gian khởi tạo phiên để các đơn mẫu (HH:mm) cũng nhảy số phút chờ theo thời gian thực
function getBootTimestamp() {
  let boot = Number(localStorage.getItem('menumind:bootTime') || 0);
  if (!boot || Number.isNaN(boot)) {
    boot = Date.now();
    localStorage.setItem('menumind:bootTime', String(boot));
  }
  return boot;
}

function parseOrderDate(createdAt) {
  if (!createdAt) return null;
  const d = new Date(createdAt);
  if (!Number.isNaN(d.getTime()) && (String(createdAt).includes('-') || String(createdAt).includes('T'))) {
    return { date: d, isFullDate: true };
  }
  const match = String(createdAt).match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (match) {
    const now = new Date();
    const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3] || '0', 10));
    return { date: candidate, isFullDate: false };
  }
  return null;
}

function getOrderWait(order, nowMs = Date.now()) {
  if (!order) return 0;
  const done = ['served', 'cancelled'].includes(order.status);
  if (done && Number(order.wait) > 0) return Number(order.wait);

  const parsed = parseOrderDate(order.createdAt);
  if (parsed && parsed.isFullDate) {
    const elapsed = Math.max(0, Math.floor((nowMs - parsed.date.getTime()) / 60000));
    return done ? (Number(order.wait) || elapsed) : elapsed;
  }

  // Với đơn mẫu định dạng HH:mm: cộng thêm số phút thực tế đã trôi qua kể từ lúc mở hệ thống
  const baseWait = Number(order.wait) || 0;
  if (done) return baseWait;
  const extraMinutes = Math.max(0, Math.floor((nowMs - getBootTimestamp()) / 60000));
  return baseWait + extraMinutes;
}

function getAlertThreshold() {
  const settings = getStore('settings', null);
  return Number(settings?.alertTime) || 15;
}

function dishImage(item) {
  if (item?.image && typeof item.image === 'object' && item.image.publicUrl) {
    return String(item.image.publicUrl);
  }
  const configured = String(item?.image || '').trim();
  if (/^(data:image\/|(https?:)?\/\/)/i.test(configured) || configured.startsWith('/')) return configured;
  const localPath = configured || `assets/images/menu/${String(item?.id || 'm01').replace(/[^a-z0-9_-]/gi, '')}.jpg`;
  return `${ROOT}/${localPath.replace(/^\.\//, '')}`;
}

function dishPicture(item, className = '') {
  return `<img class="${className}" src="${escapeHtml(dishImage(item))}" alt="${escapeHtml(item.name)}" width="720" height="480" loading="lazy" decoding="async"><span class="dish-fallback" hidden aria-hidden="true">${escapeHtml(item.emoji || '🍽️')}</span>`;
}

function toast(message, tone = 'success') {
  let region = document.querySelector('.toast-region');
  if (!region) {
    region = document.createElement('div');
    region.className = 'toast-region';
    region.setAttribute('aria-live', 'polite');
    document.body.append(region);
  }
  const item = document.createElement('div');
  item.className = `toast ${tone}`;
  item.textContent = message;
  region.append(item);
  setTimeout(() => item.remove(), 3200);
}

function getAuthSession() {
  try { return JSON.parse(sessionStorage.getItem('menumind:session') || 'null'); } catch { return null; }
}

function getQrSession() {
  try { return JSON.parse(sessionStorage.getItem('menumind:qr-session') || 'null'); } catch { return null; }
}

function getDineInTable() {
  const params = new URLSearchParams(location.search);
  const fromUrl = params.get('table');
  if (fromUrl) {
    const code = fromUrl.trim().toUpperCase();
    sessionStorage.setItem('menumind:table', code);
    sessionStorage.setItem('menumind:dine_in_table', code);
    return code;
  }
  const qr = getQrSession();
  if (qr?.table) {
    const code = String(qr.table).trim().toUpperCase();
    sessionStorage.setItem('menumind:table', code);
    sessionStorage.setItem('menumind:dine_in_table', code);
    return code;
  }
  const stored = sessionStorage.getItem('menumind:dine_in_table') || sessionStorage.getItem('menumind:table');
  return stored ? stored.trim().toUpperCase() : null;
}

function isDineIn() {
  return Boolean(getDineInTable());
}

function getActiveTable(fallback = 'A01') {
  const dineIn = getDineInTable();
  if (dineIn) return dineIn;
  return fallback ? String(fallback).trim().toUpperCase() : null;
}

function setActiveTable(tableCode, token = '') {
  const code = String(tableCode || 'A01').trim().toUpperCase();
  sessionStorage.setItem('menumind:table', code);
  sessionStorage.setItem('menumind:dine_in_table', code);
  const session = typeof ensureTableSession === 'function'
    ? ensureTableSession(code, false)
    : { table_code: code, token: token || `qr-${code.toLowerCase()}` };
  const finalToken = token || session.token;
  sessionStorage.setItem('menumind:qr-session', JSON.stringify({ table: code, token: finalToken }));
  if (typeof updateRolePill === 'function') updateRolePill();
  if (typeof syncGlobalNav === 'function') syncGlobalNav();
  return { table: code, token: finalToken };
}

function clearDineInSession() {
  sessionStorage.removeItem('menumind:table');
  sessionStorage.removeItem('menumind:dine_in_table');
  sessionStorage.removeItem('menumind:qr-session');
  if (typeof updateRolePill === 'function') updateRolePill();
  if (typeof syncGlobalNav === 'function') syncGlobalNav();
}

function roleHome(role) {
  return ({
    kitchen: 'kitchen-board.html',
    manager: 'manager-menu-management.html',
    admin: 'admin-user-management.html',
    service: 'manager-table-management.html'
  })[role] || 'login.html';
}

const protectedRoles = {
  'kitchen-board': ['kitchen', 'admin'],
  'kitchen-detail': ['kitchen', 'admin'],
  'kitchen-alerts': ['kitchen', 'admin'],
  'manager-menu': ['manager', 'admin'],
  'manager-payments': ['manager', 'service', 'admin'],
  'manager-feedback': ['manager', 'admin'],
  'manager-sales': ['admin', 'manager'],
  'admin-sales': ['admin', 'manager'],
  'admin-sales-insights': ['admin', 'manager'],
  'manager-tables': ['manager', 'service', 'admin'],
  'admin-tables': ['manager', 'service', 'admin'],
  'admin-users': ['admin'],
  'admin-settings': ['admin']
};

function guardPage() {
  const requiredRole = protectedRoles[PAGE];
  if (!requiredRole) return true;
  let session = getAuthSession();
  if (!session?.staff) {
    location.href = `${ROOT}/pages/login.html?next=${encodeURIComponent(location.pathname.split('/').pop())}`;
    return false;
  }
  // Kiểm tra xem tài khoản có bị vô hiệu hóa theo thời gian thực không
  const staffList = getStore('staff', appData.staff || []);
  const liveStaff = staffList.find(s => String(s.email).toLowerCase() === String(session.staff.email).toLowerCase());
  if (liveStaff && liveStaff.status === 'inactive') {
    sessionStorage.removeItem('menumind:session');
    location.href = `${ROOT}/pages/login.html`;
    return false;
  }
  const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  if (!allowed.includes(session.staff.role)) {
    location.href = `${ROOT}/pages/${roleHome(session.staff.role)}`;
    return false;
  }
  return true;
}

// ==========================================================================
// KIỂM TRA KHÓA ĐẶT MÓN THEO TỪNG BÀN (KHÔNG XUNG ĐỘT GIỮA CÁC BÀN)
// ==========================================================================

function getTablePayment(tableCode = getActiveTable()) {
  const code = String(tableCode || '').trim().toUpperCase();
  if (!code) return null;
  const payments = getStore('payments', appData.payments || []);
  const sessions = typeof getLocalSessions === 'function' ? getLocalSessions() : {};
  const activeSession = sessions[code];

  // Tìm yêu cầu thanh toán đang pending của bàn này
  const pending = payments.find(p => p.table_code === code && p.status === 'pending');
  if (pending) return pending;

  // Hoặc thanh toán đã paid thuộc đúng phiên hiện tại (chưa mở phiên mới)
  if (activeSession) {
    const paidInSession = payments.find(
      p => p.table_code === code && p.dining_session_id === activeSession.id && p.status === 'paid'
    );
    if (paidInSession) return paidInSession;
  }
  return null;
}

function paymentLocksOrdering(paymentOverride = undefined, tableCode = getActiveTable()) {
  if (!tableCode) return false;
  const payment = paymentOverride !== undefined ? paymentOverride : getTablePayment(tableCode);
  if (!payment) return false;
  if (payment.table_code && String(payment.table_code).toUpperCase() !== String(tableCode).toUpperCase()) {
    return false;
  }
  return ['pending', 'paid'].includes(payment.status);
}

function orderingLockMessage(paymentOverride = undefined, tableCode = getActiveTable()) {
  const payment = paymentOverride !== undefined ? paymentOverride : getTablePayment(tableCode);
  return payment?.status === 'paid'
    ? `Phiên Bàn ${tableCode} đã hoàn tất thanh toán. Không thể gửi thêm món đến bếp.`
    : `Bàn ${tableCode} đang chờ thanh toán. Không thể gửi thêm món đến bếp.`;
}

async function ensureQrOrderingOpen() {
  const tableCode = getActiveTable();
  const tables = getStore('tables', appData.tables || []);
  const tableObj = tables.find(t => t.id === tableCode);

  if (tableObj && tableObj.status === 'cleaning') {
    const error = new Error(`Bàn ${tableCode} đang được nhân viên dọn dẹp. Vui lòng chọn bàn khác hoặc chờ cấp phiên mới.`);
    error.code = 'ORDER_LOCKED';
    throw error;
  }

  let qr = getQrSession();
  if (!qr || qr.table !== tableCode) {
    qr = setActiveTable(tableCode);
  }

  const payment = getTablePayment(tableCode);
  if (paymentLocksOrdering(payment, tableCode)) {
    const error = new Error(orderingLockMessage(payment, tableCode));
    error.code = 'ORDER_LOCKED';
    throw error;
  }
}

function showQrDialog(table, token, expiresAt) {
  document.querySelector('#qr-session-dialog')?.remove();
  const url = new URL(`${ROOT}/pages/diner-menu.html`, location.href);
  url.searchParams.set('table', table);
  url.searchParams.set('id', token);
  const dialogEl = document.createElement('dialog');
  dialogEl.id = 'qr-session-dialog';
  dialogEl.innerHTML = `
    <div class="dialog-head">
      <h2>QR gọi món · Bàn ${escapeHtml(table)}</h2>
      <button class="icon-button" data-close="qr-session-dialog" aria-label="Đóng">×</button>
    </div>
    <div class="dialog-body">
      <div id="qr-code" class="qr-code" aria-label="Mã QR gọi món bàn ${escapeHtml(table)}"></div>
      <label>Đường dẫn phiên bàn
        <input id="qr-order-url" value="${escapeHtml(url.href)}" readonly>
      </label>
      <p class="fine-print">Hết hạn lúc ${new Date(expiresAt).toLocaleString('vi-VN')}. Cấp mã mới sẽ vô hiệu mã cũ.</p>
      <div class="dialog-actions">
        <a class="button quiet" href="${escapeHtml(url.href)}">Mở thực đơn bàn ${escapeHtml(table)}</a>
        <button type="button" class="button quiet" data-copy-qr>Chép liên kết</button>
        <button type="button" class="button primary" onclick="window.print()">In QR</button>
      </div>
    </div>
  `;
  document.body.append(dialogEl);
  dialogEl.showModal();
  if (window.QRCode) {
    new QRCode(document.querySelector('#qr-code'), {
      text: url.href,
      width: 220,
      height: 220,
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    const cells = [];
    const seedStr = String(table + ':' + token);
    for (let r = 0; r < 21; r++) {
      for (let c = 0; c < 21; c++) {
        const isFinder = (r < 7 && c < 7) || (r < 7 && c >= 14) || (r >= 14 && c < 7);
        let filled = false;
        if (isFinder) {
          const lr = r >= 14 ? r - 14 : r;
          const lc = c >= 14 ? c - 14 : c;
          filled = lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
        } else {
          const code = seedStr.charCodeAt((r * 21 + c) % seedStr.length);
          filled = ((code + r * 7 + c * 13) % 3) === 0;
        }
        if (filled) cells.push(`<rect x="${c * 10 + 5}" y="${r * 10 + 5}" width="10" height="10" fill="#102a2b"/>`);
      }
    }
    document.querySelector('#qr-code').innerHTML = `<svg viewBox="0 0 220 220" width="220" height="220" role="img" aria-label="QR Bàn ${escapeHtml(table)}"><rect width="220" height="220" fill="#ffffff"/>${cells.join('')}</svg>`;
  }
}

async function guardQrOrder() {
  if (!new Set(['menu', 'dish-detail', 'cart', 'status']).has(PAGE)) return true;
  const params = new URLSearchParams(location.search);
  const urlTable = params.get('table')?.trim().toUpperCase();
  const urlToken = params.get('id')?.trim();

  let qr = getQrSession();
  if (urlTable) {
    qr = setActiveTable(urlTable, urlToken || '');
  } else if (!qr?.table) {
    qr = setActiveTable(sessionStorage.getItem('menumind:table') || 'A01');
  } else {
    sessionStorage.setItem('menumind:table', qr.table);
  }

  // Đồng bộ trạng thái thanh toán của đúng bàn hiện tại mà KHÔNG ghi đè danh sách đơn hàng toàn nhà hàng
  const tablePayment = getTablePayment(qr.table);
  if (tablePayment) {
    localStorage.setItem('menumind:payment', JSON.stringify(tablePayment));
  } else {
    localStorage.removeItem('menumind:payment');
  }

  return true;
}

function pageHead(kicker, title, desc, actions = '') {
  return `<header class="page-head"><div><p class="kicker">${kicker}</p><h1>${title}</h1><p>${desc}</p></div>${actions ? `<div class="head-actions">${actions}</div>` : ''}</header>`;
}

function emptyState(title, detail, action = '') {
  return `<div class="empty-state"><span aria-hidden="true">⌕</span><h2>${title}</h2><p>${detail}</p>${action}</div>`;
}

function statusLabel(s) {
  return ({
    new: 'Mới nhận',
    cooking: 'Đang nấu',
    ready: 'Chờ phục vụ',
    served: 'Đã phục vụ',
    cancelled: 'Đã hủy',
    cancel_requested: 'Chờ duyệt hủy',
    available: 'Sẵn sàng',
    occupied: 'Đang dùng',
    reserved: 'Đã đặt',
    cleaning: 'Đang dọn',
    active: 'Hoạt động',
    inactive: 'Vô hiệu',
    replied: 'Đã phản hồi',
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thất bại',
    kitchen: 'Nhân viên bếp',
    manager: 'Quản lý',
    admin: 'Quản trị viên',
    service: 'Phục vụ'
  }[s] || s);
}

function badge(s) {
  return `<span class="status ${s}">${statusLabel(s)}</span>`;
}

function refreshAppDataFromStorage() {
  const seed = getStore('seed', fallbackData);
  ['menuItems', 'orders', 'tables', 'feedback', 'staff', 'payments'].forEach(key => {
    const stored = getStore(key, null);
    if (Array.isArray(stored) && stored.length > 0) {
      appData[key] = stored;
    } else if (seed && Array.isArray(seed[key])) {
      appData[key] = seed[key];
      setStore(key, seed[key], true);
    }
  });
}

function applySystemSettingsToDOM() {
  const settings = getStore('settings', null);
  if (!settings) return;
  document.documentElement.classList.toggle('high-contrast', Boolean(settings.dark));
  const brandNameEls = document.querySelectorAll('.site-header .brand span:last-child');
  brandNameEls.forEach(el => {
    if (settings.name) el.textContent = settings.name;
  });
}

function cacheData(data) {
  const seed = getStore('seed', fallbackData);
  ['staff', 'orders', 'feedback', 'payments', 'tables', 'menuItems'].forEach(key => {
    if (!data[key] || !Array.isArray(data[key]) || data[key].length === 0) {
      const existing = getStore(key, null);
      if (Array.isArray(existing) && existing.length > 0) {
        data[key] = existing;
      } else if (seed && Array.isArray(seed[key]) && seed[key].length > 0) {
        data[key] = seed[key];
      }
    }
  });
  appData = data;
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length === 0) {
      const existing = getStore(key, null);
      if (Array.isArray(existing) && existing.length > 0) return;
    }
    setStore(key, value, true);
  });
}

// Kiểm tra xem người dùng có đang gõ trong input/textarea hoặc mở dialog không để tránh giật UI khi re-render tự động
function isUserInteractingWithForm() {
  const openDialog = document.querySelector('dialog[open]');
  if (openDialog) return true;
  const active = document.activeElement;
  if (!active) return false;
  const tag = active.tagName?.toLowerCase();
  if (tag === 'textarea') return true;
  if (tag === 'input' && !['checkbox', 'radio', 'button', 'submit'].includes(active.type)) {
    // Cho phép re-render nếu là ô search trống, nhưng giữ nguyên nếu đang nhập form
    if (active.closest('form')) return true;
  }
  return false;
}

function triggerRealtimeRender(changedKey = '') {
  refreshAppDataFromStorage();
  applySystemSettingsToDOM();
  if (typeof updateCartCount === 'function') updateCartCount();
  if (typeof updateRolePill === 'function') updateRolePill();

  if (typeof currentRenderFn === 'function' && !isUserInteractingWithForm()) {
    currentRenderFn();
  }
}

// Lắng nghe đồng bộ thời gian thực từ BroadcastChannel và sự kiện storage
if (realtimeChannel) {
  realtimeChannel.onmessage = event => {
    const data = event.data;
    if (!data || data.type !== 'store:update') return;
    triggerRealtimeRender(data.key);

    // Hiển thị thông báo thời gian thực thông minh theo vai trò
    if (data.key === 'orders') {
      if (['kitchen-board', 'kitchen-alerts', 'kitchen-detail'].includes(PAGE)) {
        if (data.action === 'cancel_request') {
          toast(`⚠️ Bàn ${data.table || ''} vừa gửi yêu cầu hủy đơn ${data.orderId || ''}!`, 'warning');
        } else if (data.action === 'cancel_withdrawn') {
          toast(`ℹ️ Bàn ${data.table || ''} đã rút lại yêu cầu hủy đơn ${data.orderId || ''}.`, 'info');
        } else if (data.sourcePage === 'cart') {
          toast('🔔 Có đơn gọi món mới vừa gửi vào bếp!', 'info');
        }
      } else if (PAGE === 'status') {
        if (data.action === 'cancel_approved') {
          toast(`✓ Bếp trưởng đã chấp thuận hủy đơn ${data.orderId || ''}!`, 'success');
        } else if (data.action === 'cancel_rejected') {
          toast(`✕ Bếp thông báo: Món đang nấu nên không thể hủy đơn ${data.orderId || ''}.`, 'error');
        } else if (data.sourcePage?.startsWith('kitchen')) {
          toast('🍽️ Tiến độ món ăn của bàn bạn vừa được cập nhật!', 'info');
        }
      }
    } else if (data.key === 'payments' && PAGE === 'manager-payments' && data.sourcePage === 'status') {
      toast('💳 Có bàn vừa gửi yêu cầu thanh toán mới!', 'info');
    } else if (data.key === 'payments' && PAGE === 'status' && data.sourcePage === 'manager-payments') {
      toast('✓ Nhân viên đã xác nhận thanh toán cho bàn của bạn!');
    }
  };
}

window.addEventListener('storage', event => {
  if (!event.key || !event.key.startsWith('menumind:')) return;
  const shortKey = event.key.replace('menumind:', '');
  triggerRealtimeRender(shortKey);
});

async function bootPage(renderPage) {
  currentRenderFn = renderPage;
  getBootTimestamp();

  // 1. Tải ngay dữ liệu từ bộ nhớ cục bộ để RENDER NGAY LẬP TỨC (Zero-Wait, không giật lag)
  refreshAppDataFromStorage();

  const hasSeed = Boolean(localStorage.getItem('menumind:seed'));
  if (!hasSeed) {
    try {
      const res = await fetch(`${ROOT}/assets/data/app-data.json`);
      if (res.ok) {
        const localSeed = await res.json();
        setStore('seed', localSeed, true);
        ['staff', 'orders', 'feedback', 'payments', 'tables', 'menuItems'].forEach(key => {
          const current = getStore(key, null);
          if (!current || (Array.isArray(current) && current.length === 0)) {
            setStore(key, localSeed[key] || [], true);
          }
        });
        refreshAppDataFromStorage();
      }
    } catch (err) {
      setStore('seed', fallbackData, true);
      ['staff', 'orders', 'feedback', 'payments', 'tables', 'menuItems'].forEach(key => {
        const current = getStore(key, null);
        if (!current || (Array.isArray(current) && current.length === 0)) {
          setStore(key, fallbackData[key] || [], true);
        }
      });
      refreshAppDataFromStorage();
    }
  }

  if (!appData.menuItems || !appData.menuItems.length) {
    appData = getStore('seed', fallbackData);
  }

  if (!appData.menuItems || !appData.menuItems.length) {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.innerHTML = emptyState(
        'Không tải được dữ liệu',
        'Hãy chạy website qua máy chủ cục bộ và thử lại.',
        `<button class="button primary" onclick="location.reload()">Thử lại</button>`
      );
    }
    return;
  }

  // 2. Kiểm tra quyền và RENDER TRANG TỨC THÌ (0ms)
  if (!(await guardQrOrder())) return;
  if (!guardPage()) return;

  applySystemSettingsToDOM();
  renderPage();

  // 3. Xử lý đồng bộ nền ngầm phía sau (không làm khựng giao diện người dùng)
  setTimeout(() => {
    if (typeof ensureTableSession === 'function' && Array.isArray(appData.tables)) {
      appData.tables.forEach(t => {
        if (t.status === 'occupied') {
          ensureTableSession(t.id, false);
        }
      });
    }

    if (typeof configureSupabase === 'function') {
      configureSupabase().then(async () => {
        try {
          const remote = typeof readRemoteData === 'function' ? await readRemoteData() : null;
          if (remote && remote.menuItems && remote.menuItems.length) {
            cacheData(remote);
            if (typeof currentRenderFn === 'function') {
              currentRenderFn();
            }
          }
        } catch (remoteError) {}
      });
    }
  }, 10);

  // Bộ đếm nhịp thời gian thực (cập nhật thời gian chờ mỗi 15 giây)
  if (realtimeTickerId) clearInterval(realtimeTickerId);
  realtimeTickerId = setInterval(() => {
    if (['home', 'status', 'kitchen-board', 'kitchen-detail', 'kitchen-alerts', 'admin-sales', 'manager-tables', 'manager-payments'].includes(PAGE)) {
      triggerRealtimeRender('tick');
    }
  }, 15000);
}

// Khôi phục toàn bộ dữ liệu mẫu nhà hàng về trạng thái sạch ban đầu
async function resetAllRestaurantData() {
  const seed = getStore('seed', null);
  const keysToClear = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('menumind:') && k !== 'menumind:theme') {
      keysToClear.push(k);
    }
  }
  keysToClear.forEach(k => localStorage.removeItem(k));
  localStorage.setItem('menumind:bootTime', String(Date.now()));

  if (seed) {
    setStore('seed', seed, true);
    ['staff', 'orders', 'feedback', 'payments', 'tables', 'menuItems'].forEach(key => {
      if (seed[key]) setStore(key, seed[key], true);
    });
  }
  realtimeChannel?.postMessage({ type: 'store:update', key: 'all', timestamp: Date.now(), sourcePage: PAGE });
}
window.resetAllRestaurantData = resetAllRestaurantData;

// Global modal & interaction listeners
document.addEventListener('click', e => {
  const b = e.target.closest('button, a');
  if (!b) return;
  if (b.dataset.open) {
    document.querySelector(`#${b.dataset.open}`)?.showModal();
  }
  if (b.dataset.close) {
    document.querySelector(`#${b.dataset.close}`)?.close();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('dialog[open]').forEach(d => d.close());
  }
});

document.addEventListener('error', e => {
  if (!(e.target instanceof HTMLImageElement) || !e.target.matches('.dish-photo, .detail-photo, .mini-food-photo, .tiny-food-photo')) return;
  e.target.hidden = true;
  if (e.target.nextElementSibling?.classList.contains('dish-fallback')) {
    e.target.nextElementSibling.hidden = false;
  }
}, true);
