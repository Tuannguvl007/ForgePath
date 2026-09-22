/* ForgePath V4.0 platform layer
 * Web/PWA + Capacitor-ready shell.
 * Keeps the V3.12 UI/core intact while adding installability, offline support,
 * device-aware behavior, and the lightweight YouTube Exercise Guide.
 */

const FP_PLATFORM_VERSION = '4.0.0';
const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

const isNative = () => {
  try {
    return Boolean(window.Capacitor?.isNativePlatform?.());
  } catch (_) {
    return false;
  }
};

window.ForgePathPlatform = {
  version: FP_PLATFORM_VERSION,
  mode: isNative() ? 'native' : isStandalone() ? 'pwa' : 'web',
  isNative,
  isStandalone,
};

document.documentElement.dataset.fpPlatform = window.ForgePathPlatform.mode;

function injectPlatformStyles() {
  const style = document.createElement('style');
  style.id = 'fp-v4-platform-css';
  style.textContent = `
    .fp-install-chip{position:fixed;left:50%;bottom:calc(92px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:70;border:1px solid rgba(184,255,61,.34);background:rgba(17,22,28,.96);color:#f5f7fa;box-shadow:0 12px 32px rgba(0,0,0,.34);border-radius:999px;padding:10px 14px;font:800 12px/1.1 Inter,system-ui,sans-serif;display:flex;align-items:center;gap:8px;backdrop-filter:blur(14px)}
    .fp-install-chip b{color:#b8ff3d}.fp-install-chip[hidden]{display:none!important}
    .fp-platform-toast{position:fixed;left:50%;bottom:calc(94px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:100;background:#eaf7d5;color:#14200d;padding:10px 13px;border-radius:14px;font-weight:850;font-size:12px;box-shadow:0 14px 40px rgba(0,0,0,.28);max-width:min(90vw,420px);text-align:center}
    .fp-platform-toast.offline{background:#fff0ca;color:#3a2a06}
    .fp-install-help{position:fixed;inset:0;background:rgba(0,0,0,.68);z-index:120;display:grid;place-items:end center;padding:16px}.fp-install-help-card{width:min(480px,100%);background:#11161c;border:1px solid #26303a;border-radius:24px;padding:18px;box-shadow:0 24px 70px rgba(0,0,0,.48)}
    .fp-install-help-card h3{margin:0 0 7px}.fp-install-help-card p{margin:0 0 12px;color:#aab4bf;line-height:1.55;font-size:13px}.fp-install-help-card ol{margin:0 0 14px;padding-left:20px;color:#eef2f5;font-size:13px;line-height:1.7}.fp-install-help-card button{width:100%;border:0;border-radius:14px;padding:12px 14px;background:#b8ff3d;color:#10150b;font-weight:900}
    .fp-youtube-guide{margin-top:10px;border:1px solid rgba(184,255,61,.22);border-radius:18px;background:linear-gradient(145deg,rgba(184,255,61,.075),rgba(78,225,255,.035));padding:14px}
    .fp-youtube-guide-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.fp-youtube-guide-head b{font-size:14px}.fp-youtube-guide-head span{font-size:10px;color:#9aa4b2;border:1px solid #26303a;border-radius:999px;padding:5px 8px}
    .fp-youtube-guide p{font-size:12px;color:#aab4bf;line-height:1.5;margin:8px 0 12px}.fp-youtube-btn{width:100%;border:1px solid rgba(255,255,255,.10);border-radius:14px;padding:12px 14px;background:#ff0033;color:white;font-weight:900;display:flex;align-items:center;justify-content:center;gap:8px}
    .fp-youtube-btn:active{transform:scale(.985)}
    html[data-fp-platform="native"] body{overscroll-behavior-y:none;-webkit-user-select:none;user-select:none}html[data-fp-platform="native"] input,html[data-fp-platform="native"] textarea{-webkit-user-select:text;user-select:text}
    @media (min-width:900px){.fp-install-chip{bottom:28px}}
  `;
  document.head.appendChild(style);
}

