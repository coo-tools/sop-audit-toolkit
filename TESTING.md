# Acceptance testing

## Automated checks

Run `npm test`. Four unit tests cover weighted scoring, section summaries, priority ordering, and maturity labels.

## Manual release check

1. Reset the sample audit and note the score.
2. Change the first ownership control from `Yes` to `No`.
3. Confirm the score falls and the priority-action list updates.
4. Reload the page and confirm the selected value remains.
5. Export the action plan and confirm the Markdown file includes the overall score and open controls.
6. Reset the audit.

## Expected result

The test scenario moves the baseline score from 55% to 45% and stores the audit only in the current browser.
