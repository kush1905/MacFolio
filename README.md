# Portfolio OS

A macOS-style developer portfolio that boots, unlocks, and runs apps in the browser.

## Stack

- Next.js + TypeScript + Tailwind CSS
- Framer Motion
- Zustand (+ localStorage persistence)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Portfolio content

Edit placeholder JSON in `/content`:

- `about.json`
- `projects.json`
- `skills.json`
- `experience.json`
- `stats.json`
- `photos.json`

## Shortcuts

| Shortcut | Action |
| --- | --- |
| Enter / click | Unlock from lock screen |
| ⌘K or ⌘Space | Spotlight |
| Esc | Close Spotlight / Launchpad |
| Double-click desktop icons | Open apps |

## Phase roadmap

1. ✅ Boot, Lock, Desktop, Dock, Window Manager, Finder + core apps
2. Polish Photos / Projects / Terminal / Safari / Messages
3. Backend persistence (Express + Postgres) for settings, messages, analytics
4. Sound, deeper animations, multi-window per app
