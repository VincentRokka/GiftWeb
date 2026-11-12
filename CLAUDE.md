# CLAUDE.md

File này hướng dẫn Claude Code (claude.ai/code) khi làm việc với code trong repo này.

## Dự án

"Lucky Ppopgi" — trang web giới thiệu một trang (single-page) nhỏ, viết bằng React 19 + Vite 6 (JSX thuần, không TypeScript, không thư viện router, không thư viện state). Comment trong `src/content.js` viết bằng tiếng Việt.

## Lệnh

- `npm run dev` — dev server Vite ở cổng 5173 (tự mở trình duyệt; nếu cổng bận sẽ dùng cổng khác)
- `npm run build` — build production ra `dist/`
- `npm run preview` — chạy thử bản build trong `dist/`

Không có linter, formatter hay test.

## Git

Repo: https://github.com/VincentRokka/GiftWeb (public, nhánh `main`). Chỉ commit/push khi người dùng yêu cầu. `.gitignore` bỏ qua `node_modules`, `dist`, `*.zip` (file backup `ToanhWeb.zip` chỉ để trên máy) và file tạm Office `~$*`.

## Kiến trúc

**Toàn bộ nội dung nằm ở `src/content.js`.** Chữ, đường dẫn ảnh, mục menu, thời gian loader (`loaderCycles`, `loaderFrameMs`) và cấu hình luồng Lucky (`luckyFlow`) đều ở đây; component import từ file này chứ không hardcode chữ. Muốn đổi câu chữ, ảnh, hay thêm/đổi tên trang tính năng thì sửa `content.js` trước. Ảnh nằm trong `public/images/`, gọi bằng đường dẫn tuyệt đối (`/images/...`); đổi ảnh = thay file cùng tên (`loader/01-03.png`, `gallery/01-08.png`, `gif/01-04.gif`, `pages/01-05.png`, `logo-dark.png` / `logo-light.png`).

**Routing tự viết trong `src/App.jsx`.** `routeFromPath` so `window.location.pathname` với `menuItems[].path`; điều hướng bằng `history.pushState` + lắng nghe `popstate`. Path khớp → render `FeaturePage` (bỏ qua loader); còn lại → luồng trang chủ. Deep link như `/lucky-spin` dựa vào SPA fallback của dev server — host tĩnh cần rewrite về `index.html`.

**Luồng trang chủ là state machine 3 pha trong `App.jsx`:** `loading` → `revealing` → `main`. Trong `revealing` (`REVEAL_MS`, 1280ms) cả `Loader` (class `is-leaving`) và `MainScreen` (class `is-entering`) cùng được mount để transition CSS chồng lên nhau; hằng số này phải khớp với transition trong `Loader.css` / `MainScreen.css`.

**`Loader`** preload ảnh, rồi chạy thanh tiến độ và đổi frame bằng một vòng `requestAnimationFrame` duy nhất, sửa DOM trực tiếp qua ref (không render React mỗi frame, chỉ render khi đổi slot). Tổng thời gian = `loaderImages.length * loaderCycles * loaderFrameMs`. Có tôn trọng `prefers-reduced-motion`.

**`Gallery`** là carousel kéo vô hạn tự viết: render `COPIES` (5) bản sao ảnh gallery, giữ offset quanh bản giữa, khi thả chuột thì snap vào thẻ gần nhất, sau `SNAP_MS` âm thầm đưa offset về bản giữa (tắt transition bằng class `is-instant`). Bước nhảy giữa các thẻ đo từ DOM (`offsetLeft` của 2 thẻ liền nhau), kích thước thẻ lấy từ biến CSS `--card-w` trong `MainScreen.css`. Pointer-down trên UI phủ lên (`.wish, .topbar, .footer, .brand, .menu, .logo`) bị bỏ qua — thêm overlay mới lên gallery thì phải cập nhật selector này. Click (không kéo) vào thẻ gọi `onCardClick(index)`.

**Styling:** CSS global thuần, mỗi màn một file và được import bởi component tương ứng (`App.css` chứa base/reset và style `.logo` dùng chung). Trạng thái thể hiện bằng class `is-*`. Component `Logo` chọn ảnh sáng/tối tuỳ `className` có chứa `logo-on-dark` hay không. Font viết tay (Homemade Apple) và Nunito 800 load qua Google Fonts trong `index.html`.

## Luồng Lucky (click ảnh gallery 03)

Code: `src/screens/LuckyFlow.jsx` + `LuckyFlow.css`, cấu hình: `luckyFlow` trong `src/content.js`. `App.jsx` mở `LuckyFlow` khi click thẻ có index `luckyFlow.galleryIndex` (2 = ảnh 03), và giữ lựa chọn ở state `luckyChoice` + localStorage key `luckyChoice` (dùng cho các bước sau).

Các bước (`step` trong `LuckyFlow`):

