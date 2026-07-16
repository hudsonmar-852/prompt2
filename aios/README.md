# Hudson AIOS Foundation

Current release: **v1.1.0 — Sprint 1 Core**  
Last updated: **2026-07-16**

## Purpose

AIOS is a reusable operating framework for managing AI knowledge, prompts, skills, workflows, automation, agents, reports and delivery records. It does not replace an AI model; it provides consistent structure, controls, provenance and reuse across different AI tools.

## Sprint 1 Deliverables

- `core/aios-manifest.yaml` — system entry point and current capability map
- `registries/object-registry.yaml` — unified object schema and initial registered objects
- `registries/skill-registry.yaml` — reusable skills with inputs, outputs, restrictions and checks
- `registries/workflow-registry.yaml` — executable workflow definitions, controls and rollback

## Operating Rule

Every production AIOS asset should have:

1. A unique ID and object type.
2. A version and lifecycle status.
3. A clear owner and storage location.
4. Dependencies and reusable skills.
5. Source and provenance metadata where relevant.
6. Quality checks and a safety gate.
7. A rollback or previous-version recovery method.

## Standard Execution Flow

```text
Request
  -> Context Retrieval
  -> Research / Verification
  -> Structure
  -> Draft
  -> Quality Review
  -> Approval Gate
  -> Delivery
  -> Archive
  -> Registry Update
```

## Compatibility

The AIOS directory is isolated from the existing Prompt2 GitHub Pages runtime. Sprint 1 adds architecture and registry files only; it does not modify `index.html`, CSS, JavaScript or the current production builder.

## Next Sprint

Sprint 2 — Knowledge Layer Migration:

- Inventory existing prompts, templates, SOPs and workflows.
- Assign IDs, versions, tags and dependencies.
- Convert priority assets into Prompt Pattern Cards.
- Add registry validation rules.
- Add AI Content Provenance records.
- Add Value-over-Volume measurement fields.

## Status

| Component | Status |
|---|---|
| Manifest | Active |
| Object Registry | Active |
| Skill Registry | Active |
| Workflow Registry | Active |
| Existing Prompt2 site | Unchanged |
| Registry validation | Planned |
| Drive archive connector | Planned |
| Agent dispatcher | Planned |
