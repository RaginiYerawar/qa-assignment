# Tests for the todo app

## Set up

You need Node.js 18 or later. Run these commands in this folder once:

```
npm install
npx playwright install chromium
```

## Run the tests

```
npx playwright test
```

Playwright starts the app from `../todo-app` if it is not running yet.

To see the HTML report after a run: `npx playwright show-report`.

The app keeps its data between runs. To go back to the start data, stop the app and run `npm run reset-data` in `../todo-app`.
