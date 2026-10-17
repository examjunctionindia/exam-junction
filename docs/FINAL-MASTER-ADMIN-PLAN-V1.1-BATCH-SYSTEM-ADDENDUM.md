# EXAM JUNCTION — Final Master Admin Plan V1.1
## Batch System & Admin Management Addendum

**Status:** Approved plan addendum  
**Applies to:** Existing Final Master Admin Plan V1.0  
**Repository:** `examjunctionindia/exam-junction`  
**Branch:** `main`

> This file supplements the existing V1.0 plan; it does not replace or remove its approved requirements. It is a planning/specification change, not a claim that every feature is already implemented or functionally verified.

## 1. Goals and no-repeat rule

Make the existing Admin Panel's Batch System and all related Management sections reliable on mobile and desktop. Fix root causes instead of repeatedly layering patches. Preserve the current UI and working features unless a change is necessary and approved. Audit existing code, database schema, relationships, and policies before making structural changes.

- No unapproved Supabase changes.
- Do not delete/remove data, files, tables, columns, policies, or existing features as a shortcut.
- Do not report success unless the database confirms the operation.
- Do not claim a feature is fixed until its real workflow is functionally tested.
- Prefer shared, maintainable functions and regression tests over repeated one-off code patches.

## 2. Dashboard and current error visibility

Display real database counts/status for batches, books, chapters, lectures, notifications, drafts, and published content where supported by the existing schema. Show loading state, database connection status, current runtime/operation errors, the affected section, and whether an error is pending or resolved when that state can be determined.

Do not add permanent error-history storage merely for display. Show safe, detailed diagnostics to Admins; students receive simple, non-technical messages. Never expose passwords, service-role keys, tokens, or other secrets.

## 3. Batch Management

### Fields (use existing schema)
- Batch name, teacher, description.
- Thumbnail/image.
- Free or selected-student access.
- Draft/published status.
- Display position and available date/metadata fields.

### Operations
- Add, view, edit, update, preview, publish/unpublish, draft, reorder, search, filter, and delete with confirmation.
- Edit must open and reveal the correct form; updating must modify the existing record rather than insert a duplicate.
- Confirm saved/deleted records from database responses; handle zero-row results as unconfirmed, not successful.

### Thumbnail picker and cards
- Provide a website gallery picker that can use images originating from the phone gallery.
- Show preview and allow replacing an image.
- Render the thumbnail correctly in the Batch Card with responsive sizing and appropriate object-fit/cropping so it is not unintentionally cut off.
- Changing a thumbnail must not alter unrelated batch content.

## 4. Chapter Management

Support adding, listing, editing, updating, searching/filtering, ordering, and deleting chapters with confirmation. Each chapter must be associated with the correct batch. Validate required fields and relationships. Avoid duplicate records on update. Before any destructive action, inspect dependent lectures/notes and existing foreign-key behaviour; do not silently cascade-delete content.

## 5. Lecture Management

Support add, list, edit, update, ordering, search/filter by batch and chapter, publish state where supported, and delete with confirmation. Fields include title, batch, chapter, lecture URL, and display position according to the existing schema.

Support YouTube and permitted external HTTPS lecture links, including external MP4 sources. Validate URLs and handle unsupported embedding or server restrictions with a clear Open Link fallback instead of an endless spinner. Student playback should provide Watch and, where technically and legally supported, Download actions. Watch should support fullscreen where the playback method permits it.

## 6. Chapter Notes Management

Manage chapter-level notes independently of lecture-level notes. Support add, list, edit, update, link validation, and confirmed deletion where available. Associate notes with the correct chapter. Existing Google Drive or external PDF links may be used. Supabase Storage is only considered configured when its bucket, upload flow, and access policies have actually been set up and tested.

## 7. Lecture Notes Management

Manage notes independently for each lecture. Required workflow:

1. Open Lecture Notes Management.
2. Press Add Lecture Notes.
3. Select a chapter.
4. Select a lecture belonging to that chapter.
5. Enable/add notes and enter a title and supported PDF/notes URL.
6. Save and verify the database result.

The Add Lecture Notes action must first reveal the section containing the form and only then scroll to it. Reset stale edit state when opening a new form. Chapter changes must refresh the lecture dropdown. Editing must load the correct existing record and update it rather than create a duplicate. Chapter Notes and Lecture Notes must not require one another to exist.

