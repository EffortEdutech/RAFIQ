#!/usr/bin/env python3
"""
RAFIQ Phase 2: Source Registry V2 Population
Reads: data/manifests/*.json, data/manifests/hadith-acquisition-resources-2026-06-14.csv,
       data/checksums/SHA256SUMS.txt, data/checksums/HADITH_PRINCIPAL_SHA256_2026-06-14.csv
Writes: supabase/migrations/20260615000001_phase2_source_registry.sql

All UUIDs are deterministic (uuid5) under the RAFIQ namespace -- re-running this
script always produces byte-for-byte identical SQL.
"""

import json
import csv
import uuid
import sys
from pathlib import Path

# -- RAFIQ deterministic namespace
RAFIQ_NS = uuid.UUID("b5d4f3a2-1c9e-4d7f-8b5e-3a2f4c6d8e9f")


def u5(seed: str) -> str:
    return str(uuid.uuid5(RAFIQ_NS, f"rafiq:{seed}"))


def q(s) -> str:
    if s is None or s == "":
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"


def b(v) -> str:
    return "true" if v else "false"


# -- Static source registry definitions
SOURCE_REGISTRY = [
    dict(source_key="tanzil", name="Tanzil Project", provider="Tanzil Project",
         domain="quran", official_url="https://tanzil.net", repository_url=None,
         documentation_url="https://tanzil.net/docs/", authority_class="scholarly"),
    dict(source_key="qul", name="Quranic Universal Library", provider="TarteelAI",
         domain="quran_and_islamic_studies", official_url="https://qul.tarteel.ai",
         repository_url="https://github.com/TarteelAI/quranic-universal-library",
         documentation_url="https://qul.tarteel.ai/resources", authority_class="institutional"),
    dict(source_key="hadith-fawaz-hadith-api", name="Fawaz Ahmed Hadith API",
         provider="Fawaz Ahmed", domain="hadith",
         official_url="https://github.com/fawazahmed0/hadith-api",
         repository_url="https://github.com/fawazahmed0/hadith-api",
         documentation_url=None, authority_class="open_corpus"),
    dict(source_key="hadith-abdullah-naseer-six-books", name="Abdullah Naseer Six Books",
         provider="Abdullah Naseer", domain="hadith",
         official_url="https://github.com/AbdullahNaseer/six-books",
         repository_url="https://github.com/AbdullahNaseer/six-books",
         documentation_url=None, authority_class="candidate"),
    dict(source_key="hadith-hf-all-hadiths-cleaned", name="All Hadiths Cleaned (HuggingFace)",
         provider="HuggingFace Dataset", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="research"),
    dict(source_key="hadith-hf-fawaz-hadith-data", name="Fawaz Hadith Data (HuggingFace)",
         provider="Fawaz Ahmed / HuggingFace", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="open_corpus"),
    dict(source_key="hadith-hf-jimlam-hadith-data", name="jimlam Hadith Data (HuggingFace)",
         provider="jimlam / HuggingFace", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="research"),
    dict(source_key="hadith-hf-jimlam-hadith-data-hyphen",
         name="jimlam Hadith Data Hyphen (HuggingFace)",
         provider="jimlam / HuggingFace", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="research"),
    dict(source_key="hadith-hf-maic-all-hadith", name="MAIC All Hadith (HuggingFace)",
         provider="MAIC / HuggingFace", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="research"),
    dict(source_key="hadith-hf-ronnieaban-sunnah", name="ronnieaban Sunnah (HuggingFace)",
         provider="ronnieaban / HuggingFace", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="research"),
    dict(source_key="hadith-hf-sarfarazmir-hadith-dataset",
         name="sarfarazmir Hadith Dataset (HuggingFace)",
         provider="sarfarazmir / HuggingFace", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="research"),
    dict(source_key="hadith-hf-abdo-arabic-hadith", name="abdo Arabic Hadith (HuggingFace)",
         provider="abdo / HuggingFace", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="research"),
    dict(source_key="hadith-hf-meeatif-hadith-datasets",
         name="MeeAtif Hadith Datasets (HuggingFace)",
         provider="MeeAtif / HuggingFace", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="research"),
    dict(source_key="hadith-hf-sarnsrun-hadiths", name="sarnsrun Hadiths (HuggingFace)",
         provider="sarnsrun / HuggingFace", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="research"),
    dict(source_key="hadith-sunnah-com", name="Sunnah.com API",
         provider="Islamic Network", domain="hadith",
         official_url="https://sunnah.com",
         repository_url="https://github.com/sunnah-com",
         documentation_url="https://api.sunnah.com", authority_class="official"),
    dict(source_key="hadith-ahmedbaset", name="AhmedBaset Hadith JSON and API",
         provider="AhmedBaset", domain="hadith",
         official_url=None, repository_url="https://github.com/AhmedBaset",
         documentation_url=None, authority_class="candidate"),
    dict(source_key="hadith-hf-sunnah-ar-en",
         name="Sunnah Arabic-English (HuggingFace, Quarantined)",
         provider="HuggingFace Dataset", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="candidate"),
    dict(source_key="hadith-hf-sunnah-dataset",
         name="Sunnah Dataset (HuggingFace, Quarantined)",
         provider="HuggingFace Dataset", domain="hadith",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="candidate"),
    dict(source_key="hadith-hf-arbml", name="ARBML Hadith Corpora (HuggingFace)",
         provider="ARBML / HuggingFace", domain="hadith",
         official_url="https://huggingface.co/arbml",
         repository_url="https://github.com/ARBML",
         documentation_url=None, authority_class="research"),
    dict(source_key="hadith-hf-ar-quran-hadith14books-msa",
         name="Arabic Quran Hadith 14 Books MSA (HuggingFace)",
         provider="HuggingFace Dataset", domain="hadith_and_quran",
         official_url="https://huggingface.co/datasets",
         repository_url=None, documentation_url=None, authority_class="research"),
    dict(source_key="hadith-lk-hadith-corpus", name="LK Hadith Corpus",
         provider="LK Research", domain="hadith",
         official_url=None, repository_url=None, documentation_url=None,
         authority_class="research"),
    dict(source_key="hadith-semakhadis", name="SemakHadis",
         provider="SemakHadis", domain="hadith",
         official_url="https://semakhadis.com",
         repository_url=None, documentation_url=None, authority_class="official"),
]

