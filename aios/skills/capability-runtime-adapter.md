# SK-007 — Capability Package and Runtime Adapter Design

## Purpose
Separate AIOS business capabilities from individual platforms, models and applications.

## Capability Package

A package contains:

- purpose and version
- skills and tools
- input and output schemas
- templates and prompt patterns
- permissions
- approval policy
- rollback method
- runtime adapters
- tests and known failure modes

## Runtime Contract

`Mission → Capability Package → Runtime Adapter → Provider Model / Tool → Approval → Artifact → Audit Record`

## Rules

- GitHub remains the source of truth for schemas, policies and versions.
- Runtime products are replaceable execution environments.
- Minimum permissions are granted for each run.
- External writes require explicit approval or inherited approved workflow authority.
- Every adapter must expose execution status, actual model/tool, cost where available and rollback evidence.
