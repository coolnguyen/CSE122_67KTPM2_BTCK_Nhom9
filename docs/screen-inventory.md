# Báº£ng Kiá»ƒm KÃª MÃ n HÃ¬nh MenuMind (Screen Inventory)

> **Há»c pháº§n:** PhÃ¡t triá»ƒn á»©ng dá»¥ng Web cÆ¡ báº£n â€“ CSE122  
> **Dá»± Ã¡n:** BTL-09 â€“ MenuMind (Thá»±c Ä‘Æ¡n thÃ´ng minh & Äiá»u phá»‘i Ä‘Æ¡n hÃ ng F&B)  
> **PhiÃªn báº£n:** V2.0 â€“ Chuáº©n hÃ³a theo Barem Cháº¥m Ä‘iá»ƒm & Quy cháº¿ Váº¥n Ä‘Ã¡p BTL (Äá»§ 12 cá»™t báº¯t buá»™c)  
> **NguyÃªn táº¯c:** Liá»‡t kÃª Ä‘áº§y Ä‘á»§ 100% mÃ n hÃ¬nh thá»±c táº¿ trong há»‡ thá»‘ng, khá»›p 1:1 vá»›i thÆ° má»¥c `pages/` vÃ  tÃªn nhÃ¡nh Git.  

---

## 1. Báº£ng Kiá»ƒm KÃª Chi Tiáº¿t 17 MÃ n HÃ¬nh (Äá»§ 12 Cá»™t Chuáº©n Barem)

