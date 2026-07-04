from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import sqlite3
import sys
import time
from collections import Counter, defaultdict
from concurrent.futures import FIRST_COMPLETED, ThreadPoolExecutor, wait
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]
RAW_ROOT = ROOT / "data" / "raw" / "hadith"
MANIFESTS = ROOT / "data" / "manifests"
CHECKSUMS = ROOT / "data" / "checksums"
REPORTS = ROOT / "data" / "staging_reports" / "hadith" / "raw_inventory"
CACHE_PATH = REPORTS / "inventory_cache.sqlite"

ACQUISITION_CSV = MANIFESTS / "hadith-acquisition-resources-2026-06-14.csv"
PRINCIPAL_CSV = CHECKSUMS / "HADITH_PRINCIPAL_SHA256_2026-06-14.csv"

OBJECTS_CSV = MANIFESTS / "hadith-raw-objects-2026-06-14.csv"
SUBTREES_CSV = MANIFESTS / "hadith-raw-subtrees-2026-06-14.csv"
SUMMARY_JSON = REPORTS / "hadith-raw-inventory-summary.json"
CHANGES_CSV = REPORTS / "hadith-raw-inventory-changes.csv"

HASH_CHUNK_SIZE = 4 * 1024 * 1024
DEFAULT_WORKERS = min(8, max(2, (os.cpu_count() or 4)))
MAX_PENDING_FACTOR = 8

PAYLOAD_SUFFIXES = {
    ".csv",
    ".db",
    ".gz",
    ".json",
    ".jsonl",
    ".parquet",
    ".sql",
    ".sqlite",
    ".txt",
    ".xlsx",
    ".xml",
}
METADATA_NAMES = {
    "citation.cff",
    "code_of_conduct.md",
    "contributing.md",
    "dataset_infos.json",
    "dev.md",
    "download.md",
    "license",
    "license.md",
    "license.txt",
    "package-lock.json",
    "package.json",
    "preprocessing.md",
    "readme",
    "readme.md",
    "references.md",
}


@dataclass(frozen=True)
class FileTask:
    absolute_path: Path
    relative_path: str
    category: str
    resource_path: str
    resource_key: str
    subtree_key: str
    role: str
    parse_eligible: bool
    byte_length: int
    mtime_ns: int


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def normalize_path(path: Path | str) -> str:
    return Path(path).as_posix()


