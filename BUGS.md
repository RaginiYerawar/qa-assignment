# Bug reports

Tested on Windows 10, Chrome (Playwright) and curl, app started with `npm start`. Screenshots are in `evidence/`.

---

## BUG-001 — Un-checking a todo is not saved

**Severity:** High · **Area:** Frontend + API

**Steps to reproduce**
1. Open the app. "Book a dentist appointment" is completed.
2. Un-check it.
3. Reload the page.

**Expected result:** The todo stays un-checked.

**Actual result:** The todo is checked again. The API ignores `{"completed": false}`: `PATCH /api/todos/{id}` returns 200 but `completed` stays `true`.

**Impact:** The user thinks the change was saved, but it is lost.

**Evidence:** `evidence/bug01-1-before-completed.png`, `evidence/bug01-2-unchecked.png`, `evidence/bug01-3-after-reload-checked-again.png`

---

## BUG-002 — "Clear completed" does not delete todos on the server

**Severity:** High · **Area:** Frontend

**Steps to reproduce**
1. Open the app. One todo is completed.
2. Click "Clear completed". The todo disappears.
3. Reload the page.

**Expected result:** The completed todo is deleted for good.

**Actual result:** The todo is back after the reload. The browser sends no request when "Clear completed" is clicked (checked in the Network tab). `DELETE /api/todos?completed=true` works when called directly.

**Impact:** The user thinks todos are deleted, but they are not.

**Evidence:** `evidence/bug02-after-clear-completed.png`

---

## BUG-003 — Checking a todo right after adding it fails

**Severity:** High · **Area:** Frontend

**Steps to reproduce**
1. Add a new todo, for example "fresh item".
2. Without reloading, tick its checkbox.
3. Reload the page.

**Expected result:** The todo stays checked.

**Actual result:** The checkbox looks ticked, but the request fails with `500`. The frontend sends a different ID than the one the server returned when the todo was created. No error is shown, and after a reload the todo is not checked. If you reload before ticking, it works.

**Impact:** The user gets a false confirmation. The most common first action (add, then tick) loses data.

**Evidence:** `evidence/bug03-checked-new-item-before-reload.png`

---

## BUG-004 — Esc in search hides the search box but keeps the filter

**Severity:** Medium · **Area:** Frontend

**Steps to reproduce**
1. Click the search icon and type "slides".
2. Press Esc (the page says "Press Esc to cancel").

**Expected result:** The search is cancelled and all todos are shown again.

**Actual result:** The search box disappears, but only "Prepare slides for Monday" is still listed. The other todos look deleted.

**Impact:** The user cannot see why todos are missing and cannot clear the filter.

**Evidence:** `evidence/bug04-search-esc-filter-stuck.png`

---

## BUG-005 — `status=active` returns completed todos

**Severity:** Medium · **Area:** API

**Steps to reproduce**
1. Send `GET /api/todos?status=active`.

**Expected result:** Only todos that are not completed (README).

**Actual result:** All todos are returned, including "Book a dentist appointment" with `"completed": true`. `status=completed` works.

**Impact:** Any client that uses the filter shows wrong data. The web UI filters in the browser, so it does not show this bug.

**Evidence:** `evidence/bug05-status-active-returns-completed.png`

---

## BUG-006 — API accepts empty text and text longer than 256 characters

**Severity:** Medium · **Area:** API

**Steps to reproduce**
1. Send `POST /api/todos` with `{"text": ""}`.
2. Repeat with `{"text": "   "}` and with 300 characters.

**Expected result:** `400` with an error message (README: text must be 1 to 256 characters and not only spaces).

**Actual result:** `201` and the todo is created each time. An empty todo shows as a blank row in the UI. The UI blocks spaces-only text, but not text over 256 characters.

**Impact:** Invalid data is stored, and the documented limit is not enforced.

**Evidence:** `evidence/bug06-1-empty-text-201.png`, `evidence/bug06-2-spaces-only-201.png`, `evidence/bug06-3-over-256-chars-201.png`

---

## The three bugs to fix first

1. **BUG-001** — A core feature (un-check) does not work, and the user is told nothing. The fix is one line on the server.
2. **BUG-002** — Users believe todos are deleted, but they come back. Small frontend fix; the API already works.
3. **BUG-003** — Add then tick is the most common first action, and it fails silently with a 500.

All three look successful on screen while the data is not saved, so users do not notice until their list is wrong.