| ID | Role | User Goal (Má»¥c tiÃªu) | User Task (Nhiá»‡m vá»¥) | Screen (TÃªn mÃ n hÃ¬nh) | File (Tá»‡p HTML) | CRUD | States (Bao phá»§ tráº¡ng thÃ¡i) | AI (Tráº£i nghiá»‡m AI) | Assignee (Phá»¥ trÃ¡ch) | Task / Branch (Tháº» & NhÃ¡nh) | OBS (Video minh chá»©ng) |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :---: | :---: | :--- | :---: |
| **S01** | DÃ¹ng chung | Báº¯t Ä‘áº§u Ä‘Ãºng vá»‹ trÃ­ bÃ n | QuÃ©t QR / Chá»n sá»‘ bÃ n Äƒn | Giá»›i thiá»‡u & Chá»n bÃ n | `index.html` | R/U | normal, disabled, selected | KhÃ´ng | **TrÆ°Æ¡ng Viá»‡t HoÃ ng (SV1)** | `TASK-01` / `feature/index` | PENDING |
| **S02** | DÃ¹ng chung | VÃ o Ä‘Ãºng khu vá»±c lÃ m viá»‡c | ÄÄƒng nháº­p tÃ i khoáº£n nhÃ¢n viÃªn | ÄÄƒng nháº­p vai trÃ² | `pages/login.html` | R | normal, validation, error | KhÃ´ng | **TrÆ°Æ¡ng Viá»‡t HoÃ ng (SV1)** | `TASK-02` / `feature/login` | PENDING |
| **S03** | KhÃ¡ch hÃ ng | KhÃ¡m phÃ¡ thá»±c Ä‘Æ¡n & nháº­n gá»£i Ã½ | TÃ¬m kiáº¿m / Lá»c mÃ³n / Chá»n AI | Thá»±c Ä‘Æ¡n thÃ´ng minh | `pages/diner-menu.html` | R/C cart | loading, normal, empty, AI failure | **AI-1: Taste Recommender** | **TrÆ°Æ¡ng Viá»‡t HoÃ ng (SV1)** | `TASK-03` / `feature/diner-menu` | PENDING |
| **S04** | KhÃ¡ch hÃ ng | Hiá»ƒu rÃµ thÃ nh pháº§n & tÃ¹y biáº¿n | Chá»n sá»‘ lÆ°á»£ng / Ghi chÃº mÃ³n | Chi tiáº¿t mÃ³n Äƒn | `pages/diner-dish-detail.html` | C/R/U cart | normal, validation, success | KhÃ´ng | **TrÆ°Æ¡ng Viá»‡t HoÃ ng (SV1)** | `TASK-04` / `feature/diner-dish-detail` | PENDING |
| **S05** | KhÃ¡ch hÃ ng | Kiá»ƒm tra giá» hÃ ng trÆ°á»›c khi gá»­i | Sá»­a sá»‘ lÆ°á»£ng / XÃ³a / Gá»­i Ä‘Æ¡n | Giá» mÃ³n bÃ n Äƒn | `pages/diner-table-order.html` | C/R/U/D | normal, empty, disabled, success | KhÃ´ng | **TrÆ°Æ¡ng Viá»‡t HoÃ ng (SV1)** | `TASK-05` / `feature/diner-table-order` | PENDING |
| **S06** | KhÃ¡ch hÃ ng | Náº¯m báº¯t tiáº¿n Ä‘á»™ & pháº£n há»“i | Theo dÃµi mÃ³n / ÄÃ¡nh giÃ¡ / TÃ­nh tiá»n | Theo dÃµi Ä‘Æ¡n hÃ ng | `pages/diner-order-status.html` | R/C feedback | loading, pending, served, success | KhÃ´ng | **TrÆ°Æ¡ng Viá»‡t HoÃ ng (SV1)** | `TASK-06` / `feature/diner-order-status` | PENDING |
| **S07** | NhÃ¢n viÃªn báº¿p | Äiá»u phá»‘i cháº¿ biáº¿n liÃªn tá»¥c | Nháº­n Ä‘Æ¡n / Äá»•i tráº¡ng thÃ¡i náº¥u | Báº£ng Kanban báº¿p | `pages/kitchen-board.html` | R/U order | loading, normal, empty, error, success | KhÃ´ng | **Äáº·ng XuÃ¢n DÆ°Æ¡ng (SV2)** | `TASK-07` / `feature/kitchen-board` | PENDING |
| **S08** | NhÃ¢n viÃªn báº¿p | Kiá»ƒm tra chi tiáº¿t Ä‘Æ¡n hÃ ng | Tick mÃ³n xong / Æ¯u tiÃªn Ä‘Æ¡n | Chi tiáº¿t Ä‘Æ¡n cháº¿ biáº¿n | `pages/kitchen-order-detail.html` | C/R/U | normal, pending, completed, cancelled | KhÃ´ng | **Äáº·ng XuÃ¢n DÆ°Æ¡ng (SV2)** | `TASK-08` / `feature/kitchen-order-detail` | PENDING |
| **S09** | NhÃ¢n viÃªn báº¿p | Kiá»ƒm soÃ¡t rá»§i ro trá»… mÃ³n | Lá»c Ä‘Æ¡n trá»… / Dá»± bÃ¡o táº£i báº¿p | Cáº£nh bÃ¡o thá»i gian chá» | `pages/kitchen-wait-time-alerts.html` | C/R/U | normal, empty, loading, AI failure | **AI-2: Kitchen Load Predictor** | **Äáº·ng XuÃ¢n DÆ°Æ¡ng (SV2)** | `TASK-09` / `feature/kitchen-wait-time-alerts` | PENDING |
| **S10** | Váº­n hÃ nh sáº£nh | Quáº£n lÃ½ sÆ¡ Ä‘á»“ bÃ n tiá»‡c | Táº¡o bÃ n má»›i / In mÃ£ QR bÃ n | Quáº£n lÃ½ bÃ n Äƒn & QR | `pages/manager-table-management.html` | C/R/U | normal, validation, success | KhÃ´ng | **Äáº·ng XuÃ¢n DÆ°Æ¡ng (SV2)** | `TASK-10` / `feature/manager-table-management` | PENDING |
| **S11** | Váº­n hÃ nh sáº£nh | Thu ngÃ¢n & XÃ¡c nháº­n hÃ³a Ä‘Æ¡n | Xem bÃ n chá» tÃ­nh tiá»n / Thu tiá»n | YÃªu cáº§u thanh toÃ¡n táº¡i bÃ n | `pages/manager-payment-requests.html` | R/U | normal, empty, success | KhÃ´ng | **Äáº·ng XuÃ¢n DÆ°Æ¡ng (SV2)** | `TASK-11` / `feature/manager-payment-requests` | PENDING |
| **S12** | Quáº£n lÃ½ | Kiá»ƒm soÃ¡t thá»±c Ä‘Æ¡n nhÃ  hÃ ng | ThÃªm mÃ³n / Äá»•i giÃ¡ / Báº­t táº¯t háº¿t | Quáº£n lÃ½ thá»±c Ä‘Æ¡n | `pages/manager-menu-management.html` | C/R/U/Archive | normal, empty, validation, success | KhÃ´ng | **Nguyá»…n HoÃ ng Háº£i (SV3 - Leader)** | `TASK-12` / `feature/manager-menu-management` | PENDING |
| **S13** | Quáº£n lÃ½ | Äo lÆ°á»ng hiá»‡u quáº£ kinh doanh | Lá»c thá»i gian / Doanh sá»‘ / CSV | BÃ¡o cÃ¡o doanh sá»‘ & Thá»‘ng kÃª | `pages/admin-sales-insights.html` | R/Export | normal, success, empty | KhÃ´ng | **Nguyá»…n HoÃ ng Háº£i (SV3 - Leader)** | `TASK-13` / `feature/admin-sales-insights` | PENDING |
| **S14** | Quáº£n lÃ½ | Cáº£i thiá»‡n cháº¥t lÆ°á»£ng dá»‹ch vá»¥ | Äá»c nháº­n xÃ©t / AI phÃ¢n nhÃ³m chá»§ Ä‘á» | Trung tÃ¢m pháº£n há»“i khÃ¡ch | `pages/manager-feedback-center.html` | R/U | normal, loading, success, AI failure | **AI-3: Feedback Theme Extractor** | **Nguyá»…n HoÃ ng Háº£i (SV3 - Leader)** | `TASK-14` / `feature/manager-feedback-center` | PENDING |
| **S15** | Quáº£n trá»‹ viÃªn | Kiá»ƒm soÃ¡t phÃ¢n quyá»n nhÃ¢n sá»± | Táº¡o tÃ i khoáº£n / KhÃ³a tÃ i khoáº£n | Quáº£n lÃ½ tÃ i khoáº£n nhÃ¢n viÃªn | `pages/admin-user-management.html` | C/R/U/Disable | normal, validation, success | KhÃ´ng | **Nguyá»…n HoÃ ng Háº£i (SV3 - Leader)** | `TASK-15` / `feature/admin-user-management` | PENDING |
| **S16** | Quáº£n trá»‹ viÃªn | Cáº¥u hÃ¬nh tham sá»‘ toÃ n há»‡ thá»‘ng | Äá»•i thÃ´ng tin quÃ¡n / Giá» trá»… / Theme | CÃ i Ä‘áº·t há»‡ thá»‘ng nhÃ  hÃ ng | `pages/admin-settings.html` | R/U/D reset | normal, validation, success, danger | KhÃ´ng | **Nguyá»…n HoÃ ng Háº£i (SV3 - Leader)** | `TASK-16` / `feature/admin-settings` | PENDING |
| **S17** | DÃ¹ng chung | Phá»¥c há»“i tráº£i nghiá»‡m khi sai URL | TÃ¬m kiáº¿m mÃ³n / Quay vá» trang chá»§ | Trang 404 & Phá»¥c há»“i | `pages/404.html` | R | error, recovery | KhÃ´ng | **Nguyá»…n HoÃ ng Háº£i (SV3 - Leader)** | `TASK-17` / `feature/404` | PENDING |

