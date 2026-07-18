# SK-009 — Image Quality Evaluation and Controlled Retry

## Purpose
Approve or regenerate images using measurable quality criteria while preventing unlimited retries and uncontrolled cost.

## Scorecard

Evaluate identity accuracy, face geometry, age consistency, anatomy, hands, eyes, lighting, perspective, text, background continuity, artifacts and commercial realism.

## Retry Policy

- Retry only when a named acceptance threshold fails.
- Every run requires a maximum attempt count and cost budget.
- Change the failing instruction rather than repeating the same prompt.
- Stop and request human review when identity-critical defects remain after the retry budget.
- Archive failure category, provider, prompt version and corrective action for reuse.

## Production Approval

An asset is production-ready only when mandatory thresholds pass and provenance is recorded.
