# MenuMind – Thực Đơn Thông Minh & Điều Phối Đơn Hàng F&B

> **Học phần:** Phát triển ứng dụng Web cơ bản – CSE122  
> **Đề tài:** BTL-09 – MenuMind (Lĩnh vực: Nhà hàng / F&B)  
> **Giảng viên hướng dẫn & chấm điểm:** ThS. Kiều Tuấn Dũng – ThS. Tạ Chí Hiếu  
> **Nhóm sinh viên thực hiện:** Nhóm 09 (Lớp 67KTPM2 – Khoa CNTT, Đại học Thủy Lợi)  

---

## 1. Giới Thiệu Tổng Quan Sản Phẩm

**MenuMind** là nguyên mẫu Web Frontend ứng dụng kiến trúc đa vai trò (Multi-Role Web Application) phục vụ hệ sinh thái vận hành nhà hàng hiện đại:
* **Thực khách** quét mã QR tại bàn để khám phá thực đơn thông minh, nhận gợi ý khẩu vị AI và tự đặt món.
* **Nhân viên Bếp** điều phối chế biến liên tục qua bảng Kanban thời gian thực và nhận cảnh báo quá tải bếp từ AI.
* **Quản lý & Thu ngân** kiểm soát thực đơn, xác nhận thanh toán bàn, phân tích doanh số và gom nhóm phản hồi khách hàng bằng AI.
* **Quản trị viên (Chủ quán)** cấu hình tham số toàn nhà hàng, quản lý sơ đồ bàn và phân quyền tài khoản nhân sự.

---

## 2. Thông Tin Nhóm & Phân Công Trách Nhiệm 2 Chiều

Nhóm áp dụng mô hình phân bổ cân bằng **Lát cắt dọc (Vertical Slice)** kết hợp **Trục trách nhiệm chéo (Cross-Responsibility)** theo đúng quy chế BTL CSE122:

| Thành viên | Mã SV | Vai trò | Lát cắt dọc (Phụ trách 100% UI & Logic) | Trục trách nhiệm chéo (Toàn hệ thống) |
| :--- | :---: | :---: | :--- | :--- |
| **Nguyễn Văn Hoàng** | *SV1* | Trưởng nhóm | **Khối Mặt tiền (6 màn):** `index.html`, `login.html`, `diner-menu.html`, `diner-dish-detail.html`, `diner-table-order.html`, `diner-order-status.html`<br>⭐ Sở hữu **AI-1: Taste Recommender** | **Trục chéo 1 — Hệ thống Thiết kế & A11y:**<br>• Thiết kế Design System, biến `:root` trong `css/common.css`<br>• Khung điều hướng & Role Switcher<br>• Tiêu chuẩn tiếp cận (Tab `:focus-visible`, Esc, `alt`, `label`) |
| **Trần Văn Dương** | *SV2* | Thành viên | **Khối Vận hành Bếp & Sảnh (5 màn):** `kitchen-board.html`, `kitchen-order-detail.html`, `kitchen-wait-time-alerts.html`, `admin-table-management.html`, `manager-payment-requests.html`<br>⭐ Sở hữu **AI-2: Kitchen Load Predictor** | **Trục chéo 2 — Kiến trúc Dữ liệu & AI UX:**<br>• Mô-đun lưu trữ `localStorage` trong `js/database.js`<br>• Tạo bộ dữ liệu mẫu JSON 24 món ăn thực tế<br>• Viết hàm bảo mật chống XSS `escapeHTML()` |
| **Nguyễn Văn Hải** | *SV3* | Thành viên | **Khối Quản trị & Quản lý (6 màn):** `manager-menu-management.html`, `manager-sales-insights.html`, `manager-feedback-center.html`, `admin-user-management.html`, `admin-settings.html`, `404.html`<br>⭐ Sở hữu **AI-3: Feedback Theme Extractor** | **Trục chéo 3 — Responsive QA, Git & Triển khai:**<br>• Kiểm thử Responsive đa thiết bị (320px, 768px, Desktop)<br>• Quản lý hợp nhất nhánh Git (`dev` $\rightarrow$ `main`)<br>• Triển khai thực tế (Live Deployment) & QA |

---

## 3. Bảng Liên Kết Minh Chứng Bắt Buộc