def load_principal_checksums() -> dict[str, tuple[str, int]]:
    principals: dict[str, tuple[str, int]] = {}
    with PRINCIPAL_CSV.open("r", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            path = normalize_path(row["path"])
            principals[path] = (row["sha256"].upper(), int(row["bytes"]))
    return principals


def load_acquisition_rows() -> list[dict[str, str]]:
    with ACQUISITION_CSV.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def classify_role(relative_path: str, principal_paths: set[str]) -> tuple[str, bool]:
    workspace_path = f"data/raw/hadith/{relative_path}"
    lower = relative_path.lower()
    path = Path(relative_path)
    name = path.name.lower()
    parts = tuple(part.lower() for part in path.parts)

    if workspace_path in principal_paths:
        return "principal", True
    if path.parts and path.parts[0].lower() == "evidence":
        return "evidence", False
    if name in METADATA_NAMES or name.startswith("license"):
        return "metadata", False
    if name.endswith(".min.json") or ".min." in name:
        return "mirror", False
    if (
        "fawaz-hadith-api-v1" in parts
        and (
            "database" in parts
            or (
                "editions" in parts
                and len(parts) > parts.index("editions") + 2
            )
        )
    ):
        return "generated", False
    if any(part in {"src", "app", "config", "routes", "tests", ".github"} for part in parts):
        return "support", False
    if path.suffix.lower() in PAYLOAD_SUFFIXES:
        return "payload_unselected", False
    return "support", False


def resource_and_subtree(relative_path: str) -> tuple[str, str, str]:
    parts = Path(relative_path).parts
    category = parts[0] if parts else ""
    resource = parts[1] if len(parts) > 1 else "(category-root)"
    resource_key = f"{category}/{resource}"
    resource_path = f"data/raw/hadith/{resource_key}"

    tail = parts[2:]
    if not tail:
        subtree_key = resource_key
    elif resource == "fawaz-hadith-api-v1" and tail[0] == "editions" and len(tail) > 1:
        subtree_key = f"{resource_key}/editions/{tail[1]}"
    elif resource == "fawaz-hadith-api-v1" and tail[0] == "database" and len(tail) > 1:
        subtree_key = f"{resource_key}/database/{tail[1]}"
    else:
        subtree_key = f"{resource_key}/{tail[0]}"
    return category, resource_path, subtree_key


def iter_file_tasks(principal_paths: set[str]) -> Iterable[FileTask]:
    for directory, child_dirs, filenames in os.walk(RAW_ROOT):
        child_dirs[:] = sorted(name for name in child_dirs if name != ".git")
        current = Path(directory)
        for filename in sorted(filenames):
            path = current / filename
            stat = path.stat()
            relative = path.relative_to(RAW_ROOT).as_posix()
            category, resource_path, subtree_key = resource_and_subtree(relative)
            role, parse_eligible = classify_role(relative, principal_paths)
            resource_key = resource_path.removeprefix("data/raw/hadith/")
            yield FileTask(
                absolute_path=path,
                relative_path=relative,
                category=category,
                resource_path=resource_path,
                resource_key=resource_key,
                subtree_key=subtree_key,
                role=role,
                parse_eligible=parse_eligible,
                byte_length=stat.st_size,
                mtime_ns=stat.st_mtime_ns,
            )


def connect_cache() -> sqlite3.Connection:
    REPORTS.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(CACHE_PATH)
    connection.execute("pragma journal_mode = wal")
    connection.execute("pragma synchronous = normal")
    connection.execute(
        """
        create table if not exists objects (
          relative_path text primary key,
          category text not null,
          resource_path text not null,
          resource_key text not null,
          subtree_key text not null,
          role text not null,
          parse_eligible integer not null,
          byte_length integer not null,
          mtime_ns integer not null,
          sha256 text not null,
          last_seen_run text not null,
          hashed_at text not null
        )
        """
    )
    connection.execute(
        "create index if not exists idx_objects_run on objects(last_seen_run)"
    )
    connection.execute(
        "create index if not exists idx_objects_subtree on objects(subtree_key, relative_path)"
    )
    connection.execute(
        """
        create table if not exists run_changes (
          run_id text not null,
          change_type text not null,
          relative_path text not null,
          previous_sha256 text,
          current_sha256 text,
          byte_length integer,
          primary key (run_id, change_type, relative_path)
        )
        """
    )
    connection.commit()
    return connection


def hash_file(task: FileTask) -> tuple[FileTask, str]:
    digest = hashlib.sha256()
    with task.absolute_path.open("rb") as handle:
        while chunk := handle.read(HASH_CHUNK_SIZE):
            digest.update(chunk)
    return task, digest.hexdigest().upper()


def cached_row(
    connection: sqlite3.Connection, task: FileTask
) -> tuple[int, int, str] | None:
    return connection.execute(
        "select byte_length, mtime_ns, sha256 from objects where relative_path = ?",
        (task.relative_path,),
    ).fetchone()


def upsert_object(
    connection: sqlite3.Connection,
    task: FileTask,
    sha256: str,
    run_id: str,
    hashed_at: str,
) -> None:
    connection.execute(
        """
        insert into objects (
          relative_path, category, resource_path, resource_key, subtree_key,
          role, parse_eligible, byte_length, mtime_ns, sha256,
          last_seen_run, hashed_at
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        on conflict(relative_path) do update set
          category = excluded.category,
          resource_path = excluded.resource_path,
          resource_key = excluded.resource_key,
          subtree_key = excluded.subtree_key,
          role = excluded.role,
          parse_eligible = excluded.parse_eligible,
          byte_length = excluded.byte_length,
          mtime_ns = excluded.mtime_ns,
          sha256 = excluded.sha256,
          last_seen_run = excluded.last_seen_run,
          hashed_at = excluded.hashed_at
        """,
        (
            task.relative_path,
            task.category,
            task.resource_path,
            task.resource_key,
            task.subtree_key,
            task.role,
            int(task.parse_eligible),
            task.byte_length,
            task.mtime_ns,
            sha256,
            run_id,
            hashed_at,
        ),
    )


def inventory_files(
    connection: sqlite3.Connection,
    principal_paths: set[str],
    run_id: str,
    workers: int,
    force_rehash: bool,
) -> dict[str, int]:
    counters = Counter()
    pending: dict[object, str | None] = {}
    batch_since_commit = 0
    started = time.monotonic()

    connection.execute("delete from run_changes where run_id = ?", (run_id,))

    def record_result(
        task: FileTask,
        sha256: str,
        reused: bool,
        previous_sha256: str | None = None,
    ) -> None:
        nonlocal batch_since_commit
        upsert_object(connection, task, sha256, run_id, utc_now())
        counters["files"] += 1
        counters["bytes"] += task.byte_length
        counters["reused" if reused else "hashed"] += 1
        if not reused:
            counters["hashed_bytes"] += task.byte_length
            if previous_sha256 is None:
                change_type = "added"
            elif previous_sha256 != sha256:
                change_type = "content_changed"
            else:
                change_type = "metadata_changed_rehashed"
            connection.execute(
                """
                insert or replace into run_changes (
                  run_id, change_type, relative_path, previous_sha256,
                  current_sha256, byte_length
                ) values (?, ?, ?, ?, ?, ?)
                """,
                (
                    run_id,
                    change_type,
                    task.relative_path,
                    previous_sha256,
                    sha256,
                    task.byte_length,
                ),
            )
        batch_since_commit += 1
        if batch_since_commit >= 1000:
            connection.commit()
            batch_since_commit = 0
        if counters["files"] % 25_000 == 0:
            elapsed = max(time.monotonic() - started, 0.001)
            print(
                f"inventory {counters['files']:,} files; "
                f"hashed {counters['hashed']:,}; reused {counters['reused']:,}; "
                f"{counters['files'] / elapsed:,.0f} files/s",
                flush=True,
            )

    with ThreadPoolExecutor(max_workers=workers) as executor:
        for task in iter_file_tasks(principal_paths):
            cached = cached_row(connection, task)
            if (
                not force_rehash
                and cached is not None
                and int(cached[0]) == task.byte_length
                and int(cached[1]) == task.mtime_ns
            ):
                record_result(task, str(cached[2]), True)
                continue

            future = executor.submit(hash_file, task)
            pending[future] = str(cached[2]) if cached is not None else None
            if len(pending) >= workers * MAX_PENDING_FACTOR:
                done, _ = wait(pending, return_when=FIRST_COMPLETED)
                for future in done:
                    previous_sha256 = pending.pop(future)
                    result_task, digest = future.result()
                    record_result(
                        result_task, digest, False, previous_sha256
                    )

        while pending:
            done, _ = wait(pending, return_when=FIRST_COMPLETED)
            for future in done:
                previous_sha256 = pending.pop(future)
                result_task, digest = future.result()
                record_result(result_task, digest, False, previous_sha256)

    connection.commit()
    missing_rows = connection.execute(
        """
        select relative_path, sha256, byte_length
          from objects
         where last_seen_run <> ?
        """,
        (run_id,),
    ).fetchall()
    for relative_path, sha256, byte_length in missing_rows:
        connection.execute(
            """
            insert or replace into run_changes (
              run_id, change_type, relative_path, previous_sha256,
              current_sha256, byte_length
            ) values (?, 'missing', ?, ?, null, ?)
            """,
            (run_id, relative_path, sha256, byte_length),
        )
    connection.commit()
    counters["missing"] = len(missing_rows)
    return dict(counters)


def write_atomic_csv(path: Path, fieldnames: list[str], rows: Iterable[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with temporary.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    temporary.replace(path)


def write_objects_csv(connection: sqlite3.Connection, run_id: str) -> None:
    fieldnames = [
        "path",
        "category",
        "resource_path",
        "subtree_key",
        "role",
        "parse_eligible",
        "bytes",
        "mtime_ns",
        "sha256",
        "hashed_at",
    ]

    def rows() -> Iterable[dict[str, object]]:
        cursor = connection.execute(
            """
            select relative_path, category, resource_path, subtree_key, role,
                   parse_eligible, byte_length, mtime_ns, sha256, hashed_at
              from objects
             where last_seen_run = ?
             order by relative_path
            """,
            (run_id,),
        )
        for row in cursor:
            yield {
                "path": f"data/raw/hadith/{row[0]}",
                "category": row[1],
                "resource_path": row[2],
                "subtree_key": row[3],
                "role": row[4],
                "parse_eligible": str(bool(row[5])).lower(),
                "bytes": row[6],
                "mtime_ns": row[7],
                "sha256": row[8],
                "hashed_at": row[9],
            }

    write_atomic_csv(OBJECTS_CSV, fieldnames, rows())


def digest_rows(rows: Iterable[tuple[str, int, str]]) -> tuple[int, int, str]:
    digest = hashlib.sha256()
    file_count = 0
    total_bytes = 0
    for relative_path, byte_length, sha256 in rows:
        digest.update(f"{relative_path}|{byte_length}|{sha256}\n".encode("utf-8"))
        file_count += 1
        total_bytes += byte_length
    return file_count, total_bytes, digest.hexdigest().upper()


def build_subtree_summaries(
    connection: sqlite3.Connection, run_id: str
) -> list[dict[str, object]]:
    groups = connection.execute(
        """
        select 'resource' as level, resource_key as group_key
          from objects where last_seen_run = ?
         group by resource_key
        union all
        select 'subtree' as level, subtree_key as group_key
          from objects where last_seen_run = ?
         group by subtree_key
         order by level, group_key
        """,
        (run_id, run_id),
    ).fetchall()

    summaries = []
    for level, group_key in groups:
        column = "resource_key" if level == "resource" else "subtree_key"
        cursor = connection.execute(
            f"""
            select relative_path, byte_length, sha256
              from objects
             where last_seen_run = ? and {column} = ?
             order by relative_path
            """,
            (run_id, group_key),
        )
        count, byte_length, digest = digest_rows(cursor)
        role_counts = dict(
            connection.execute(
                f"""
                select role, count(*)
                  from objects
                 where last_seen_run = ? and {column} = ?
                 group by role
                 order by role
                """,
                (run_id, group_key),
            ).fetchall()
        )
        summaries.append(
            {
                "level": level,
                "group_key": group_key,
                "file_count": count,
                "bytes": byte_length,
                "aggregate_sha256": digest,
                "role_counts_json": json.dumps(role_counts, sort_keys=True),
            }
        )
    return summaries


def verify_principals(
    connection: sqlite3.Connection,
    run_id: str,
    principals: dict[str, tuple[str, int]],
) -> dict[str, object]:
    matched = 0
    mismatches = []
    missing = []
    for workspace_path, (expected_sha, expected_bytes) in principals.items():
        relative = workspace_path.removeprefix("data/raw/hadith/")
        row = connection.execute(
            """
            select sha256, byte_length
              from objects
             where relative_path = ? and last_seen_run = ?
            """,
            (relative, run_id),
        ).fetchone()
        if row is None:
            missing.append(workspace_path)
        elif row[0] != expected_sha or int(row[1]) != expected_bytes:
            mismatches.append(
                {
                    "path": workspace_path,
                    "expected_sha256": expected_sha,
                    "actual_sha256": row[0],
                    "expected_bytes": expected_bytes,
                    "actual_bytes": row[1],
                }
            )
        else:
            matched += 1
    return {
        "expected": len(principals),
        "matched": matched,
        "missing": missing,
        "mismatches": mismatches,
    }


def reconcile_acquisition(
    connection: sqlite3.Connection,
    run_id: str,
    acquisition_rows: list[dict[str, str]],
) -> list[dict[str, object]]:
    rows = []
    for acquisition in acquisition_rows:
        resource_path = normalize_path(acquisition["path"])
        resource_key = resource_path.removeprefix("data/raw/hadith/")
        actual = connection.execute(
            """
            select count(*), coalesce(sum(byte_length), 0)
              from objects
             where resource_key = ? and last_seen_run = ?
            """,
            (resource_key, run_id),
        ).fetchone()
        expected_files = int(acquisition["file_count"])
        expected_bytes = int(acquisition["bytes"])
        rows.append(
            {
                "resource_path": resource_path,
                "expected_files_including_git": expected_files,
                "registered_files_excluding_git": int(actual[0]),
                "file_difference": int(actual[0]) - expected_files,
                "expected_bytes_including_git": expected_bytes,
                "registered_bytes_excluding_git": int(actual[1]),
                "byte_difference": int(actual[1]) - expected_bytes,
                "note": "Acquisition manifest includes .git metadata; raw-object inventory excludes .git.",
            }
        )
    return rows


def write_changes_csv(connection: sqlite3.Connection, run_id: str) -> None:
    fieldnames = [
        "change_type",
        "path",
        "bytes",
        "previous_sha256",
        "current_sha256",
    ]

    def rows() -> Iterable[dict[str, object]]:
        for change_type, path, previous_sha, current_sha, byte_length in connection.execute(
            """
            select change_type, relative_path, previous_sha256,
                   current_sha256, byte_length
              from run_changes
             where run_id = ?
             order by change_type, relative_path
            """,
            (run_id,),
        ):
            yield {
                "change_type": change_type,
                "path": f"data/raw/hadith/{path}",
                "bytes": byte_length,
                "previous_sha256": previous_sha or "",
                "current_sha256": current_sha or "",
            }

    write_atomic_csv(CHANGES_CSV, fieldnames, rows())


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Inventory and hash every non-.git Hadith raw object."
    )
    parser.add_argument("--workers", type=int, default=DEFAULT_WORKERS)
    parser.add_argument("--force-rehash", action="store_true")
    parser.add_argument(
        "--fail-on-change",
        action="store_true",
        help="Return non-zero when previous objects are missing or principals mismatch.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not RAW_ROOT.exists():
        raise SystemExit(f"Missing raw Hadith directory: {RAW_ROOT}")
    principals = load_principal_checksums()
    acquisition_rows = load_acquisition_rows()
    run_id = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    connection = connect_cache()
    started_at = utc_now()

    try:
        print(
            f"Starting Hadith raw-object inventory with {args.workers} workers; "
            f"{len(principals)} principal checksums loaded.",
            flush=True,
        )
        counters = inventory_files(
            connection,
            set(principals),
            run_id,
            max(1, args.workers),
            args.force_rehash,
        )
        print("Writing object inventory CSV...", flush=True)
        write_objects_csv(connection, run_id)
        print("Computing deterministic subtree digests...", flush=True)
        subtree_rows = build_subtree_summaries(connection, run_id)
        write_atomic_csv(
            SUBTREES_CSV,
            [
                "level",
                "group_key",
                "file_count",
                "bytes",
                "aggregate_sha256",
                "role_counts_json",
            ],
            subtree_rows,
        )
        principal_verification = verify_principals(
            connection, run_id, principals
        )
        reconciliation = reconcile_acquisition(
            connection, run_id, acquisition_rows
        )
        write_changes_csv(connection, run_id)

        role_counts = dict(
            connection.execute(
                """
                select role, count(*)
                  from objects
                 where last_seen_run = ?
                 group by role order by role
                """,
                (run_id,),
            ).fetchall()
        )
        change_counts = dict(
            connection.execute(
                """
                select change_type, count(*)
                  from run_changes
                 where run_id = ?
                 group by change_type order by change_type
                """,
                (run_id,),
            ).fetchall()
        )
        category_counts = [
            {"category": category, "files": count, "bytes": byte_length}
            for category, count, byte_length in connection.execute(
                """
                select category, count(*), sum(byte_length)
                  from objects
                 where last_seen_run = ?
                 group by category order by category
                """,
                (run_id,),
            )
        ]
        whole_count, whole_bytes, whole_digest = digest_rows(
            connection.execute(
                """
                select relative_path, byte_length, sha256
                  from objects
                 where last_seen_run = ?
                 order by relative_path
                """,
                (run_id,),
            )
        )
        summary = {
            "run_id": run_id,
            "started_at": started_at,
            "completed_at": utc_now(),
            "policy": {
                "git_metadata_excluded": True,
                "per_file_sha256": True,
                "aggregate_digest_input": "relative_path|byte_length|sha256\\n sorted by relative_path",
                "cache_reuse_key": "relative_path + byte_length + mtime_ns",
                "raw_files_modified": False,
            },
            "inventory": {
                "files": whole_count,
                "bytes": whole_bytes,
                "aggregate_sha256": whole_digest,
                "role_counts": role_counts,
                "category_counts": category_counts,
                "hashed_files_this_run": counters.get("hashed", 0),
                "hashed_bytes_this_run": counters.get("hashed_bytes", 0),
                "reused_files_this_run": counters.get("reused", 0),
                "missing_since_previous_inventory": counters.get("missing", 0),
                "change_counts": change_counts,
            },
            "principal_verification": principal_verification,
            "acquisition_manifest_reconciliation": reconciliation,
            "outputs": {
                "objects_csv": OBJECTS_CSV.relative_to(ROOT).as_posix(),
                "subtrees_csv": SUBTREES_CSV.relative_to(ROOT).as_posix(),
                "changes_csv": CHANGES_CSV.relative_to(ROOT).as_posix(),
                "cache": CACHE_PATH.relative_to(ROOT).as_posix(),
            },
        }
        SUMMARY_JSON.parent.mkdir(parents=True, exist_ok=True)
        temporary_summary = SUMMARY_JSON.with_suffix(".json.tmp")
        temporary_summary.write_text(
            json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        temporary_summary.replace(SUMMARY_JSON)
        print(json.dumps(summary["inventory"], indent=2), flush=True)
        print(
            json.dumps(summary["principal_verification"], indent=2), flush=True
        )

        has_failure = bool(
            principal_verification["missing"]
            or principal_verification["mismatches"]
            or (args.fail_on_change and change_counts)
        )
        return 1 if has_failure else 0
    finally:
        connection.close()


if __name__ == "__main__":
    sys.exit(main())
