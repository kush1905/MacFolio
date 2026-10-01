"use client";

import { useRef, useState } from "react";

type Props = {
  focused: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onTileLeft?: () => void;
  onTileRight?: () => void;
  onFill?: () => void;
};

export function TrafficLights({
  focused,
  onClose,
  onMinimize,
  onMaximize,
  onTileLeft,
  onTileRight,
  onFill,
}: Props) {
  const dim = !focused;
  const [menuOpen, setMenuOpen] = useState(false);
  const hoverTimer = useRef<number | null>(null);

  const openMenu = () => setMenuOpen(true);
  const clearHover = () => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  return (
    <div className="group/traffic relative flex items-center gap-[8px]">
      <Light
        dim={dim}
        color="var(--traffic-red)"
        dimColor="#555"
        label="Close"
        onClick={onClose}
      >
        <path
          d="M3.05 3.05l5.9 5.9M8.95 3.05l-5.9 5.9"
          stroke="#1a1a1a"
          strokeWidth="2.15"
          strokeLinecap="round"
        />
      </Light>
      <Light
        dim={dim}
        color="var(--traffic-yellow)"
        dimColor="#555"
        label="Minimize"
        onClick={onMinimize}
      >
        <path
          d="M2.15 6h7.7"
          stroke="#1a1a1a"
          strokeWidth="2.15"
          strokeLinecap="round"
        />
      </Light>
      <div className="relative flex items-center leading-none">
        <Light
          dim={dim}
          color="var(--traffic-green)"
          dimColor="#555"
          label="Full Screen"
          onClick={onMaximize}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openMenu();
          }}
          onMouseEnter={() => {
            clearHover();
            hoverTimer.current = window.setTimeout(openMenu, 500);
          }}
          onMouseLeave={clearHover}
        >
          <path fill="#1a1a1a" d="M2.15 2.15h4.55L2.15 6.7Z" />
          <path fill="#1a1a1a" d="M9.85 9.85H5.3L9.85 5.3Z" />
        </Light>
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-[200]"
              onClick={() => setMenuOpen(false)}
            />
            <div className="menu-dropdown absolute left-0 top-5 z-[210] w-[210px] overflow-hidden rounded-[8px] py-1 text-[12px] text-white">
              <TileItem
                label="Enter Full Screen"
                onClick={() => {
                  setMenuOpen(false);
                  onMaximize();
                }}
              />
              <div className="my-1 h-px bg-white/10" />
              <TileItem
                label="Tile Window to Left of Screen"
                onClick={() => {
                  setMenuOpen(false);
                  onTileLeft?.();
                }}
              />
              <TileItem
                label="Tile Window to Right of Screen"
                onClick={() => {
                  setMenuOpen(false);
                  onTileRight?.();
                }}
              />
              <div className="my-1 h-px bg-white/10" />
              <TileItem
                label="Fill"
                onClick={() => {
                  setMenuOpen(false);
                  onFill?.();
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TileItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex w-full cursor-default px-3 py-[5px] text-left hover:bg-mac-accent"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function Light({
  dim,
  color,
  dimColor,
  label,
  onClick,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  dim: boolean;
  color: string;
  dimColor: string;
  label: string;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="traffic-btn cursor-default"
      style={{
        background: dim ? dimColor : color,
        boxShadow: dim
          ? "inset 0 0 0 0.5px rgba(0,0,0,0.15)"
          : "inset 0 0 0 0.5px rgba(0,0,0,0.25), 0 0.5px 0.5px rgba(0,0,0,0.12)",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onContextMenu={onContextMenu}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <svg viewBox="0 0 12 12" fill="none">
        {children}
      </svg>
    </button>
  );
}
