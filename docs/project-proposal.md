# Äá» Xuáº¥t Dá»± Ãn: MenuMind â€“ Thá»±c ÄÆ¡n ThÃ´ng Minh & Äiá»u Phá»‘i ÄÆ¡n HÃ ng

> **Há»c pháº§n:** PhÃ¡t triá»ƒn á»©ng dá»¥ng Web cÆ¡ báº£n â€“ CSE122  
> **Äá» tÃ i:** BTL-09 â€“ MenuMind (LÄ©nh vá»±c: F&B / NhÃ  hÃ ng - áº¨m thá»±c)  
> **NhÃ³m thá»±c hiá»‡n:** NhÃ³m 09 (3 sinh viÃªn)  
> **PhiÃªn báº£n tÃ i liá»‡u:** V2.0 â€“ Chuáº©n hÃ³a theo Barem Cháº¥m Ä‘iá»ƒm & Quy cháº¿ Váº¥n Ä‘Ã¡p BTL CSE122  

---

## 1. Ngá»¯ Cáº£nh Thá»±c Táº¿ & CÃ¢u Chuyá»‡n LÄ©nh Vá»±c (Domain Context)

Táº¡i cÃ¡c nhÃ  hÃ ng F&B táº§m trung vÃ  cao cáº¥p, giá» cao Ä‘iá»ƒm (trÆ°a 11:30 â€“ 13:30 vÃ  tá»‘i 18:30 â€“ 20:30) luÃ´n lÃ  thá»i Ä‘iá»ƒm cÄƒng tháº³ng nháº¥t trong chuá»—i váº­n hÃ nh:
* **KhÃ¡ch hÃ ng** bÆ°á»›c vÃ o bÃ n pháº£i chá» phá»¥c vá»¥ mang menu giáº¥y ra; menu dÃ i hÃ ng chá»¥c mÃ³n khiáº¿n khÃ¡ch bÄƒn khoÄƒn máº¥t 10â€“15 phÃºt má»›i gá»i xong mÃ³n, nhÃ¢n viÃªn pháº£i Ä‘á»©ng Ä‘á»£i ghi chÃ©p thá»§ cÃ´ng.
* **Báº¿p** nháº­n order giáº¥y viáº¿t tay dá»… nháº§m láº«n, khÃ´ng cÃ³ thá»© tá»± Æ°u tiÃªn chuáº©n xÃ¡c, khÃ´ng biáº¿t mÃ³n nÃ o cáº§n náº¥u gáº¥p, dáº«n Ä‘áº¿n tÃ¬nh tráº¡ng bÃ n Ä‘áº¿n trÆ°á»›c nháº­n mÃ³n sau.
* **Phá»¥c vá»¥** liÃªn tá»¥c pháº£i cháº¡y vÃ o báº¿p giá»¥c mÃ³n khi khÃ¡ch phÃ n nÃ n, lÃ m Ä‘á»©t gÃ£y nhá»‹p phá»¥c vá»¥ táº¡i sáº£nh.
* **Quáº£n lÃ½ & Chá»§ nhÃ  hÃ ng** Ä‘áº¿n cuá»‘i ngÃ y chá»‰ nhÃ¬n tháº¥y con sá»‘ tá»•ng tiá»n trÃªn pháº§n má»m thu ngÃ¢n, hoÃ n toÃ n mÃ¹ má» vá» cÃ¡c chá»‰ sá»‘ cá»‘t lÃµi: mÃ³n nÃ o áº¿ khÃ¡ch, bÃ n nÃ o pháº£i Ä‘á»£i quÃ¡ lÃ¢u, vÃ  khÃ¡ch hÃ ng bá»©c xÃºc Ä‘iá»u gÃ¬ vá» mÃ³n Äƒn.

**MenuMind** ra Ä‘á»i nhÆ° má»™t giáº£i phÃ¡p sá»‘ hÃ³a toÃ n diá»‡n táº¡i bÃ n (QR Ordering & Dispatching Ecosystem): KhÃ¡ch tá»± khÃ¡m phÃ¡ thá»±c Ä‘Æ¡n vÃ  gá»i mÃ³n $\rightarrow$ ÄÆ¡n hÃ ng Ä‘á»“ng bá»™ tá»©c thÃ¬ vÃ o báº£ng Kanban cá»§a Báº¿p $\rightarrow$ Quáº£n lÃ½ theo dÃµi doanh sá»‘, Ä‘iá»u phá»‘i mÃ³n vÃ  tiáº¿p nháº­n pháº£n há»“i thá»i gian thá»±c qua sá»± há»— trá»£ cá»§a cÃ¡c tÃ­nh nÄƒng AI UX.

---

## 2. PhÃ¡t Biá»ƒu Váº¥n Äá» Cá»¥ Thá»ƒ (Problem Statements: P1 â€“ P4)

