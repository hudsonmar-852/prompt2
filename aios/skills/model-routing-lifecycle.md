# SK-006 — Model Routing and Lifecycle Management

## Purpose
Select the lowest-cost available model that satisfies the task's quality, latency, privacy and risk requirements. Pipelines reference stable aliases instead of provider model names.

## Routing Contract

1. Classify task complexity, risk, freshness and modality.
2. Resolve a model alias from the registry.
3. Apply cost, token, latency and permission guardrails.
4. Execute with a defined fallback chain.
5. Record actual provider, model, usage, cost and approval result.

## Required Aliases

- `economy_batch`
- `standard_general`
- `frontier_reasoning`
- `coding_runtime`
- `realtime_voice`
- `image_generation`

## Lifecycle Rules

- Core workflows must never hardcode a provider model ID.
- Deprecated models are replaced in the registry only.
- Benchmarks use sustainable public pricing, not temporary promotions.
- Every alias requires at least one fallback.
- High-impact tasks require human approval regardless of model tier.

## Cost Guardrails

Each run records estimated cost, maximum cost, cache strategy, stop condition and retry limit.
