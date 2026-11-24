# TASK DECOMPOSITION & WORK BREAKDOWN STRUCTURE (WBS)

## Môn học: Phát triển Ứng dụng Web — Lab 04: Multi-Route SPA Architecture & Express Backend Hygiene

---

## I. TỔNG QUAN KIẾN TRÚC KẾ THỪA & MỞ RỘNG

- **Nền tảng kế thừa**: Kế thừa trọn vẹn Custom Virtual DOM Engine (`mini-react.js`), Reactive State Engine (`reactive-engine.js`), và các component từ Lab 2 & Lab 3 (`DeveloperCard.js`, `ScientistDirectory.js`, `PubgMatchTelemetry.js`).
- **Nâng cấp kiến trúc trong Lab 4**:
  1. _Code-Splitting & Suspense Boundaries_: Nâng cấp `mini-react.js` hỗ trợ `Fragment`, `lazy()` dynamic import và `<Suspense>` boundary kèm Skeleton Box chống giật bố cục (`CLS = 0`).
  2. _Multi-Route SPA Architecture_: Xây dựng bộ định tuyến khai báo (`router.js`) hỗ trợ `<Routes>`, `<Route>`, nested `<Layout>` với `<Outlet>`, `<NavLink>` nhận callback `isActive`, và `useParams()`.
  3. _Master-Detail & CSS Grid_: Tách trang chi tiết `PersonDetail.js` sử dụng CSS Grid `minmax(280px, 1fr) 2fr`, thẻ mô tả ngữ nghĩa `<dl>` và xử lý trang lỗi 404 (`NotFoundState`).
  4. _Single-Pass Form Validation_: Triệt tiêu chuỗi `useEffect` đồng bộ lồng nhau trong `RegistrationForm.js` (1 keystroke = 1 render pass).
  5. _Custom Hook & Express Hygiene_: Tách logic gọi API ra hook `useForumMessages.js` có `AbortController`, render `<dl>` với keyed `Fragment`, kết hợp backend `server.js` cấu hình CORS và kiểm tra tính hợp lệ payload đầu vào.

---

## II. MA TRẬN PHÂN RÃ CÔNG VIỆC (WORK BREAKDOWN STRUCTURE)

### 1. Sprint 1: Core Engine Upgrades & Code-Splitting (Exercise 1.1)

- **Mục tiêu**: Hỗ trợ tải động module theo tuyến đường (route-level chunking) và bảo toàn chỉ số ổn định hình ảnh (`CLS = 0`).
- **Các gói công việc cụ thể**:
  - [x] **Task 1.1**: Mở rộng `mini-react.js` và `reactive-engine.js`.
    - Bổ sung `Symbol("Fragment")` cho phép nhóm nhiều node con mà không sinh thẻ `<div>` dư thừa.
    - Xây dựng hàm `lazy(loader)` kích hoạt dynamic `import()` và ném Promise cho `Suspense` bắt giữ.
    - Thiết lập `<Suspense fallback={...}>` tự động re-render ứng dụng thông qua sự kiện `mini-react-rerender` khi chunk tải xong.
    - **Atomic Commit**: `feat(core): add Fragment, lazy and Suspense boundaries to Mini-React`
  - [x] **Task 1.2**: Thiết kế `PersonDetailSkeleton` khớp kích thước thực tế (`height: 210px`, `aria-busy="true"`, `aria-live="polite"`) đảm bảo `CLS = 0`.

---

### 2. Sprint 2: Declarative SPA Router & Master-Detail Views (Exercises 1.2, 1.2.1 & 1.2.2)

