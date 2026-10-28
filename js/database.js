// ==========================================================================
// js/database.js - Hybrid Real-Time Data & Supabase Adapter
// Hoạt động 100% thời gian thực qua LocalStorage + BroadcastChannel,
// đồng thời tương thích tự động với Supabase REST/RPC khi có kết nối thực.
// ==========================================================================

let SUPABASE_URL = window.MENUMIND_SUPABASE?.url || '';
let SUPABASE_KEY = window.MENUMIND_SUPABASE?.key || '';
let remoteEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

function isRealAuthToken(token) {
  return Boolean(token && typeof token === 'string' && !token.startsWith('demo-') && token !== 'demo-local-token');
}

async function apiFetch(resource, options = {}) {
  if (!remoteEnabled) throw new Error('Supabase chưa được cấu hình');
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${resource}`, { cache: 'no-store', ...options, headers });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || errorBody.error_description || errorBody.msg || `Supabase ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.code = errorBody.code;
    throw error;
  }
  if (response.status === 204) return null;
  return response.json();
}

async function signIn(email, password) {
  if (!remoteEnabled) throw new Error('Chưa cấu hình máy chủ đăng nhập');
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error_description || payload.msg || 'Email hoặc mật khẩu không đúng');
  return payload;
}

async function getStaffRole(email, token) {
  const rows = await apiFetch(`staff?select=id,name,email,role,status,shift&email=eq.${encodeURIComponent(email)}&limit=1`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const staff = rows?.[0];
  if (!staff || staff.status !== 'active') throw new Error('Tài khoản chưa được cấp quyền hoạt động');
  return staff;
}

let remoteConfigured = false;
let supabaseConfigCache = null;

async function configureSupabase() {
  if (remoteEnabled || remoteConfigured) return;
  const root = typeof ROOT !== 'undefined' ? ROOT : '.';
  try {
    if (!supabaseConfigCache) {
      const saved = sessionStorage.getItem('menumind:supabase_config');
      if (saved) {
        supabaseConfigCache = JSON.parse(saved);
      } else {
        const response = await fetch(`${root}/assets/config/supabase.json`);
        if (response.ok) {
          supabaseConfigCache = await response.json();
          sessionStorage.setItem('menumind:supabase_config', JSON.stringify(supabaseConfigCache));
        }
      }
    }
    if (supabaseConfigCache) {
      SUPABASE_URL = String(supabaseConfigCache.url || '').replace(/\/$/, '');
      SUPABASE_KEY = String(supabaseConfigCache.publishableKey || '');
      remoteEnabled = Boolean(
        SUPABASE_URL &&
        SUPABASE_KEY &&
        !SUPABASE_KEY.toLowerCase().includes('your') &&
        !SUPABASE_KEY.includes('<')
      );
    }
  } catch (error) {
    remoteEnabled = false;
  }
  remoteConfigured = true;
}

async function readRemoteData() {
  if (!remoteEnabled) return null;
  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  const hasRealAuth = isRealAuthToken(auth?.accessToken);
  // Chỉ đồng bộ ghi đè từ Supabase khi đăng nhập thực bằng JWT của Supabase
  if (!hasRealAuth) return null;
  const secured = { headers: { Authorization: `Bearer ${auth.accessToken}` } };
  const safeRead = async (resource, options = {}) => {
    try { return await apiFetch(resource, options); }
    catch { return []; }
  };
  const [menuItems, tables] = await Promise.all([safeRead('menuItems?select=*'), safeRead('tables?select=*')]);
  const canReadPayments = ['service', 'manager', 'admin'].includes(auth?.staff?.role);
  const [staff, orders, feedback, payments] = await Promise.all([
    safeRead('staff?select=*', secured),
    safeRead('orders?select=*&order=createdAt.desc', secured),
    safeRead('feedback?select=*&order=createdAt.desc', secured),
    canReadPayments ? safeRead('payments?select=*&order=created_at.desc', secured) : Promise.resolve([])
  ]);
  return {
    menuItems,
    tables: tables.map(t => ({ ...t, id: t.code || t.id })),
    staff,
    orders: orders.map(o => ({ ...o, table: o.table, createdAt: o.createdAt || o.created_at })),
    feedback,
    payments
  };
}

async function remoteWrite(resource, method, body, query = '', accessToken = '') {
  if (!remoteEnabled || !isRealAuthToken(accessToken)) return null;
  return apiFetch(`${resource}${query}`, {
    method,
    headers: {
      Prefer: 'return=representation',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  });
}

async function callRpc(name, body, accessToken = '') {
  if (!remoteEnabled) throw new Error('Supabase offline');
  const headers = isRealAuthToken(accessToken) ? { Authorization: `Bearer ${accessToken}` } : {};
  return apiFetch(`rpc/${name}`, { method: 'POST', headers, body: JSON.stringify(body) });
}

// ==========================================================================
// QUẢN LÝ PHIÊN BÀN QR (DINING SESSIONS) THỜI GIAN THỰC
// ==========================================================================

function getLocalSessions() {
  try {
    return JSON.parse(localStorage.getItem('menumind:sessions') || '{}') || {};
  } catch {
    return {};
  }
}

function saveLocalSessions(sessions) {
  if (typeof setStore === 'function') {
    setStore('sessions', sessions);
  } else {
    localStorage.setItem('menumind:sessions', JSON.stringify(sessions));
  }
}

function generateSessionToken(table) {
  const rand = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-6);
  return `qr-${String(table).toLowerCase()}-${rand}`;
}

function ensureTableSession(tableCode, forceNew = false) {
  const code = String(tableCode || 'A01').trim().toUpperCase();
  const sessions = getLocalSessions();
  const now = Date.now();
  const existing = sessions[code];

  if (!forceNew && existing && existing.status === 'active' && new Date(existing.expires_at).getTime() > now) {
    return existing;
  }

  const session = {
    id: `ds-${code.toLowerCase()}-${now.toString(36)}`,
    table_code: code,
    token: generateSessionToken(code),
    status: 'active',
    created_at: new Date(now).toISOString(),
    expires_at: new Date(now + 8 * 3600 * 1000).toISOString(),
    closed_at: null
  };
  sessions[code] = session;
  saveLocalSessions(sessions);
  return session;
}

async function validateQrSession(table, token) {
  const code = String(table || '').trim().toUpperCase();
  if (!code) return false;

  const sessions = getLocalSessions();
  const localSession = sessions[code];

  if (localSession) {
    const notExpired = new Date(localSession.expires_at).getTime() > Date.now();
    if (localSession.status === 'closed' || !notExpired) {
      return false;
    }
    if (!token || localSession.token === token) {
      return true;
    }
  }

  // Nếu bàn không ở trạng thái đang dọn (cleaning), tự động khởi tạo phiên hợp lệ
  const tables = typeof getStore === 'function' ? getStore('tables', []) : [];
  const tableObj = tables.find(t => t.id === code);
  if (tableObj && tableObj.status === 'cleaning') {
    return false;
  }

  const created = ensureTableSession(code, false);
  if (token && created.token !== token) {
    created.token = token;
    sessions[code] = created;
    saveLocalSessions(sessions);
  }
  return true;
}

async function createQrSession(table) {
  const code = String(table || '').trim().toUpperCase();
  if (!code) throw new Error('Mã bàn không hợp lệ');

  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  if (remoteEnabled && isRealAuthToken(auth?.accessToken)) {
    try {
      const rows = await callRpc('create_dining_session', { p_table: code }, auth.accessToken);
      if (rows?.[0]) {
        const s = rows[0];
        const sessions = getLocalSessions();
        sessions[code] = {
          id: `ds-${code.toLowerCase()}-${Date.now().toString(36)}`,
          table_code: s.table_code || code,
          token: s.token,
          status: 'active',
          created_at: new Date().toISOString(),
          expires_at: s.expires_at
        };
        saveLocalSessions(sessions);
        return sessions[code];
      }
    } catch (e) {
      console.warn('Fallback cấp QR cục bộ:', e.message);
    }
  }

  // Tạo phiên mới trên bộ nhớ thời gian thực
  const session = ensureTableSession(code, true);

  // Cập nhật trạng thái bàn sang 'occupied' (Đang dùng)
  if (typeof getStore === 'function' && typeof setStore === 'function') {
    const tables = getStore('tables', appData?.tables || []);
    const targetTable = tables.find(t => t.id === code);
    if (targetTable) {
      targetTable.status = 'occupied';
      setStore('tables', tables);
      if (typeof appData !== 'undefined') appData.tables = tables;
    }

    // Nếu bàn này có yêu cầu thanh toán cũ đã thanh toán/đóng, không khóa phiên mới
    const payments = getStore('payments', appData?.payments || []);
    payments.forEach(p => {
      if (p.table_code === code && p.status === 'pending') {
        p.status = 'cancelled';
      }
    });
    setStore('payments', payments);

    // Xóa giỏ hàng cũ của bàn này
    const carts = getStore('carts', {});
    if (carts && carts[code]) {
      delete carts[code];
      setStore('carts', carts);
    }
  }

  return session;
}

async function closeQrSession(table) {
  const code = String(table || '').trim().toUpperCase();
  if (!code) throw new Error('Mã bàn không hợp lệ');

  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  if (remoteEnabled && isRealAuthToken(auth?.accessToken)) {
    try {
      await callRpc('close_dining_session', { p_table: code }, auth.accessToken);
    } catch (e) {
      console.warn('Fallback đóng phiên QR cục bộ:', e.message);
    }
  }

  const sessions = getLocalSessions();
  if (sessions[code]) {
    sessions[code].status = 'closed';
    sessions[code].closed_at = new Date().toISOString();
    saveLocalSessions(sessions);
  }

  if (typeof getStore === 'function' && typeof setStore === 'function') {
    // Chuyển các đơn đã sẵn sàng/đang nấu của bàn sang hoàn tất hoặc lưu lịch sử
    const orders = getStore('orders', appData?.orders || []);
    orders.forEach(o => {
      if (o.table === code && o.status === 'cancel_requested') {
        o.status = 'cancelled';
        o.cancelledBy = 'session_closed';
        o.updatedAt = new Date().toISOString();
      } else if (o.table === code && ['new', 'cooking', 'ready'].includes(o.status)) {
        o.status = 'served';
        o.wait = typeof getOrderWait === 'function' ? getOrderWait(o) : (o.wait || 10);
        o.updatedAt = new Date().toISOString();
      }
    });
    setStore('orders', orders);

    // Đổi trạng thái bàn sang 'cleaning' (Đang dọn)
    const tables = getStore('tables', appData?.tables || []);
    const targetTable = tables.find(t => t.id === code);
    if (targetTable) {
      targetTable.status = 'cleaning';
      setStore('tables', tables);
      if (typeof appData !== 'undefined') appData.tables = tables;
    }

    // Xóa giỏ hàng của bàn
    const carts = getStore('carts', {});
    if (carts && carts[code]) {
      delete carts[code];
      setStore('carts', carts);
    }
  }

  return true;
}

// ==========================================================================
// THANH TOÁN, ĐƠN HÀNG & PHẢN HỒI THỜI GIAN THỰC
// ==========================================================================

async function requestPayment(method, tableOverride = '') {
  const qr = typeof getQrSession === 'function' ? getQrSession() : null;
  const tableCode = String(tableOverride || qr?.table || sessionStorage.getItem('menumind:table') || 'A01').trim().toUpperCase();
  if (!['cash', 'card', 'bank_transfer'].includes(method)) {
    throw new Error('Vui lòng chọn phương thức thanh toán hợp lệ');
  }

  const orders = typeof getStore === 'function' ? getStore('orders', appData?.orders || []) : [];
  const tableOrders = orders.filter(o => o.table === tableCode && o.status !== 'cancelled');
  if (!tableOrders.length) {
    throw new Error('Bàn chưa có đơn hàng nào để thanh toán');
  }

  const totalAmount = tableOrders.reduce((sum, o) => {
    const orderTotal = Number(o.total) || o.items.reduce((s, x) => {
      const m = (appData?.menuItems || []).find(i => i.id === x.menuId);
      return s + (Number(x.unitPrice || m?.price || 0) * Number(x.qty || 1));
    }, 0);
    return sum + orderTotal;
  }, 0);

  if (totalAmount <= 0) {
    throw new Error('Tổng tiền thanh toán phải lớn hơn 0 ₫');
  }

  const sessions = getLocalSessions();
  const session = sessions[tableCode] || ensureTableSession(tableCode, false);
  const payments = typeof getStore === 'function' ? getStore('payments', appData?.payments || []) : [];

  let payment = payments.find(p => p.table_code === tableCode && p.status === 'pending');
  if (payment) {
    payment.amount = totalAmount;
    payment.method = method;
    payment.created_at = new Date().toISOString();
  } else {
    payment = {
      id: `p-${Date.now().toString(36)}`,
      dining_session_id: session.id,
      table_code: tableCode,
      reference: `HD-${tableCode}-${Math.floor(100 + Math.random() * 900)}`,
      method,
      amount: totalAmount,
      status: 'pending',
      created_at: new Date().toISOString(),
      paid_at: null
    };
    payments.unshift(payment);
  }

  if (typeof setStore === 'function') {
    setStore('payments', payments);
    setStore('payment', payment);
    if (typeof appData !== 'undefined') appData.payments = payments;
  }

  return payment;
}

async function loadQrPayment(qr) {
  const tableCode = String(qr?.table || sessionStorage.getItem('menumind:table') || '').trim().toUpperCase();
  if (!tableCode) return null;
  const payments = typeof getStore === 'function' ? getStore('payments', appData?.payments || []) : [];
  const sessions = getLocalSessions();
  const currentSession = sessions[tableCode];

  // Tìm bản ghi thanh toán của phiên hiện tại hoặc đang pending của bàn này
  const match = payments.find(p =>
    p.table_code === tableCode &&
    (p.status === 'pending' || (currentSession && p.dining_session_id === currentSession.id && p.status === 'paid'))
  );
  return match || null;
}

function classifyFeedbackTheme(text, rating) {
  const lower = String(text || '').toLowerCase();
  if (/chờ|chậm|lâu|trễ|phút|giờ cao điểm/.test(lower)) return 'Thời gian chờ';
  if (/nhân viên|phục vụ|thái độ|nhắc|nhiệt tình|chu đáo/.test(lower)) return 'Thái độ phục vụ';
  if (/không gian|vườn|bàn|sạch|thoáng|nhạc|ấm cúng/.test(lower)) return 'Không gian';
  if (/cay|mặn|nhạt|ngọt|khẩu vị|vừa miệng/.test(lower)) return 'Khẩu vị';
  if (/giá|đắt|rẻ|hợp lý|tiền/.test(lower)) return 'Giá cả';
  if (/ngon|tươi|món|cá hồi|bò|salad|mì|cơm|trà|bánh/.test(lower)) return 'Hương vị món';
  return rating >= 4 ? 'Hương vị món' : 'Dịch vụ chung';
}

async function submitQrFeedback(rating, message, tableOverride = '') {
  const qr = typeof getQrSession === 'function' ? getQrSession() : null;
  const tableCode = String(tableOverride || qr?.table || sessionStorage.getItem('menumind:table') || 'A01').trim().toUpperCase();
  const numRating = Number(rating);
  const cleanText = String(message || '').trim();

  if (!numRating || numRating < 1 || numRating > 5) {
    throw new Error('Vui lòng chọn số sao từ 1 đến 5');
  }
  if (cleanText.length < 8) {
    throw new Error('Nội dung phản hồi phải có ít nhất 8 ký tự');
  }

  const sessions = getLocalSessions();
  const session = sessions[tableCode] || ensureTableSession(tableCode, false);
  const feedbackList = typeof getStore === 'function' ? getStore('feedback', appData?.feedback || []) : [];

  const saved = {
    id: `f-${Date.now().toString(36)}`,
    table: tableCode,
    dining_session_id: session.id,
    rating: numRating,
    text: cleanText,
    theme: classifyFeedbackTheme(cleanText, numRating),
    status: 'new',
    createdAt: new Date().toISOString()
  };

  feedbackList.unshift(saved);
  if (typeof setStore === 'function') {
    setStore('feedback', feedbackList);
    if (typeof appData !== 'undefined') appData.feedback = feedbackList;
  }

  return saved;
}

async function createOrderRemote(order) {
  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  const qr = typeof getQrSession === 'function' ? getQrSession() : null;
  if (remoteEnabled && isRealAuthToken(auth?.accessToken) && qr?.token) {
    try {
      await callRpc('place_qr_order', {
        p_table: order.table,
        p_token: qr.token,
        p_order_id: order.id,
        p_items: order.items,
        p_total: order.total,
        p_note: order.note
      });
    } catch (e) {
      console.warn('Lưu đơn ở chế độ thời gian thực cục bộ:', e.message);
    }
  }
  return order;
}

async function updateOrderRemote(order) {
  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  if (!remoteEnabled || !isRealAuthToken(auth?.accessToken)) return;
  try {
    await remoteWrite(
      'orders',
      'PATCH',
      { status: order.status, priority: order.priority, wait: order.wait, note: order.note },
      `?id=eq.${encodeURIComponent(order.id)}`,
      auth.accessToken
    );
  } catch (e) {
    console.warn('Cập nhật đơn cục bộ:', e.message);
  }
}

async function updateMenuRemote(item) {
  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  if (!remoteEnabled || !isRealAuthToken(auth?.accessToken)) return;
  try {
    await remoteWrite(
      'menuItems',
      'PATCH',
      { available: item.available, price: item.price, name: item.name, category: item.category, description: item.description },
      `?id=eq.${encodeURIComponent(item.id)}`,
      auth.accessToken
    );
  } catch (e) {
    console.warn('Cập nhật thực đơn cục bộ:', e.message);
  }
}

async function createTableRemote(table) {
  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  if (!remoteEnabled || !isRealAuthToken(auth?.accessToken)) return table;
  try {
    const rows = await remoteWrite('tables', 'POST', {
      code: table.id,
      zone: table.zone,
      seats: table.seats,
      status: table.status
    }, '', auth.accessToken);
    return rows?.[0] || table;
  } catch {
    return table;
  }
}

async function confirmPaymentRemote(paymentId) {
  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  if (remoteEnabled && isRealAuthToken(auth?.accessToken)) {
    try {
      await callRpc('confirm_payment', { p_payment_id: paymentId }, auth.accessToken);
    } catch (e) {
      console.warn('Xác nhận thanh toán cục bộ:', e.message);
    }
  }

  if (typeof getStore === 'function' && typeof setStore === 'function') {
    const payments = getStore('payments', appData?.payments || []);
    const payment = payments.find(item => item.id === paymentId);
    if (!payment) throw new Error('Không tìm thấy yêu cầu thanh toán');

    payment.status = 'paid';
    payment.paid_at = new Date().toISOString();
    setStore('payments', payments);
    if (typeof appData !== 'undefined') appData.payments = payments;

    const tableCode = payment.table_code;
    if (tableCode) {
      // 1. Đánh dấu toàn bộ đơn đang mở của bàn này sang 'served'
      const orders = getStore('orders', appData?.orders || []);
      orders.forEach(o => {
        if (o.table === tableCode && ['new', 'cooking', 'ready'].includes(o.status)) {
          o.status = 'served';
          o.wait = typeof getOrderWait === 'function' ? getOrderWait(o) : (o.wait || 12);
          o.updatedAt = new Date().toISOString();
        }
      });
      setStore('orders', orders);
      if (typeof appData !== 'undefined') appData.orders = orders;

      // 2. Đóng phiên QR của bàn
      const sessions = getLocalSessions();
      if (sessions[tableCode]) {
        sessions[tableCode].status = 'closed';
        sessions[tableCode].closed_at = new Date().toISOString();
        saveLocalSessions(sessions);
      }

      // 3. Chuyển trạng thái bàn sang 'cleaning' (Đang dọn)
      const tables = getStore('tables', appData?.tables || []);
      const targetTable = tables.find(t => t.id === tableCode);
      if (targetTable) {
        targetTable.status = 'cleaning';
        setStore('tables', tables);
        if (typeof appData !== 'undefined') appData.tables = tables;
      }

      // 4. Xóa giỏ hàng của bàn
      const carts = getStore('carts', {});
      if (carts && carts[tableCode]) {
        delete carts[tableCode];
        setStore('carts', carts);
      }
    }
  }
  return true;
}

// ==========================================================================
// TẢI ẢNH MÓN ĂN (HỖ TRỢ DATA URL CỤC BỘ & SUPABASE STORAGE)
// ==========================================================================

const MENU_IMAGE_BUCKET = 'menu-images';
const MENU_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MENU_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

function validateMenuImage(file) {
  if (!(file instanceof File) || !file.size) throw new Error('Vui lòng chọn ảnh món ăn');
  if (!MENU_IMAGE_TYPES.has(file.type)) throw new Error('Ảnh phải có định dạng JPG, PNG hoặc WebP');
  if (file.size > MENU_IMAGE_MAX_SIZE) throw new Error('Ảnh không được lớn hơn 5 MB');
}

function menuImageExtension(file) {
  return ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' })[file.type] || 'jpg';
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Không thể đọc tệp ảnh'));
    reader.readAsDataURL(file);
  });
}

