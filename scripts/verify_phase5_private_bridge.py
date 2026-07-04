#!/usr/bin/env python3
"""
Smoke-test the RAFIQ private bridge database calls without starting HTTP.
"""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "apps" / "private-bridge"))

import server  # noqa: E402


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    quran = server.get_quran_surah(1)
    require(quran["notice"]["label"] == "UNAPPROVED CONTENT - NOT FOR PUBLICATION", "missing private notice")
    require(len(quran["ayahs"]) == 7, "surah 1 should have 7 ayahs")
    require(quran["editions"]["translation"]["editionKey"] == "qul-en-sahih-simple", "unexpected translation default")

    collections = server.list_hadith_collections()
    require(len(collections["collections"]) == 70, "expected 70 hadith collections")

    records = server.list_hadith_records("fawaz-linebyline:bukhari", "english", 3, 0)
    require(records["pagination"]["total"] == 7563, "expected bukhari total 7563")
    require(len(records["records"]) == 3, "expected 3 hadith records")

    record_id = records["records"][0]["hadithRecordId"]
    detail = server.get_hadith_record(record_id)
    require(detail["notice"]["label"] == "UNAPPROVED CONTENT - NOT FOR PUBLICATION", "missing detail notice")
    require(len(detail["textVersions"]) > 0, "hadith detail should have text versions")

    print(json.dumps({
        "status": "pass",
        "quranAyahs": len(quran["ayahs"]),
        "hadithCollections": len(collections["collections"]),
        "hadithBukhariTotal": records["pagination"]["total"],
        "detailTextVersions": len(detail["textVersions"]),
    }, indent=2))


if __name__ == "__main__":
    main()
