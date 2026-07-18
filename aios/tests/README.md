# AIOS Validation Fixtures

The validator runs against production registries under `aios/registries/`.

Fixtures under this directory are used for unit testing:

- `valid-model-alias-registry.yaml` must pass registry-specific required-field validation.
- `invalid-model-alias-registry.yaml` must fail with `MISSING_FIELDS`.

The invalid fixture is intentionally excluded from the production registry scan.
