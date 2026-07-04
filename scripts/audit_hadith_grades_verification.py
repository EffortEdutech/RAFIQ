from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

import openpyxl


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "hadith"
OUT = ROOT / "data" / "staging_reports" / "hadith" / "day6"
OUT.mkdir(parents=True, exist_ok=True)


def normalized_bucket(value: Any) -> str:
    text = str(value or "").strip().lower()
    text = text.replace("’", "'").replace("‘", "'")
    if not text or text == "nan":
        return "unknown"
    if any(term in text for term in ("mawdu", "maudhu", "palsu", "fabricat", "موضوع")):
        return "fabricated"
    if any(term in text for term in ("tiada asal", "no basis", "no origin")):
        return "no_origin"
    if any(term in text for term in ("tidak sahih", "not sahih", "not authentic")):
        return "not_sahih"
    if any(term in text for term in ("dhaif", "daif", "da'if", "weak", "ضعيف")):
        return "daif"
    if ("hasan" in text or "حسن" in text) and ("sahih" in text or "صحيح" in text):
        return "hasan_sahih"
    if any(term in text for term in ("hasan", "good", "حسن")):
        return "hasan"
    if any(term in text for term in ("sahih", "authentic", "صحيح")):
        return "sahih"
    return "other"


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    if not rows:
        path.write_text("", encoding="utf-8")
        return
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def add_vocab(
    vocabulary: Counter[tuple[str, str, str, str, str]],
    source: str,
    collection: str,
    grader: str,
    raw_grade: Any,
) -> str:
    raw = str(raw_grade or "").strip()
    bucket = normalized_bucket(raw)
    if raw:
        vocabulary[(source, collection, grader or "", raw, bucket)] += 1
    return bucket


