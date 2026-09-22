# ForgePath V4.0 — Web/PWA + Capacitor

Bản này chuyển ForgePath sang kiến trúc **Web-first / PWA / Capacitor-ready** mà không viết lại UI V3.12.

## Chạy trên máy

```bash
npm run build
npm run dev
```

Mở `http://127.0.0.1:4173`.

## Deploy Netlify

`netlify.toml` đã cấu hình:

- Build command: `npm run build`
- Publish directory: `dist`

Có thể kéo repo lên Netlify/Git hoặc chạy build rồi deploy thư mục `dist`.

## PWA

PWA bao gồm:

- `manifest.webmanifest`
- icon 192 / 512 / maskable
- service worker cache app shell
- offline fallback
- prompt cài trên Chromium
- hướng dẫn Add to Home Screen trên iOS Safari

> YouTube cần Internet; phần app shell và dữ liệu đã lưu cục bộ vẫn hoạt động offline.

## Android bằng Capacitor

Cài dependency lần đầu:

```bash
npm install
npm run build
npm run cap:add:android
npm run cap:sync
npm run cap:android
```

Android Studio sẽ mở project native. Khi sửa web app về sau chỉ cần:

```bash
npm run cap:android
```

## iOS bằng Capacitor

Cần macOS + Xcode:

```bash
npm install
npm run build
npm run cap:add:ios
npm run cap:sync
npm run cap:ios
```

## Quy tắc kiến trúc

`index.html` hiện vẫn giữ logic V3.12 để bảo toàn UI/behavior. Lớp mới nằm ở `src/platform.js` và chỉ phụ trách PWA/native shell + Exercise Guide. Đây là bước chuyển tiếp an toàn trước khi tách từng engine ở các bản V4.x tiếp theo.

### Nguồn sự thật

- Source web: `index.html`, `src/`, `public/`
- Build output: `dist/`
- Capacitor luôn đóng gói `dist/`
- Netlify cũng publish `dist/`

Vì vậy web, PWA và Android/iOS dùng **cùng một codebase**.

## Quyết định 3D

V4 runtime không tạo Motion Coach 3D nữa. `renderGuide()` được thay bằng:

- hướng dẫn kỹ thuật có sẵn,
- lỗi thường gặp,
- breathing/form cues,
- nút **Tìm video trên YouTube**.

Legacy 3D code vẫn còn trong baseline HTML ở bản foundation để tránh refactor quá lớn cùng lúc, nhưng không được gọi bởi UI V4 và không tải Three.js ở luồng Exercise Guide mới. Nó sẽ được loại bỏ vật lý khi tách `exercise-guide` thành module riêng.

## Bước tiếp theo đề xuất

1. Tách state/storage khỏi `index.html`.
2. Chuyển dữ liệu bền vững sang IndexedDB abstraction.
3. Recovery Engine.
4. Adaptive Training Engine 2.0.
5. Today screen.
6. Cloud sync/account sau khi local model ổn định.
