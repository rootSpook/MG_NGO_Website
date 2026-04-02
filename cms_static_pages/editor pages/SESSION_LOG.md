# CMS Editor Dashboard – Session Log

## Project Overview

**Project:** Admin/CMS dashboard for the Myasthenia Gravis (MG) Association website
**Figma file:** `https://www.figma.com/design/PaCo9eq37DpuJz7RfiZTku/Donation-Page`
**Working directory:** `C:\Users\doguk\OneDrive\Masaüstü\senior\2\ens206\admin_page_designs`
**Tech stack:** Plain HTML + CSS (no framework, no build tool)
**Fonts:** Inter, Roboto (Google Fonts CDN)
**Icons:** Material Icons (Google CDN)

---

## CMS Structure

The CMS has **2 account types:**
- **Editor account** ← this session focused on this one
- **Admin account** ← not yet started

---

## What Was Done This Session

### 1. Explored the Figma file
- Node `1:5` → style guide / foundations page (color palette + typography)
- Node `76:2` → **Editor Page** (the main page containing all editor screens)

### 2. Identified all pages in the Editor Page
Found these top-level frames inside the Editor Page canvas:

| Frame ID | Page Name |
|---|---|
| `76:451` | Dashboard |
| `83:1662` | Calendar |
| `85:3226` | Events (list) |
| `85:4144` | Add Events |
| `79:1163` | Dashboard with user dropdown open |
| `85:4639` | Media (Add Media) |

### 3. Design tokens extracted from Figma

| Token | Value |
|---|---|
| Primary teal | `#0E8281` |
| Primary dark teal | `#0A6A68` |
| Blue accent | `#2F80ED` |
| Green (buttons) | `#27AE60` |
| Red | `#EB5757` |
| Neutral 200 | `#E5E7EB` |
| Neutral 600 | `#6B7280` |
| Neutral 900 | `#111827` |
| White | `#FFFFFF` |
| Nav selected bg | `rgba(47, 128, 237, 0.10)` |

### 4. Layout structure (from Dashboard design)
- **Header:** 64px tall, full width
  - Left 272px: white bg, user avatar + "Editor 1" name
  - Right: white bg, search bar + notifications bell
- **Sidebar:** 272px wide, sticky
  - White rounded card (14px radius) for nav menu
  - MG logo at the bottom
- **Content area:** remaining width, white background

### 5. Sidebar navigation items (Editor account)
1. Dashboard
2. Events
3. Blog Posts
4. Calendar
5. Media
6. Announcement
7. *(divider)*
8. Help

---

## Files Created

| File | Description |
|---|---|
| `styles.css` | Shared CSS — layout, design tokens, all reusable components |
| `dashboard.html` | Main dashboard: Quick Stats (45 posts, 12 events, 8 drafts), Latest Blog Posts, Upcoming Events, Quick Actions |
| `events.html` | Events list as a table with Edit/Delete per row |
| `events-add.html` | Add Event form (title, date, time, location, description, category, cover image) |
| `blog-posts.html` | Blog posts list as a table with Published/Draft badges |
| `blog-posts-add.html` | New blog post form (title, content, tags, publish/draft buttons) |
| `calendar.html` | Full year view calendar, interactive year navigation, working/non-working day counts per month, Add Event button |
| `media.html` | File upload area + media library grid (images, videos, PDFs) |
| `announcement.html` | Announcement list + modal to create new announcements |
| `help.html` | Help topics (blog posts, events, calendar, media, announcements, contact support) |

All pages are linked to each other via the sidebar navigation.

---

## What I Know About the Design

- The **Dashboard** shows:
  - 3 stat cards (Total Blog Posts, Upcoming Events, Posts in Drafts)
  - A "Latest Blog Posts" section with Edit buttons per row
  - An "Upcoming Events" section with 3 placeholder cards
  - A "Quick Actions" row: + New Blog Post, + New Event, + New Announcement, Upload Media

- The **Calendar** page has:
  - A "Branch" dropdown (e.g. Paris)
  - A year navigator with left/right arrows
  - Total working days / non-working days counter at the top
  - 12 monthly mini-calendars in a 4×3 grid
  - Each month shows working/non-working day counts below it
  - An "Add Event" green button top-right

- The **Events** and **Add Events** pages were mostly placeholder/empty in the Figma design — I built them out with a reasonable table and form structure consistent with the rest.

- The **Media** page is titled "Add Media" and shows an upload box + a media item below it.

- The user dropdown (clicking the avatar) shows: My details, Calendar, Performance review.

---

## What Still Needs To Be Done

- [ ] **Admin account pages** — not started yet (different nav/permissions)
- [ ] Review and adjust any pages if they don't match what you had in mind
- [ ] Add real content / connect to a backend if needed
- [ ] The "Blog Posts" page was in the sidebar but had no Figma frame — built from scratch based on the Events page style
- [ ] The "Announcement" page was also not in the Figma — built from scratch
- [ ] The "Help" page was not in the Figma — built from scratch

---

## Notes

- Figma asset URLs (images like the MG logo) expire after 7 days. The logo in the sidebar will disappear after that. Replace with a local image file when ready.
- The calendar is fully functional with JavaScript — it calculates working/non-working days dynamically and highlights today's date.
- All pages use `styles.css` for shared styles. Avoid duplicating styles in individual pages.
