# Review of `colleague.spec.ts`

Overall, the suite covers several useful user flows and includes both UI and API tests. It is also good that the tests use Playwright's built-in request fixture for API coverage and that the suite checks basic create, complete, filter, and error scenarios.

Before merging, I would address the following issues because some tests can pass without verifying the intended behaviour, while others depend on state created by previous tests and may become flaky.

## What I saw when running the tests

I ran `colleague.spec.ts` twice against the app:

| Run | Data | Result |
|-----|------|--------|
| 1 | Fresh (`npm run reset-data`) | 8 passed, 1 failed: `should mark a todo as completed` |
| 2 | Same server, data left over from run 1 | 8 passed, 1 failed: `should add a new todo` (expected 4 items, received 7) |

- The comment at the top of the file says "All tests pass locally". That is not true on a clean start.
- The failure in run 1 comes from the missing `await` on line 32 (see issue 5): the test ends before the assertion is checked.
- The failure in run 2 shows the isolation problem (see issues 1 and 9): the result depends on what earlier runs left behind.

## What is good

- The suite covers both frontend and API behaviour.
- The test names are clear and describe the intended scenario.
- API tests use Playwright's `request` fixture instead of adding another dependency.
- The suite includes both positive and negative scenarios, such as an unknown todo ID.
- The tests focus on important user actions such as creating, completing, filtering, and clearing todos.

## Issues to address

### 1. Tests depend on each other

The test `should mark a todo as completed` contains:

```ts
// Uses the todo from the previous test
```

Tests should be independently executable. Playwright may run tests in a different order or in parallel, and a failure in the create test would also break later tests.

**Suggestion:** Create the required todo as part of the test itself, ideally using the API for setup, or reset the test data before each test.

---

### 2. The `h1` assertion does not verify the page

```ts
expect(page.locator('h1')).toBeTruthy();
```

A Playwright locator object is truthy even if no matching element exists, so this assertion cannot fail for a missing heading.

**Suggestion:**

```ts
await expect(page.locator('h1')).toBeVisible();
```

Even better, verify meaningful content if the heading text is part of the expected UI.

---

### 3. Hard-coded XPath is brittle

```ts
page.locator('xpath=//*[@id="root"]/div/div/div/div/div/ul/li[4]/div/label/input')
```

This locator depends on the exact DOM structure and item position. A harmless markup change could break the test even though the feature still works.

**Suggestion:** Locate the todo by visible text and then find its checkbox within that item, or use an accessible role/label where possible.

---

### 4. Fixed waits should be avoided

Examples:

```ts
await page.waitForTimeout(2000);
await page.waitForTimeout(1000);
```

Fixed sleeps make the suite slower and do not guarantee that the application is ready. They can still fail on a slower environment.

**Suggestion:** Wait for the expected UI or network state using Playwright assertions, for example:

```ts
await expect(items.last()).toContainText('Write tests');
```

Playwright assertions already retry until the condition is met or the timeout expires.

---

### 5. Some async assertions are missing `await`

For example:

```ts
expect(page.locator('li.todo-item').nth(3)).toHaveClass(/completed/);
```

Playwright web assertions return promises and should be awaited.

**Suggestion:**

```ts
await expect(page.locator('li.todo-item').nth(3)).toHaveClass(/completed/);
```

---

### 6. The Active filter test contains a meaningless assertion

```ts
const count = await page.locator('.todo-item').count();
expect(count).toBeGreaterThanOrEqual(0);
```

A locator count can never be less than zero, so this assertion always passes and does not verify that the Active filter works.

The test should instead verify that only incomplete todos are displayed and that completed todos are hidden.

---

### 7. Assertion failures are swallowed

```ts
try {
  await expect(page.locator('footer')).toContainText(`${count} items`, { timeout: 2000 });
} catch (e) {
  console.log('Footer count not updated yet');
}
```

Ignoring an assertion failure means the test can pass even when the application is behaving incorrectly. This can hide regressions.

**Suggestion:** Keep the assertion and allow the test to fail, or remove it if the footer behaviour is outside the purpose of this test.

---

### 8. The empty-text API test asserts behaviour that contradicts the API contract

```ts
test('API: should create a todo with empty text', async ({ request }) => {
  const res = await request.post(`${URL}/api/todos`, { data: { text: '' } });
  expect(res.status()).toBe(201);
});
```

The API README states that `text` must contain between 1 and 256 characters and that invalid input must return `400`.

This test currently documents the application's bug as the expected behaviour.

**Suggestion:**

```ts
expect(res.status()).toBe(400);
```

Also validate the documented JSON error response.

---

### 9. Test state is not isolated

The application persists todos between tests and between test runs. Assertions such as:

```ts
await expect(items).toHaveCount(4);
```

assume a specific starting dataset and can fail once another test or previous run changes the stored data.

**Suggestion:** Use deterministic setup/cleanup. For example, reset data before the suite or create/delete test data through the API.

---

### 10. Use the configured `baseURL`

`playwright.config.ts` already defines:

```ts
baseURL: 'http://localhost:3000'
```

but the test file duplicates the URL in a constant.

**Suggestion:** Use relative paths such as:

```ts
await page.goto('/');
await request.post('/api/todos', ...);
```

This keeps environment configuration in one place.

### 11. Tests pass even though the app has bugs (no reload or API check)

`should un-check a completed todo` and `should clear completed todos` only look at what the page shows right after the click. They never reload the page and never check the server.

When I tested the app manually, both features are broken: un-checking is not saved (the todo is checked again after a reload), and "Clear completed" sends no request to the server (the todos come back after a reload). Both tests still pass, so the suite stays green with these bugs in the app.

**Suggestion:** After the action, reload the page (or call `GET /api/todos`) and assert again:

```ts
await page.reload();
await expect(item.locator('input')).not.toBeChecked();
```

## Summary

The suite has a useful starting set of scenarios, but I would not merge it yet because several tests are not deterministic and some assertions can pass without validating the expected behaviour.

My main priorities before merge would be:

1. Make every test independent and deterministic.
2. Replace hard-coded locators and fixed waits with Playwright's resilient locators and auto-waiting assertions.
3. Fix assertions that do not validate real behaviour or silently ignore failures.
4. Align API expectations with the documented contract.
5. Make the un-check and clear tests reload and verify that the change was saved.