---

## 2. Quy Chuáº©n Äáº·t TÃªn Tá»‡p HTML & TÃ­nh Nháº¥t QuÃ¡n (TiÃªu chÃ­ 2.4 Barem)

* **100% tuÃ¢n thá»§ quy táº¯c:** Viáº¿t thÆ°á»ng, tiáº¿ng Anh, ná»‘i nhau báº±ng dáº¥u gáº¡ch ngang (`kebab-case`), khÃ´ng cÃ³ dáº¥u tiáº¿ng Viá»‡t, khÃ´ng viáº¿t táº¯t vÃ´ nghÄ©a kiá»ƒu `trang1.html`, `quanly.html`.
* **Cáº¥u trÃºc Ä‘áº·t tÃªn chuáº©n:** `role-function-action.html`
  * `diner-*`: Phá»¥c vá»¥ vai trÃ² Thá»±c khÃ¡ch (Menu, Chi tiáº¿t mÃ³n, Giá» hÃ ng, Theo dÃµi Ä‘Æ¡n).
  * `kitchen-*`: Phá»¥c vá»¥ vai trÃ² NhÃ¢n viÃªn Báº¿p (Báº£ng Kanban, Chi tiáº¿t Ä‘Æ¡n, Cáº£nh bÃ¡o táº£i).
  * `manager-*`: Phá»¥c vá»¥ vai trÃ² Quáº£n lÃ½ ca & Thu ngÃ¢n (Thá»±c Ä‘Æ¡n, BÃ¡n hÃ ng, Pháº£n há»“i, Thanh toÃ¡n).
  * `admin-*`: Phá»¥c vá»¥ vai trÃ² Quáº£n trá»‹ viÃªn cáº¥p cao (SÆ¡ Ä‘á»“ bÃ n, TÃ i khoáº£n, CÃ i Ä‘áº·t).
