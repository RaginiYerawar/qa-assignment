# QA assignment

The assignment takes about 2–3 hours. Please do not spend more than about three hours. You do not need to find every bug. If you run out of time, write down what you planned to do next.

## What you get

- `todo-app/`: a small todo app with a web frontend and a REST API. The `README.md` file in that folder tells you how to start the app and describes the API.
- `tests/`: a Playwright project in TypeScript that is ready to use. It contains one test file, `colleague.spec.ts`.

## Start the app

You need Node.js 18 or later.

1. Open a terminal in `todo-app/`.
2. Run `npm start`.
3. Open http://localhost:3000.

## Tasks

### 1. Find and report bugs

- Test the frontend, and test the API against its description in `todo-app/README.md`.
- Write your bug reports in one file named `BUGS`, in a common format of your choice. For example: Markdown, PDF, Word, or a spreadsheet.
- Put screenshots, videos, or logs in a folder named `evidence/`, and refer to them from your reports.
- Write each report as you would for a developer on your team.
- At the end of the file, choose the three bugs that we must fix first, and tell us why.

### 2. Review a colleague's tests

- A colleague wrote `colleague.spec.ts` with help from an AI tool. They asked you to review it before they merge it.
- Write your review in `REVIEW.md`, as you would in a pull request.
- Tell us what is good, what is wrong, and why.

### 3. Write your own tests

- Add at least two tests for the frontend and one test for the API to the Playwright project.
- Choose the tests that you think give the most value.
- If a test fails because of a bug in the app, that is OK. Mark it clearly, so that a reader knows why it fails.
- Use Git, and commit as you work. We read the commit history. Do not squash or rewrite your commits. We want to see how you worked, so a messy history is fine.
- If you have time, add a CI configuration that runs your tests, for a CI tool of your choice. For example: GitHub Actions, GitLab CI, or Jenkins.

### 4. Write short notes

You can use AI tools. We ask you to be honest and open about how you used them. Honest answers do not cost you points.

In `NOTES.md`, tell us:

- If you used an AI tool: which tool you used, and for what. Give one example where the AI was wrong or not good enough, and how you found out. If you did not use an AI tool, skip this question.
- What you will test next if you have more time.
- Any assumptions that you made.

## Checklist before you send your result

- [ ] `BUGS` (any common format), with the three most important bugs at the end
- [ ] `evidence/` folder, if you have screenshots, videos, or logs
- [ ] `REVIEW.md`
- [ ] Your own tests in the Playwright project
- [ ] `NOTES.md`
- [ ] Git history included
- [ ] Optional: a CI configuration

Send your result as described in the email. If something is not clear, reply to the email. Questions are welcome, as in a real team.
