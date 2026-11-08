import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  // All tests share one server and one data file, so run them one at a time.
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Starts the app from ../todo-app if it is not running yet.
  webServer: {
    command: 'npm start',
    cwd: '../todo-app',
    url: 'http://localhost:3000/api/health',
    reuseExistingServer: true,
  },
});