def audit_fawaz(
    vocabulary: Counter[tuple[str, str, str, str, str]]
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    root = RAW / "collections" / "fawaz-hadith-api-v1" / "editions"
    summaries: list[dict[str, Any]] = []
    conflicts: list[dict[str, Any]] = []
    for path in sorted(root.glob("eng-*.json")):
        if path.name.endswith(".min.json"):
            continue
        collection = path.stem.removeprefix("eng-")
        value = json.loads(path.read_text(encoding="utf-8-sig"))
        records = value.get("hadiths", [])
        graded_records = 0
        assertions = 0
        graders: Counter[str] = Counter()
        conflict_records = 0
        for item in records:
            grades = item.get("grades") or []
            if grades:
                graded_records += 1
            buckets: set[str] = set()
            rendered = []
            for assertion in grades:
                grader = str(assertion.get("name") or "").strip()
                raw_grade = assertion.get("grade") or ""
                bucket = add_vocab(
                    vocabulary, "fawaz", collection, grader, raw_grade
                )
                assertions += 1
                graders[grader or "(blank)"] += 1
                if bucket not in {"unknown", "other"}:
                    buckets.add(bucket)
                rendered.append(f"{grader}: {raw_grade}")
            if len(buckets) > 1:
                conflict_records += 1
                conflicts.append(
                    {
                        "source": "fawaz",
                        "collection": collection,
                        "hadith_number": item.get("hadithnumber") or "",
                        "normalized_buckets": "|".join(sorted(buckets)),
                        "assertions": " || ".join(rendered),
                    }
                )
        summaries.append(
            {
                "source": "fawaz",
                "collection": collection,
                "records": len(records),
                "graded_records": graded_records,
                "grade_assertions": assertions,
                "distinct_graders": len(graders),
                "top_graders": " | ".join(
                    f"{name}:{count}" for name, count in graders.most_common(8)
                ),
                "conflict_records": conflict_records,
                "provenance_note": "Named per-record grade assertions; upstream edition provenance remains incomplete.",
            }
        )
    return summaries, conflicts


def audit_meeatif(
    vocabulary: Counter[tuple[str, str, str, str, str]]
) -> list[dict[str, Any]]:
    root = RAW / "multilingual" / "hf-meeatif-hadith-datasets"
    summaries = []
    for path in sorted(root.glob("*.csv")):
        collection = path.stem
        records = 0
        graded = 0
        graders: Counter[str] = Counter()
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            for item in csv.DictReader(handle):
                records += 1
                raw = str(item.get("Grade") or "").strip()
                if not raw:
                    continue
                graded += 1
                match = re.match(r"^(.*?)\s*\(([^()]*)\)\s*$", raw)
                grade, grader = (match.group(1), match.group(2)) if match else (raw, "")
                add_vocab(vocabulary, "meeatif", collection, grader, grade)
                graders[grader or "(not separated)"] += 1
        summaries.append(
            {
                "source": "meeatif",
                "collection": collection,
                "records": records,
                "graded_records": graded,
                "grade_assertions": graded,
                "distinct_graders": len(graders),
                "top_graders": " | ".join(
                    f"{name}:{count}" for name, count in graders.most_common(8)
                ),
                "conflict_records": "",
                "provenance_note": "Single display string; grader sometimes encoded in parentheses.",
            }
        )
    return summaries


def audit_lk(
    vocabulary: Counter[tuple[str, str, str, str, str]]
) -> list[dict[str, Any]]:
    root = RAW / "research" / "lk-hadith-corpus"
    summaries = []
    for directory in sorted(
        path for path in root.iterdir() if path.is_dir() and path.name != ".git"
    ):
        records = 0
        graded = 0
        bilingual_disagreements = 0
        for path in sorted(directory.glob("*.csv")):
            with path.open("r", encoding="utf-8-sig", newline="") as handle:
                for item in csv.DictReader(handle):
                    records += 1
                    english = str(item.get("English_Grade") or "").strip()
                    arabic = str(item.get("Arabic_Grade") or "").strip()
                    if english.lower() == "nan":
                        english = ""
                    if arabic.lower() == "nan":
                        arabic = ""
                    if english or arabic:
                        graded += 1
                    left = add_vocab(
                        vocabulary, "lk", directory.name, "", english
                    )
                    right = add_vocab(
                        vocabulary, "lk_arabic", directory.name, "", arabic
                    )
                    if (
                        left not in {"unknown", "other"}
                        and right not in {"unknown", "other"}
                        and left != right
                    ):
                        bilingual_disagreements += 1
        summaries.append(
            {
                "source": "lk",
                "collection": directory.name,
                "records": records,
                "graded_records": graded,
                "grade_assertions": graded,
                "distinct_graders": 0,
                "top_graders": "",
                "conflict_records": bilingual_disagreements,
                "provenance_note": "Bilingual grade labels; no explicit grader column. Non-Bukhari segmentation is automated.",
            }
        )
    return summaries


def audit_abdullah(
    vocabulary: Counter[tuple[str, str, str, str, str]]
) -> list[dict[str, Any]]:
    root = RAW / "collections" / "abdullah-naseer-six-books" / "src"
    summaries = []
    for path in sorted(root.glob("*.json")):
        records = json.loads(path.read_text(encoding="utf-8-sig"))["hadiths"]["data"]
        for item in records:
            add_vocab(vocabulary, "abdullah_naseer", path.stem, "", item.get("status"))
        summaries.append(
            {
                "source": "abdullah_naseer",
                "collection": path.stem,
                "records": len(records),
                "graded_records": len(records),
                "grade_assertions": len(records),
                "distinct_graders": 0,
                "top_graders": "",
                "conflict_records": "",
                "provenance_note": "README explicitly says status is not accurately represented; do not import as authoritative grade.",
            }
        )
    return summaries


def audit_semakhadis() -> dict[str, Any]:
    root = RAW / "verification"
    workbook_path = (
        root
        / "semakhadis-api"
        / "database"
        / "seeds"
        / "seeder_csv"
        / "hadith_seeder.xlsx"
    )
    workbook = openpyxl.load_workbook(workbook_path, read_only=True, data_only=True)
    workbook_sheets = []
    for sheet in workbook.worksheets:
        iterator = sheet.iter_rows(values_only=True)
        headers = [str(value or "") for value in next(iterator, [])]
        rows = list(iterator)
        status_index = headers.index("STATUS") if "STATUS" in headers else None
        researcher_index = (
            headers.index("ULAMA/PENGKAJI HADIS")
            if "ULAMA/PENGKAJI HADIS" in headers
            else None
        )
        workbook_sheets.append(
            {
                "sheet": sheet.title,
                "records": len(rows),
                "headers": headers,
                "nonblank_by_column": [
                    {
                        "index": index + 1,
                        "header": headers[index],
                        "nonblank": sum(
                            1
                            for row in rows
                            if index < len(row)
                            and row[index] is not None
                            and str(row[index]).strip()
                        ),
                    }
                    for index in range(len(headers))
                ],
                "status_vocabulary": (
                    dict(
                        Counter(
                            str(row[status_index] or "").strip()
                            for row in rows
                            if status_index < len(row)
                        )
                    )
                    if status_index is not None
                    else {}
                ),
                "researcher_vocabulary": (
                    dict(
                        Counter(
                            str(row[researcher_index] or "").strip()
                            for row in rows
                            if researcher_index < len(row)
                        )
                    )
                    if researcher_index is not None
                    else {}
                ),
            }
        )
    workbook.close()

    mock_path = root / "semakhadis-frontend" / "src" / "mock" / "mock.json"
    mock = json.loads(mock_path.read_text(encoding="utf-8-sig"))["hadith"]
    statuses = Counter(str(item.get("status_hadith") or "").strip() for item in mock)
    return {
        "api_repository_archived": True,
        "repository_archive_date": "2020-09-08",
        "classification_statuses": [
            "draft",
            "sahih",
            "palsu",
            "hasan",
            "dhaif",
            "maudhu",
            "tidak sahih",
        ],
        "editorial_progress_statuses": [
            "draf",
            "diterbitkan",
            "disemak",
            "dibuang",
        ],
        "workbook": workbook_sheets,
        "mock_records": len(mock),
        "mock_status_vocabulary": dict(statuses),
        "mock_researcher_blank": sum(
            1 for item in mock if not str(item.get("pengkaji-hadis") or "").strip()
        ),
        "mock_arabic_blank": sum(
            1 for item in mock if not str(item.get("text_arab") or "").strip()
        ),
        "mock_references_blank": sum(
            1 for item in mock if not (item.get("rujukan") or [])
        ),
        "mock_mojibake_candidates": sum(
            1
            for item in mock
            if any(
                marker in str(item.get(field) or "")
                for field in ("text_arab", "text_melayu", "status_hadith")
                for marker in ("Ø", "Ù", "â", "Ã", "�")
            )
        ),
        "assessment": "Repository schema/sample only; not a complete authoritative verification export.",
    }


def main() -> None:
    vocabulary: Counter[tuple[str, str, str, str, str]] = Counter()
    summaries, conflicts = audit_fawaz(vocabulary)
    summaries.extend(audit_meeatif(vocabulary))
    summaries.extend(audit_lk(vocabulary))
    summaries.extend(audit_abdullah(vocabulary))

    vocab_rows = [
        {
            "source": source,
            "collection": collection,
            "grader": grader,
            "raw_grade": raw_grade,
            "normalized_bucket": bucket,
            "count": count,
        }
        for (source, collection, grader, raw_grade, bucket), count in sorted(
            vocabulary.items()
        )
    ]
    write_csv(OUT / "grade_source_summary.csv", summaries)
    write_csv(OUT / "grade_vocabulary.csv", vocab_rows)
    write_csv(OUT / "fawaz_grade_conflicts.csv", conflicts)
    semakhadis = audit_semakhadis()
    (OUT / "semakhadis_profile.json").write_text(
        json.dumps(semakhadis, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    summary = {
        "grade_source_profiles": len(summaries),
        "raw_grade_vocabulary_rows": len(vocab_rows),
        "fawaz_conflict_records": len(conflicts),
        "semakhadis_mock_records": semakhadis["mock_records"],
        "semakhadis_workbook_sheets": len(semakhadis["workbook"]),
    }
    (OUT / "day6_summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
