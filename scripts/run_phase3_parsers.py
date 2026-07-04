#!/usr/bin/env python3
"""
RAFIQ Phase 3 – Run all parsers in sequence and print a summary.

Usage:
    python scripts/run_phase3_parsers.py [project_root]

Runs:
    1. parse_quran_ayah_texts.py
    2. parse_quran_partitions.py
    3. parse_translation_texts.py
    4. parse_hadith_fawaz.py

Then prints a verification table from the database.
"""

import sys
import subprocess
from pathlib import Path

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent
SCRIPTS = ROOT / "scripts"

PARSERS = [
    "parse_quran_ayah_texts.py",
    "parse_quran_partitions.py",
    "parse_translation_texts.py",
    "parse_hadith_fawaz.py",
]


def run(script_name: str):
    print(f"\n{'='*60}")
    print(f"  {script_name}")
    print(f"{'='*60}")
    result = subprocess.run(
        [sys.executable, str(SCRIPTS / script_name), str(ROOT)],
        check=False,
    )
    if result.returncode != 0:
        print(f"\n[FAILED] {script_name} exited with code {result.returncode}")
        return False
    return True


def verify():
    sys.path.insert(0, str(SCRIPTS))
    from db_utils import get_connection

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            checks = [
                ("import_runs completed",
                 "SELECT COUNT(*) FROM ingest.import_runs WHERE status='completed'"),
                ("import_runs failed",
                 "SELECT COUNT(*) FROM ingest.import_runs WHERE status='failed'"),
                ("source_records total",
                 "SELECT COUNT(*) FROM staging.source_records"),
                ("quran_ayah_texts",
                 "SELECT COUNT(*) FROM staging.quran_ayah_texts"),
                ("quran_partitions",
                 "SELECT COUNT(*) FROM staging.quran_partitions"),
                ("translation_texts",
                 "SELECT COUNT(*) FROM staging.translation_texts"),
                ("hadith_records",
                 "SELECT COUNT(*) FROM staging.hadith_records"),
                ("hadith_text_versions",
                 "SELECT COUNT(*) FROM staging.hadith_text_versions"),
            ]
            print(f"\n{'='*60}")
            print("  PHASE 3 VERIFICATION")
            print(f"{'='*60}")
            all_ok = True
            for label, sql in checks:
                cur.execute(sql)
                count = cur.fetchone()[0]
                status = ""
                # Expected minimums
                minimums = {
                    "quran_ayah_texts":    18700,
                    "quran_partitions":    1560,
                    "translation_texts":   44000,
                    "hadith_records":      3000,
                    "hadith_text_versions":10000,
                    "source_records":      60000,
                }
                if label in minimums:
                    if count >= minimums[label]:
                        status = "PASS"
                    else:
                        status = f"FAIL (expected >= {minimums[label]})"
                        all_ok = False
                print(f"  {label:<30} {count:>8}  {status}")

            print(f"\n{'='*60}")
            if all_ok:
                print("  Phase 3 PASSED")
            else:
                print("  Phase 3 has FAILURES — review above")
            print(f"{'='*60}")
    finally:
        conn.close()


def main():
    failed = []
    for parser in PARSERS:
        ok = run(parser)
        if not ok:
            failed.append(parser)

    if failed:
        print(f"\nFAILED parsers: {', '.join(failed)}")
    else:
        print("\nAll parsers completed.")

    verify()


if __name__ == "__main__":
    main()