function showToast(message, offline = false, ms = 2400) {
  document.querySelector('.fp-platform-toast')?.remove();
  const el = document.createElement('div');
  el.className = `fp-platform-toast${offline ? ' offline' : ''}`;
  el.textContent = message;
  document.body.appendChild(el);
  window.setTimeout(() => el.remove(), ms);
}

let deferredInstallPrompt = null;

function installChip(label = 'Cài ForgePath') {
  let chip = document.getElementById('fp-install-chip');
  if (!chip) {
    chip = document.createElement('button');
    chip.type = 'button';
    chip.id = 'fp-install-chip';
    chip.className = 'fp-install-chip';
    document.body.appendChild(chip);
  }
  chip.innerHTML = `<span>⬇</span><b>${label}</b><span>• PWA</span>`;
  chip.hidden = false;
  return chip;
}

function hideInstallChip() {
  const chip = document.getElementById('fp-install-chip');
  if (chip) chip.hidden = true;
}

function showIOSInstallHelp() {
  document.querySelector('.fp-install-help')?.remove();
  const wrap = document.createElement('div');
  wrap.className = 'fp-install-help';
  wrap.innerHTML = `
    <div class="fp-install-help-card" role="dialog" aria-modal="true" aria-label="Cài ForgePath trên iPhone hoặc iPad">
      <h3>Cài ForgePath</h3>
      <p>Safari trên iPhone/iPad dùng thao tác Thêm vào Màn hình chính thay vì hộp thoại cài tự động.</p>
      <ol><li>Nhấn nút <b>Chia sẻ</b> trong Safari.</li><li>Chọn <b>Thêm vào Màn hình chính</b>.</li><li>Nhấn <b>Thêm</b>.</li></ol>
      <button type="button">Đã hiểu</button>
    </div>`;
  wrap.addEventListener('click', (e) => {
    if (e.target === wrap || e.target.tagName === 'BUTTON') wrap.remove();
  });
  document.body.appendChild(wrap);
}

function setupInstallExperience() {
  if (isNative() || isStandalone()) return;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    const chip = installChip();
    chip.onclick = async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice.catch(() => null);
      deferredInstallPrompt = null;
      if (choice?.outcome === 'accepted') {
        hideInstallChip();
        showToast('ForgePath đã được thêm vào thiết bị.');
      }
    };
  });

  const ua = navigator.userAgent || '';
  const isiOS = /iPhone|iPad|iPod/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);
  if (isiOS && isSafari) {
    const chip = installChip('Thêm vào Màn hình chính');
    chip.onclick = showIOSInstallHelp;
  }

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    hideInstallChip();
    showToast('ForgePath đã được cài đặt.');
  });
}

function setupNetworkStatus() {
  window.addEventListener('offline', () => showToast('Bạn đang offline • ForgePath vẫn dùng được dữ liệu đã lưu.', true, 3200));
  window.addEventListener('online', () => showToast('Đã kết nối lại Internet.'));
}

async function registerServiceWorker() {
  if (isNative() || !('serviceWorker' in navigator)) return;
  if (!/^https?:$/.test(location.protocol)) return;
  try {
    const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } catch (error) {
    console.warn('[ForgePath] Service worker registration failed:', error);
  }
}

function youtubeQueryFor(exercise) {
  const name = typeof exercise === 'string' ? exercise : exercise?.name || 'exercise';
  return `${name} proper form exercise tutorial`;
}