* **P1. KhÃ³ khÄƒn trong khÃ¡m phÃ¡ thá»±c Ä‘Æ¡n (Menu Discovery Friction):**
  * *Äá»‘i tÆ°á»£ng chá»‹u áº£nh hÆ°á»Ÿng:* Thá»±c khÃ¡ch (KhÃ¡ch Äƒn).
  * *Chi tiáº¿t:* KhÃ¡ch bá»‹ "ngá»£p" trÆ°á»›c danh sÃ¡ch mÃ³n dÃ i, khÃ´ng cÃ³ cÃ´ng cá»¥ tÃ¬m kiáº¿m nhanh theo tÃªn nguyÃªn liá»‡u, khÃ´ng lá»c Ä‘Æ°á»£c theo khoáº£ng giÃ¡ hay phÃ¢n loáº¡i mÃ³n Äƒn (Khai vá»‹, MÃ³n chÃ­nh, Äá»“ uá»‘ng, TrÃ¡ng miá»‡ng).
* **P2. Thiáº¿u cÃ¡ nhÃ¢n hÃ³a theo sá»Ÿ thÃ­ch & dinh dÆ°á»¡ng (Dietary & Taste Uncertainty):**
  * *Äá»‘i tÆ°á»£ng chá»‹u áº£nh hÆ°á»Ÿng:* Thá»±c khÃ¡ch.
  * *Chi tiáº¿t:* KhÃ¡ch Äƒn cÃ³ cháº¿ Ä‘á»™ Äƒn riÃªng biá»‡t (kiÃªng cay, dá»‹ á»©ng háº£i sáº£n, Äƒn chay, thÃ­ch vá»‹ chua ngá»t, Äƒn kiÃªng low-carb) nhÆ°ng menu truyá»n thá»‘ng khÃ´ng thá»ƒ tÆ° váº¥n, dáº«n Ä‘áº¿n viá»‡c gá»i nháº§m mÃ³n khÃ´ng há»£p kháº©u vá»‹ vÃ  Ä‘á»ƒ láº¡i tráº£i nghiá»‡m tá»“i tá»‡.
* **P3. Báº¥t Ä‘á»“ng bá»™ vÃ  Ä‘á»©t gÃ£y tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng (Order State Desynchronization):**
  * *Äá»‘i tÆ°á»£ng chá»‹u áº£nh hÆ°á»Ÿng:* NhÃ¢n viÃªn Báº¿p vÃ  NhÃ¢n viÃªn Phá»¥c vá»¥.
  * *Chi tiáº¿t:* ÄÆ¡n hÃ ng tá»« bÃ n Äƒn khÃ´ng Ä‘Æ°á»£c thÃ´ng tin minh báº¡ch; báº¿p náº¥u xong nhÆ°ng phá»¥c vá»¥ khÃ´ng biáº¿t Ä‘á»ƒ bÃª ra; bÃ n chá» quÃ¡ 20 phÃºt khÃ´ng cÃ³ cÆ¡ cháº¿ cáº£nh bÃ¡o tá»± Ä‘á»™ng khiáº¿n khÃ¡ch bá»©c xÃºc bá» vá».
* **P4. Thiáº¿u dá»¯ liá»‡u phÃ¢n tÃ­ch váº­n hÃ nh & Bá» quÃªn pháº£n há»“i khÃ¡ch hÃ ng (Operational Blindspot & Feedback Silo):**
  * *Äá»‘i tÆ°á»£ng chá»‹u áº£nh hÆ°á»Ÿng:* Quáº£n lÃ½ ca vÃ  Chá»§ nhÃ  hÃ ng (Admin).
  * *Chi tiáº¿t:* Ã kiáº¿n Ä‘Ã³ng gÃ³p cá»§a khÃ¡ch hÃ ng bá»‹ trÃ´i máº¥t hoáº·c chá»‰ nháº­n Ä‘Æ°á»£c khi khÃ¡ch Ä‘Ã£ Ä‘Ã¡nh giÃ¡ 1 sao trÃªn máº¡ng xÃ£ há»™i; quáº£n lÃ½ khÃ´ng cÃ³ bÃ¡o cÃ¡o trá»±c quan vá» mÃ³n bÃ¡n cháº¡y/mÃ³n tá»“n, khÃ´ng ká»‹p thá»i cáº­p nháº­t thá»±c Ä‘Æ¡n khi háº¿t nguyÃªn liá»‡u.

---

## 3. Má»¥c TiÃªu Dá»± Ãn (Project Objectives: O1 â€“ O7)

