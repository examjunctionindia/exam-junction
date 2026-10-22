# EXAM JUNCTION — Scale-Ready Structure Blueprint
Status: Phase 1 — structure planning. This document is not a claim of production readiness.
Baseline: preserve the approved Step 1–53 behavior and the Final Master Admin Plan V1.1 addendum.

## Goals
- Keep the existing GitHub Pages website and current student/admin workflows working.
- Prepare for 1,000 simultaneous active students and 10,000+ lecture records through measured, incremental improvements.
- Do not delete content, data, tables, policies, pages, or features to simplify implementation.
- No new paid service or plan upgrade without owner approval.
- A technical change is complete only after a reproducible verification; device-only tests are marked blocked until the owner runs them.

## Existing product structure (keep)
### Student-facing pages
- `index.html`: home, banners, published batches, batch search, fixed bottom navigation.
- `batch.html` / `batch-detail.html`: batch discovery and shared batch viewer; chapter list, lecture list, chapter notes, lecture notes, announcements, contextual search, player and permitted original-link fallback.
- `my-batches.html`: student's requested/approved batches.
- `books.html`: books/notes catalogue and book access requests.
- `notifications.html`: student notifications.
- `leaderboard.html`: leaderboard.
- `profile.html`: profile and account actions.
- `login.html`: registration, login, password reset, and return-to-requested-page behavior.
- `about.html`: static information.
### Admin
- `admin.html`: existing admin management system. Keep its approved sections and mobile-first workflow; do not rewrite it wholesale.
### Shared assets
- `assets/css/style.css`: shared responsive styling.
- `assets/js/common.js`: shared Supabase initialization and common data helpers.
- Existing configuration and page-specific code remain in place until dependency audit proves a targeted change safe.
### Backend
- Supabase Auth identifies users; PostgreSQL stores content/access; RLS is the authorization boundary; Supabase Storage uses bucket policies. GitHub Pages serves static frontend assets only.
- External video hosts/CDNs deliver video bytes. Database concurrency improvements cannot compensate for a video host's limits, poor CORS/range support, or expired/restricted links.

## Required content relationships
Batch → Chapters → Lectures.
Chapter → Chapter Notes.
Lecture → Lecture Notes.
Student ↔ Batch access/request records.
Student ↔ Book access/request records.
Every query must preserve these relationships and the current published/free/selected-student rules.

## Target request/data flow
1. Page starts with a bounded first page and a clear loading state.
2. Supabase Auth session is read only where needed; no service-role key or secret in browser code.
3. List queries select only needed columns, filter on the server, order deterministically, and use cursor/range pagination.
4. Batch/chapter/lecture lists load only the current context; avoid one database request per row (N+1 pattern) where a safe grouped query can be used.
5. RLS enforces access independently of UI visibility. Selected-student content and private files must not become public through URL hiding alone.
6. Video player tries the supported in-site playback path, uses a short bounded fallback strategy, stops previous sources/audio when switching lectures, and offers Open Original Link only when permitted.
7. Errors are logged safely for admins; students see simple actionable language. Never log tokens, passwords, or private signed URLs.

## Scale constraints and engineering rules
- Never replace a 100-row cap with an unbounded 10,000-row download. Use pagination and server-side filtering/search.
- Avoid repeated full-catalog reads and duplicate requests on each render.
- Use database indexes based on actual filters, joins, ordering, and measured query plans; do not drop indexes solely because an advisor labels them unused.
- Use cache only for public/published data and invalidate after admin changes; do not cache personalized access decisions across users.
- Do not store restricted content in a publicly readable bucket. Verify object policies and signed URL behavior before asserting revocation blocks access to previously issued URLs.
- External video bandwidth and concurrency must be tested with each host. 1,000 accounts is not the same as 1,000 concurrent viewers.
- Keep free/low-cost constraints visible; do not enable paid upgrades without explicit approval.

## Delivery phases
### Phase 1 — Structure (current)
Document current pages, dependencies, data relationships, trust boundaries, risks and verification order. No student-facing redesign or application-code changes in this phase.
### Phase 2 — Design
Define one consistent visual system that preserves the current navy/white brand, mobile-first cards, fixed bottom navigation, current batch-card behavior, and admin's existing layout. Design only targeted states: loading, empty, error, pagination/load-more, access denied/pending, player fallback, and diagnostics. No feature removal or new navigation.
### Phase 3 — Implementation
Create a scoped branch/PR. Fix high-risk bugs and scalability bottlenecks in small, reviewable changes. Do not bundle unrelated database-policy changes into frontend edits.
### Phase 4 — Verification
Run syntax/static checks, query/policy review, and regression checks. Record each acceptance test as PASS, FAIL, or BLOCKED. Test 1,000 concurrent users only with a controlled load test and verified service quotas; never infer capacity from code review alone.

## Known issues to verify before implementation
- Shared helper `getPublishedBatches()` and `getPublishedBooks()` currently apply `.limit(100)`; caller behavior must be audited before adding pagination.
- The batch viewer has inline playback/fallback logic and a prior reported background-audio/spinner failure; inspect the full state transitions before editing.
- Admin page is large and has existing form workflows; avoid whole-file rewrites.
- Supabase advisor currently reports security-definer execution warnings, leaked-password protection disabled, four RLS init-plan performance warnings, duplicate indexes and multiple permissive update policies. Do not blindly revoke function permissions or drop indexes; inspect exact function/policy definitions and dependencies first.
- Existing student tests 22.1–22.8 and 22.10 were previously reported PASS by the owner; 22.9 (return to originally requested page after login) remains unconfirmed. These are historical reports, not a fresh regression run.

## Acceptance gate
No claim of scale readiness until:
- The 100-record catalogue truncation is resolved with pagination or a suitable bounded UX.
- Large batch/chapter/lecture lists are paginated or loaded contextually.
- RLS and private storage access are verified for free, approved, unapproved and revoked users.
- Player source switching cannot leave background audio or indefinite loading.
- Query plans/indexes and service quotas are reviewed.
- A repeatable load test is run against the actual backend/video path.
- The approved Step 1–53 regression checklist is recorded with PASS/FAIL/BLOCKED results.