async function uploadMenuImage(file, itemId) {
  validateMenuImage(file);
  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  const objectName = `${itemId}.${menuImageExtension(file)}`;

  if (remoteEnabled && isRealAuthToken(auth?.accessToken)) {
    try {
      const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${MENU_IMAGE_BUCKET}/${encodeURIComponent(objectName)}`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': file.type,
          'x-upsert': 'true'
        },
        body: file
      });
      if (response.ok) {
        return {
          objectName,
          publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${MENU_IMAGE_BUCKET}/${encodeURIComponent(objectName)}`
        };
      }
    } catch (e) {
      console.warn('Sử dụng DataURL cục bộ cho ảnh món ăn:', e.message);
    }
  }

  const dataUrl = await readFileAsDataUrl(file);
  return {
    objectName,
    publicUrl: dataUrl
  };
}

async function removeMenuImage(objectName) {
  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  if (!remoteEnabled || !isRealAuthToken(auth?.accessToken) || !objectName) return;
  await fetch(`${SUPABASE_URL}/storage/v1/object/${MENU_IMAGE_BUCKET}/${encodeURIComponent(objectName)}`, {
    method: 'DELETE',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${auth.accessToken}` }
  }).catch(() => {});
}

async function createMenuItemRemote(item) {
  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  if (!remoteEnabled || !isRealAuthToken(auth?.accessToken)) return item;
  const rows = await remoteWrite('menuItems', 'POST', item, '', auth.accessToken);
  return rows?.[0] || item;
}

async function createStaffProfileRemote(profile) {
  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  if (!remoteEnabled || !isRealAuthToken(auth?.accessToken)) return profile;
  const rows = await callRpc('create_staff_profile', {
    p_name: profile.name,
    p_email: profile.email,
    p_role: profile.role,
    p_shift: profile.shift
  }, auth.accessToken);
  return rows?.[0] || profile;
}

async function setStaffStatusRemote(id, status) {
  const auth = typeof getAuthSession === 'function' ? getAuthSession() : null;
  if (!remoteEnabled || !isRealAuthToken(auth?.accessToken)) return { id, status };
  const rows = await callRpc('set_staff_status', { p_staff_id: id, p_status: status }, auth.accessToken);
  return rows?.[0] || { id, status };
}
