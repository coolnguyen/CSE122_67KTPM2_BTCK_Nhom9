# Báº£ng PhÃ¢n CÃ´ng Nhiá»‡m Vá»¥ 2 Chiá»u (Team Assignment)

> **Há»c pháº§n:** PhÃ¡t triá»ƒn á»©ng dá»¥ng Web cÆ¡ báº£n â€“ CSE122  
> **Dá»± Ã¡n:** BTL-09 â€“ MenuMind (Thá»±c Ä‘Æ¡n thÃ´ng minh & Äiá»u phá»‘i Ä‘Æ¡n hÃ ng F&B)  
> **NhÃ³m thá»±c hiá»‡n:** NhÃ³m 09 (Lá»›p 67KTPM2 â€“ Khoa CNTT, TrÆ°á»ng Äáº¡i há»c Thá»§y Lá»£i)  
> **Giáº£ng viÃªn hÆ°á»›ng dáº«n & cháº¥m Ä‘iá»ƒm:** ThS. Kiá»u Tuáº¥n DÅ©ng â€“ ThS. Táº¡ ChÃ­ Hiáº¿u  

---

## 1. PhÃ¢n CÃ´ng 2 Chiá»u (Vertical Slice + Trá»¥c ChÃ©o) Cho 3 ThÃ nh ViÃªn

NhÃ³m Ã¡p dá»¥ng mÃ´ hÃ¬nh phÃ¢n chia cÃ´ng viá»‡c cÃ¢n báº±ng theo tá»· lá»‡ vÃ ng **6 â€“ 5 â€“ 6**, káº¿t há»£p giá»¯a LÃ¡t cáº¯t dá»c (Vertical Slice - phá»¥ trÃ¡ch 100% UI & Logic theo Role) vÃ  Trá»¥c trÃ¡ch nhiá»‡m chÃ©o toÃ n há»‡ thá»‘ng (Cross-Responsibility):

| ThÃ nh viÃªn | TrÃ¡ch nhiá»‡m dá»c (Vertical Slice - Theo Role) | TrÃ¡ch nhiá»‡m chÃ©o (Cross-Responsibility - ToÃ n há»‡ thá»‘ng) |
| :--- | :--- | :--- |
| **TrÆ°Æ¡ng Viá»‡t HoÃ ng (SV1)** | **Khá»‘i máº·t tiá»n (6 mÃ n):** S01 $\rightarrow$ S06<br>â­ Phá»¥ trÃ¡ch **AI-1: Taste Recommender** | **Trá»¥c chÃ©o 1**: Kiá»ƒm thá»­ Responsive Ä‘a thiáº¿t bá»‹ (320px, 768px, 1024px+), Thanh Ä‘iá»u hÆ°á»›ng chung (Navigation / Role Switcher), Kháº£ nÄƒng tiáº¿p cáº­n (A11y) |
| **Äáº·ng XuÃ¢n DÆ°Æ¡ng (SV2)** | **Khá»‘i váº­n hÃ nh (5 mÃ n):** S07 $\rightarrow$ S11<br>â­ Phá»¥ trÃ¡ch **AI-2: Kitchen Load Predictor** | **Trá»¥c chÃ©o 2**: Xá»­ lÃ½ dá»¯ liá»‡u (backend / localStorage / API), Dá»¯ liá»‡u máº«u JSON (15â€“25 báº£n ghi), Triá»ƒn khai (Deploy) & QA |
| **Nguyá»…n HoÃ ng Háº£i (Leader - SV3)** | **Khá»‘i quáº£n trá»‹ (6 mÃ n):** S12 $\rightarrow$ S17<br>â­ Phá»¥ trÃ¡ch **AI-3: Feedback Theme Extractor** | **Trá»¥c chÃ©o 3**: Há»‡ thá»‘ng thiáº¿t káº¿ (`css/common.css`, `css/style.css`, biáº¿n `:root`), Quáº£n lÃ½ há»£p nháº¥t nhÃ¡nh Git (`dev` $\rightarrow$ `main`) |

---

## 2. Chi Tiáº¿t LÃ¡t Cáº¯t Dá»c & PhÃ¢n Bá»• MÃ n HÃ¬nh Tá»«ng ThÃ nh ViÃªn

