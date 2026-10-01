"use client";

import dynamic from "next/dynamic";
import type { AppId } from "@/types";

const FinderApp = dynamic(() => import("./FinderApp").then((m) => m.FinderApp));
const TerminalApp = dynamic(() => import("./TerminalApp").then((m) => m.TerminalApp));
const SettingsApp = dynamic(() => import("./SettingsApp").then((m) => m.SettingsApp));
const ProjectsApp = dynamic(() => import("./ProjectsApp").then((m) => m.ProjectsApp));
const MessagesApp = dynamic(() => import("./MessagesApp").then((m) => m.MessagesApp));
const SafariApp = dynamic(() => import("./SafariApp").then((m) => m.SafariApp));
const PhotosApp = dynamic(() => import("./PhotosApp").then((m) => m.PhotosApp));
const NotesApp = dynamic(() => import("./NotesApp").then((m) => m.NotesApp));
const ActivityMonitorApp = dynamic(() =>
  import("./ActivityMonitorApp").then((m) => m.ActivityMonitorApp),
);
const TrashApp = dynamic(() => import("./TrashApp").then((m) => m.TrashApp));
const PreviewApp = dynamic(() => import("./PreviewApp").then((m) => m.PreviewApp));
const AssistantApp = dynamic(() => import("./AssistantApp").then((m) => m.AssistantApp));
const ProjectShowcaseApp = dynamic(() =>
  import("./ProjectShowcaseApp").then((m) => m.ProjectShowcaseApp),
);

export function AppContent({
  appId,
}: {
  appId: AppId;
  windowId: string;
}) {
  switch (appId) {
    case "finder":
      return <FinderApp />;
    case "terminal":
      return <TerminalApp />;
    case "settings":
      return <SettingsApp />;
    case "vscode":
      return <ProjectsApp />;
    case "projects":
      return <ProjectShowcaseApp />;
    case "messages":
      return <MessagesApp />;
    case "safari":
      return <SafariApp />;
    case "photos":
      return <PhotosApp />;
    case "notes":
      return <NotesApp />;
    case "activity":
      return <ActivityMonitorApp />;
    case "preview":
      return <PreviewApp />;
    case "assistant":
      return <AssistantApp />;
    case "trash":
      return <TrashApp />;
    default:
      return (
        <div className="flex h-full items-center justify-center text-white/50">
          App unavailable
        </div>
      );
  }
}
