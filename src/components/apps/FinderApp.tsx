"use client";

import { useMemo, useState } from "react";
import { content } from "@/lib/content";
import { folderSpec } from "@/lib/appearance";
import { useOSStore } from "@/store/osStore";
import { useWindowStore } from "@/store/windowStore";
import type { AppId } from "@/types";
import {
  FinderFolderIcon,
  FinderImageIcon,
  FinderPdfIcon,
  SFClock,
  SFCloudBadge,
  SFFolder,
  SFHome,
  SFiCloud,
  SFPdf,
} from "@/components/icons/FinderIcons";
import { MacOSAssetIcon } from "@/components/icons/AppIcon";
import { UserAvatar } from "@/components/icons/UserAvatar";

type NavKey =
  | "recents"
  | "applications"
  | "downloads"
  | "desktop"
  | "documents"
  | "about"
  | "projects"
  | "skills"
  | "resume"
  | "icloud"
  | "home"
  | "airdrop"
  | "trash"
  | "react"
  | "node"
  | "java"
  | "mongodb";

type ViewMode = "icons" | "list" | "columns" | "gallery";

type FinderItem = {
  id: string;
  name: string;
  kind: "folder" | "image" | "pdf" | "file" | "app";
  group: "Today" | "Yesterday" | "Previous 30 Days";
  cloud?: boolean;
  color?: string;
  openApp?: AppId;
  href?: string;
};

const USER = content.about.name.toLowerCase().replace(/\s+/g, "");

