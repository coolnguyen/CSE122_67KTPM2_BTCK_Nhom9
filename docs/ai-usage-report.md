# Báo cáo sử dụng AI

## Công cụ và phạm vi

- Công cụ: OpenAI Codex.
- Phạm vi hỗ trợ: phân tích đề/barem, đề xuất hệ thống thiết kế, sinh cấu trúc HTML/CSS/JavaScript, dữ liệu mẫu và kịch bản kiểm thử.
- Prompt chính: yêu cầu xây dựng website đầy đủ theo đề BTL-09, barem PDF và danh sách 16 màn hình do nhóm cung cấp.

## Phần AI sinh và phần cần sinh viên kiểm chứng

AI đã hỗ trợ tạo bản triển khai HTML/CSS/JavaScript, sau đó tách mã thành `css/pages`, `css/shared`, `js/pages`, `js/shared` và tài liệu dự án. Sinh viên phải tự:

- đọc và giải thích được event delegation, `localStorage`, `fetch`, `filter/map/reduce`;
- kiểm tra logic vòng đời đơn từ khách sang bếp;
- thử form validation, AI failure UX và responsive;
- thay dữ liệu/tên thành viên/đường dẫn Figma, task, branch, PR, OBS bằng minh chứng thật;
- ghi lại các lỗi phát hiện và cách sửa trong quá trình review.

## Lỗi/rủi ro AI cần kiểm chứng

- Dữ liệu `fetch` không chạy khi mở bằng `file://`; dự án phải chạy qua HTTP server.
- Dữ liệu mô phỏng AI là quy tắc JavaScript, không phải kết quả LLM thật.
- Font Google cần mạng; khi mất mạng giao diện dùng font hệ thống fallback.
- `localStorage` chỉ đồng bộ trong cùng origin và trình duyệt, chưa phải backend nhiều thiết bị.

## Ba tính năng AI mô phỏng

| Tính năng | Input | Processing | Output/Explainability | User control | Save/Apply | Failure UX |
|---|---|---|---|---|---|---|
| Taste Recommender | khẩu vị, món tránh | loading | món + độ phù hợp + 3 yếu tố | chấp nhận/sửa/từ chối/tạo lại | thêm vào giỏ | thiếu khẩu vị |
| Kitchen Load Predictor | số đơn, nhân sự | loading | khoảng chờ + độ tin cậy + yếu tố tải | áp dụng/sửa/từ chối/tạo lại | lưu kế hoạch | quá 8 đơn/người |
| Feedback Theme Extractor | nguồn, mục tiêu | loading | 3 chủ đề + tỷ lệ + lý do | lưu/sửa/từ chối/tạo lại | lưu insight | mục tiêu dưới 10 ký tự |

## Điều học được và giới hạn

AI giúp tăng tốc scaffold nhưng không tạo được bằng chứng quá trình học. Chất lượng cuối cùng phụ thuộc vào việc nhóm tự kiểm thử, hiểu mã, sửa lỗi và chứng minh qua Git/PR/OBS. Ba AI feature trong bản này là mô phỏng frontend có kiểm soát; không gửi dữ liệu khách hàng đến API bên ngoài.