* **O1. XÃ¢y dá»±ng sáº£n pháº©m Web Frontend hoÃ n chá»‰nh:** Thiáº¿t káº¿ nguyÃªn máº«u Web á»©ng dá»¥ng Responsive Ä‘áº§y Ä‘á»§ tá»« Mobile (320px) Ä‘áº¿n Desktop ($\ge 1024$px), ngá»¯ nghÄ©a chuáº©n HTML5, CSS hiá»‡n Ä‘áº¡i vÃ  khÃ´ng cÃ³ lá»—i W3C.
* **O2. PhÃ¢n rÃ£ 4 vai trÃ² rÃµ nÃ©t (Multi-Role):** XÃ¢y dá»±ng hÃ nh trÃ¬nh khÃ©p kÃ­n cho 4 nhÃ³m ngÆ°á»i dÃ¹ng thá»±c táº¿: *Thá»±c khÃ¡ch, NhÃ¢n viÃªn Báº¿p, Quáº£n lÃ½ nhÃ  hÃ ng, Quáº£n trá»‹ viÃªn (Chá»§ quÃ¡n)*, kÃ¨m cÃ¡c trang dÃ¹ng chung.
* **O3. CRUD vÃ  Quáº£n lÃ½ vÃ²ng Ä‘á»i dá»¯ liá»‡u thá»±c cháº¥t:** Thá»±c hiá»‡n Ä‘áº§y Ä‘á»§ cÃ¡c thao tÃ¡c ThÃªm, Äá»c, Sá»­a, XÃ³a/Há»§y/áº¨n/VÃ´ hiá»‡u hÃ³a báº£n ghi gáº¯n liá»n vá»›i logic kinh doanh F&B (khÃ´ng lÃ m CRUD hÃ¬nh thá»©c).
* **O4. DOM JavaScript & Kiá»ƒm tra há»£p lá»‡ sÃ¢u:** TÆ°Æ¡ng tÃ¡c DOM phong phÃº (TÃ¬m kiáº¿m thá»i gian thá»±c káº¿t há»£p bá»™ lá»c Ä‘a tiÃªu chÃ­, Modal xÃ¡c nháº­n, Toast thÃ´ng bÃ¡o, Form Validation chi tiáº¿t vá»›i thÃ´ng bÃ¡o lá»—i Ä‘á» dÆ°á»›i tá»«ng Ã´ nháº­p).
* **O5. Quáº£n lÃ½ tráº¡ng thÃ¡i vÃ  lÆ°u trá»¯ bá»n vá»¯ng:** TÃ­ch há»£p mÃ´-Ä‘un lÆ°u trá»¯ `localStorage` vÃ  dá»¯ liá»‡u máº«u phong phÃº ($\ge 24$ mÃ³n Äƒn) Ä‘á»ƒ dá»¯ liá»‡u liÃªn thÃ´ng tá»©c thÃ¬ giá»¯a cÃ¡c vai trÃ² vÃ  khÃ´ng bá»‹ máº¥t sau khi táº£i láº¡i trang (F5).
* **O6. Thiáº¿t káº¿ 3 tráº£i nghiá»‡m AI UX 6 bÆ°á»›c & Failure UX:** Hiá»‡n thá»±c hÃ³a 3 tÃ­nh nÄƒng AI Ä‘áº·c thÃ¹ cho 3 Ä‘á»‘i tÆ°á»£ng ngÆ°á»i dÃ¹ng, tuÃ¢n thá»§ nghiÃªm ngáº·t 6 bÆ°á»›c tÆ°Æ¡ng tÃ¡c UI vÃ  ká»‹ch báº£n xá»­ lÃ½ khi AI khÃ´ng cháº¯c cháº¯n.
* **O7. Chuáº©n hÃ³a quy trÃ¬nh ká»¹ thuáº­t & LÃ m viá»‡c nhÃ³m:** Ãp dá»¥ng Git Flow chuyÃªn nghiá»‡p (`main`, `dev`, `feature/*`), quáº£n trá»‹ cÃ´ng viá»‡c trÃªn Trello/Jira, thá»±c hiá»‡n Peer Review vÃ  xÃ¢y dá»±ng bá»™ video OBS minh chá»©ng 1:1 cho tá»«ng mÃ n hÃ¬nh.

---

## 4. Danh SÃ¡ch Thá»±c Thá»ƒ Dá»¯ Liá»‡u (Entities) & Ma Tráº­n VÃ²ng Äá»i Tráº¡ng ThÃ¡i (Lifecycle State Matrix)

### 4.1. Danh sÃ¡ch thá»±c thá»ƒ dá»¯ liá»‡u cá»‘t lÃµi

1. **`MenuItem` (MÃ³n Äƒn):**
   * *Thuá»™c tÃ­nh:* `id`, `name`, `category` (MÃ³n chÃ­nh, Khai vá»‹, Äá»“ uá»‘ng...), `price`, `image`, `description`, `tasteProfile` (cay, ngá»t, chua, bÃ©o), `isVegetarian`, `status`.
2. **`Table` (BÃ n Äƒn):**
   * *Thuá»™c tÃ­nh:* `id`, `tableNumber`, `seats`, `floor`, `qrCode`, `currentOrderId`, `status`.
3. **`Order` (ÄÆ¡n gá»i mÃ³n):**
   * *Thuá»™c tÃ­nh:* `id`, `tableId`, `items` (máº£ng cÃ¡c mÃ³n + sá»‘ lÆ°á»£ng + ghi chÃº), `totalAmount`, `createdAt`, `updatedAt`, `priorityLevel`, `status`, `paymentStatus`.
4. **`Feedback` (ÄÃ¡nh giÃ¡ cá»§a khÃ¡ch):**
   * *Thuá»™c tÃ­nh:* `id`, `orderId`, `tableId`, `rating` (1â€“5 sao), `comment`, `aiSentiment`, `aiThemes` (máº£ng nhÃ£n chá»§ Ä‘á»), `status`, `createdAt`.
