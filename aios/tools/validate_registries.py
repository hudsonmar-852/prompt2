#!/usr/bin/env python3
"""Validate AIOS YAML registries, identifiers, dependencies and source paths."""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml

REGISTRY_DIR = Path("aios/registries")
REPORT_PATH = Path("aios/reports/registry-validation-latest.json")
REQUIRED_OBJECT_FIELDS = {
    "id", "type", "name", "version", "status", "owner",
    "location", "created_at", "updated_at",
}
ID_KEYS = {"id", "template_id", "pattern_id", "skill_id", "workflow_id", "object_id"}
DEPENDENCY_KEYS = {
    "dependencies", "skills", "uses", "requires", "referenced_skills", "uses_skills"
}


def load_yaml(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def walk(node: Any):
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from walk(value)
    elif isinstance(node, list):
        for value in node:
            yield from walk(value)


def collect_ids(documents: dict[Path, Any]) -> tuple[list[str], dict[str, Path]]:
    """Collect all declared IDs for dependency resolution.

    Registry IDs may intentionally reappear in the object registry as references,
    so global repetition is not treated as an error.
    """
    ids: list[str] = []
    locations: dict[str, Path] = {}
    for path, document in documents.items():
        for item in walk(document):
            for key in ID_KEYS:
                value = item.get(key)
                if isinstance(value, str) and value.strip():
                    value = value.strip()
                    ids.append(value)
                    locations.setdefault(value, path)
    return ids, locations


def validate_local_duplicate_ids(documents: dict[Path, Any]) -> list[dict[str, str]]:
    """Reject duplicate object IDs inside the same registry object list."""
    errors: list[dict[str, str]] = []
    for path, document in documents.items():
        if not isinstance(document, dict):
            continue
        objects = document.get("objects")
        if not isinstance(objects, list):
            continue
        object_ids = [obj.get("id") for obj in objects if isinstance(obj, dict) and isinstance(obj.get("id"), str)]
        for identifier, count in Counter(object_ids).items():
            if count > 1:
                errors.append({
                    "code": "DUPLICATE_ID",
                    "path": str(path),
                    "message": f"Duplicate identifier inside registry: {identifier}",
                })
    return errors


def collect_dependencies(documents: dict[Path, Any]) -> list[tuple[str, Path]]:
    dependencies: list[tuple[str, Path]] = []
    for path, document in documents.items():
        for item in walk(document):
            for key in DEPENDENCY_KEYS:
                value = item.get(key)
                if isinstance(value, str):
                    dependencies.append((value, path))
                elif isinstance(value, list):
                    dependencies.extend((entry, path) for entry in value if isinstance(entry, str))
    return dependencies


def validate_object_registry(document: Any, path: Path) -> list[dict[str, str]]:
    errors: list[dict[str, str]] = []
    if not isinstance(document, dict):
        return [{"code": "INVALID_ROOT", "path": str(path), "message": "Root must be a mapping."}]
    objects = document.get("objects", [])
    if not isinstance(objects, list):
        return [{"code": "INVALID_OBJECTS", "path": str(path), "message": "objects must be a list."}]
    for index, obj in enumerate(objects):
        if not isinstance(obj, dict):
            errors.append({"code": "INVALID_OBJECT", "path": str(path), "message": f"objects[{index}] must be a mapping."})
            continue
        missing = sorted(REQUIRED_OBJECT_FIELDS - set(obj))
        if missing:
            errors.append({
                "code": "MISSING_FIELDS",
                "path": str(path),
                "message": f"{obj.get('id', index)} missing: {', '.join(missing)}",
            })
    return errors


def validate_source_paths(documents: dict[Path, Any], repo_root: Path) -> list[dict[str, str]]:
    warnings: list[dict[str, str]] = []
    for path, document in documents.items():
        for item in walk(document):
            for key in ("location", "source_path"):
                value = item.get(key)
                if not isinstance(value, str) or not value or value.startswith(("http://", "https://")):
                    continue
                if not (repo_root / value).exists():
                    warnings.append({
                        "code": "MISSING_SOURCE_PATH",
                        "path": str(path),
                        "message": f"{key} does not exist: {value}",
                    })
    return warnings


def validate(repo_root: Path) -> dict[str, Any]:
    registry_dir = repo_root / REGISTRY_DIR
    files = sorted(registry_dir.glob("*.yaml")) + sorted(registry_dir.glob("*.yml"))
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    documents: dict[Path, Any] = {}

    if not files:
        errors.append({"code": "NO_REGISTRIES", "path": str(REGISTRY_DIR), "message": "No registry YAML files found."})

    for path in files:
        relative = path.relative_to(repo_root)
        try:
            documents[relative] = load_yaml(path)
        except Exception as exc:
            errors.append({"code": "YAML_PARSE_ERROR", "path": str(relative), "message": str(exc)})

    object_path = Path("aios/registries/object-registry.yaml")
    if object_path in documents:
        errors.extend(validate_object_registry(documents[object_path], object_path))

    errors.extend(validate_local_duplicate_ids(documents))
    identifiers, _ = collect_ids(documents)
    known_ids = set(identifiers)

    for dependency, path in collect_dependencies(documents):
        if dependency and dependency not in known_ids:
            warnings.append({
                "code": "UNRESOLVED_DEPENDENCY",
                "path": str(path),
                "message": f"Dependency not registered: {dependency}",
            })

    warnings.extend(validate_source_paths(documents, repo_root))

    return {
        "validator_version": "1.0.1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "status": "pass" if not errors else "fail",
        "summary": {
            "registry_files": len(files),
            "identifiers_found": len(identifiers),
            "unique_identifiers": len(known_ids),
            "errors": len(errors),
            "warnings": len(warnings),
        },
        "errors": errors,
        "warnings": warnings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", default=".", help="Repository root directory")
    parser.add_argument("--report", default=str(REPORT_PATH), help="JSON report output path")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    report = validate(repo_root)
    report_path = repo_root / args.report
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(json.dumps(report["summary"], indent=2))
    for error in report["errors"]:
        print(f"ERROR [{error['code']}] {error['path']}: {error['message']}")
    for warning in report["warnings"]:
        print(f"WARNING [{warning['code']}] {warning['path']}: {warning['message']}")
    return 0 if report["status"] == "pass" else 1


if __name__ == "__main__":
    sys.exit(main())
