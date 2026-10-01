"use client";

import { DOCK_LOCKED, DOCK_ORDER, resolveWallpaper } from "@/lib/apps";
import { apiFetch, trackEvent } from "@/lib/api";
import { useOSStore } from "@/store/osStore";
import type { AppId, Preferences } from "@/types";

function normalizeDockPins(raw: unknown): AppId[] {
  const allowed = new Set<AppId>([...DOCK_ORDER, "preview", "assistant"]);
  const ids = (Array.isArray(raw) ? raw : [])
    .filter(
      (id): id is AppId =>
        typeof id === "string" && allowed.has(id as AppId) && id !== "trash",
    );
  const withoutLocked = (ids.length ? ids : [...DOCK_ORDER]).filter(
    (id) => !DOCK_LOCKED.includes(id),
  );
  return [
    "finder",
    "launchpad",
    ...withoutLocked.filter((id) => id !== "finder" && id !== "launchpad"),
  ];
}

async function persistSettings() {
  const { preferences, dockPins } = useOSStore.getState();
  try {
    await apiFetch("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ preferences, dockPins }),
    });
  } catch {
    // Keep localStorage copy; retry on the next change.
  }
}

export function startBackendSync() {
  let skipPersist = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastPrefs = useOSStore.getState().preferences;
  let lastPins = useOSStore.getState().dockPins;

  async function loadRemote() {
    try {
      const res = await apiFetch("/api/settings");
      const data = (await res.json()) as {
        source?: string;
        settings?: {
          preferences?: Preferences;
          dockPins?: AppId[];
        } | null;
      };
      if (data.source !== "postgres") {
        await persistSettings();
        return;
      }
      if (data.settings?.preferences) {
        skipPersist = true;
        const wallpaper = resolveWallpaper(data.settings.preferences.wallpaper);
        useOSStore.setState({
          preferences: {
            ...useOSStore.getState().preferences,
            ...data.settings.preferences,
            wallpaper,
          },
          dockPins: normalizeDockPins(data.settings.dockPins),
        });
        lastPrefs = useOSStore.getState().preferences;
        lastPins = useOSStore.getState().dockPins;
      } else {
        await persistSettings();
      }
    } catch {
      // Offline / API down — local persistence still works.
    }
  }

  const unsub = useOSStore.subscribe((s) => {
    if (s.preferences === lastPrefs && s.dockPins === lastPins) return;
    lastPrefs = s.preferences;
    lastPins = s.dockPins;
    if (skipPersist) {
      skipPersist = false;
      return;
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      void persistSettings();
    }, 700);
  });

  void loadRemote();

  if (typeof sessionStorage !== "undefined") {
    if (!sessionStorage.getItem("macfolio-visit-tracked")) {
      sessionStorage.setItem("macfolio-visit-tracked", "1");
      trackEvent("visit");
    }
  } else {
    trackEvent("visit");
  }

  return () => {
    unsub();
    if (timer) clearTimeout(timer);
  };
}