* 🌐 **Đường dẫn chạy thử thực tế (Live Deployment):** `[Đang triển khai GitHub Pages]`
* 📁 **Kho mã nguồn GitHub (Public Repo):** [https://github.com/coolnguyen/CSE122_67KTPM2_BTCK_Nhom9](https://github.com/coolnguyen/CSE122_67KTPM2_BTCK_Nhom9)
* 🎨 **Bản thiết kế Figma (Public View):** [https://www.figma.com/design/N8wER6qISetc5Gf4pANqka/MenuMind](https://www.figma.com/design/N8wER6qISetc5Gf4pANqka/MenuMind)
* 📋 **Bảng quản lý công việc Trello:** `[Dán liên kết Trello Public tại đây]`
* 📹 **Thư mục Video OBS Minh chứng (17 màn hình):** `[Dán liên kết thư mục Google Drive tại đây]`

---

## 4. Bối Cảnh Thực Tế & Vấn Đề Giải Quyết (P1 – P4)

* **P1. Khó khám phá thực đơn:** Menu giấy truyền thống quá dài khiến khách mất 10–15 phút lựa chọn, bàn quay vòng chậm trong giờ cao điểm.
* **P2. Thiếu cá nhân hóa khẩu vị:** Khách kiêng cay, ăn chay, dị ứng thực phẩm không được tư vấn, dễ gọi nhầm món và thất vọng.
* **P3. Bất đồng bộ trạng thái đơn:** Đơn giấy viết tay dễ sai sót, bếp làm xong phục vụ không biết, bàn chờ quá 20 phút không có cảnh báo tự động.
* **P4. Thiếu số liệu vận hành & Bỏ quên phản hồi:** Quản lý không có báo cáo món bán chạy/món tồn theo thời gian thực; nhận xét của khách bị trôi mất.

---

## 5. Mục Tiêu Dự Án (O1 – O7)

* **O1.** Xây dựng ứng dụng Web Frontend hoàn chỉnh, responsive từ 320px đến desktop, đạt chuẩn W3C HTML5/CSS3.
* **O2.** Triển khai trọn vẹn 4 vai trò nghiệp vụ với 17 màn hình liên thông khép kín.
* **O3.** Thao tác CRUD thực chất phản ánh đúng vòng đời dữ liệu (Món ăn, Bàn ăn, Đơn hàng, Phản hồi, Nhân sự).
* **O4.** Lập trình DOM JavaScript phong phú: Tìm kiếm thời gian thực, lọc đa tiêu chí đồng thời, form validation hiển thị lỗi trực tiếp.
* **O5.** Lưu trữ dữ liệu bền vững qua `localStorage` và 24 bản ghi JSON phong phú, F5 không mất dữ liệu.
* **O6.** Hiện thực hóa 3 tính năng AI UX 6 bước và kịch bản xử lý khi AI thất bại (AI Failure / Uncertainty UX).
* **O7.** Quy trình làm việc nhóm chuẩn công nghiệp với Trello, Git Flow (`main`, `dev`, `feature/*`), Peer Review và Video OBS.

---

## 6. Bốn Vai Trò Người Dùng Trong Hệ Thống

1. **Khách hàng (Diner):** Quét QR chọn bàn, tìm kiếm món, nhận gợi ý combo AI, tùy chỉnh ghi chú, gửi đơn và đánh giá sao.
2. **Nhân viên Bếp (Kitchen):** Quản lý luồng chế biến trên bảng Kanban, tick hoàn thành từng món, nhận cảnh báo đơn trễ.
3. **Quản lý nhà hàng (Manager):** Quản lý danh mục món ăn, xác nhận yêu cầu thanh toán bàn, xem biểu đồ doanh số và phân tích phản hồi.
4. **Quản trị viên (Admin - Chủ nhà hàng):** Sơ đồ bàn ăn và in QR, phân quyền tài khoản nhân sự, cấu hình thông tin quán và reset dữ liệu.

---

## 7. Bảng Kiểm Kê 17 Màn Hình Giao Diện

Chi tiết xem tại tài liệu đặc tả: [docs/screen-inventory.md](docs/screen-inventory.md).

| ID | Tệp giao diện | Tên màn hình | Role | CRUD | Trải nghiệm AI | Phụ trách |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| **S01** | `index.html` | Giới thiệu & Chọn bàn | Dùng chung | R/U | Không | Hoàng |
| **S02** | `pages/login.html` | Đăng nhập vai trò | Dùng chung | R | Không | Hoàng |
| **S03** | `pages/diner-menu.html` | Thực đơn thông minh | Khách | R/C | **AI-1: Taste Recommender** | Hoàng |
| **S04** | `pages/diner-dish-detail.html` | Chi tiết món ăn | Khách | C/R/U | Không | Hoàng |
| **S05** | `pages/diner-table-order.html` | Giỏ món bàn ăn | Khách | C/R/U/D | Không | Hoàng |
| **S06** | `pages/diner-order-status.html` | Theo dõi đơn hàng | Khách | R/C | Không | Hoàng |
| **S07** | `pages/kitchen-board.html` | Bảng Kanban bếp | Bếp | R/U | Không | Dương |
| **S08** | `pages/kitchen-order-detail.html` | Chi tiết đơn chế biến | Bếp | C/R/U | Không | Dương |
| **S09** | `pages/kitchen-wait-time-alerts.html` | Cảnh báo thời gian chờ | Bếp | C/R/U | **AI-2: Kitchen Load Predictor** | Dương |
| **S10** | `pages/admin-table-management.html` | Quản lý bàn & QR | Sảnh | C/R/U | Không | Dương |
| **S11** | `pages/manager-payment-requests.html` | Yêu cầu thanh toán | Sảnh | R/U | Không | Dương |
| **S12** | `pages/manager-menu-management.html` | Quản lý thực đơn | Quản lý | C/R/U/D | Không | Hải |
| **S13** | `pages/manager-sales-insights.html` | Báo cáo doanh số | Quản lý | R/Export | Không | Hải |
| **S14** | `pages/manager-feedback-center.html` | Trung tâm phản hồi | Quản lý | R/U | **AI-3: Feedback Theme Extractor** | Hải |
| **S15** | `pages/admin-user-management.html` | Quản lý nhân viên | Admin | C/R/U/D | Không | Hải |
| **S16** | `pages/admin-settings.html` | Cài đặt hệ thống | Admin | R/U/D | Không | Hải |
| **S17** | `pages/404.html` | Trang 404 & Phục hồi | Chung | R | Không | Hải |

---

## 8. Ba Trải Nghiệm AI Đặc Thù (Chuẩn 6 Bước & Failure UX)

1. **AI-1: Taste Recommender (Thực đơn - `pages/diner-menu.html`):**  
   Gợi ý combo món theo mức cay, chế độ ăn kiêng và ngân sách. Có khối giải thích *"Vì sao gợi ý?"* và nút *"Thêm vào giỏ"*.  
   *Failure UX:* Khi chọn điều kiện mâu thuẫn $\rightarrow$ Báo độ tin cậy thấp kèm gợi ý mở rộng tiêu chí.
2. **AI-2: Kitchen Load Predictor (Cảnh báo bếp - `pages/kitchen-wait-time-alerts.html`):**  
   Dự báo thời gian chờ dựa trên công suất trạm bếp và cảnh báo đỏ đơn hàng trễ.  
   *Failure UX:* Món ngoài menu $\rightarrow$ Báo hộp vàng nhắc bếp trưởng căn chỉnh thủ công.
3. **AI-3: Feedback Theme Extractor (Phản hồi - `pages/manager-feedback-center.html`):**  
   Quét NLP tự động gom nhóm 3 chủ đề nóng nhất từ nhận xét của khách và cho phép sửa nhận xét trước khi lưu.  
   *Failure UX:* Nhận xét trống hoặc ký tự rác $\rightarrow$ Xếp vào nhóm *"Ý kiến chưa phân loại"*.

---

## 9. Luồng Nghiệp Vụ Đầu - Cuối (End-to-End User Flow)

```text
Khách quét QR chọn bàn (S01) 
  ──► Chọn món qua gợi ý AI (S03, S04) 
  ──► Gửi đơn vào bếp (S05) 
  ──► Đơn hiện trên Kanban Bếp (S07, S08) 
  ──► Bếp nấu & Cảnh báo trễ AI (S09) 
  ──► Khách theo dõi & gọi thanh toán (S06) 
  ──► Thu ngân xác nhận thu tiền (S11) 
  ──► Doanh số & Đánh giá cập nhật lên Dashboard Quản lý (S13, S14)
```

---

## 10. Kiến Trúc Kỹ Thuật & Cấu Trúc Thư Mục

Dự án sử dụng **HTML5 thuần, CSS3 hiện đại (Flexbox/Grid/Tokens) và Vanilla JavaScript ES6+**, không phụ thuộc framework cồng kềnh:

```text
├── assets/
│   ├── config/supabase.json       # Cấu hình API Supabase (Publishable Key an toàn)
│   ├── data/app-data.json         # 24 bản ghi dữ liệu mẫu phong phú
│   └── images/menu/               # 24 hình ảnh món ăn chất lượng cao
├── css/
│   ├── common.css                 # Hệ thống Design Tokens (:root), Typography, Layout chung
│   ├── header.css                 # Điều hướng Header & Thanh Role Switcher
│   └── [tên-man-hinh].css         # CSS riêng biệt cho từng trang
├── js/
│   ├── common.js                  # Tiện ích DOM, Toast thông báo, Modal dialog
│   ├── database.js                # Lớp quản lý dữ liệu localStorage & đồng bộ
│   ├── header.js                  # Xử lý Drawer menu mobile và chuyển vai trò
│   └── [tên-man-hinh].js          # Logic sự kiện JavaScript riêng cho từng trang
├── pages/                         # 16 màn hình chức năng của các vai trò
├── docs/                          # Tài liệu truy vết BTL (proposal, inventory, assignment, AI report)
├── index.html                     # Màn hình bắt đầu (Trang chủ & Chọn bàn)
└── README.md                      # Báo cáo tổng quan dự án (15 mục chuẩn)
```

---

## 11. Hướng Dẫn Cài Đặt & Chạy Cục Bộ

Do dự án tải dữ liệu mẫu bằng hàm `fetch()`, bắt buộc chạy qua HTTP Server cục bộ thay vì mở trực tiếp bằng giao thức `file://`:

### Cách 1: Sử dụng Python (Đơn giản nhất)
```powershell
# Chạy server tại thư mục dự án
python -m http.server 4173
```
Mở trình duyệt truy cập: `http://localhost:4173`

### Cách 2: Sử dụng VS Code Live Server
* Mở thư mục dự án trong VS Code.
* Chuột phải vào file `index.html` $\rightarrow$ Chọn **Open with Live Server**.

---

## 12. Bao Phủ Trạng Thái Giao Diện (State Coverage)

Mọi màn hình nghiệp vụ đều được thiết kế bao phủ tối thiểu 4 trạng thái giao diện:
1. **Normal State:** Hiển thị danh sách dữ liệu bình thường từ mảng 24 món ăn.
2. **Loading State:** Hiển thị hiệu ứng khung xương (Skeleton) hoặc Spinner khi chờ tải/AI xử lý.
3. **Empty State:** Hiển thị thông báo rõ ràng kèm nút hành động (CTA) *"Xóa bộ lọc"* khi tìm kiếm/lọc không ra kết quả.
4. **Error State:** Có nút giả lập lỗi mạng để hiển thị hộp thông báo lỗi màu đỏ kèm nút *"Thử lại"*.
5. **Form Validation:** Báo lỗi viền đỏ và dòng thông báo lỗi ngay dưới ô nhập liệu sai định dạng.

---

## 13. Quy Chuẩn Git Flow & Đóng Góp Nhóm

Dự án áp dụng nghiêm ngặt chiến lược nhánh chuẩn công nghiệp:
* **`main`:** Nhánh phát hành chính thức, mã nguồn ổn định 100% để nộp bài và demo.
* **`dev`:** Nhánh tích hợp chung, nơi nhận các Pull Request từ các nhánh tính năng.
* **`docs/initial-specs`:** Nhánh khởi tạo hồ sơ tài liệu và đặc tả trước khi code.
* **`feature/<tên-man-hinh>`:** 17 nhánh làm việc độc lập của 3 thành viên (khớp 1:1 với tên file HTML).
* **Quy ước Commit:** Tuân thủ Conventional Commits (`feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`).
* **Quy trình gộp code:** 100% code vào `dev` đều thông qua **Pull Request** có nhận xét đánh giá (Peer Review) từ thành viên khác.

---

## 14. Khả Năng Tiếp Cận (A11y) & Thiết Kế Đáp Ứng (Responsive)

* **Thiết kế đáp ứng đa kích thước:**
  * Desktop: $\ge 1024$px (Layout đa cột rộng rãi).
  * Tablet: $768$px (Lưới 2 cột, bảng dữ liệu co giãn).
  * Mobile: $320$px – $375px$ (Sidebar tự thu thành Hamburger Drawer, bảng dữ liệu chuyển thành Card dọc, không tràn ngang).
* **Khả năng tiếp cận:**
  * 100% ảnh có thẻ `alt` mô tả; 100% ô nhập liệu có `<label>` liên kết `for`.
  * Hỗ trợ điều hướng bàn phím hoàn chỉnh: Phím **Tab** hiển thị viền `:focus-visible` tương phản cao; phím **Esc** đóng Modal/Drawer.
  * Độ tương phản màu chữ/nền đạt chuẩn WCAG $\ge 4.5:1$.

---

## 15. Tuyên Bố Sử Dụng AI & Giấy Phép Bản Quyền

* **Minh bạch AI:** Nhóm có khai báo đầy đủ các công cụ AI hỗ trợ, prompt mẫu, lỗi của AI và cách nhóm tự kiểm chứng sửa mã nguồn tại tài liệu: [docs/ai-usage-report.md](docs/ai-usage-report.md).
* **Làm chủ mã nguồn:** 100% thành viên trong nhóm tự tay kiểm thử, hiểu rõ từng dòng lệnh và sẵn sàng cho phần thi vấn đáp cá nhân cũng như thử thách chỉnh sửa trực tiếp (Live Modification).
* **Bản quyền:** Dự án phát triển phục vụ mục đích học tập trong khuôn khổ Học phần CSE122 – Trường Đại học Thủy Lợi (TLU).
