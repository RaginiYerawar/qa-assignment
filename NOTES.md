# Notes

## AI usage

I used Claude during this assignment.

I used them mainly to:

- brainstorm additional edge cases after my initial exploratory testing
- review the structure and clarity of bug reports
- discuss Playwright test design and possible improvements
- review ideas for making tests independent and maintainable

I did not treat AI output as the source of truth. I verified findings against the application, the API behaviour, and the README before including them in my submission.

### Example where AI was not good enough

One example was test design. An initial AI suggestion created unique test data but did not clean the data up afterwards. This would make repeated test runs change the application state and could make the suite less deterministic.

Another example was in using selectors: AI suggested brittle selectors in some examples, such as position-based or overly specific DOM selectors. I identified this during review and replaced them with more stable, user-facing locators based on roles, labels, or visible text.

This was a useful reminder that AI is helpful for generating ideas, but the expected behaviour and final test decisions still need human validation.

## What I would test next

With more time, I would continue with:

- More API boundary and validation scenarios, including invalid field types and malformed requests.
- Failure handling in the frontend when API requests return 4xx/5xx responses or the network is unavailable.
- Search and filter combinations and transitions between different UI states.
- Cross-browser testing beyond Chromium.
- Behaviour with a larger number of todos.
- Concurrent updates from multiple browser tabs/users.
- Additional CI coverage and reporting for automated tests.

I would prioritise these based on user impact and the likelihood of finding failures rather than trying to maximise the number of test cases.