export function FinderApp() {
  const [nav, setNav] = useState<NavKey>("desktop");
  const [view, setView] = useState<ViewMode>("icons");
  const [selected, setSelected] = useState<string | null>(null);
  const openApp = useWindowStore((s) => s.openApp);

  const title = useMemo(() => {
    const map: Record<NavKey, string> = {
      recents: "Recents",
      applications: "Applications",
      downloads: "Downloads",
      desktop: "Desktop",
      documents: "Documents",
      about: "About Me",
      projects: "Projects",
      skills: "Skills",
      resume: "Resume",
      icloud: "iCloud Drive",
      home: USER,
      airdrop: "AirDrop",
      trash: "Trash",
      react: "React",
      node: "Node",
      java: "Java",
      mongodb: "MongoDB",
    };
    return map[nav];
  }, [nav]);

  const path = useMemo(() => {
    if (nav === "desktop") return ["iCloud Drive", "Desktop"];
    if (nav === "documents") return ["iCloud Drive", "Documents"];
    if (nav === "home") return [USER];
    if (nav === "icloud") return ["iCloud Drive"];
    if (nav === "downloads") return [USER, "Downloads"];
    if (nav === "applications") return ["Applications"];
    return [title];
  }, [nav, title]);

  const items = useMemo(() => getItems(nav), [nav]);

  const groups = useMemo(() => {
    const order: FinderItem["group"][] = [
      "Today",
      "Yesterday",
      "Previous 30 Days",
    ];
    return order
      .map((g) => ({
        label: g,
        items: items.filter((i) => i.group === g),
      }))
      .filter((g) => g.items.length > 0);
  }, [items]);

  const openItem = (item: FinderItem) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (item.openApp) openApp(item.openApp);
    if (item.kind === "folder") {
      if (item.id === "projects-folder") setNav("projects");
      if (item.id === "about-folder") setNav("about");
      if (item.id === "skills-folder") setNav("skills");
    }
  };

  return (
    <div className="finder-app flex h-full text-white/[0.92]">
      {/* Sidebar */}
      <aside className="finder-sidebar mac-scroll flex w-[204px] shrink-0 flex-col border-r border-white/[0.06] pt-11">
        <div className="space-y-3.5 px-2 pb-4">
          <Section label="Favorites">
            <SideItem
              active={nav === "recents"}
              onClick={() => setNav("recents")}
              icon={<SFClock className="h-full w-full" />}
              label="Recents"
            />
            <SideItem
              active={nav === "applications"}
              onClick={() => setNav("applications")}
              icon={
                <MacOSAssetIcon
                  name="folder-applications"
                  className="h-full w-full"
                />
              }
              label="Applications"
            />
            <SideItem
              active={nav === "downloads"}
              onClick={() => setNav("downloads")}
              icon={
                <MacOSAssetIcon name="folder-downloads" className="h-full w-full" />
              }
              label="Downloads"
            />
            <SideItem
              active={nav === "desktop"}
              onClick={() => setNav("desktop")}
              icon={
                <MacOSAssetIcon name="folder-desktop" className="h-full w-full" />
              }
              label="Desktop"
              cloud
            />
            <SideItem
              active={nav === "documents"}
              onClick={() => setNav("documents")}
              icon={
                <MacOSAssetIcon name="folder-documents" className="h-full w-full" />
              }
              label="Documents"
              cloud
            />
            <SideItem
              active={nav === "about"}
              onClick={() => setNav("about")}
              icon={<UserAvatar size={20} className="h-full w-full ring-1 ring-black/20" />}
              label="About Me"
            />
            <SideItem
              active={nav === "projects"}
              onClick={() => setNav("projects")}
              icon={<MacOSAssetIcon name="folder" className="h-full w-full" />}
              label="Projects"
            />
            <SideItem
              active={nav === "resume"}
              onClick={() => setNav("resume")}
              icon={<SFPdf className="h-full w-full" />}
              label="Resume"
            />
          </Section>

          <Section label="iCloud">
            <SideItem
              active={nav === "icloud"}
              onClick={() => setNav("icloud")}
              icon={<SFiCloud className="h-full w-full" />}
              label="iCloud Drive"
            />
            <SideItem
              active={nav === "home"}
              onClick={() => setNav("home")}
              icon={<SFHome className="h-full w-full" />}
              label={USER}
            />
            <SideItem
              active={nav === "airdrop"}
              onClick={() => setNav("airdrop")}
              icon={<MacOSAssetIcon name="airdrop" className="h-full w-full" />}
              label="AirDrop"
            />
            <SideItem
              active={nav === "trash"}
              onClick={() => setNav("trash")}
              icon={<MacOSAssetIcon name="trash" className="h-full w-full" />}
              label="Trash"
            />
          </Section>

          <Section label="Tags">
            {(
              [
                ["react", "React", "#FF453A"],
                ["node", "Node", "#FF9F0A"],
                ["java", "Java", "#FFD60A"],
                ["mongodb", "MongoDB", "#30D158"],
              ] as const
            ).map(([key, label, color]) => (
              <SideItem
                key={key}
                active={nav === key}
                onClick={() => setNav(key)}
                icon={
                  <span
                    className="inline-block h-[10px] w-[10px] rounded-full"
                    style={{ background: color }}
                  />
                }
                label={label}
              />
            ))}
          </Section>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#1e1e1e]">
        {/* Toolbar */}
        <div className="relative z-10 flex h-12 shrink-0 items-center gap-1 border-b border-white/[0.06] px-3 pt-0.5">
          <div className="flex items-center gap-0.5 pl-[68px]">
            <ToolIcon label="Back">
              <path
                d="M10 3L4 8l6 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </ToolIcon>
            <ToolIcon label="Forward" dim>
              <path
                d="M6 3l6 5-6 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </ToolIcon>
          </div>

          <div className="pointer-events-none absolute inset-x-0 flex justify-center">
            <span className="finder-title">{title}</span>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <div className="flex overflow-hidden rounded-[7px] bg-white/[0.08] p-[2px]">
              {(
                [
                  ["icons", ViewIconIcons],
                  ["list", ViewIconList],
                  ["columns", ViewIconColumns],
                  ["gallery", ViewIconGallery],
                ] as const
              ).map(([mode, Icon]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setView(mode)}
                  className={`flex h-[22px] w-[28px] cursor-default items-center justify-center rounded-[5px] ${
                    view === mode
                      ? "bg-white/18 text-white"
                      : "text-white/55 hover:text-white/80"
                  }`}
                  aria-label={mode}
                >
                  <Icon />
                </button>
              ))}
            </div>
            <ToolIcon label="Group">
              <path
                d="M3 4h4v4H3zM9 4h4v4H9zM3 10h4v4H3zM9 10h4v4H9z"
                fill="currentColor"
              />
            </ToolIcon>
            <ToolIcon label="Share">
              <path
                d="M8 2v8M5 4.5L8 2l3 2.5M3 8v5a1 1 0 001 1h8a1 1 0 001-1V8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </ToolIcon>
            <ToolIcon label="Tags">
              <path
                d="M2.5 8.5L8 3h4.5V7.5L7.5 13.5a1 1 0 01-1.4 0L2.5 10a1 1 0 010-1.5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <circle cx="10.5" cy="5.5" r="0.9" fill="currentColor" />
            </ToolIcon>
            <ToolIcon label="More">
              <circle cx="4" cy="8" r="1.1" fill="currentColor" />
              <circle cx="8" cy="8" r="1.1" fill="currentColor" />
              <circle cx="12" cy="8" r="1.1" fill="currentColor" />
            </ToolIcon>
            <ToolIcon label="Search">
              <circle
                cx="7"
                cy="7"
                r="3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M9.8 9.8L13 13"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </ToolIcon>
          </div>
        </div>

        {/* Content */}
        <div className="mac-scroll min-h-0 flex-1 px-5 py-3">
          {nav === "about" || nav === "skills" || nav === "resume" ? (
            <DetailPane nav={nav} onOpenApp={openApp} />
          ) : view === "list" ? (
            <ListView
              items={items}
              selected={selected}
              onSelect={setSelected}
              onOpen={openItem}
            />
          ) : (
            <div className="space-y-5">
              {groups.map((group) => (
                <div key={group.label}>
                  <div className="mb-2 flex items-end justify-between">
                    <span className="finder-group-label">{group.label}</span>
                    {group.label === "Previous 30 Days" && (
                      <span className="finder-meta">Show Less</span>
                    )}
                  </div>
                  <div className="mb-3 h-px bg-white/[0.08]" />
                  <div
                    className={`grid gap-x-2 gap-y-5 ${
                      view === "gallery"
                        ? "grid-cols-2 sm:grid-cols-3"
                        : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                    }`}
                  >
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelected(item.id)}
                        onDoubleClick={() => openItem(item)}
                        className={`finder-icon-cell flex cursor-default flex-col items-center rounded-[6px] px-1 py-1.5 text-center ${
                          selected === item.id
                            ? "bg-mac-accent/30"
                            : "hover:bg-white/[0.05]"
                        }`}
                      >
                        <Thumb item={item} large={view === "gallery"} />
                        <div className="mt-1 flex max-w-[100px] items-start justify-center gap-0.5">
                          <span
                            className={`finder-icon-label line-clamp-2 ${
                              selected === item.id
                                ? "rounded-[3px] bg-mac-accent px-[5px] py-px text-white"
                                : "text-white/[0.88]"
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.cloud && (
                            <SFCloudBadge className="mt-0.5 h-2.5 w-3 shrink-0 text-white/45" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="flex h-40 items-center justify-center text-white/35">
                  No items to show
                </div>
              )}
            </div>
          )}
        </div>

        {/* Path bar */}
        <div className="finder-pathbar flex h-[26px] shrink-0 items-center gap-1.5 border-t border-white/[0.06] bg-[#2a2a2c]/90 px-3 text-white/55">
          {path.map((seg, i) => (
            <span key={`${seg}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-white/25">›</span>}
              {i === 0 && path[0] === "iCloud Drive" ? (
                <SFCloudBadge className="h-2.5 w-3.5 text-white/55" />
              ) : (
                <SFFolder className="h-3 w-3" color="#5AC8FA" />
              )}
              <span
                className={`finder-path-seg ${
                  i === path.length - 1 ? "text-white/80" : ""
                }`}
              >
                {seg}
              </span>
            </span>
          ))}
          <span className="finder-meta ml-auto tabular-nums">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </div>
  );
}