MANIFEST_SOURCE_KEY = {
    "tanzil-quran-uthmani-v1.1": "tanzil",
    "tanzil-quran-metadata-v1.0": "tanzil",
    "tanzil-translation-en-sahih": "tanzil",
    "tanzil-translation-id-indonesian": "tanzil",
    "tanzil-translation-ms-basmeih": "tanzil",
    "qul-quran-script-uthmani-88": "qul",
    "qul-quran-script-qpc-hafs-86": "qul",
    "qul-quran-metadata-63-70": "qul",
    "qul-translation-saheeh-193": "qul",
    "qul-translation-malay-292": "qul",
    "qul-tafsir-english-ibn-kathir-35": "qul",
    "qul-tafsir-english-mukhtasar-266": "qul",
    "qul-tafsir-arabic-saadi-308": "qul",
    "qul-topics-45": "qul",
    "qul-ayah-themes-62": "qul",
    "qul-day4-ayah-theme-public-evidence": "qul",
    "qul-day4-tafsir-public-evidence": "qul",
    "qul-day4-topics-public-evidence": "qul",
}

STATUS_MAP = {
    "staging_only": dict(technical_status="validated", rights_status="verified",
                         attribution_status="pending", content_status="raw",
                         publication_status="private_only"),
    "raw_validated_rights_blocked": dict(technical_status="validated", rights_status="unknown",
                                         attribution_status="unknown", content_status="raw",
                                         publication_status="private_only"),
    "raw_validated_quality_and_rights_blocked": dict(technical_status="validated_with_findings",
                                                     rights_status="unknown",
                                                     attribution_status="unknown",
                                                     content_status="raw",
                                                     publication_status="private_only"),
    "raw_validated_rights_and_attribution_blocked": dict(technical_status="validated",
                                                         rights_status="unknown",
                                                         attribution_status="unknown",
                                                         content_status="raw",
                                                         publication_status="private_only"),
    "schema_discovery_only": dict(technical_status="profiled", rights_status="unknown",
                                   attribution_status="unknown", content_status="raw",
                                   publication_status="private_only"),
}

