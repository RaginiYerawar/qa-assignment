import { test, expect } from '@playwright/test';

// Own tests for the todo app.
//
// Each test creates its own data (unique text, API setup) and finds its todo by that
// text, so it does not depend on the start data or on other tests.
//
// Tests marked with test.fail() hit a KNOWN BUG (see BUGS.md). They are expected to
// fail today. When the bug is fixed they "pass unexpectedly" and the run turns red:
// remove test.fail() then.

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
});
