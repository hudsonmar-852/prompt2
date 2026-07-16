# AIOS Registry Validation Engine

## Purpose

The validator protects AIOS registries from structural errors before changes are accepted.

## Checks

- YAML syntax
- Required fields in the Object Registry
- Duplicate IDs inside each registry
- Unresolved Skill and Workflow dependencies
- Missing local source paths
- Machine-readable JSON report generation

## Local command

```bash
python -m pip install PyYAML==6.0.2
python aios/tools/validate_registries.py
```

The latest report is written to:

```text
aios/reports/registry-validation-latest.json
```

## GitHub Actions

`.github/workflows/aios-registry-validation.yml` runs automatically when files under `aios/` change, on pull requests, and through manual workflow dispatch.

Errors fail the workflow. Warnings are recorded but do not block deployment.

## Severity policy

| Level | Result |
|---|---|
| Error | Workflow fails; fix before merge or production use |
| Warning | Workflow passes; review and resolve when practical |

## Rollback

Revert the validator, workflow and related manifest commit. Existing Prompt2 runtime files are independent from this validation layer.