* **TÃ­nh liÃªn thÃ´ng 0 liÃªn káº¿t cháº¿t (Dead Link):** ToÃ n bá»™ cÃ¡c tháº» Ä‘iá»u hÆ°á»›ng, Role Switcher vÃ  nÃºt chuyá»ƒn trang Ä‘á»u liÃªn káº¿t chÃ­nh xÃ¡c tuyá»‡t Ä‘á»‘i Ä‘áº¿n 17 tá»‡p HTML trÃªn.

---

## 3. Thá»‘ng KÃª PhÃ¢n Bá»• CÃ´ng Viá»‡c CÃ¢n Báº±ng (Tá»· Lá»‡ VÃ ng 6 â€“ 5 â€“ 6)

| ThÃ nh viÃªn | Khá»‘i nghiá»‡p vá»¥ phá»¥ trÃ¡ch (LÃ¡t cáº¯t dá»c) | Sá»‘ mÃ n hÃ¬nh | TÃ­nh nÄƒng AI sá»Ÿ há»¯u | TrÃ¡ch nhiá»‡m chÃ©o toÃ n há»‡ thá»‘ng (Cross-Responsibility) |
| :---: | :--- | :---: | :---: | :--- |
| **TrÆ°Æ¡ng Viá»‡t HoÃ ng (SV1)** | **Khá»‘i máº·t tiá»n (HÃ nh trÃ¬nh Thá»±c khÃ¡ch)** | **6 mÃ n** (S01 â€“ S06) | **AI-1: Taste Recommender** | **Trá»¥c chÃ©o 1**: Kiá»ƒm thá»­ Responsive Ä‘a thiáº¿t bá»‹ (320px, 768px, 1024px+), Thanh Ä‘iá»u hÆ°á»›ng chung (Navigation / Role Switcher), Kháº£ nÄƒng tiáº¿p cáº­n (A11y) |
| **Äáº·ng XuÃ¢n DÆ°Æ¡ng (SV2)** | **Khá»‘i váº­n hÃ nh (Äiá»u phá»‘i Báº¿p & Sáº£nh bÃ n)** | **5 mÃ n** (S07 â€“ S11) | **AI-2: Kitchen Load Predictor** | **Trá»¥c chÃ©o 2**: Xá»­ lÃ½ dá»¯ liá»‡u (backend / localStorage / API), Dá»¯ liá»‡u máº«u JSON (15â€“25 báº£n ghi), Triá»ƒn khai (Deploy) & QA |
| **Nguyá»…n HoÃ ng Háº£i (Leader - SV3)** | **Khá»‘i quáº£n trá»‹ (Quáº£n lÃ½ kinh doanh & Admin)** | **6 mÃ n** (S12 â€“ S17) | **AI-3: Feedback Theme Extractor** | **Trá»¥c chÃ©o 3**: Há»‡ thá»‘ng thiáº¿t káº¿ (`css/common.css`, biáº¿n `:root`), Quáº£n lÃ½ há»£p nháº¥t nhÃ¡nh Git (`dev` $\rightarrow$ `main`) |

> ðŸ“Œ **LÆ°u Ã½ trÆ°á»›c giá» báº£o vá»‡:** Cá»™t **OBS** sáº½ Ä‘Æ°á»£c cáº­p nháº­t link video thá»±c táº¿ sau khi tá»«ng thÃ nh viÃªn hoÃ n thÃ nh video quay mÃ n hÃ¬nh Ä‘á»™c láº­p cÃ³ webcam rÃµ khuÃ´n máº·t theo Ä‘Ãºng quy cháº¿.
