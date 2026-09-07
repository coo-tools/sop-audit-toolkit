# Acceptance testing

## Automated checks

Run `npm test`. Six unit tests cover weighted scoring, section summaries, priority ordering, maturity labels, audit-context normalization, and context-aware exports.

## Manual release check

1. Reset the sample audit and note the score.
2. Enter a process name, process owner, and review date.
3. Change the first ownership control from `Yes` to `No`.
4. Confirm the score falls and the priority-action list updates.
5. Reload the page and confirm both the audit context and selected control value remain.
6. Export the action plan and confirm the Markdown file includes the audit context, overall score, and open controls.
7. Reset the audit and confirm the context fields clear while the review date returns to today.

## Expected result

The test scenario moves the baseline score from 55% to 45% and stores the audit, including its context, only in the current browser.
