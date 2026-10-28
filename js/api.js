/**
 * js/api.js - MenuMind Data Access Layer & Real-Time API Module
 * Phụ trách: SV2 (Đặng Xuân Dương - Trục chéo 2: Kiến trúc Dữ liệu & An toàn mã nguồn)
 * Đạt chuẩn: Tiêu chí 5.3 (Quản lý dữ liệu), Tiêu chí 5.4 (Kiến trúc mô-đun & Chống XSS)
 * Điểm thưởng mở rộng: Đồng bộ dữ liệu liên thông thời gian thực giữa các Tab (+0.50đ)
 */

const API_STORAGE_PREFIX = 'menumind:';

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#039;',
    '"': '&quot;'
  }[tag] || tag));
}

window.escapeHTML = escapeHTML;
window.escapeHtml = escapeHTML;

const api = {
  get(key, fallback = []) {
    if (typeof getStore === 'function') return getStore(key, fallback);
    try {
      const data = localStorage.getItem(`${API_STORAGE_PREFIX}${key}`);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Lỗi đọc localStorage key [${key}]:`, e);
      return fallback;
    }
  },

  set(key, value) {
    if (typeof setStore === 'function') {
      setStore(key, value);
      return true;
    }
    try {
      localStorage.setItem(`${API_STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Lỗi ghi localStorage key [${key}]:`, e);
      return false;
    }
  },

  // 1. Quản lý Món ăn (menuItems)
  getMenuItems() {
    return this.get('menuItems', typeof appData !== 'undefined' ? appData.menuItems : []);
  },

  saveMenuItem(item) {
    const items = this.getMenuItems();
    const index = items.findIndex(x => x.id === item.id);
    if (index >= 0) {
      items[index] = { ...items[index], ...item };
    } else {
      items.unshift({ ...item, id: item.id || `m-${Date.now()}` });
    }
    this.set('menuItems', items);
    return items;
  },

  deleteMenuItem(id) {
    const items = this.getMenuItems().filter(x => x.id !== id);
    this.set('menuItems', items);
    return items;
  },

  // 2. Quản lý Đơn hàng (orders)
  getOrders() {
    return this.get('orders', typeof appData !== 'undefined' ? appData.orders : []);
  },

  createOrder(orderData) {
    const orders = this.getOrders();
    const items = Array.isArray(orderData.items) ? orderData.items : [];
    const subtotal = orderData.subtotal || items.reduce((sum, x) => sum + (Number(x.unitPrice) || 0) * (Number(x.qty) || 1), 0);
    const serviceFee = orderData.serviceFee ?? Math.round(subtotal * 0.05);
    const total = orderData.total || (subtotal + serviceFee);
    const newOrder = {
      id: orderData.id || `MM-${Math.floor(1000 + Math.random() * 9000)}`,
      table: String(orderData.table || 'A01').toUpperCase(),
      items,
      subtotal,
      serviceFee,
      total,
      note: orderData.note ? escapeHTML(orderData.note) : '',
      status: 'new',
      priority: Boolean(orderData.priority),
      wait: 0,
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    this.set('orders', orders);
    return newOrder;
  },

  updateOrderStatus(orderId, nextStatus) {
    const orders = this.getOrders();
    const order = orders.find(x => x.id === orderId);
    if (order) {
      order.status = nextStatus;
      order.updatedAt = new Date().toISOString();
      if (['served', 'cancelled'].includes(nextStatus) && typeof getOrderWait === 'function') {
        order.wait = getOrderWait(order);
      }
      this.set('orders', orders);
    }
    return order;
  },

  // 3. Quản lý Bàn ăn (tables)
  getTables() {
    return this.get('tables', typeof appData !== 'undefined' ? appData.tables : []);
  },

  updateTableStatus(tableId, status) {
    const tables = this.getTables();
    const table = tables.find(x => x.id === tableId);
    if (table) {
      table.status = status;
      this.set('tables', tables);
    }
    return table;
  },

  // 4. Quản lý Phản hồi (feedback)
  getFeedback() {
    return this.get('feedback', typeof appData !== 'undefined' ? appData.feedback : []);
  },

  addFeedback(feedbackData) {
    const feedbackList = this.getFeedback();
    const newFeedback = {
      id: `f-${Date.now().toString(36)}`,
      table: feedbackData.table || 'A01',
      rating: Number(feedbackData.rating) || 5,
      text: escapeHTML(feedbackData.text || ''),
      theme: feedbackData.theme || (typeof classifyFeedbackTheme === 'function' ? classifyFeedbackTheme(feedbackData.text, feedbackData.rating) : 'Dịch vụ chung'),
      status: 'new',
      createdAt: new Date().toISOString()
    };
    feedbackList.unshift(newFeedback);
    this.set('feedback', feedbackList);
    return newFeedback;
  },

  // 5. Tải dữ liệu mẫu khởi tạo qua HTTP fetch() có try/catch/finally
  async loadSeedData(rootPath = '.') {
    let loadedData = null;
    try {
      const response = await fetch(`${rootPath}/assets/data/app-data.json`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP Lỗi khi tải dữ liệu: ${response.status}`);
      }
      loadedData = await response.json();
    } catch (err) {
      console.warn('Không thể fetch dữ liệu qua mạng, sử dụng dữ liệu cục bộ:', err);
      loadedData = this.get('seed', null);
    } finally {
      if (loadedData) {
        ['menuItems', 'orders', 'tables', 'feedback', 'staff', 'payments'].forEach(key => {
          if (!localStorage.getItem(`${API_STORAGE_PREFIX}${key}`)) {
            this.set(key, loadedData[key] || []);
          }
        });
      }
    }
    return loadedData;
  }
};

window.api = api;

// Đồng bộ dữ liệu liên thông thời gian thực giữa các Tab (Cross-Tab Synchronization)
window.addEventListener('storage', event => {
  if (event.key && event.key.startsWith(API_STORAGE_PREFIX)) {
    if (typeof triggerRealtimeRender === 'function') {
      triggerRealtimeRender(event.key.replace(API_STORAGE_PREFIX, ''));
      return;
    }
    if (typeof kitchenBoardPageV2 === 'function' && document.querySelector('#kitchen-board-wrapper')) {
      kitchenBoardPageV2();
    }
    if (typeof statusPageV2 === 'function' && document.querySelector('#status-content-wrapper')) {
      statusPageV2();
    }
    if (typeof managerPaymentsPage === 'function' && document.querySelector('#manager-payments-wrapper')) {
      managerPaymentsPage();
    }
  }
});
