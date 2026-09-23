# ForgePath V4.0 Web

Bản Web-only của ForgePath, chuyển từ V3.12 nhưng giữ ngôn ngữ giao diện/UX hiện tại.

## Đã thay đổi

- Loại bỏ PWA/service worker/manifest/install prompt.
- Loại bỏ Capacitor và toàn bộ native packaging.
- Loại bỏ motion renderer, model runtime và các dependency liên quan.
- Thay phần hướng dẫn chuyển động bằng **Exercise Guide + nút tìm tutorial trên YouTube**.
- Giữ Anatomy SVG, workout logging, timer, RIR, progress, skills, onboarding và các màn hình hiện tại.
- Tách CSS/JavaScript khỏi `index.html` để repo dễ quản lý hơn.
- Web build không cần dependency ngoài.

## Chạy local

```bash
npm run dev
```

Mở `http://localhost:8080`.

## Build production

```bash
npm run build
```

Output: `dist/`.

### Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: `None`

## Source layout

```text
src/
├── core/       runtime + version bridge
├── features/   progress, skills, anatomy, exercise guide
├── ui/         UI layers preserved from V3.12
└── styles/     shared application styles
```

V4.0 chủ yếu là bước **stabilization + web cleanup**. Các engine Recovery/Adaptive sẽ được tách sâu hơn ở các bản tiếp theo thay vì redesign presentation layer.