function youtubeUrlFor(exercise) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQueryFor(exercise))}`;
}

window.fpOpenYoutube = function fpOpenYoutube(name) {
  const url = youtubeUrlFor(name);
  const opened = window.open(url, '_blank', 'noopener,noreferrer');
  if (!opened) location.href = url;
};

window.fpYoutubeSearchUrl = youtubeUrlFor;

function guideMarkup(e) {
  const g = typeof window.guideFor === 'function'
    ? window.guideFor(e.id)
    : { setup: '', steps: [], cues: [], mistakes: [], breathing: '' };
  const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const name = esc(e.name || 'Exercise');
  return `<button class="guidebtn" onclick="toggleGuide('${esc(e.id)}')"><span>▶ Exercise Guide & kỹ thuật</span><span>⌄</span></button><div class="guide" id="guide-${esc(e.id)}"><div class="fp-youtube-guide"><div class="fp-youtube-guide-head"><b>Video hướng dẫn • ${name}</b><span>YouTube Search</span></div><p>Mở kết quả tìm kiếm video để chọn tutorial phù hợp. ForgePath không khóa bạn vào một video hoặc creator duy nhất.</p><button class="fp-youtube-btn" type="button" onclick="fpOpenYoutube(${JSON.stringify(e.name || 'Exercise')})"><span>▶</span><span>TÌM VIDEO TRÊN YOUTUBE</span></button></div><div class="coach-summary"><div class="quickcue"><b>✅ Form nhanh</b><span>${(g.cues||[]).slice(0,2).map(esc).join(' • ')}</span></div><div class="quickcue safetycue"><b>⚠️ Tránh</b><span>${(g.mistakes||[]).slice(0,2).map(esc).join(' • ')}</span></div></div><h4 style="margin-top:14px">Chuẩn bị</h4><p>${esc(g.setup)}</p><h4>Cách thực hiện</h4><ul>${(g.steps||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h4>Điểm cần nhớ</h4><ul>${(g.cues||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h4 class="warning">Lỗi thường gặp</h4><ul class="warning">${(g.mistakes||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul><div class="breath">🫁 ${esc(g.breathing)}</div></div>`;
}

function disable3DAndInstallYoutubeGuide() {
  // The old 3D functions remain only as legacy source compatibility. New UI never
  // creates a 3D viewer, so Three.js/GLTF assets are not requested at runtime.
  window.init3D = function () {};
  window.visualDemo = function (e) {
    return `<div class="fp-youtube-guide"><div class="fp-youtube-guide-head"><b>Video hướng dẫn • ${String(e?.name || 'Exercise')}</b><span>YouTube Search</span></div><p>Tìm tutorial đúng động tác, góc quay và dụng cụ bạn đang sử dụng.</p><button class="fp-youtube-btn" type="button" onclick="fpOpenYoutube(${JSON.stringify(e?.name || 'Exercise')})"><span>▶</span><span>TÌM VIDEO TRÊN YOUTUBE</span></button></div>`;
  };
  window.renderGuide = guideMarkup;
  try {
    // Classic-script global bindings map onto window properties in the legacy app.
    // Reassigning here keeps existing render functions compatible.
    init3D = window.init3D;
    visualDemo = window.visualDemo;
    renderGuide = window.renderGuide;
  } catch (_) {}
}

function patchLegacyRuntimeLabels(root = document) {
  root.querySelectorAll?.('.v36-runtime-note').forEach(el => {
    el.innerHTML = 'Exercise Guide dùng <b>YouTube Search</b>; Home/Profile tiếp tục dùng anatomical SVG và không tải Three.js.';
  });
  root.querySelectorAll?.('.v351-runtime').forEach(el => {
    el.innerHTML = '<span class="ok">Exercise Guide: READY</span><span>YouTube + SVG • không cần WebGL/3D runtime</span>';
  });
  root.querySelectorAll?.('.v351-build').forEach(el => {
    if (/^V3\./.test(el.textContent || '')) el.textContent = 'V4 PWA';
  });
}

function watchLegacyUI() {
  patchLegacyRuntimeLabels();
  const app = document.getElementById('app');
  if (!app) return;
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      patchLegacyRuntimeLabels(app);
    });
  }).observe(app, { childList: true, subtree: true });
}

function boot() {
  injectPlatformStyles();
  disable3DAndInstallYoutubeGuide();
  setupInstallExperience();
  setupNetworkStatus();
  registerServiceWorker();
  watchLegacyUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