1. **`intro`** — ảnh 06 (`gallery/06.png`, 1671×941) phóng to từ giữa màn hình (`zoomMs`), giữ `holdMs`, rồi tự sang menu. Không có nút/hover ở bước này.
2. **`menu`** — ảnh 07 (`gallery/07.png`) dạng contain, 6 ô (`options`, toạ độ % theo ảnh 07); hover: nền `#6D3912` + chữ + icon bánh `08-cutout.png`. Click 1 ô → lưu lựa chọn → menu mờ dần → sang `shelf`.
3. **`shelf`** — vẫn là ảnh 06 (cùng layer với intro, không cần ảnh riêng) nhưng thêm:
   - **Hover tên trên bệ** của 4 khung (Fortune Cookie, May Box, Vasilopita, Galette des Rois) → hiện bảng mô tả kính mờ trắng, tiêu đề viết hoa trên nền vàng `#FFC700`, theo mẫu `gallery/06_display.png`. Nội dung + toạ độ khung ở `luckyFlow.shelf` (`frame` = % của ảnh 06). Vùng hover (`.lucky-shelf-hotspot`) và bảng (`.lucky-shelf-panel`) đặt theo % của khung trong CSS. Trên màn cảm ứng không có hover nên chạm vào khung là mở gif luôn (bảng mô tả chỉ hiện khi rê chuột hoặc focus bằng bàn phím).
   - **2 nút bên trái** (`.lucky-nav`, chữ ở `luckyFlow.nav`): "Back" → về menu 07; "Home" (nằm ngay dưới Back) → đóng LuckyFlow về màn chính. Mép trên nút ngang mép trên khung 01 (tính trong CSS từ `shelf[0].frame.top` + tỉ lệ ảnh 06).
   - **Click vào 1 trong 4 khung** (cả khung là một `<button class="lucky-shelf-frame">`) → sang bước `gif`.
4. **`gif`** — chạy gif của khung đó (`luckyFlow.shelf[].gif` = `public/images/gif/01-04.gif`, đánh số trái→phải, trên→dưới) phủ kín màn hình (`object-fit: cover`), **chỉ 1 lần**, dừng ở khung cuối (tờ giấy trắng), rồi hiện tên khung + **1 lời nhắn random trong 5 câu** của option đã chọn ở màn 07 (`luckyFlow.messages[luckyChoice]`, chép từ `public/doc/Messages.docx`). Nút "Back" ở bước này → về `shelf`; "Home" → đóng.
   - Cách cho gif chạy 1 lần: `src/lib/playOnceGif.js` fetch gif, bỏ extension lặp `NETSCAPE2.0` (gif không có extension này thì trình duyệt chạy 1 lần rồi giữ khung cuối), cộng delay các frame ra tổng thời gian. Mỗi lần mở tạo object URL mới để gif chạy lại từ đầu. Lời nhắn hiện sau `duration + GIF_END_PAD_MS`, tính từ lúc ảnh `onLoad`. Gif được preload khi rê chuột vào khung.
   - Đổi gif: thay file cùng tên, không cần sửa code (thời lượng tự đọc từ file). Đổi lời nhắn: sửa `luckyFlow.messages` trong `content.js` (docx không được đọc lúc chạy).

Ảnh 06 được bọc trong `.lucky-intro-stage` có kích thước bằng đúng ảnh khi `object-fit: cover` (dùng `luckyFlow.introAspect`), nên mọi overlay đặt theo % đều khớp với ảnh ở mọi kích thước màn hình. Chữ trong bảng dùng đơn vị `cqw` theo stage. Nhấn `Escape` ở bất kỳ bước nào → đóng LuckyFlow.

## Nhật ký thay đổi / task

- 2026-11-11: Tạo luồng Lucky: 06 zoom → menu 07 (6 lựa chọn, hover) → quay về 06; lưu `luckyChoice`.
- 2026-11-11: Màn 06 bước 2 (`shelf`): hover 4 tên trên bệ → hiện bảng mô tả theo mẫu `06_display.png`; thêm nút "Quay lại" (về 07) và "Về trang chủ" ở góc trái trên. Bước `intro` không đổi. Dịch CLAUDE.md sang tiếng Việt.
- 2026-11-12: Màn 06 bước 2: click 1 trong 4 khung → gif tương ứng chạy 1 lần tới tờ giấy cuối → hiện lời nhắn random (1/5) theo option đã chọn ở 07. Thêm `src/lib/playOnceGif.js`, `luckyFlow.messages`, `luckyFlow.shelf[].gif`.
- 2026-11-12: Đổi nút thành "Back" / "Home", xếp Home dưới Back, hạ xuống ngang mép trên khung 01. Chữ mô tả trong bảng hover đậm hơn (font-weight 300 → 400).
- 2026-11-12: Tạo git, đẩy lên GitHub repo `GiftWeb`.
- Đang chờ: người dùng sẽ gửi các bước tiếp theo của luồng Lucky (có thể dùng `luckyChoice`).