## 8. Student Access Management

Provide student search by name/email where available, batch selection, current access status, grant and revoke actions, and clear confirmation. Enforce authorization through the actual database/storage policies, not just hidden UI controls. Published free content follows the existing public access rules; selected-student content is available only to authorized signed-in students. Revoke access must stop subsequent access through supported protected resources. Do not expose restricted original PDF/video links to unauthorized users.

## 9. Batch Access Requests

If the request workflow and its database structures exist, show pending/approved/rejected requests and support approve/reject actions. Approval is successful only after the associated access permission is confirmed. Changing a request label alone is not proof that access was granted. Do not invent a new schema without audit and explicit approval.

## 10. Books & Notes Management

Preserve existing Books & Notes functionality. Where supported, provide add, view, edit, update, search/filter, publish/draft, access level, title, author/teacher, description, cover, and PDF/external URL. Validate links and confirm actual database writes. Book access may be independently assigned where the current data model permits it.

## 11. Banner Management

Preserve add/view/edit/update/publish and preview features supported by the current schema. Validate image and destination URLs. Banner type options must match actual database-supported values; do not present options that cause database constraint errors. Image handling must not break batch thumbnails.

## 12. Notifications Management

Preserve add, view, edit, update, publish/unpublish, title/message/link validation, and search/list features where present. Confirm database operations and show clear permission/validation errors.

## 13. Student Problem Reports

If reports/replies are already configured, allow Admin to inspect report category, description, status and available attachment; reply and update status where supported. Confirm writes against the database. Do not claim this feature is active if its required table or policy is absent.

## 14. Shared CRUD, validation and navigation

All applicable management sections must consistently handle:
- Add, list/view, edit, update, and delete confirmation.
- Search/filter, loading, empty, success, and error states.
- Required-field, URL, relationship, and access validation.
- Correct section navigation and visibility before focusing/scrolling to a form.
- Mobile tap targets and responsive layouts.
- Duplicate-submit protection and no duplicate inserts during updates.
- Safe, actionable Admin diagnostics and simple student-facing messages.

Use existing columns and table relationships. Do not invent fields or assume a table exists. If schema/policy prevents an operation, report the exact safe diagnostic and stop rather than silently changing Supabase.

## 15. Security and change-control requirements

Before schema or policy work, inspect existing tables, columns, foreign keys, grants, and RLS policies. No destructive database changes. Supabase changes require explicit approval and must not be bundled into a frontend fix without consent. GitHub edits must be scoped, syntax-checked, and regression-tested. Preserve working design and features.

## 16. Functional acceptance checklist

A feature is complete only after actual tests verify:
- Admin authentication and correct role.
- Batch create/edit/update and thumbnail selection/display.
- Chapter create/edit/update with correct batch relation.
- Lecture create/edit/update with correct chapter relation.
- Chapter Notes and Lecture Notes can be managed independently.
- Add Lecture Notes opens a visible form; chapter selection populates the right lectures.
- External lecture links are handled without an indefinite spinner.
- Student access grant/revoke matches actual protected-resource access.
- Search, filters, ordering, navigation, refresh/reload, and mobile layout work.
- Failed writes/deletes are not shown as successful.
- Existing unrelated features still work after the fix.

Record pass/fail results honestly. A syntax check or dashboard scan alone does not count as functional testing.

## 17. Completion rule

This addendum is part of the existing Final Master Admin Plan V1.0. It does not authorize automatic implementation of every listed feature, database migration, or deletion. For implementation, audit the relevant code and current schema first, make the smallest root-cause fix, test affected and neighbouring workflows, and avoid repeated patches.

---

## 18. Complete Admin Panel navigation and layout

The Admin Panel must provide a responsive, usable sidebar/navigation with these sections, preserving any already-working implementation and mapping each entry to its real existing section:

1. Dashboard
2. Batches
3. Books & Notes
4. Chapters
5. Lectures
6. Notifications
7. Student Access
8. Settings

Also include the already-planned Banner Management, Chapter Notes, Lecture Notes, Access Requests, and Problem Reports in the appropriate management group or subsection so no existing feature becomes unreachable. On mobile, provide a reliable menu/open-close interaction and make sure navigation reveals the target section before scrolling. No link may point to a missing section. The active section must be visually clear.

## 19. Complete student-facing website requirements connected to admin content

