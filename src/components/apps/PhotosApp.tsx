"use client";

import { useMemo, useState } from "react";
import { content } from "@/lib/content";
import { useOSStore } from "@/store/osStore";

const ALBUM_COLORS = [
  "linear-gradient(135deg,#ff9a9e,#fecfef)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
  "linear-gradient(135deg,#fad0c4,#ffd1ff)",
  "linear-gradient(135deg,#ffecd2,#fcb69f)",
  "linear-gradient(135deg,#84fab0,#8fd3f4)",
  "linear-gradient(135deg,#cfd9df,#e2ebf0)",
];

type LibraryView = "all" | "screenshots" | string;

export function PhotosApp() {
  const albums = useMemo(
    () => Array.from(new Set(content.photos.map((p) => p.album))),
    [],
  );
  const screenshots = useOSStore((s) => s.screenshots);
  const [album, setAlbum] = useState<LibraryView>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [shotId, setShotId] = useState<string | null>(null);

  const photos =
    album === "all" || album === "screenshots"
      ? content.photos
      : content.photos.filter((p) => p.album === album);

  const selectedPhoto = content.photos.find((p) => p.id === selected);
  const selectedShot = screenshots.find((s) => s.id === shotId);

  return (
    <div className="flex h-full text-[13px]">
      <aside className="mac-scroll w-[180px] shrink-0 border-r border-white/10 bg-black/25 p-3 pt-11">
        <div className="mb-2 px-2 text-[11px] font-semibold text-white/40">
          Library
        </div>
        <SideBtn
          active={album === "all"}
          onClick={() => {
            setAlbum("all");
            setShotId(null);
            setSelected(null);
          }}
        >
          All Photos
        </SideBtn>
        <SideBtn
          active={album === "screenshots"}
          onClick={() => {
            setAlbum("screenshots");
            setSelected(null);
            setShotId(null);
          }}
        >
          Screenshots ({screenshots.length})
        </SideBtn>
        <div className="mb-2 mt-4 px-2 text-[11px] font-semibold text-white/40">
          Albums
        </div>
        {albums.map((a) => (
          <SideBtn
            key={a}
            active={album === a}
            onClick={() => {
              setAlbum(a);
              setShotId(null);
              setSelected(null);
            }}
          >
            {a}
          </SideBtn>
        ))}
      </aside>

      <div className="mac-scroll flex-1 p-4">
        {selectedShot ? (
          <div>
            <button
              type="button"
              className="mb-3 cursor-default text-mac-accent"
              onClick={() => setShotId(null)}
            >
              ‹ Screenshots
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedShot.dataUrl}
              alt=""
              className="mb-3 max-h-[420px] w-full rounded-xl object-contain bg-black/40"
            />
            <h2 className="text-lg font-semibold">{selectedShot.name}</h2>
            <p className="text-white/60">
              {new Date(selectedShot.createdAt).toLocaleString()}
            </p>
          </div>
        ) : selectedPhoto ? (
          <div>
            <button
              type="button"
              className="mb-3 cursor-default text-mac-accent"
              onClick={() => setSelected(null)}
            >
              ‹ Library
            </button>
            <div
              className="mb-4 flex h-[320px] items-end rounded-2xl p-6 text-2xl font-semibold text-white shadow-inner"
              style={{
                background:
                  ALBUM_COLORS[
                    content.photos.findIndex((p) => p.id === selectedPhoto.id) %
                      ALBUM_COLORS.length
                  ],
              }}
            >
              {selectedPhoto.title}
            </div>
            <h2 className="text-lg font-semibold">{selectedPhoto.title}</h2>
            <p className="text-white/60">{selectedPhoto.caption}</p>
          </div>
        ) : album === "screenshots" ? (
          <>
            <h2 className="mb-4 text-lg font-semibold">Screenshots</h2>
            {screenshots.length === 0 ? (
              <div className="rounded-xl bg-white/5 px-4 py-10 text-center text-white/45">
                No screenshots yet. Press ⌘⇧3 or ⌘⇧4.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {screenshots.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setShotId(s.id)}
                    className="group cursor-default overflow-hidden rounded-lg"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.dataUrl}
                      alt=""
                      className="aspect-square w-full object-cover transition group-hover:scale-[1.02]"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="mb-4 text-lg font-semibold">
              {album === "all" ? "All Photos" : album}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  className="group cursor-default overflow-hidden rounded-lg"
                >
                  <div
                    className="flex aspect-square items-end p-3 text-left text-[12px] font-semibold text-white transition group-hover:scale-[1.02]"
                    style={{
                      background: ALBUM_COLORS[i % ALBUM_COLORS.length],
                    }}
                  >
                    <span className="drop-shadow">{p.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SideBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-0.5 w-full cursor-default rounded-md px-2 py-1 text-left ${
        active ? "bg-mac-accent text-white" : "hover:bg-white/8"
      }`}
    >
      {children}
    </button>
  );
}