5. **`Staff` (TÃ i khoáº£n nhÃ¢n sá»±):**
   * *Thuá»™c tÃ­nh:* `id`, `fullName`, `email`, `role` (`kitchen`, `manager`, `admin`), `shift`, `status`.

---

### 4.2. Ma tráº­n vÃ²ng Ä‘á»i tráº¡ng thÃ¡i (State Lifecycle Matrix)

| Thá»±c thá»ƒ | Tráº¡ng thÃ¡i khá»Ÿi táº¡o | CÃ¡c tráº¡ng thÃ¡i trung gian | Tráº¡ng thÃ¡i káº¿t thÃºc | HÃ nh Ä‘á»™ng kÃ­ch hoáº¡t & Vai trÃ² thá»±c hiá»‡n |
| :--- | :--- | :--- | :--- | :--- |
| **`MenuItem`** | `draft` (NhÃ¡p) | `available` (Äang má»Ÿ bÃ¡n) $\leftrightarrow$ `out_of_stock` (Háº¿t hÃ ng táº¡m thá»i) | `archived` (Ngá»«ng kinh doanh) | Quáº£n lÃ½ thÃªm má»›i $\rightarrow$ Báº­t/Táº¯t tráº¡ng thÃ¡i bÃ¡n $\rightarrow$ XÃ³a/LÆ°u trá»¯ mÃ³n |
| **`Table`** | `available` (BÃ n trá»‘ng) | `occupied` (Äang cÃ³ khÃ¡ch ngá»“i) $\rightarrow$ `waiting_payment` (Chá» tÃ­nh tiá»n) $\rightarrow$ `cleaning` (Äang dá»n bÃ n) | `available` (Quay vá» vÃ²ng láº·p) / `disabled` (Há»ng/KhÃ³a) | KhÃ¡ch quÃ©t QR $\rightarrow$ KhÃ¡ch gá»i tÃ­nh tiá»n $\rightarrow$ NhÃ¢n viÃªn dá»n bÃ n $\rightarrow$ Sáºµn sÃ ng Ä‘Ã³n khÃ¡ch má»›i |
| **`Order`** | `pending` (Báº¿p vá»«a nháº­n) | `cooking` (Äáº§u báº¿p Ä‘ang náº¥u) $\rightarrow$ `ready` (MÃ³n Ä‘Ã£ náº¥u xong, chá» bÃª ra) | `served` (ÄÃ£ phá»¥c vá»¥ xong) OR `cancelled` (ÄÃ£ há»§y mÃ³n) | KhÃ¡ch gá»­i giá» hÃ ng $\rightarrow$ Báº¿p nháº­n náº¥u $\rightarrow$ Báº¿p bÃ¡o xong $\rightarrow$ Thu ngÃ¢n Ä‘Ã³ng bill |
| **`Feedback`** | `new` (Má»›i gá»­i) | `analyzed` (AI Ä‘Ã£ phÃ¢n tÃ­ch cáº£m xÃºc & gom chá»§ Ä‘á») $\rightarrow$ `processing` (Äang xá»­ lÃ½) | `resolved` (ÄÃ£ ghi nháº­n & giáº£i quyáº¿t) | KhÃ¡ch gá»­i sao $\rightarrow$ Há»‡ thá»‘ng AI quÃ©t tá»« khÃ³a $\rightarrow$ Quáº£n lÃ½ pháº£n há»“i khÃ¡ch |
| **`Staff`** | `active` (Äang lÃ m viá»‡c) | â€” | `inactive` (Táº¡m khÃ³a / VÃ´ hiá»‡u hÃ³a) | Quáº£n trá»‹ viÃªn cáº¥p tÃ i khoáº£n $\rightarrow$ VÃ´ hiá»‡u hÃ³a khi nghá»‰ viá»‡c |

---

## 5. Ba Tráº£i Nghiá»‡m AI Äáº·c ThÃ¹ (Chuáº©n AI Product UX 6 BÆ°á»›c & Failure UX)

Dá»± Ã¡n tuyá»‡t Ä‘á»‘i khÃ´ng sá»­ dá»¥ng khung chat há»i Ä‘Ã¡p generic, mÃ  xÃ¢y dá»±ng 3 tÃ­nh nÄƒng AI nhÃºng trá»±c tiáº¿p vÃ o tÃ¡c vá»¥ cá»§a tá»«ng vai trÃ²:

### 5.1. AI-1: Taste Recommender â€“ Gá»£i Ã MÃ³n Ä‚n Theo Kháº©u Vá»‹ (Vai trÃ²: Thá»±c khÃ¡ch)
* **Giáº£i quyáº¿t váº¥n Ä‘á»:** P1 & P2 (KhÃ¡ch bÄƒn khoÄƒn khi xem menu dÃ i, muá»‘n Äƒn theo sá»Ÿ thÃ­ch dinh dÆ°á»¡ng).
* **Giao diá»‡n tÃ­ch há»£p:** `pages/diner-menu.html`
* **Chuáº©n 6 bÆ°á»›c AI UX:**
  1. *Input:* KhÃ¡ch chá»n tiÃªu chÃ­ nhanh qua cÃ¡c chip gá»£i Ã½: Má»©c cay (KhÃ´ng cay / Cay vá»«a / Cay ná»“ng), Cháº¿ Ä‘á»™ Äƒn (Ä‚n chay / KhÃ´ng gluten / Äáº­m Ä‘Ã  / Thanh Ä‘áº¡m), NgÃ¢n sÃ¡ch tá»‘i Ä‘a.
  2. *Processing:* Hiá»ƒn thá»‹ thanh tiáº¿n trÃ¬nh / Skeleton Card phÃ¢n tÃ­ch kháº©u vá»‹ khÃ¡ch hÃ ng vá»›i dá»¯ liá»‡u thá»±c Ä‘Æ¡n hiá»‡n táº¡i.
  3. *Output:* Hiá»ƒn thá»‹ Combo 2â€“3 mÃ³n Äƒn kÃ¨m tháº» tÃ³m táº¯t trá»±c quan (TÃªn mÃ³n, giÃ¡, Ä‘á»™ phÃ¹ há»£p kháº©u vá»‹).
  4. *Explainability (Giáº£i thÃ­ch lÃ½ do):* Khá»‘i *"VÃ¬ sao AI gá»£i Ã½ combo nÃ y?"* (VÃ­ dá»¥: *"Khá»›p 95% vá»›i yÃªu cáº§u KhÃ´ng cay + Ä‚n chay; cÃ³ Ä‘áº¡m tá»« náº¥m vÃ  Ä‘áº­u hÅ©"*).
  5. *User Control (Quyá»n kiá»ƒm soÃ¡t):* NÃºt *"Äá»•i mÃ³n khÃ¡c trong combo"*, *"Táº¡o láº¡i gá»£i Ã½"* hoáº·c *"Bá» qua"*.
  6. *Save / Apply:* Báº¥m *"ThÃªm cáº£ combo vÃ o giá» hÃ ng"* $\rightarrow$ ToÃ n bá»™ mÃ³n Äƒn Ä‘Æ°á»£c thÃªm ngay vÃ o giá» mÃ³n cá»§a bÃ n Äƒn.
* **Ká»‹ch báº£n AI Failure / Uncertainty UX:**
  * *TÃ¬nh huá»‘ng:* KhÃ¡ch chá»n Ä‘iá»u kiá»‡n mÃ¢u thuáº«n (VÃ­ dá»¥: *"Ä‚n chay"* nhÆ°ng láº¡i tÃ­ch *"Thá»‹t bÃ² háº§m"* hoáº·c ngÃ¢n sÃ¡ch quÃ¡ tháº¥p dÆ°á»›i giÃ¡ mÃ³n ráº» nháº¥t).
  * *Xá»­ lÃ½ UI:* KhÃ´ng bÃ¡o lá»—i há»‡ thá»‘ng 500, mÃ  hiá»ƒn thá»‹ thÃ´ng bÃ¡o nhÃ£ nháº·n: *"AI chÆ°a tÃ¬m tháº¥y mÃ³n khá»›p 100% vá»›i cÃ¡c Ä‘iá»u kiá»‡n trÃªn (Äá»™ tin cáº­y 35%)"* kÃ¨m nÃºt báº¥m: *"Gá»£i Ã½ Ä‘iá»u chá»‰nh ngÃ¢n sÃ¡ch"* hoáº·c *"Xem cÃ¡c mÃ³n chay phá»• biáº¿n nháº¥t"*.

---

### 5.2. AI-2: Kitchen Load Predictor â€“ Dá»± BÃ¡o Táº£i Báº¿p & Cáº£nh BÃ¡o Chá» LÃ¢u (Vai trÃ²: NhÃ¢n viÃªn Báº¿p)
* **Giáº£i quyáº¿t váº¥n Ä‘á»:** P3 (Báº¿p quÃ¡ táº£i dá»“n Ä‘Æ¡n, khÃ¡ch chá» lÃ¢u cÃ¡u gáº¯t).
* **Giao diá»‡n tÃ­ch há»£p:** `pages/kitchen-wait-time-alerts.html`
* **Chuáº©n 6 bÆ°á»›c AI UX:**
  1. *Input:* Há»‡ thá»‘ng tá»± Ä‘á»™ng Ä‘á»c sá»‘ lÆ°á»£ng Ä‘Æ¡n Ä‘ang chá» trong hÃ ng Ä‘á»£i (`queue`), sá»‘ mÃ³n nÆ°á»›ng/xÃ o/háº¥p Ä‘ang náº¥u cÃ¹ng lÃºc.
  2. *Processing:* Biá»ƒu tÆ°á»£ng sÃ³ng nhá»‹p báº¿p phÃ¢n tÃ­ch thá»i gian cháº¿ biáº¿n tiÃªu chuáº©n cá»§a tá»«ng mÃ³n.
  3. *Output:* Tháº» dá»± bÃ¡o thá»i gian chá» Æ°á»›c tÃ­nh cho tá»«ng bÃ n (VÃ­ dá»¥: BÃ n 04: dá»± kiáº¿n xong sau 8 phÃºt; BÃ n 09: cÃ³ nguy cÆ¡ trá»… 22 phÃºt).
  4. *Explainability:* Giáº£i thÃ­ch: *"BÃ n 09 gá»i 3 mÃ³n nÆ°á»›ng phá»©c táº¡p; lÃ² nÆ°á»›ng hiá»‡n Ä‘ang full 100% cÃ´ng suáº¥t"*.
  5. *User Control:* Äáº§u báº¿p cÃ³ cÃ¡c nÃºt quyáº¿t Ä‘á»‹nh: *"TÄƒng Æ°u tiÃªn Ä‘Æ¡n"*, *"Chuyá»ƒn tráº¡m báº¿p há»— trá»£"*, *"ThÃ´ng bÃ¡o phá»¥c vá»¥ xin lá»—i khÃ¡ch"*.
  6. *Save / Apply:* Khi báº¿p báº¥m *"TÄƒng Æ°u tiÃªn"*, Ä‘Æ¡n hÃ ng Ä‘Æ°á»£c gáº¯n cá» tháº» Ä‘á» trÃªn báº£ng Kanban vÃ  Ä‘áº©y lÃªn Ä‘áº§u hÃ ng Ä‘á»£i.