function getItems(nav: NavKey): FinderItem[] {
  if (nav === "desktop" || nav === "recents") {
    return [
      {
        id: "resume",
        name: "Resume.pdf",
        kind: "pdf",
        group: "Today",
        cloud: true,
        openApp: "preview",
      },
      {
        id: "macfolio",
        name: "Macfolio",
        kind: "folder",
        group: "Today",
        color: "#64d2ff",
        openApp: "projects",
      },
      {
        id: "potato",
        name: "Potato Bazaar",
        kind: "folder",
        group: "Today",
        color: "#30d158",
        openApp: "projects",
      },
      {
        id: "tybee",
        name: "Tybee Go",
        kind: "folder",
        group: "Yesterday",
        color: "#0a84ff",
        openApp: "projects",
      },
      {
        id: "findanio",
        name: "Findanio",
        kind: "folder",
        group: "Yesterday",
        color: "#bf5af2",
        openApp: "projects",
      },
      {
        id: "nexus",
        name: "Nexus",
        kind: "folder",
        group: "Previous 30 Days",
        color: "#ff9f0a",
        openApp: "projects",
      },
      {
        id: "shot-1",
        name: "Screenshot Portfolio",
        kind: "image",
        group: "Yesterday",
        cloud: true,
        openApp: "photos",
      },
      {
        id: "skills-folder",
        name: "Skills",
        kind: "folder",
        group: "Previous 30 Days",
      },
      {
        id: "about-folder",
        name: "About Me",
        kind: "folder",
        group: "Previous 30 Days",
      },
      {
        id: "projects-folder",
        name: "Projects",
        kind: "folder",
        group: "Previous 30 Days",
        color: "#64d2ff",
      },
    ];
  }

  if (nav === "projects") {
    return content.projects.map((p, i) => ({
      id: p.id,
      name: p.name,
      kind: "folder" as const,
      group: (i === 0 ? "Today" : i === 1 ? "Yesterday" : "Previous 30 Days") as FinderItem["group"],
      openApp: "projects" as AppId,
      color: ["#30d158", "#0a84ff", "#bf5af2"][i % 3],
    }));
  }

  if (nav === "applications") {
    return [
      { id: "a-finder", name: "Finder", kind: "app", group: "Today", openApp: "finder" },
      { id: "a-safari", name: "Safari", kind: "app", group: "Today", openApp: "safari" },
      { id: "a-msg", name: "Messages", kind: "app", group: "Today", openApp: "messages" },
      { id: "a-term", name: "Terminal", kind: "app", group: "Yesterday", openApp: "terminal" },
      { id: "a-code", name: "VS Code", kind: "app", group: "Yesterday", openApp: "vscode" },
      { id: "a-projects", name: "Projects", kind: "app", group: "Today", openApp: "projects" },
      { id: "a-set", name: "System Settings", kind: "app", group: "Previous 30 Days", openApp: "settings" },
    ];
  }

  if (nav === "downloads") {
    return [
      {
        id: "dl-resume",
        name: "Kush_Gangwal_Resume.pdf",
        kind: "pdf",
        group: "Today",
        openApp: "preview",
      },
    ];
  }

  if (nav === "documents") {
    return [
      {
        id: "doc-resume",
        name: "Resume.pdf",
        kind: "pdf",
        group: "Today",
        cloud: true,
        openApp: "preview",
      },
      {
        id: "doc-bio",
        name: "About.txt",
        kind: "file",
        group: "Yesterday",
        cloud: true,
      },
    ];
  }

  if (nav === "icloud" || nav === "home") {
    return [
      { id: "f-desktop", name: "Desktop", kind: "folder", group: "Today", cloud: true },
      { id: "f-docs", name: "Documents", kind: "folder", group: "Today", cloud: true },
      { id: "f-dl", name: "Downloads", kind: "folder", group: "Yesterday" },
      { id: "f-proj", name: "Projects", kind: "folder", group: "Previous 30 Days" },
    ];
  }

  if (nav === "trash" || nav === "airdrop") return [];

  const tagProjects = content.projects.filter((p) => {
    if (nav === "react") return p.tech.some((t) => /react|next/i.test(t));
    if (nav === "node") return p.tech.some((t) => /node|express/i.test(t));
    if (nav === "java") return true;
    if (nav === "mongodb") return p.tech.some((t) => /mongo/i.test(t));
    return false;
  });

  return tagProjects.map((p, i) => ({
    id: `tag-${p.id}`,
    name: p.name,
    kind: "folder" as const,
    group: (i === 0 ? "Today" : "Previous 30 Days") as FinderItem["group"],
    openApp: "projects" as AppId,
  }));
}