HADITH_PATH_TO_SOURCE_KEY = {
    "data/raw/hadith/collections/fawaz-hadith-api-v1": "hadith-fawaz-hadith-api",
    "data/raw/hadith/collections/abdullah-naseer-six-books": "hadith-abdullah-naseer-six-books",
    "data/raw/hadith/collections/hf-all-hadiths-cleaned": "hadith-hf-all-hadiths-cleaned",
    "data/raw/hadith/collections/hf-fawaz-hadith-data": "hadith-hf-fawaz-hadith-data",
    "data/raw/hadith/collections/hf-jimlam-hadith-data": "hadith-hf-jimlam-hadith-data",
    "data/raw/hadith/collections/hf-jimlam-hadith-data-hyphen": "hadith-hf-jimlam-hadith-data-hyphen",
    "data/raw/hadith/collections/hf-maic-all-hadith": "hadith-hf-maic-all-hadith",
    "data/raw/hadith/collections/hf-ronnieaban-sunnah": "hadith-hf-ronnieaban-sunnah",
    "data/raw/hadith/collections/hf-sarfarazmir-hadith-dataset": "hadith-hf-sarfarazmir-hadith-dataset",
    "data/raw/hadith/multilingual/hf-abdo-arabic-hadith": "hadith-hf-abdo-arabic-hadith",
    "data/raw/hadith/multilingual/hf-meeatif-hadith-datasets": "hadith-hf-meeatif-hadith-datasets",
    "data/raw/hadith/multilingual/hf-sarnsrun-hadiths": "hadith-hf-sarnsrun-hadiths",
    "data/raw/hadith/official/sunnah-com-api": "hadith-sunnah-com",
    "data/raw/hadith/quarantined/ahmedbaset-hadith-api": "hadith-ahmedbaset",
    "data/raw/hadith/quarantined/ahmedbaset-hadith-json-v1.2.0": "hadith-ahmedbaset",
    "data/raw/hadith/quarantined/hf-sunnah-ar-en": "hadith-hf-sunnah-ar-en",
    "data/raw/hadith/quarantined/hf-sunnah-dataset": "hadith-hf-sunnah-dataset",
    "data/raw/hadith/research/hf-arbml-hadith": "hadith-hf-arbml",
    "data/raw/hadith/research/hf-arbml-lk-hadith": "hadith-hf-arbml",
    "data/raw/hadith/research/hf-arbml-quran-hadith": "hadith-hf-arbml",
    "data/raw/hadith/research/hf-ar-quran-hadith14books-msa": "hadith-hf-ar-quran-hadith14books-msa",
    "data/raw/hadith/research/lk-hadith-corpus": "hadith-lk-hadith-corpus",
    "data/raw/hadith/verification/semakhadis-api": "hadith-semakhadis",
    "data/raw/hadith/verification/semakhadis-frontend": "hadith-semakhadis",
}

