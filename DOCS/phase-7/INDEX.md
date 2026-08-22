# Phase 7: Real-Time Admin Dashboard

**Project:** QRS Marketing Website  
**Status:** In Progress  
**Start Date:** 2026-08-22  
**Architecture Reference:** `ARCHITECTURE.md`, `DESIGN.md`, `QRS_SOC2_Checklist_Phase2.md`

---

## Overview

Phase 7 transforms the QRS admin panel from a collection of mock components into a **real-time, role-aware content operations console**. Every screen is live, every change propagates under 1 second, and every action is auditable.

**Phase 7 is 13 sub-phases.** Each is independently verifiable and independently valuable. Commit after every phase so rollback is always safe.

---

## Delivery Status

| Phase | Deliverable | Status | Doc |
|---|---|---|---|
| 1 | Real Auth: cookie sessions, Payload user verification, audit logs | ✅ COMPLETE | [PHASE-1-REAL-AUTH.md](PHASE-1-REAL-AUTH.md) |
| 2 | Admin Shell: sidebar, topbar, command palette, role-based nav | ⏳ Next | [PHASE-2-ADMIN-SHELL.md](PHASE-2-ADMIN-SHELL.md) |
| 3 | Component Primitives: DataTable, KPI, Toast, all 7 states | ⏳ Planned | PHASE-3-PRIMITIVES.md |
| 4 | Real-time Infrastructure: SSE, LISTEN/NOTIFY, RealtimeProvider | ⏳ Planned | PHASE-4-REALTIME.md |
| 5 | Collection List Views: live updates, presence, optimistic UI | ⏳ Planned | PHASE-5-COLLECTIONS.md |
| 6 | Page Editor: 3-pane layout, autosave, versions, live preview | ⏳ Planned | PHASE-6-PAGE-EDITOR.md |
| 7 | Publish & Propagation: pre-flight, revalidate, confirm shipping | ⏳ Planned | PHASE-7-PUBLISH.md |
| 8 | Presence & Locking: soft locks, conflict resolution, typing | ⏳ Planned | PHASE-8-PRESENCE.md |
| 9 | Submissions Inbox: live triage, assignment, export | ⏳ Planned | PHASE-9-INBOX.md |
| 10 | Media Library: alt-text gating, focal point, usage tracking | ⏳ Planned | PHASE-10-MEDIA.md |
| 11 | Users & Settings: role management, integrations, maintenance | ⏳ Planned | PHASE-11-USERS.md |
| 12 | Audit Logs: live streaming, export, zero-delete | ⏳ Planned | PHASE-12-LOGS.md |
| 13 | Accessibility & Performance: Lighthouse 95, responsive, WCAG AA | ⏳ Planned | PHASE-13-POLISH.md |

---

## Running Phase 7

Start the dev server:

```bash
npm run dev
```

This launches Next.js on port 3000 with Payload CMS integrated.

### Verify Phase 1

1. Open http://localhost:3000/login
2. Payload seed users should be available (check `/admin` in Payload CMS sidebar, or query the Users collection)
3. Log in with an existing Payload user email + password
4. You should land on `/admin/dashboard` with your name and role in the topbar
5. Click logout button (top right)
6. You should be redirected to `/login`
7. Check browser DevTools → Application → Cookies → `payload-session` should be httpOnly

---

## Key Dates & Gates

- **Week of Aug 26:** Phase 1–3 ship (auth, shell, primitives)
- **Week of Sep 2:** Phase 4–6 ship (real-time, editor, publish)
- **Week of Sep 9:** Phase 7–9 ship (presence, inbox, media)
- **Week of Sep 16:** Phase 10–13 ship (settings, logs, polish)

Gate: All acceptance criteria in each phase must pass before shipping to production.

---

## Architecture Decisions

### Single Port (3000)

Both Next.js frontend and Payload CMS run on port 3000. `/api/payload/*` routes proxy to Payload endpoints.

### SSE over WebSocket

Real-time uses Server-Sent Events (SSE) on a single long-lived connection, not WebSockets. Rationale: Vercel edge runtime support, simpler CSP, no new server process, native `EventSource` client.

### PostgreSQL LISTEN/NOTIFY

The SSE route subscribes to `NOTIFY` events fired by Payload hooks. Fallback: 5-second polling if LISTEN unavailable.

### Role-Based Navigation

The sidebar renders only items the current user's role can access. Items are not disabled, they're omitted from the DOM entirely.

### Optimistic Updates

Every user action that modifies data updates the UI instantly before the server responds. On failure, the UI rolls back and shows a specific error message.

---

## Testing Strategy

Each phase includes a testing section in its documentation. Tests fall into three categories:

1. **Manual smoke tests:** Can the user do the thing? (acceptance criteria checklist)
2. **Playwright E2E tests:** Do multi-step flows work? (test files in `tests/e2e`)
3. **Lighthouse:** Is it accessible and fast? (Lighthouse budget in `next.config.js`)

All three must pass before phase completion.

---

## Rollback Plan

Each phase is a single commit with migrations. If a phase breaks production:

```bash
git revert HEAD
npm run db:migrate:rollback
npm run deploy
```

No data is lost. The commit message includes every changed file.

---

## Questions?

- **Auth issue?** See [PHASE-1-REAL-AUTH.md](PHASE-1-REAL-AUTH.md) → "Known Limitations" and "Migration Notes"
- **Real-time not working?** See PHASE-4-REALTIME.md (not yet written)
- **Performance question?** Check Lighthouse in the phase's acceptance criteria

---

## References

- **PRD:** `QRS-PHASE-7-PRD.md` (pasted into Claude Code at start of phase)
- **Design System:** `DESIGN.md` (colors, fonts, icons, density)
- **Architecture:** `ARCHITECTURE.md` (current system state)
- **SOC 2:** `QRS_SOC2_Checklist_Phase2.md` (compliance gates)
