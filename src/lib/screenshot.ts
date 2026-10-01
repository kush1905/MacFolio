import { WALLPAPERS, resolveWallpaper } from "@/lib/apps";
import { useOSStore } from "@/store/osStore";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export type CaptureRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Compose a macOS-style screenshot from the active wallpaper (+ optional crop). */
export async function captureDesktopScreenshot(
  region?: CaptureRegion,
): Promise<{ dataUrl: string; name: string }> {
  const wallpaperId = resolveWallpaper(
    useOSStore.getState().preferences.wallpaper,
  );
  const wallpaper = WALLPAPERS[wallpaperId];
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.min(2, window.devicePixelRatio || 1);

  const canvas = document.createElement("canvas");
  const rx = region?.x ?? 0;
  const ry = region?.y ?? 0;
  const rw = region?.width ?? vw;
  const rh = region?.height ?? vh;
  canvas.width = Math.max(1, Math.round(rw * scale));
  canvas.height = Math.max(1, Math.round(rh * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");

  ctx.scale(scale, scale);

  // Base fill
  ctx.fillStyle = "#0a0a0c";
  ctx.fillRect(0, 0, rw, rh);

  if (wallpaper.image) {
    try {
      const img = await loadImage(wallpaper.image);
      // Object-fit: cover for full desktop
      const imgRatio = img.width / img.height;
      const screenRatio = vw / vh;
      let dw = vw;
      let dh = vh;
      let dx = 0;
      let dy = 0;
      if (imgRatio > screenRatio) {
        dw = vh * imgRatio;
        dx = (vw - dw) / 2;
      } else {
        dh = vw / imgRatio;
        dy = (vh - dh) / 2;
      }
      ctx.drawImage(img, dx - rx, dy - ry, dw, dh);
    } catch {
      ctx.fillStyle = "#1c1c1e";
      ctx.fillRect(0, 0, rw, rh);
    }
  } else {
    const grad = ctx.createLinearGradient(0, 0, rw, rh);
    grad.addColorStop(0, "#1c1c1e");
    grad.addColorStop(1, "#000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rw, rh);
  }

  // Soft vignette like a captured desktop
  const vig = ctx.createRadialGradient(
    rw / 2,
    rh / 2,
    Math.min(rw, rh) * 0.2,
    rw / 2,
    rh / 2,
    Math.max(rw, rh) * 0.75,
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, rw, rh);

  const stamp = new Date();
  const name = `Screenshot ${stamp.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).replace(/\//g, "-")}.png`;

  return { dataUrl: canvas.toDataURL("image/png"), name };
}

export function flashScreen() {
  const el = document.createElement("div");
  el.style.cssText =
    "position:fixed;inset:0;background:#fff;opacity:0.55;z-index:9999;pointer-events:none;transition:opacity 180ms ease";
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = "0";
  });
  window.setTimeout(() => el.remove(), 220);
}
