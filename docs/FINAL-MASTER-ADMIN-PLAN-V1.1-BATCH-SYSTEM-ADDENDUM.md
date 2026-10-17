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
