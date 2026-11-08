import { test, expect } from '@playwright/test';

// Own tests for the todo app.
//
// Each test creates its own data (unique text, API setup) and finds its todo by that
// text, so it does not depend on the start data or on other tests.
//
// Tests marked with test.fail() hit a KNOWN BUG (see BUGS.md). They are expected to
// fail today. When the bug is fixed they "pass unexpectedly" and the run turns red:
// remove test.fail() then.

// Cleanup: remove the todos this suite created, also when a test fails on a known bug.
// Only todos with our "qa-test-" prefix are deleted, other data is left alone.
test.afterEach(async ({ request }) => {
  const todos: { id: string; text: string }[] = await (await request.get('/api/todos')).json();
  for (const todo of todos.filter((t) => t.text.startsWith('qa-test-'))) {
    await request.delete(`/api/todos/${todo.id}`);
  }
});

test.describe('Frontend', () => {
  test('a new todo can be completed and stays completed after reload', async ({ page }) => {
    // Known bug BUG-003: a todo added in the UI keeps a client-made ID, so the PATCH
    // to the server returns 500 and the completion is lost after reload.
    test.fail(true, 'Known bug BUG-003: PATCH for a just-added todo fails with 500');
    const text = `qa-test-${Date.now()}`;

    await page.goto('/');
    await page.getByPlaceholder('Add new').fill(text);
    await page.getByPlaceholder('Add new').press('Enter');

    const todo = page.locator('li.todo-item', { hasText: text });
    await todo.getByRole('checkbox').check();
    await expect(todo).toHaveClass(/completed/);

    await page.reload();
    await expect(todo.getByRole('checkbox')).toBeChecked();
  });

  test('"Clear completed" permanently removes completed todos', async ({ page, request }) => {
    // Known bug BUG-002: the link only changes the page, it sends no request to the
    // server, so the completed todos come back after reload.
    test.fail(true, 'Known bug BUG-002: Clear completed does not delete on the server');
    const text = `qa-test-${Date.now()}`;

    // Setup through the API: create a todo and mark it completed.
    const created = await request.post('/api/todos', { data: { text } });
    expect(created.status()).toBe(201);
    const { id } = await created.json();
    const patched = await request.patch(`/api/todos/${id}`, { data: { completed: true } });
    expect(patched.status()).toBe(200);

    await page.goto('/');
    const todo = page.locator('li.todo-item', { hasText: text });
    await expect(todo).toBeVisible();

    await page.getByText('Clear completed').click();
    await expect(todo).toHaveCount(0);

    await page.reload();
    await expect(todo).toHaveCount(0);
  });
});

test.describe('API', () => {
  test('POST /api/todos rejects invalid text with 400', async ({ request }) => {
    // Known bug BUG-006: POST does not validate text and returns 201.
    // README: text must be 1 to 256 characters and not only spaces, otherwise 400.
    test.fail(true, 'Known bug BUG-006: POST accepts empty, spaces-only and too long text');
    const invalidTexts = ['', '   ', 'a'.repeat(257)];
    const createdIds: string[] = [];

    try {
      for (const text of invalidTexts) {
        const res = await request.post('/api/todos', { data: { text } });
        if (res.status() === 201) createdIds.push((await res.json()).id);

        expect(res.status(), `text with ${text.length} characters`).toBe(400);
        expect(await res.json()).toHaveProperty('error');
      }
    } finally {
      // These texts do not start with "qa-test-", so remove what the bug let through.
      for (const id of createdIds) await request.delete(`/api/todos/${id}`);
    }
  });
});
