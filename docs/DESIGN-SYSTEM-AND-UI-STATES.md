# EXAM JUNCTION — Design System and UI States
Status: Phase 2 — design specification. Preserve the approved Step 1–53 experience; no visual rewrite without a demonstrated need.

## Design principles
- Mobile-first, simple and fast on Android; one shared batch viewer, not separate pages per batch.
- Preserve EXAM JUNCTION navy/white identity, existing bottom navigation and familiar card layout.
- Prioritize readability, low-bandwidth behavior, clear status, and large touch targets.
- Do not add new learning modules or change navigation scope.
- Use existing shared CSS where practical; page-specific styles are migrated only when safe and separately tested.

## Tokens (align, do not force a wholesale restyle)
- Primary/navy: #173b73; deep navy: #10274c.
- Background: #f5f7fb; surface: #ffffff.
- Main text: #17243a; muted text: #718096; border: #e6ebf2.
- Accent/warning: existing yellow/orange; success green; error red.
- Cards: 14–18px radius, subtle border, restrained shadow.
- Layout: mobile content width currently around 760px; maintain single-column mobile layouts and prevent horizontal overflow.
- Typography: system/Arial fallback; clear hierarchy; no tiny admin labels.

## Existing navigation to preserve
Student fixed bottom navigation: Home/Courses, Books, Notifications, Leaderboard, Profile. Batch viewing and My Batches remain reachable through existing flows. Admin navigation remains the approved sections: Dashboard, Batches, Books & Notes, Chapters, Lectures, Notifications, Student Access, Settings.

## Key screen structure
1. Home: existing banners first, then Explore Courses/Batches, search, batch cards, fixed bottom navigation.
2. Batch card: original-ratio thumbnail without unintended crop; batch name, teacher, Free/Selected badge and View Batch. Description/counts only when enabled by Admin.
3. Batch detail: Batch Information → announcements/notifications when present → Chapter List. Counts reflect published content visible to that visitor. Keep contextual chapter/lecture search and current access states.
4. Chapter/lecture: expandable chapters; visible chapter notes; lecture rows with title, Watch and only permitted Download; lecture notes under the correct lecture.
5. Access states: unauthorized restricted batch shows basic info and Login to Access / Request Access / Request Pending; never reveal restricted lecture titles, private URLs or notes.
6. Player states: idle, loading, playing, switching source, playback error, permitted Open Original Link. Switching lectures must stop/pause and unload the previous source. Avoid duplicate player controls or a permanent spinner.
7. Lists: initial loading, loaded list, Load More/next page when more rows exist, true empty state, recoverable error with Retry. Keep the existing approved empty-state Hindi text where already specified.
8. Admin: keep current page structure and forms. Improve only proven visibility, validation, pagination, tap targets and error diagnostics; do not re-theme the 188KB admin file.
9. Forms: clear field labels, related chapter/lecture dropdowns, visible Save/Update/Cancel, disable duplicate submission while saving, show confirmed success only after database response.
10. Diagnostics: student sees short nontechnical message; admin sees safe error detail and affected operation, without secrets.

## Responsive and accessibility checks
- Phone width 320–430px: no horizontal page overflow; actions remain tappable; forms and dropdowns fit viewport.
- Tablet/desktop: retain centered content and sensible max width.
- Focus/keyboard states remain visible; buttons have text or accessible labels.
- Loading/empty/error states are distinguishable without color alone.
- Images reserve their aspect ratio to reduce layout shifts.
- Avoid autoplay with sound; when switching videos, pause and unload the previous player.

## Design acceptance checklist
- No navigation changes.
- Existing navy/white identity remains recognizable.
- No unintended thumbnail cropping.
- No new cards/sections unless required by the approved plan.
- Search and pagination states are clear and touch-friendly.
- Restricted content never appears in unauthorized UI states.
- Player fallback remains one coherent student experience.
- Existing pages and Admin workflows remain intact.