Admin-managed content must appear in the student site according to the current approved EXAM JUNCTION product plan, without adding unrelated exam categories or mock/practice features that were not requested.

- Home: concise platform/batch information and published banners where configured.
- Batch: published batch cards and content, with access restrictions applied.
- Books: published free and selected-student books/notes according to permissions.
- Notifications: display published notifications through the existing notification UI.
- About: use About instead of Student Profile where that approved navigation variant is in force.
- Keep any previously approved bottom navigation layout; the latest confirmed layout was Home, Batch, Books, Leaderboard, Profile, with Notifications in the upper-right. If the later About replacement is the active approved version, use About instead of Profile. Do not silently restore removed navigation items; verify the current approved variant before altering it.
- Login is required only for protected/selected-student content and other operations that need an authenticated user. Do not unnecessarily block public published free content.

Do not add Banking, PYQ, Practice, Mock Test, or Daily Practice sections unless the owner explicitly changes the maths-only scope.

## 20. Student batch cards, content viewing, Watch and Download

- Batch cards must show the configured thumbnail at the correct location and use responsive image sizing so the whole image is visible as intended.
- Show basic information for restricted batches without exposing their chapters, lectures, private notes, or original restricted URLs.
- Unauthorized visitors should see a clear “Login to Access” or “Access not granted” message.
- Authorized students should see chapters and lectures allowed by the published/access rules.
- On lecture selection, show Watch and Download actions where supported.
- Watch should use the website's playback/viewing interface and support fullscreen when the player permits it.
- For PDFs/notes, use a matching View/Open and Download pattern where the source supports it.
- A public Google Drive link cannot be made private merely by hiding it in the UI. Restricted source files must use a protected delivery mechanism and policies that actually enforce access.
- If an external video refuses embedding, show a usable open-link fallback and an actionable message rather than an infinite spinner.
- Do not claim download support for a source/server that blocks it.

## 21. Website gallery and media selection

Batch thumbnail selection should be initiated from the website's own gallery picker. The picker may allow selecting a new image from the phone gallery and selecting an existing image if a supported gallery/library already exists.

- Preview the chosen image before saving.
- Validate image type and size.
- Show upload progress and clear errors.
- Preserve the current thumbnail if a replacement upload fails.
- Avoid leaving orphaned uploaded files when an upload fails before a database record is saved; do not automatically delete existing assets without explicit approval.
- Use existing configured storage only. Do not assume that a Supabase Storage bucket exists or that it is public/private; inspect configuration and policies first.
- Image upload and image URL save are separate operations; report success only after the complete intended operation is confirmed.

## 22. Authentication, roles and user profile

- Admin login uses Supabase Auth and checks the user's actual admin role/profile.
- Student access requires the appropriate authenticated account for restricted content.
- Handle expired sessions, sign-out, refresh, and auth-state changes without leaving stale Admin UI visible.
- Never trust a client-side role flag alone; database policies must enforce privileged operations.
- Keep account/profile features consistent with the currently approved student navigation; do not add a student-profile page if About has replaced it.
- Avoid exposing student personal data to unauthorized users.
- Existing security settings that the owner deferred must not be enabled/changed without asking.

## 23. Content publishing lifecycle

Every supported content type should follow the lifecycle allowed by its existing schema:

- Draft content is Admin-only.
- Published + Free content is available to visitors as permitted by existing product rules.
- Published + Selected Students content is available only to authorized signed-in users.
- Unpublishing content should hide it from student-facing pages without destroying the record.
- Preview should show how content will appear, while respecting Admin-only draft visibility.
- Publish/access changes must refresh the visible list and dashboard counts from actual data.
- Where no status column or supported policy exists, report the gap rather than silently inventing a column.

## 24. Mobile-first admin workflow

The owner primarily manages content from an Android phone and does not want routine code edits. Forms and workflows must be comfortable on small screens:

- Large tap targets and responsive forms.
- Clear labels and validation.
- Dropdowns that load the correct related records.
- Visible Save/Update/Cancel states.
- Upload picker reachable on mobile.
- Lists with readable record summaries and actions.
- Avoid horizontal overflow and hidden buttons.
- Do not lose form state unexpectedly during navigation or refresh.
- Provide understandable Hindi/Hinglish messages where appropriate.
- The daily workflow should primarily be content upload and management; technical maintenance should be occasional.