* **Ká»‹ch báº£n AI Failure / Uncertainty UX:**
  * *TÃ¬nh huá»‘ng:* Dá»¯ liá»‡u Ä‘Æ¡n hÃ ng thiáº¿u thá»i gian báº¯t Ä‘áº§u hoáº·c cÃ³ mÃ³n khÃ¡ch gá»i ngoÃ i menu chÆ°a Ä‘Æ°á»£c Ä‘o chuáº©n thá»i gian.
  * *Xá»­ lÃ½ UI:* Hiá»ƒn thá»‹ há»™p cáº£nh bÃ¡o mÃ u vÃ ng: *"AI chÆ°a Ä‘á»§ dá»¯ liá»‡u Ä‘o lÆ°á»ng cho mÃ³n Ä‘áº·c biá»‡t nÃ y â€“ Vui lÃ²ng cÄƒn thá»i gian thá»§ cÃ´ng theo kinh nghiá»‡m báº¿p trÆ°á»Ÿng"*.

---

### 5.3. AI-3: Feedback Theme Extractor â€“ Trá»£ LÃ½ Gom NhÃ³m & PhÃ¢n TÃ­ch Chá»§ Äá» ÄÃ¡nh GiÃ¡ (Vai trÃ²: Quáº£n lÃ½)
* **Giáº£i quyáº¿t váº¥n Ä‘á»:** P4 (Quáº£n lÃ½ báº­n rá»™n khÃ´ng Ä‘á»c xuá»ƒ hÃ ng trÄƒm pháº£n há»“i cá»§a khÃ¡ch).
* **Giao diá»‡n tÃ­ch há»£p:** `pages/manager-feedback-center.html`
* **Chuáº©n 6 bÆ°á»›c AI UX:**
  1. *Input:* Quáº£n lÃ½ chá»n bá»™ lá»c pháº£n há»“i trong tuáº§n/thÃ¡ng (vÃ­ dá»¥: cÃ¡c Ä‘Ã¡nh giÃ¡ tá»« 1 Ä‘áº¿n 3 sao).
  2. *Processing:* Hiá»ƒn thá»‹ hiá»‡u á»©ng quÃ©t ngÃ´n ngá»¯ (NLP Loading State).
  3. *Output:* Hiá»ƒn thá»‹ tháº» tÃ³m táº¯t 3 chá»§ Ä‘á» nÃ³ng nháº¥t: *#NÆ°á»›c_dÃ¹ng_hÆ¡i_máº·n (42%)*, *#MÃ³n_ra_cháº­m_giá»_trÆ°a (35%)*, *#ThÃ¡i_Ä‘á»™_phá»¥c_vá»¥_tá»‘t (88%)*.
  4. *Explainability:* Liá»‡t kÃª trÃ­ch dáº«n báº±ng chá»©ng cá»¥ thá»ƒ: *"TrÃ­ch tá»« 8 Ã½ kiáº¿n khÃ¡ch hÃ ng táº¡i BÃ n 02, BÃ n 07 nháº¯c Ä‘áº¿n tá»« 'máº·n', 'gáº¯t cá»•' trong 3 ngÃ y qua"*.
  5. *User Control:* NÃºt *"Chá»‰nh sá»­a nháº­n xÃ©t cá»§a AI"*, *"Gá»­i chá»‰ Ä‘áº¡o xuá»‘ng Báº¿p trÆ°á»Ÿng"*, *"LÆ°u vÃ o bÃ¡o cÃ¡o tuáº§n"*.
  6. *Save / Apply:* Báº¥m *"LÆ°u chá»‰ Ä‘áº¡o"* $\rightarrow$ Cáº­p nháº­t trá»±c tiáº¿p ghi chÃº nháº¯c nhá»Ÿ vÃ o báº£ng Ä‘iá»u khiá»ƒn cá»§a Báº¿p.