### ðŸ‘¤ SV1 â€” TrÆ°Æ¡ng Viá»‡t HoÃ ng: Khá»‘i Máº·t tiá»n â€” HÃ nh trÃ¬nh Thá»±c khÃ¡ch (6 mÃ n)
* **Logic nghiá»‡p vá»¥:** ToÃ n bá»™ tráº£i nghiá»‡m cá»§a má»™t ngÆ°á»i khÃ¡ch bÆ°á»›c vÃ o quÃ¡n tá»« lÃºc quÃ©t QR, xem menu Ä‘áº¿n khi gá»­i Ä‘Æ¡n vÃ  theo dÃµi tráº¡ng thÃ¡i mÃ³n.
* **Danh sÃ¡ch mÃ n hÃ¬nh (6 mÃ n):**
  1. `index.html` â€” Trang chá»§ giá»›i thiá»‡u & Chá»n bÃ n báº¯t Ä‘áº§u (`TASK-01` / `feature/index`)
  2. `pages/login.html` â€” Cá»•ng Ä‘Äƒng nháº­p nhÃ¢n viÃªn (`TASK-02` / `feature/login`)
  3. `pages/diner-menu.html` â€” Thá»±c Ä‘Æ¡n tÃ¬m kiáº¿m/lá»c mÃ³n (`TASK-03` / `feature/diner-menu`)
  4. `pages/diner-dish-detail.html` â€” Xem chi tiáº¿t mÃ³n, chá»n topping/ghi chÃº (`TASK-04` / `feature/diner-dish-detail`)
  5. `pages/diner-table-order.html` â€” Giá» mÃ³n bÃ n Äƒn, xem láº¡i tiá»n & gá»­i Ä‘Æ¡n (`TASK-05` / `feature/diner-table-order`)
  6. `pages/diner-order-status.html` â€” KhÃ¡ch theo dÃµi tiáº¿n Ä‘á»™ mÃ³n ra & gá»­i pháº£n há»“i (`TASK-06` / `feature/diner-order-status`)
* **TÃ­nh nÄƒng AI phá»¥ trÃ¡ch:** **AI-1 â€” Taste Recommender** (Gá»£i Ã½ mÃ³n Äƒn theo kháº©u vá»‹ thá»±c khÃ¡ch).
* **TrÃ¡ch nhiá»‡m chÃ©o toÃ n há»‡ thá»‘ng (Trá»¥c chÃ©o 1):** Kiá»ƒm thá»­ Responsive Ä‘a thiáº¿t bá»‹ (320px, 768px, 1024px+), Thanh Ä‘iá»u hÆ°á»›ng chung (Navigation / Role Switcher), Kháº£ nÄƒng tiáº¿p cáº­n (Accessibility Tab/Esc, `:focus-visible`, `alt`, `label`).

---

### ðŸ‘¨â€ðŸ³ SV2 â€” Äáº·ng XuÃ¢n DÆ°Æ¡ng: Khá»‘i Váº­n hÃ nh â€” Äiá»u phá»‘i Báº¿p & Phá»¥c vá»¥ (5 mÃ n)
* **Logic nghiá»‡p vá»¥:** ToÃ n bá»™ cÃ´ng viá»‡c thá»±c thi Ä‘Æ¡n hÃ ng táº¡i quÃ¡n (Báº¿p náº¥u gÃ¬, bÃ n nÃ o Ä‘ang ngá»“i, bÃ n nÃ o yÃªu cáº§u thanh toÃ¡n bill).
* **Danh sÃ¡ch mÃ n hÃ¬nh (5 mÃ n):**
  1. `pages/kitchen-board.html` â€” Báº£ng Kanban Ä‘iá»u phá»‘i mÃ³n (Chá» $\rightarrow$ Náº¥u $\rightarrow$ Xong) (`TASK-07` / `feature/kitchen-board`)
  2. `pages/kitchen-order-detail.html` â€” Chi tiáº¿t tá»«ng Ä‘Æ¡n cáº§n náº¥u, tick xong tá»«ng mÃ³n (`TASK-08` / `feature/kitchen-order-detail`)
  3. `pages/kitchen-wait-time-alerts.html` â€” Cáº£nh bÃ¡o Ä‘Æ¡n trá»… thá»i gian chá» (`TASK-09` / `feature/kitchen-wait-time-alerts`)
  4. `pages/manager-table-management.html` â€” Quáº£n lÃ½ tráº¡ng thÃ¡i bÃ n (Trá»‘ng / CÃ³ khÃ¡ch) & in QR bÃ n (`TASK-10` / `feature/manager-table-management`)
  5. `pages/manager-payment-requests.html` â€” Danh sÃ¡ch bÃ n yÃªu cáº§u thanh toÃ¡n & xÃ¡c nháº­n thu tiá»n (`TASK-11` / `feature/manager-payment-requests`)
