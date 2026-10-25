# MenuMind

MenuMind là nguyên mẫu Web Frontend đa vai trò cho nhà hàng: thực khách khám phá món và tạo đơn, bếp điều phối tiến độ, quản lý theo dõi thực đơn/doanh thu/phản hồi, quản trị viên quản lý bàn và tài khoản.

## Chạy dự án

Dự án dùng HTML, CSS và JavaScript thuần. Do dữ liệu được tải bằng `fetch`, hãy chạy qua HTTP server thay vì mở trực tiếp bằng `file://`.

```powershell
python -m http.server 4173
```

Mở `http://localhost:4173`. Không cần cài package hay build.

## Khu vực truy cập

Tại `pages/login.html`, chọn khu vực làm việc tương ứng với quyền được cấp.

- Thực khách: thực đơn → chi tiết món → giỏ món → gửi đơn → theo dõi/phản hồi.
- Nhân viên bếp: bảng đơn → chi tiết đơn → cảnh báo thời gian chờ.
- Quản lý: quản lý thực đơn → thống kê bán hàng → trung tâm phản hồi.
- Quản trị viên: quản lý bàn → tài khoản → cài đặt.

## Các tính năng chính

- 16 màn hình semantic HTML, responsive từ 320px đến desktop.
- CRUD phía trình duyệt qua lớp lưu trữ hiện tại, dữ liệu giữ nguyên sau khi tải lại trang.
- Search, multi-filter, sort, form validation, dialog, toast, export CSV.
- State coverage: normal, loading, empty, error, success, pending, cancelled, disabled.
- Ba luồng AI Product UX: Taste Recommender, Kitchen Load Predictor, Feedback Theme Extractor.
- AI có input, processing, output, explainability, user control, save/apply và failure UX.
- Điều hướng bàn phím, focus rõ, Escape đóng dialog, reduced motion.

## Cấu trúc

```text
assets/data/app-data.json   Dữ liệu dự phòng khi API không khả dụng
css/shared/                 Các lớp giao diện dùng chung
css/pages/                  Một CSS entry tương ứng cho mỗi trang
js/shared/                  Supabase, xác thực, tiện ích và sự kiện dùng chung
js/pages/                   Một JavaScript entry tương ứng cho mỗi trang
pages/                      Các màn hình chức năng
docs/                       Tài liệu phân tích và truy vết
index.html                  Trang giới thiệu/chọn bàn
```

## Dữ liệu và reset

Các thay đổi hiện được lưu dưới namespace `menumind:*` trong `localStorage`. Khi kết nối backend, thay lớp lưu trữ này bằng API dùng chung cho tất cả thiết bị.

## Minh chứng cần nhóm tự hoàn thiện trước bảo vệ

Code không thể thay thế bằng chứng quá trình. Nhóm cần bổ sung link deploy, bảng Trello/Jira/Notion, branch/commit/PR review, Figma public và video OBS 1:1 với 16 màn hình vào `docs/screen-inventory.md`.