* **Ká»‹ch báº£n AI Failure / Uncertainty UX:**
  * *TÃ¬nh huá»‘ng:* KhÃ¡ch chá»‰ Ä‘Ã¡nh giÃ¡ 1 sao nhÆ°ng khÃ´ng gÃµ chá»¯ nháº­n xÃ©t nÃ o, hoáº·c chá»‰ nháº­p cÃ¡c kÃ½ tá»± vÃ´ nghÄ©a (*"asdfgh"*).
  * *Xá»­ lÃ½ UI:* Tháº» hiá»ƒn thá»‹: *"ÄÃ¡nh giÃ¡ khÃ´ng chá»©a vÄƒn báº£n mÃ´ táº£ cá»¥ thá»ƒ. AI xáº¿p vÃ o nhÃ³m 'Ã kiáº¿n chÆ°a phÃ¢n loáº¡i' â€“ Khuyáº¿n nghá»‹ gá»i Ä‘iá»‡n chÄƒm sÃ³c khÃ¡ch hÃ ng"*.

---

## 6. SÆ¡ Äá»“ Cáº¥u TrÃºc Trang & Luá»“ng Nghiá»‡p Vá»¥ Äáº§u - Cuá»‘i

### 6.1. SÆ¡ Ä‘á»“ trang web (Sitemap)

```text
[Trang chá»§ / Chá»n bÃ n (index.html)]
  â”‚
  â”œâ”€â”€â–º [KHÃCH HÃ€NG]
  â”‚      â”œâ”€â”€ Thá»±c Ä‘Æ¡n & AI Gá»£i Ã½ (pages/diner-menu.html)
  â”‚      â”œâ”€â”€ Chi tiáº¿t mÃ³n Äƒn (pages/diner-dish-detail.html)
  â”‚      â”œâ”€â”€ Giá» mÃ³n bÃ n Äƒn & Gá»­i Ä‘Æ¡n (pages/diner-table-order.html)
  â”‚      â””â”€â”€ Theo dÃµi tiáº¿n Ä‘á»™ & ÄÃ¡nh giÃ¡ (pages/diner-order-status.html)
  â”‚
  â””â”€â”€â–º [Cá»”NG NHÃ‚N VIÃŠN] (pages/login.html)
         â”‚
         â”œâ”€â”€â–º [NHÃ‚N VIÃŠN Báº¾P]
         â”‚      â”œâ”€â”€ Báº£ng Kanban Ä‘iá»u phá»‘i (pages/kitchen-board.html)
         â”‚      â”œâ”€â”€ Chi tiáº¿t Ä‘Æ¡n cháº¿ biáº¿n (pages/kitchen-order-detail.html)
         â”‚      â””â”€â”€ Cáº£nh bÃ¡o Ä‘Æ¡n trá»… & AI Táº£i báº¿p (pages/kitchen-wait-time-alerts.html)
         â”‚
         â”œâ”€â”€â–º [QUáº¢N LÃ NHÃ€ HÃ€NG]
         â”‚      â”œâ”€â”€ Quáº£n lÃ½ thá»±c Ä‘Æ¡n & giÃ¡ (pages/manager-menu-management.html)
         â”‚      â”œâ”€â”€ YÃªu cáº§u thanh toÃ¡n bÃ n (pages/manager-payment-requests.html)
         â”‚      â”œâ”€â”€ BÃ¡o cÃ¡o doanh sá»‘ & Xuáº¥t CSV (pages/admin-sales-insights.html)
         â”‚      â””â”€â”€ Pháº£n há»“i khÃ¡ch & AI Chá»§ Ä‘á» (pages/manager-feedback-center.html)
         â”‚
         â””â”€â”€â–º [QUáº¢N TRá»Š VIÃŠN / CHá»¦ QUÃN]
                â”œâ”€â”€ SÆ¡ Ä‘á»“ bÃ n & MÃ£ QR bÃ n (pages/manager-table-management.html)
                â”œâ”€â”€ Quáº£n lÃ½ tÃ i khoáº£n nhÃ¢n viÃªn (pages/admin-user-management.html)
                â””â”€â”€ CÃ i Ä‘áº·t há»‡ thá»‘ng nhÃ  hÃ ng (pages/admin-settings.html)
```

### 6.2. Luá»“ng nghiá»‡p vá»¥ liÃªn thÃ´ng Ä‘a vai trÃ² (End-to-End User Flow)