FILE_TO_SNAPSHOT_KEY = {
    "data/raw/quran/tanzil/quran-uthmani-with-ayah-numbers.txt": "tanzil-quran-uthmani-v1.1",
    "data/raw/quran/tanzil/quran-data.xml": "tanzil-quran-metadata-v1.0",
    "data/raw/quran/tanzil/Text_License.html": "tanzil-quran-uthmani-v1.1",
    "data/raw/translations/tanzil/en.sahih.txt": "tanzil-translation-en-sahih",
    "data/raw/translations/tanzil/ms.basmeih.txt": "tanzil-translation-ms-basmeih",
    "data/raw/translations/tanzil/id.indonesian.txt": "tanzil-translation-id-indonesian",
    "data/raw/day4/qul-evidence/ayah-theme-62.html": "qul-day4-ayah-theme-public-evidence",
    "data/raw/day4/qul-evidence/copyright-ayah-theme-62.html": "qul-day4-ayah-theme-public-evidence",
    "data/raw/day4/qul-evidence/resources.html": "qul-day4-tafsir-public-evidence",
    "data/raw/day4/qul-evidence/tafsir-catalog.html": "qul-day4-tafsir-public-evidence",
    "data/raw/day4/qul-evidence/tafsir-english-mukhtasar-266.html": "qul-day4-tafsir-public-evidence",
    "data/raw/day4/qul-evidence/tafsir-ibn-kathir-en-35.html": "qul-day4-tafsir-public-evidence",
    "data/raw/day4/qul-evidence/tafsir-saadi-ar-308.html": "qul-day4-tafsir-public-evidence",
    "data/raw/day4/qul-evidence/copyright-tafsir-ibn-kathir-35.html": "qul-day4-tafsir-public-evidence",
    "data/raw/day4/qul-evidence/copyright-tafsir-mukhtasar-266.html": "qul-day4-tafsir-public-evidence",
    "data/raw/day4/qul-evidence/copyright-tafsir-saadi-308.html": "qul-day4-tafsir-public-evidence",
    "data/raw/day4/qul-evidence/topics-45.html": "qul-day4-topics-public-evidence",
    "data/raw/day4/qul-evidence/copyright-topics-45.html": "qul-day4-topics-public-evidence",
    "data/raw/tafsir/ar-tafseer-al-saddi.json": "qul-tafsir-arabic-saadi-308",
    "data/raw/tafsir/ar-tafseer-al-saddi.db": "qul-tafsir-arabic-saadi-308",
    "data/raw/tafsir/ayah-themes.db": "qul-ayah-themes-62",
    "data/raw/tafsir/en-tafisr-Al-Mukhtasar.json": "qul-tafsir-english-mukhtasar-266",
    "data/raw/tafsir/en-tafisr-Al-Mukhtasar.db": "qul-tafsir-english-mukhtasar-266",
    "data/raw/tafsir/en-tafisr-ibn-kathir.json": "qul-tafsir-english-ibn-kathir-35",
    "data/raw/tafsir/en-tafisr-ibn-kathir.db": "qul-tafsir-english-ibn-kathir-35",
    "data/raw/tafsir/topics.db": "qul-topics-45",
    "data/raw/quran/qul/qpc-hafs.json": "qul-quran-script-qpc-hafs-86",
    "data/raw/quran/qul/qpc-hafs.db": "qul-quran-script-qpc-hafs-86",
    "data/raw/quran/qul/uthmani.json": "qul-quran-script-uthmani-88",
    "data/raw/quran/qul/uthmani.db": "qul-quran-script-uthmani-88",
    **{f"data/raw/quran/qul/quran-metadata-{k}.json": "qul-quran-metadata-63-70"
       for k in ["ayah", "hizb", "juz", "manzil", "rub", "ruku", "sajda", "surah-name"]},
    **{f"data/raw/quran/qul/quran-metadata-{k}.sqlite": "qul-quran-metadata-63-70"
       for k in ["ayah", "hizb", "juz", "manzil", "rub", "ruku", "sajda", "surah-name"]},
    "data/raw/translations/qul/abdullah-basamia-simple.json": "qul-translation-malay-292",
    "data/raw/translations/qul/abdullah-basamia-simple.db": "qul-translation-malay-292",
    "data/raw/translations/qul/en-sahih-international-simple.json": "qul-translation-saheeh-193",
    "data/raw/translations/qul/en-sahih-international-simple.db": "qul-translation-saheeh-193",
    "data/raw/translations/qul/en-sahih-international-inline-footnotes.json": "qul-translation-saheeh-193",
    "data/raw/translations/qul/en-sahih-international-inline-footnotes.db": "qul-translation-saheeh-193",
    "data/raw/translations/qul/en-sahih-international-with-footnote-tags.json": "qul-translation-saheeh-193",
    "data/raw/translations/qul/en-sahih-international-with-footnote-tags.db": "qul-translation-saheeh-193",
    "data/raw/translations/qul/en-sahih-international-chunks.json": "qul-translation-saheeh-193",
    "data/raw/translations/qul/en-sahih-international-chunks.db": "qul-translation-saheeh-193",
}