* **TÃ­nh nÄƒng AI phá»¥ trÃ¡ch:** **AI-2 â€” Kitchen Load Predictor** (Dá»± bÃ¡o quÃ¡ táº£i báº¿p vÃ  cáº£nh bÃ¡o thá»i gian chá»).
* **TrÃ¡ch nhiá»‡m chÃ©o toÃ n há»‡ thá»‘ng (Trá»¥c chÃ©o 2):** Xá»­ lÃ½ dá»¯ liá»‡u (backend / localStorage trong `js/database.js`, `js/api.js`), Bá»™ dá»¯ liá»‡u máº«u JSON 24 mÃ³n Äƒn (`assets/data/app-data.json`), viáº¿t hÃ m dÃ¹ng chung chá»‘ng XSS `escapeHTML()`, Triá»ƒn khai (Deploy) & QA.

---

### ðŸ’¼ SV3 â€” Nguyá»…n HoÃ ng Háº£i (Leader): Khá»‘i Quáº£n trá»‹ â€” Quáº£n lÃ½ & Chá»§ nhÃ  hÃ ng (6 mÃ n)
* **Logic nghiá»‡p vá»¥:** Bá»™ nÃ£o chiáº¿n lÆ°á»£c cá»§a nhÃ  hÃ ng (quáº£n lÃ½ mÃ³n bÃ¡n, xem doanh thu lá»i lá»—, xem Ä‘Ã¡nh giÃ¡ cá»§a khÃ¡ch, quáº£n lÃ½ tÃ i khoáº£n nhÃ¢n viÃªn vÃ  cáº¥u hÃ¬nh quÃ¡n).
* **Danh sÃ¡ch mÃ n hÃ¬nh (6 mÃ n):**
  1. `pages/manager-menu-management.html` â€” CRUD quáº£n lÃ½ mÃ³n Äƒn, Ä‘á»•i giÃ¡, báº­t/táº¯t háº¿t hÃ ng (`TASK-12` / `feature/manager-menu-management`)
  2. `pages/admin-sales-insights.html` â€” BÃ¡o cÃ¡o doanh sá»‘ bÃ¡n cháº¡y, biá»ƒu Ä‘á»“ & xuáº¥t CSV (`TASK-13` / `feature/admin-sales-insights`)
  3. `pages/manager-feedback-center.html` â€” Trung tÃ¢m tiáº¿p nháº­n vÃ  xá»­ lÃ½ Ä‘Ã¡nh giÃ¡ cá»§a khÃ¡ch (`TASK-14` / `feature/manager-feedback-center`)
  4. `pages/admin-user-management.html` â€” Quáº£n lÃ½ tÃ i khoáº£n nhÃ¢n viÃªn (cáº¥p quyá»n, vÃ´ hiá»‡u hÃ³a) (`TASK-15` / `feature/admin-user-management`)
  5. `pages/admin-settings.html` â€” CÃ i Ä‘áº·t thÃ´ng tin nhÃ  hÃ ng, hotline, cháº¿ Ä‘á»™ SÃ¡ng/Tá»‘i (`TASK-16` / `feature/admin-settings`)
  6. `pages/404.html` â€” MÃ n hÃ¬nh bÃ¡o lá»—i vÃ  phá»¥c há»“i Ä‘iá»u hÆ°á»›ng há»‡ thá»‘ng (`TASK-17` / `feature/404`)
* **TÃ­nh nÄƒng AI phá»¥ trÃ¡ch:** **AI-3 â€” Feedback Theme Extractor** (Trá»£ lÃ½ AI phÃ¢n tÃ­ch vÃ  gom nhÃ³m chá»§ Ä‘á» pháº£n há»“i cá»§a khÃ¡ch).
* **TrÃ¡ch nhiá»‡m chÃ©o toÃ n há»‡ thá»‘ng (Trá»¥c chÃ©o 3):** Há»‡ thá»‘ng thiáº¿t káº¿ (`css/common.css`, `css/header.css`, biáº¿n `:root` mÃ u sáº¯c/typography), Quáº£n lÃ½ kiáº¿n trÃºc nhÃ¡nh Git (`dev` $\rightarrow$ `main`, PR Peer Review).