```text
[Thá»±c khÃ¡ch táº¡i BÃ n 03]
   â”‚ QuÃ©t QR bÃ n trÃªn index.html
   â–¼
Chá»n mÃ³n trÃªn diner-menu.html (DÃ¹ng AI Taste Recommender)
   â”‚ ThÃªm mÃ³n vÃ o giá» trÃªn diner-dish-detail.html
   â–¼
Kiá»ƒm tra giá» vÃ  Báº¥m "Gá»­i Báº¿p" trÃªn diner-table-order.html
   â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â–¼                              â–¼
[MÃ n hÃ¬nh Thá»±c khÃ¡ch]          [MÃ n hÃ¬nh Báº¿p - kitchen-board.html]
KhÃ¡ch xem tráº¡ng thÃ¡i Ä‘Æ¡n:       ÄÆ¡n bÃ n 03 láº­p tá»©c xuáº¥t hiá»‡n á»Ÿ cá»™t "Má»›i nháº­n"
"Äang chá» báº¿p nháº­n..."          Báº¿p báº¥m chuyá»ƒn "Äang náº¥u"
   â”‚                              â”‚
   â”‚ (Äá»“ng bá»™ thá»i gian thá»±c)      â”‚ (Náº¿u náº¥u quÃ¡ 15 phÃºt)
   â–¼                              â–¼
KhÃ¡ch tháº¥y Ä‘á»•i sang:           MÃ n hÃ¬nh kitchen-wait-time-alerts.html
"Báº¿p Ä‘ang náº¥u mÃ³n cá»§a báº¡n"      báº­t cáº£nh bÃ¡o Ä‘á» + AI dá»± bÃ¡o táº£i
   â”‚                              â”‚
   â”‚                              â–¼
   â”‚                           Báº¿p tick xong mÃ³n â†’ Chuyá»ƒn sang "ÄÃ£ xong"
   â–¼                              â”‚
MÃ³n Ä‘Æ°á»£c bÃª ra bÃ n                â–¼
KhÃ¡ch Äƒn xong, báº¥m:            [MÃ n hÃ¬nh Quáº£n lÃ½ - manager-payment-requests.html]
1. ÄÃ¡nh giÃ¡ cháº¥t lÆ°á»£ng sao     Xuáº¥t hiá»‡n yÃªu cáº§u thanh toÃ¡n BÃ n 03
2. YÃªu cáº§u tÃ­nh tiá»n           Quáº£n lÃ½ xÃ¡c nháº­n Ä‘Ã£ thu tiá»n â†’ BÃ n Ä‘á»•i vá» "Äang dá»n"
   â”‚                              â”‚
   â–¼                              â–¼
Gá»­i feedback lÃªn há»‡ thá»‘ng      Doanh sá»‘ cáº­p nháº­t vÃ o admin-sales-insights.html
AI Theme Extractor gom nhÃ³m    Quáº£n lÃ½ xem bÃ¡o cÃ¡o & xuáº¥t CSV
trÃªn feedback-center.html
```

---

## 7. Há»‡ Thá»‘ng Thiáº¿t Káº¿ (Design System & Tokens)

Há»‡ thá»‘ng giao diá»‡n Ä‘Æ°á»£c Ä‘á»‹nh nghÄ©a nháº¥t quÃ¡n táº¡i `css/common.css` vÃ  Ã¡p dá»¥ng cho toÃ n bá»™ 17 mÃ n hÃ¬nh:

* **MÃ u má»±c chá»§ Ä‘áº¡o (`#102A2B`):** Thá»ƒ hiá»‡n sá»± sang trá»ng, tÆ°Æ¡ng pháº£n cao trÃªn ná»n sÃ¡ng, dÃ¹ng cho vÄƒn báº£n vÃ  typography.
* **Xanh ngá»c thÆ°Æ¡ng hiá»‡u (`#176B5B`):** Äiá»ƒm nháº¥n nháº­n diá»‡n MenuMind, dÃ¹ng cho cÃ¡c nÃºt hÃ nh Ä‘á»™ng chÃ­nh (Primary CTA), tráº¡ng thÃ¡i hoáº¡t Ä‘á»™ng (Active) vÃ  huy hiá»‡u thÃ nh cÃ´ng (Success).
* **VÃ ng chanh / Xanh máº¡ (`#D9E7A6`):** MÃ u nháº­n diá»‡n vÃ¹ng tÃ­nh nÄƒng thÃ´ng minh AI vÃ  nhá»‹p thá»Ÿ váº­n hÃ nh (Service Pulse).
* **Cam áº¥m F&B (`#F1A33A`):** TÃ´ng mÃ u kÃ­ch thÃ­ch vá»‹ giÃ¡c, dÃ¹ng cho hÃ¬nh áº£nh mÃ³n Äƒn, cáº£nh bÃ¡o nháº¹ (Warning) vÃ  Ä‘á»™ Æ°u tiÃªn Ä‘Æ¡n hÃ ng.
* **Äá» gáº¡ch (`#B94A3D`):** DÃ¹ng cho tráº¡ng thÃ¡i lá»—i (Error State), nÃºt há»§y Ä‘Æ¡n (Danger Action) vÃ  cáº£nh bÃ¡o Ä‘Æ¡n trá»… háº¡n.
* **Typography:** TiÃªu Ä‘á» dÃ¹ng font *Manrope* (hiá»‡n Ä‘áº¡i, dá»©t khoÃ¡t), ná»™i dung hiá»ƒn thá»‹ dÃ¹ng font *Be Vietnam Pro* (tá»‘i Æ°u hiá»ƒn thá»‹ tiáº¿ng Viá»‡t cÃ³ dáº¥u, sáº¯c nÃ©t trÃªn má»i kÃ­ch thÆ°á»›c mÃ n hÃ¬nh).