## 25. Data integrity and safe operations

- Do not delete records or storage files automatically as part of a normal edit.
- Before deleting a batch/chapter/lecture/book, show a clear confirmation and inspect dependencies.
- Prefer unpublish/archive only if the current schema supports it and the owner approves.
- Prevent double submission and duplicate records.
- Handle network timeouts and retry safely without accidentally creating duplicates.
- After an operation, refresh the relevant list and dashboard from the database.
- If the backend returns no updated/deleted row, do not announce success.
- Do not perform destructive migrations or broad RLS changes as part of a frontend-only fix.

## 26. Testing matrix for the entire product

Testing must cover both Admin and student views, not just syntax:

- Admin login, expired session, logout and access denied.
- Dashboard counts/loading/errors.
- Sidebar navigation and every form's visibility.
- CRUD for batches, books, chapters, lectures, chapter notes, lecture notes, banners and notifications where supported.
- Gallery selection, image preview/upload failure, and card display.
- YouTube and external MP4 link behaviour.
- PDF open/view/download behaviour where supported.
- Draft visibility and published content lifecycle.
- Free access versus selected-student access.
- Grant and revoke access using an authorized test account and an unauthorized test account.
- Problem report listing/reply/resolution only if its database function and policies exist.
- Mobile viewport, reload, slow network, duplicate taps and empty states.
- Regression tests for neighbouring features after every fix.

For every test, record Passed / Failed / Blocked. A feature is Blocked when required schema, policy, storage, or test account is missing. Never label a blocked/unexecuted test as passed.

## 27. Explicitly outside the current approved scope

- No unrequested exam modules such as PYQ, mock tests, banking, practice or daily practice.
- No automatic Supabase schema/policy/storage changes without the owner's explicit approval.
- No deleting data, files, tables, columns, policies, or old features to simplify implementation.
- No assumption that public external links provide restricted security.
- No claim that all features are implemented just because they are listed in this plan.

---

## 28. Search feature — every useful location

Add a search field wherever users or Admins need to find an existing item. Search must be visible, usable on Android/mobile, and connected to real data—not a decorative input.

### Admin Panel search
Provide search on:
- Dashboard (where practical: quick find / jump to management sections).
- Batches list (batch name, teacher, and searchable description where appropriate).
- Books & Notes list (title, author/teacher).
- Chapters list (chapter title, with batch filter).
- Lectures list (lecture title, with batch/chapter filters).
- Chapter Notes list (notes title, chapter).
- Lecture Notes list (notes title, lecture/chapter).
- Student Access (student name/email and batch).
- Batch Access Requests (student name/email, batch, request status).
- Notifications list (title/message).
- Banners list (title/type, if the list is present).
- Student Problem Reports (student/report text/category/status, only fields permitted for Admin).
- Gallery/media picker (image filename/title when available).
- Settings or diagnostics only if there are enough entries to search; do not add pointless search boxes to simple settings forms.

### Student Website search
- Batch listing: search published batches by name and teacher where those fields are available.
- Books: search published books/notes by title and author.
- Chapters and lectures: provide contextual search inside an accessible batch, filtering only content the current visitor is authorized to see.
- Notifications: search published notifications if a searchable notification list is available.
- Do not expose draft content, private student data, restricted titles/records, or original protected URLs through search results, suggestions, result counts, or error messages.

### Search behaviour and acceptance criteria
- Search results must be scoped to the current section and its active batch/chapter/access filters.
- Case-insensitive partial matching where practical; trim leading/trailing spaces.
- Update results while typing or after an explicit Search action, consistently within a section.
- Include a clear/reset action and a useful empty state (“No results found”).
- Combine search with existing filters and sorting rather than resetting them unexpectedly.
- Handle loading, network errors, and permission failures safely.
- Prevent stale asynchronous results from overwriting newer queries.
- Use pagination or bounded queries for large datasets; avoid downloading every student's/private record to the browser just to search.
- Use server/database-side search when supported by the current schema and RLS. Otherwise use only the already-authorized records loaded for the visible list.
- Never bypass RLS or widen access to make search easier.
- Search must work by keyboard and mobile touch; labels/placeholders must identify what is being searched.
- Test no-result, partial-match, mixed-case, whitespace, combined-filter, unauthorized-user, and slow-network cases.
- Do not claim search is implemented until it has been wired to actual list data and functionally tested.