- **Mục tiêu**: Chuyển đổi ứng dụng từ hiển thị dồn trang sang mô hình Single-Page Application đa tuyến đường có tham số động.
- **Các gói công việc cụ thể**:
  - [x] **Task 2.1**: Xây dựng bộ định tuyến `router.js`.
    - Hiện thực `<Routes>` và `<Route>` hỗ trợ nested routing qua thẻ `<Outlet />`.
    - Hiện thực `<NavLink>` hỗ trợ functional callback `className={({ isActive }) => ...}` và thuộc tính `aria-current="page"`.
    - Hiện thực hook `useParams()` phân giải tham số động trên URL (ví dụ: `/scientists/:id`).
    - **Atomic Commit**: `feat(router): implement declarative Routes, NavLink, Outlet and useParams`
  - [x] **Task 2.2**: Hiện thực trang chi tiết `PersonDetail.js` và liên kết từ `ScientistDirectory.js`.
    - Tra cứu thực thể qua `SMART_PEOPLE.find((p) => p.id === id)` kế thừa từ Lab 3.
    - Render giao diện 2 cột bằng CSS Grid `grid-template-columns: minmax(280px, 1fr) 2fr` và danh sách định nghĩa `<dl>`, `<dt>`, `<dd>`.
    - Xây dựng giao diện dự phòng `<NotFoundState />` kèm cảnh báo `role="alert"` khi ID trên URL không tồn tại.
    - **Atomic Commit**: `feat(ex1.2): implement Master-Detail PersonDetail with CSS Grid and 404 fallback`

---

### 3. Sprint 3: Single-Pass Form Validation (Exercise 1.3)

- **Mục tiêu**: Giải quyết triệt để lỗi kiến trúc chaining `useEffect` gây vòng lặp re-render dây chuyền.
- **Các gói công việc cụ thể**:
  - [x] **Task 3.1**: Xây dựng `RegistrationForm.js` theo mô hình Derived Validation State.
    - Tính toán trực tiếp đối tượng `errors` và cờ `isFormValid` ngay trong luồng render (Zero `useEffect`), đảm bảo 1 lần gõ phím chỉ kích hoạt đúng 1 chu kỳ render.
    - Gắn kết đầy đủ `<label htmlFor>` với `<input id>`, kiểm tra định dạng tên, email và giới hạn chỉ số IQ (`100 - 250`).
    - **Atomic Commit**: `feat(ex1.3): implement single-pass derived form validation without useEffect cascades`

---

### 4. Sprint 4: Custom Data Hook & Express Backend Hygiene (Exercise 1.7.1)

- **Mục tiêu**: Đóng gói logic fetch bất đồng bộ an toàn ở frontend và bảo vệ API route ở backend.
- **Các gói công việc cụ thể**:
  - [x] **Task 4.1**: Tách custom hook `useForumMessages.js` và giao diện `ForumChannel.js`.
    - Tích hợp `AbortController` hủy bỏ các request cũ khi người dùng chuyển kênh thảo luận liên tục, loại bỏ hoàn toàn `AbortError` giả mạo và rò rỉ bộ nhớ.
    - Render danh sách tin nhắn bằng thẻ `<dl>` kết hợp `<Fragment key={msg.id}>`.
  - [x] **Task 4.2**: Xây dựng Express server (`server.js`).
    - Cấu hình middleware `cors()` và `express.json()`.
    - Áp dụng kiểm tra chặt chẽ kiểu dữ liệu và độ dài chuỗi (1 - 300 ký tự) cho route `POST /api/channels/:channelId/messages`, từ chối payload không hợp lệ với mã HTTP `400 Bad Request`.
    - **Atomic Commit**: `feat(ex1.7): add useForumMessages hook with AbortController and Express CORS/validation`

---

## III. BẢNG ĐỐI SOÁT LỊCH SỬ GIT LOG (LAB 4 ATOMIC COMMITS)

| STT | Commit Message Chuẩn Hóa                                                           | Phân Vùng File Liên Quan                   | Trạng Thái |
| :-: | :--------------------------------------------------------------------------------- | :----------------------------------------- | :--------: |
|  1  | `feat(core): add Fragment, lazy and Suspense boundaries to Mini-React`             | `mini-react.js`, `reactive-engine.js`      | Hoàn thành |
|  2  | `feat(router): implement declarative Routes, NavLink, Outlet and useParams`        | `router.js`                                | Hoàn thành |
|  3  | `feat(ex1.2): implement Master-Detail PersonDetail with CSS Grid and 404 fallback` | `PersonDetail.js`, `ScientistDirectory.js` | Hoàn thành |
|  4  | `feat(ex1.3                                                                        |