function DetailPane({
  nav,
  onOpenApp,
}: {
  nav: NavKey;
  onOpenApp: (id: AppId) => void;
}) {
  if (nav === "about") {
    return (
      <div className="max-w-xl space-y-4 pt-2">
        <h2 className="flex items-center gap-4 text-2xl font-semibold tracking-tight">
          <UserAvatar
            size={64}
            className="ring-1 ring-white/15 shadow-md"
          />
          <span>{content.about.name}</span>
        </h2>
        <p className="text-[15px] text-white/65">{content.about.role}</p>
        <p className="leading-relaxed text-white/80">{content.about.bio}</p>
        <div className="grid grid-cols-2 gap-3">
          <InfoTile label="Location" value={content.about.location} />
          <InfoTile label="Email" value={content.about.email} />
          <InfoTile label="Phone" value={content.about.phone} />
          <InfoTile
            label="Education"
            value={`${content.about.education.school} · ${content.about.education.cgpa} CGPA`}
          />
        </div>
      </div>
    );
  }

  if (nav === "skills") {
    return (
      <div className="space-y-5 pt-2">
        {(
          [
            ["Languages", content.skills.languages],
            ["Frontend", content.skills.frontend],
            ["Mobile", content.skills.mobile],
            ["Backend", content.skills.backend],
            ["Databases", content.skills.databases],
            ["Cloud", content.skills.cloud],
            ["Tools", content.skills.tools],
          ] as const
        ).map(([label, list]) => (
          <div key={label}>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
              {label}
            </div>
            <div className="flex flex-wrap gap-2">
              {list.map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-white/10 px-2.5 py-1 text-[12px]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-4 pt-2">
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
        <FinderPdfIcon className="mb-3 h-16 w-12" />
        <div className="finder-body font-medium text-white/90">{content.about.name}</div>
        <p className="finder-meta mt-1">{content.about.role}</p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onOpenApp("preview")}
            className="finder-body cursor-default rounded-md bg-mac-accent px-3 py-1.5 font-medium text-white"
          >
            Open in Preview
          </button>
          <a
            href={content.about.links.resume}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-white/10 px-3 py-1.5 text-[12px]"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}

function ListView({
  items,
  selected,
  onSelect,
  onOpen,
}: {
  items: FinderItem[];
  selected: string | null;
  onSelect: (id: string) => void;
  onOpen: (item: FinderItem) => void;
}) {
  return (
    <div className="pt-1">
      <div className="mb-1 grid grid-cols-[1fr_120px_100px] gap-2 border-b border-white/10 px-2 pb-1 finder-section-label">
        <span>Name</span>
        <span>Kind</span>
        <span>Date</span>
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          onDoubleClick={() => onOpen(item)}
          className={`finder-side-label grid w-full cursor-default grid-cols-[1fr_120px_100px] gap-2 rounded-[5px] px-2 py-[5px] text-left ${
            selected === item.id ? "bg-mac-accent" : "hover:bg-white/[0.06]"
          }`}
        >
          <span className="flex items-center gap-2 truncate">
            <Thumb item={item} tiny />
            {item.name}
          </span>
          <span className="text-white/55 capitalize">{item.kind}</span>
          <span className="text-white/45">{item.group}</span>
        </button>
      ))}
    </div>
  );
}


function Thumb({
  item,
  large,
  tiny,
}: {
  item: FinderItem;
  large?: boolean;
  tiny?: boolean;
}) {
  const folderId = useOSStore((s) => s.preferences.folderColor);
  const folderColor = folderSpec(folderId).hex;
  if (tiny) {
    if (item.kind === "folder")
      return <SFFolder className="h-4 w-4" color={folderColor} />;
    if (item.kind === "pdf") return <SFPdf className="h-4 w-4" />;
    if (item.kind === "image")
      return (
        <span className="inline-block h-4 w-4 rounded-[3px] bg-gradient-to-br from-purple-500 to-orange-400" />
      );
    return (
      <span className="inline-block h-4 w-3.5 rounded-[2px] bg-white/90" />
    );
  }

  if (item.kind === "folder") {
    return (
      <FinderFolderIcon
        color={folderColor}
        className={large ? "h-[100px] w-[118px]" : "h-[64px] w-[76px]"}
      />
    );
  }

  if (item.kind === "pdf") {
    return (
      <FinderPdfIcon
        className={large ? "h-[108px] w-[86px]" : "h-[68px] w-[54px]"}
      />
    );
  }

  if (item.kind === "image") {
    return (
      <FinderImageIcon
        className={large ? "h-[100px] w-[118px]" : "h-[64px] w-[76px]"}
      />
    );
  }

  if (item.kind === "app") {
    return (
      <div
        className={`${large ? "h-20 w-20" : "h-14 w-14"} rounded-[22%]`}
        style={{
          background: "linear-gradient(160deg,#5ac8fa,#007aff)",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
        }}
      />
    );
  }

  return (
    <div
      className={`${large ? "h-[100px] w-[80px]" : "h-[64px] w-[52px]"} rounded-[3px] border border-white/15 bg-white shadow-md`}
    />
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="finder-section-label px-2">{label}</div>
      <div className="mt-0.5 space-y-px">{children}</div>
    </div>
  );
}

function SideItem({
  active,
  onClick,
  icon,
  label,
  cloud,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  cloud?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`finder-side-item flex w-full cursor-default items-center gap-[7px] rounded-[5px] px-[7px] py-[3px] text-left ${
        active
          ? "bg-white/[0.14] text-white"
          : "text-white/[0.82] hover:bg-white/[0.07]"
      }`}
    >
      <span className="sidebar-glyph flex shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="finder-side-label min-w-0 flex-1 truncate">{label}</span>
      {cloud && <SFCloudBadge className="h-2.5 w-3 shrink-0 text-white/40" />}
    </button>
  );
}

function ToolIcon({
  children,
  label,
  dim,
}: {
  children: React.ReactNode;
  label: string;
  dim?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex h-7 w-7 cursor-default items-center justify-center rounded-[6px] hover:bg-white/10 ${
        dim ? "text-white/25" : "text-white/70"
      }`}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
        {children}
      </svg>
    </button>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <div className="finder-meta">{label}</div>
      <div className="finder-body mt-0.5 font-medium text-white/90">{value}</div>
    </div>
  );
}

function ViewIconIcons() {
  return (
    <svg viewBox="0 0 14 14" className="h-3 w-3">
      <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" />
    </svg>
  );
}
function ViewIconList() {
  return (
    <svg viewBox="0 0 14 14" className="h-3 w-3">
      <path
        d="M1 3h12M1 7h12M1 11h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ViewIconColumns() {
  return (
    <svg viewBox="0 0 14 14" className="h-3 w-3">
      <rect x="1" y="1" width="3.5" height="12" rx="0.8" fill="currentColor" />
      <rect
        x="5.25"
        y="1"
        width="3.5"
        height="12"
        rx="0.8"
        fill="currentColor"
        opacity="0.7"
      />
      <rect
        x="9.5"
        y="1"
        width="3.5"
        height="12"
        rx="0.8"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  );
}
function ViewIconGallery() {
  return (
    <svg viewBox="0 0 14 14" className="h-3 w-3">
      <rect
        x="1"
        y="2"
        width="12"
        height="10"
        rx="1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="5" cy="6" r="1.2" fill="currentColor" />
      <path
        d="M1 10l3.5-3 2.5 2 2-1.5L13 10"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}