EXT_FORMAT_MEDIA = {
    "txt":     ("text",    "text/plain"),
    "xml":     ("xml",     "application/xml"),
    "json":    ("json",    "application/json"),
    "jsonl":   ("jsonl",   "application/jsonl"),
    "html":    ("html",    "text/html"),
    "db":      ("sqlite",  "application/vnd.sqlite3"),
    "sqlite":  ("sqlite",  "application/vnd.sqlite3"),
    "parquet": ("parquet", "application/vnd.apache.parquet"),
    "csv":     ("csv",     "text/csv"),
    "gz":      ("gzip",    "application/gzip"),
    "zip":     ("zip",     "application/zip"),
    "xlsx":    ("xlsx",    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
}


def infer_format_media(path: str):
    ext = path.rsplit(".", 1)[-1].lower() if "." in path else ""
    return EXT_FORMAT_MEDIA.get(ext, ("binary", "application/octet-stream"))


def infer_role(path: str) -> str:
    lower = path.lower()
    if "day4" in lower or "evidence" in lower:
        return "schema_evidence"
    if "license" in lower or "text_license" in lower:
        return "license_terms"
    ext = path.rsplit(".", 1)[-1].lower() if "." in path else ""
    if ext in ("db", "sqlite"):
        return "companion"
    return "payload"


def infer_parse_eligible(path: str, role: str) -> bool:
    if role in ("schema_evidence", "license_terms"):
        return False
    ext = path.rsplit(".", 1)[-1].lower() if "." in path else ""
    if ext in ("db", "sqlite"):
        return False
    return True


def hadith_snapshot_statuses(snap_path: str) -> dict:
    if "/quarantined/" in snap_path:
        return dict(technical_status="validated", rights_status="unknown",
                    attribution_status="unknown", content_status="raw",
                    publication_status="private_only")
    if "semakhadis" in snap_path:
        return dict(technical_status="validated_with_findings", rights_status="unknown",
                    attribution_status="unknown", content_status="raw",
                    publication_status="private_only")
    if "/official/" in snap_path:
        return dict(technical_status="validated", rights_status="requested",
                    attribution_status="unknown", content_status="raw",
                    publication_status="private_only")
    if "fawaz-hadith-api" in snap_path:
        return dict(technical_status="validated", rights_status="verified",
                    attribution_status="pending", content_status="raw",
                    publication_status="private_only")
    return dict(technical_status="validated", rights_status="unknown",
                attribution_status="unknown", content_status="raw",
                publication_status="private_only")


def main():
    root = Path(__file__).parent.parent
    if len(sys.argv) > 1:
        root = Path(sys.argv[1])

    manifests_dir = root / "data" / "manifests"
    checksums_file = root / "data" / "checksums" / "SHA256SUMS.txt"
    hadith_resources_csv = root / "data" / "manifests" / "hadith-acquisition-resources-2026-06-14.csv"
    hadith_principal_csv = root / "data" / "checksums" / "HADITH_PRINCIPAL_SHA256_2026-06-14.csv"
    output_file = root / "supabase" / "migrations" / "20260615000001_phase2_source_registry.sql"

    lines = []

    def emit(s=""):
        lines.append(s)

    emit("-- ============================================================")
    emit("-- RAFIQ Phase 2: Complete Source Registry and Raw Registration")
    emit("-- Generated by: scripts/generate_phase2_migration.py")
    emit("-- DO NOT EDIT BY HAND. Re-run the generator to regenerate.")
    emit("-- ============================================================")
    emit()
    emit("-- All inserts are idempotent (ON CONFLICT DO NOTHING).")
    emit("-- UUIDs are deterministic uuid5 under the RAFIQ namespace.")
    emit("-- Namespace: b5d4f3a2-1c9e-4d7f-8b5e-3a2f4c6d8e9f")
    emit()
    emit("begin;")
    emit()

    # ── Section 1: source_registry ──────────────────────────────────────────────
    emit("-- Section 1: source_registry (" + str(len(SOURCE_REGISTRY)) + " rows)")
    emit()
    emit("insert into ingest.source_registry")
    emit("  (id, source_key, name, provider, domain,")
    emit("   official_url, repository_url, documentation_url,")
    emit("   authority_class, active, created_at)")
    emit("values")

    src_rows = []
    for s in SOURCE_REGISTRY:
        sid = u5("source:" + s["source_key"])
        row = (
            "  (" + q(sid) + ", " + q(s["source_key"]) + ", " + q(s["name"]) + ", "
            + q(s.get("provider")) + ", " + q(s["domain"]) + ",\n"
            "   " + q(s.get("official_url")) + ", " + q(s.get("repository_url")) + ", "
            + q(s.get("documentation_url")) + ",\n"
            "   " + q(s["authority_class"]) + ", true, now())"
        )
        src_rows.append(row)
    emit(",\n".join(src_rows))
    emit("on conflict (source_key) do nothing;")
    emit()

    # ── Section 2a: source_snapshots from V1 manifests ──────────────────────────
    emit("-- Section 2a: source_snapshots from V1 manifests")
    emit()

    manifests = []
    for jf in sorted(manifests_dir.glob("*.json")):
        with open(jf, encoding="utf-8") as fh:
            data = json.load(fh)
        manifests.append(data)

    emit("insert into ingest.source_snapshots")
    emit("  (id, source_id, snapshot_key, upstream_version, branch, commit_hash,")
    emit("   acquired_at, acquisition_method,")
    emit("   license_name, license_url, attribution_text,")
    emit("   technical_status, rights_status, attribution_status,")
    emit("   content_status, publication_status,")
    emit("   expected_record_count, actual_record_count)")
    emit("values")

    snap_rows = []
    for m in manifests:
        sid_seed = m["sourceId"]
        source_key = MANIFEST_SOURCE_KEY.get(sid_seed, "qul")
        snap_id = u5("snapshot:" + sid_seed)
        statuses = STATUS_MAP.get(
            m.get("status", "raw_validated_rights_blocked"),
            STATUS_MAP["raw_validated_rights_blocked"]
        )

        dl = m.get("downloadUrl", "")
        if dl and dl.startswith("http"):
            acq_method = "direct_download"
        else:
            acq_method = "authenticated_download"

        date_accessed = m.get("dateAccessed", "2026-06-12")
        upstream_ver = m.get("version", None)
        if not upstream_ver or upstream_ver.startswith("Downloaded") or upstream_ver.startswith("Public"):
            upstream_ver = None

        expected = m.get("recordCountExpected")
        actual = m.get("recordCountActual")

        row = (
            "  (" + q(snap_id) + ",\n"
            "   (select id from ingest.source_registry where source_key = " + q(source_key) + "),\n"
            "   " + q(sid_seed) + ",\n"
            "   " + q(upstream_ver) + ", NULL, NULL,\n"
            "   " + q(date_accessed + "T00:00:00+00:00") + "::timestamptz,\n"
            "   " + q(acq_method) + ",\n"
            "   " + q(m.get("licenseName")) + ", " + q(m.get("licenseUrl")) + ", " + q(m.get("attribution")) + ",\n"
            "   " + q(statuses["technical_status"]) + ", " + q(statuses["rights_status"]) + ",\n"
            "   " + q(statuses["attribution_status"]) + ", " + q(statuses["content_status"]) + ",\n"
            "   " + q(statuses["publication_status"]) + ",\n"
            "   " + (q(expected) if expected is not None else "NULL") + ",\n"
            "   " + (q(actual) if actual is not None else "NULL") + ")"
        )
        snap_rows.append(row)

    emit(",\n".join(snap_rows))
    emit("on conflict (snapshot_key) do nothing;")
    emit()

    # ── Section 2b: source_snapshots from hadith CSV ────────────────────────────
    emit("-- Section 2b: source_snapshots from hadith acquisition CSV")
    emit()

    with open(hadith_resources_csv, encoding="utf-8-sig") as fh:
        hadith_snaps = list(csv.DictReader(fh))

    emit("insert into ingest.source_snapshots")
    emit("  (id, source_id, snapshot_key, upstream_version, branch, commit_hash,")
    emit("   acquired_at, acquisition_method,")
    emit("   technical_status, rights_status, attribution_status,")
    emit("   content_status, publication_status,")
    emit("   file_count, total_bytes)")
    emit("values")

    hadith_snap_rows = []
    for row in hadith_snaps:
        snap_path = row["path"].strip()
        source_key = HADITH_PATH_TO_SOURCE_KEY.get(snap_path)
        if not source_key:
            print("WARNING: no source_key for hadith path: " + snap_path, file=sys.stderr)
            continue

        snapshot_key = snap_path.rsplit("/", 1)[-1]
        snap_id = u5("snapshot:" + snapshot_key)
        branch = row.get("branch", "").strip() or None
        commit = row.get("commit", "").strip() or None
        file_count = row.get("file_count", "").strip() or None
        total_bytes = row.get("bytes", "").strip() or None
        acquired_at = row.get("acquired_at", "2026-06-14").strip()
        acq_method = "api_snapshot" if snap_path == "data/raw/hadith/official/sunnah-com-api" else "git_clone"
        statuses = hadith_snapshot_statuses(snap_path)

        r = (
            "  (" + q(snap_id) + ",\n"
            "   (select id from ingest.source_registry where source_key = " + q(source_key) + "),\n"
            "   " + q(snapshot_key) + ",\n"
            "   NULL, " + q(branch) + ", " + q(commit) + ",\n"
            "   " + q(acquired_at + "T00:00:00+00:00") + "::timestamptz,\n"
            "   " + q(acq_method) + ",\n"
            "   " + q(statuses["technical_status"]) + ", " + q(statuses["rights_status"]) + ",\n"
            "   " + q(statuses["attribution_status"]) + ", " + q(statuses["content_status"]) + ",\n"
            "   " + q(statuses["publication_status"]) + ",\n"
            "   " + (file_count if file_count else "NULL") + ",\n"
            "   " + (total_bytes if total_bytes else "NULL") + ")"
        )
        hadith_snap_rows.append(r)

    emit(",\n".join(hadith_snap_rows))
    emit("on conflict (snapshot_key) do nothing;")
    emit()

    # ── Section 3a: raw_objects from SHA256SUMS.txt ─────────────────────────────
    emit("-- Section 3a: raw_objects from SHA256SUMS.txt (non-hadith)")
    emit()

    sha256_entries = []
    with open(checksums_file, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            parts = line.split(None, 1)
            if len(parts) == 2:
                sha256_entries.append((parts[0].lower(), parts[1].strip()))

    emit("insert into ingest.raw_objects")
    emit("  (id, snapshot_id, logical_name, object_role, object_path,")
    emit("   sha256, byte_length, format, media_type, encoding, parse_eligible)")
    emit("values")

    obj_rows = []
    for sha256, path in sha256_entries:
        snap_key = FILE_TO_SNAPSHOT_KEY.get(path)
        if not snap_key:
            print("WARNING: no snapshot mapping for SHA256SUMS path: " + path, file=sys.stderr)
            continue

        obj_id = u5("raw_object:" + path)
        logical_name = path.rsplit("/", 1)[-1]
        role = infer_role(path)
        fmt, media = infer_format_media(path)
        parse_ok = infer_parse_eligible(path, role)
        encoding = "utf-8" if fmt in ("text", "json", "xml", "html", "csv", "jsonl") else None

        # Get byte_length from disk (SHA256SUMS.txt contains no sizes)
        abs_path = root / path
        if abs_path.exists():
            byte_length = str(abs_path.stat().st_size)
        else:
            byte_length = "NULL"
            print("WARNING: file not found, byte_length NULL: " + path, file=sys.stderr)

        r = (
            "  (" + q(obj_id) + ",\n"
            "   (select id from ingest.source_snapshots where snapshot_key = " + q(snap_key) + "),\n"
            "   " + q(logical_name) + ", " + q(role) + ", " + q(path) + ",\n"
            "   " + q(sha256) + ", " + byte_length + ", " + q(fmt) + ", " + q(media) + ", "
            + q(encoding) + ", " + b(parse_ok) + ")"
        )
        obj_rows.append(r)

    emit(",\n".join(obj_rows))
    emit("on conflict (snapshot_id, object_path, sha256) do nothing;")
    emit()

    # ── Section 3b: raw_objects from HADITH_PRINCIPAL_SHA256 ────────────────────
    emit("-- Section 3b: raw_objects from HADITH_PRINCIPAL_SHA256 (163 principals)")
    emit()

    snap_paths_sorted = sorted(HADITH_PATH_TO_SOURCE_KEY.keys(), key=len, reverse=True)

    def find_hadith_snapshot_key(file_path: str):
        for sp in snap_paths_sorted:
            if file_path.startswith(sp + "/"):
                return sp.rsplit("/", 1)[-1]
        return None

    with open(hadith_principal_csv, encoding="utf-8-sig") as fh:
        principal_rows = list(csv.DictReader(fh))

    emit("insert into ingest.raw_objects")
    emit("  (id, snapshot_id, logical_name, object_role, object_path,")
    emit("   sha256, byte_length, format, media_type, encoding, parse_eligible)")
    emit("values")

    hadith_obj_rows = []
    for row in principal_rows:
        sha256 = row["sha256"].strip().lower()
        byte_length = row["bytes"].strip()
        path = row["path"].strip()

        snap_key = find_hadith_snapshot_key(path)
        if not snap_key:
            print("WARNING: no snapshot match for hadith principal path: " + path, file=sys.stderr)
            continue

        obj_id = u5("raw_object:" + path)
        logical_name = path.rsplit("/", 1)[-1]
        role = "payload"
        fmt, media = infer_format_media(path)
        encoding = "utf-8" if fmt in ("text", "json", "jsonl", "csv") else None
        parse_ok = fmt not in ("sqlite", "binary", "gzip", "zip")

        r = (
            "  (" + q(obj_id) + ",\n"
            "   (select id from ingest.source_snapshots where snapshot_key = " + q(snap_key) + "),\n"
            "   " + q(logical_name) + ", " + q(role) + ", " + q(path) + ",\n"
            "   " + q(sha256) + ", " + byte_length + ", " + q(fmt) + ", " + q(media) + ", "
            + q(encoding) + ", " + b(parse_ok) + ")"
        )
        hadith_obj_rows.append(r)

    emit(",\n".join(hadith_obj_rows))
    emit("on conflict (snapshot_id, object_path, sha256) do nothing;")
    emit()

    # ── Verification block ───────────────────────────────────────────────────────
    emit("-- Verification: row counts")
    emit()
    emit("do $$")
    emit("declare")
    emit("  n_sources   bigint;")
    emit("  n_snapshots bigint;")
    emit("  n_objects   bigint;")
    emit("begin")
    emit("  select count(*) into n_sources   from ingest.source_registry;")
    emit("  select count(*) into n_snapshots from ingest.source_snapshots;")
    emit("  select count(*) into n_objects   from ingest.raw_objects;")
    emit()
    emit("  assert n_sources   >= " + str(len(SOURCE_REGISTRY)) + ",")
    emit("    'source_registry: expected >= " + str(len(SOURCE_REGISTRY)) + ", got ' || n_sources;")
    emit("  assert n_snapshots >= " + str(len(manifests) + len(hadith_snaps)) + ",")
    emit("    'source_snapshots: expected >= " + str(len(manifests) + len(hadith_snaps)) + ", got ' || n_snapshots;")
    expected_objects = len(obj_rows) + len(hadith_obj_rows)
    emit("  assert n_objects   >= " + str(expected_objects) + ",")
    emit("    'raw_objects: expected >= " + str(expected_objects) + ", got ' || n_objects;")
    emit()
    emit("  raise notice 'Phase 2 verification passed: % sources, % snapshots, % objects',")
    emit("    n_sources, n_snapshots, n_objects;")
    emit("end $$;")
    emit()
    emit("commit;")
    emit()

    # ── Write output ─────────────────────────────────────────────────────────────
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))

    print("Written: " + str(output_file))
    print("  source_registry rows : " + str(len(SOURCE_REGISTRY)))
    print("  source_snapshots rows: "
          + str(len(manifests)) + " (V1 manifests) + "
          + str(len(hadith_snaps)) + " (hadith) = "
          + str(len(manifests) + len(hadith_snaps)))
    print("  raw_objects rows     : "
          + str(len(obj_rows)) + " (SHA256SUMS) + "
          + str(len(hadith_obj_rows)) + " (hadith principals) = "
          + str(len(obj_rows) + len(hadith_obj_rows)))


if __name__ == "__main__":
    main()
