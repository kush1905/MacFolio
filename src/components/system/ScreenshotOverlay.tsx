"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { captureDesktopScreenshot, flashScreen } from "@/lib/screenshot";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";

export function ScreenshotOverlay() {
  const selectMode = useOSStore((s) => s.screenshotSelectMode);
  const setSelectMode = useOSStore((s) => s.setScreenshotSelectMode);
  const addScreenshot = useOSStore((s) => s.addScreenshot);
  const latestId = useOSStore((s) => s.latestScreenshotId);
  const screenshots = useOSStore((s) => s.screenshots);
  const dismiss = useOSStore((s) => s.dismissLatestScreenshot);
  const openApp = useWindowStore((s) => s.openApp);

  const latest = screenshots.find((s) => s.id === latestId) ?? null;

  const [drag, setDrag] = useState<{
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  } | null>(null);
  const dragging = useRef(false);

  const finishRegion = useCallback(
    async (region: { x: number; y: number; width: number; height: number }) => {
      setSelectMode(false);
      setDrag(null);
      if (region.width < 8 || region.height < 8) return;
      flashScreen();
      try {
        const shot = await captureDesktopScreenshot(region);
        addScreenshot({ ...shot, region });
      } catch {
        // ignore
      }
    },
    [addScreenshot, setSelectMode],
  );

  useEffect(() => {
    if (!selectMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectMode(false);
        setDrag(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectMode, setSelectMode]);

  useEffect(() => {
    if (!latestId) return;
    const t = window.setTimeout(() => dismiss(), 6000);
    return () => clearTimeout(t);
  }, [latestId, dismiss]);

  const rect =
    drag &&
    ({
      left: Math.min(drag.x0, drag.x1),
      top: Math.min(drag.y0, drag.y1),
      width: Math.abs(drag.x1 - drag.x0),
      height: Math.abs(drag.y1 - drag.y0),
    } as const);

  return (
    <>
      {selectMode && (
        <div
          className="fixed inset-0 z-[120] cursor-crosshair bg-black/35"
          onMouseDown={(e) => {
            dragging.current = true;
            setDrag({ x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY });
          }}
          onMouseMove={(e) => {
            if (!dragging.current || !drag) return;
            setDrag({ ...drag, x1: e.clientX, y1: e.clientY });
          }}
          onMouseUp={() => {
            if (!drag) return;
            dragging.current = false;
            const x = Math.min(drag.x0, drag.x1);
            const y = Math.min(drag.y0, drag.y1);
            const width = Math.abs(drag.x1 - drag.x0);
            const height = Math.abs(drag.y1 - drag.y0);
            void finishRegion({ x, y, width, height });
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-10 text-center text-[13px] font-medium text-white drop-shadow">
            Drag to select area · Esc to cancel
          </div>
          {rect && (
            <div
              className="pointer-events-none absolute border border-white bg-white/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]"
              style={rect}
            />
          )}
        </div>
      )}

      <AnimatePresence>
        {latest && (
          <motion.button
            type="button"
            className="screenshot-toast pointer-events-auto absolute bottom-24 right-5 z-[85] w-[220px] overflow-hidden rounded-[12px] text-left text-white"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => {
              dismiss();
              openApp("photos");
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={latest.dataUrl}
              alt=""
              className="h-[132px] w-full object-cover"
            />
            <div className="px-3 py-2">
              <div className="text-[12px] font-semibold">Screenshot</div>
              <div className="text-[11px] text-white/55">
                Click to open in Photos
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
