#!/usr/bin/env python3
"""
Verify RAFIQ Phase 5 Checkpoint 03 app scaffold files.
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REQUIRED_FILES = [
    "package.json",
    "pnpm-workspace.yaml",
    "tsconfig.base.json",
    ".env.example",
    "apps/api/package.json",
    "apps/api/tsconfig.json",
    "apps/api/nest-cli.json",
    "apps/api/.env.example",
    "apps/api/README.md",
    "apps/api/src/main.ts",
    "apps/api/src/modules/app.module.ts",
    "apps/api/src/modules/private-content/private-content.module.ts",
    "apps/api/src/modules/private-content/private-content.controller.ts",
    "apps/api/src/modules/private-content/private-content.service.ts",
    "apps/api/src/modules/private-content/private-content.repository.ts",
    "apps/mobile/package.json",
    "apps/mobile/app.json",
    "apps/mobile/tsconfig.json",
    "apps/mobile/.env.example",
    "apps/mobile/README.md",
    "apps/mobile/app/_layout.tsx",
    "apps/mobile/app/index.tsx",
    "apps/mobile/app/quran/[surahNumber].tsx",
    "apps/mobile/app/hadith.tsx",
    "apps/mobile/app/hadith/[hadithRecordId].tsx",
    "apps/mobile/app/search.tsx",
    "apps/mobile/app/review.tsx",
    "apps/mobile/app/review/[queueItemId].tsx",
    "apps/mobile/app/answer.tsx",
    "apps/mobile/app/source-detail.tsx",
    "apps/mobile/src/components/PrivateNoticeBanner.tsx",
    "apps/mobile/src/components/SourceStatusPanel.tsx",
    "apps/mobile/src/components/ToggleChip.tsx",
    "apps/mobile/src/services/privateContentApi.ts",
    "packages/shared/package.json",
    "packages/shared/src/index.ts",
    "packages/shared/src/private-content.ts",
]

JSON_FILES = [
    "package.json",
    "tsconfig.base.json",
    "apps/api/package.json",
    "apps/api/tsconfig.json",
    "apps/api/nest-cli.json",
    "apps/mobile/package.json",
    "apps/mobile/app.json",
    "apps/mobile/tsconfig.json",
    "packages/shared/package.json",
]

REQUIRED_SNIPPETS = {
    "apps/api/src/modules/private-content/private-content.controller.ts": [
        "@Controller('private-content')",
        "@Get('quran/surah/:surahNumber')",
        "@Get('hadith/collections')",
        "@Get('hadith/records')",
        "@Get('hadith/record/:hadithRecordId')",
        "@Get('search')",
        "@Get('search/trace/:traceId')",
        "@Get('source/detail')",
        "@Get('review/queue')",
        "@Get('review/queue/:queueItemId')",
        "@Get('answer/draft')",
        "@Get('answer/draft/:answerDraftId')",
        "@Get('answer/guided')",
        "@Get('answer/guided/:guidedAnswerId')",
        "@Get('answer/model-adapter/status')",
        "@Get('answer/model-adapter/run')",
        "@Get('answer/model-adapter/run/:modelAdapterRunId')",
        "@Get('answer/validation/run')",
        "@Get('answer/validation/run/:answerValidationRunId')",
        "@Get('answer/validation/review/:answerValidationRunId')",
    ],
    "apps/api/src/modules/private-content/private-content.repository.ts": [
        "set local role service_role",
        "private_api.get_quran_surah",
        "private_api.list_hadith_collections",
        "private_api.list_hadith_records",
        "private_api.get_hadith_record",
        "private_api.search_content",
        "private_api.get_retrieval_trace",
        "private_api.get_source_detail",
        "private_api.list_review_queue",
        "private_api.get_review_queue_item",
        "private_api.create_answer_draft",
        "private_api.get_answer_draft",
        "private_api.create_guided_answer",
        "private_api.get_guided_answer",
        "private_api.create_model_adapter_run",
        "private_api.get_model_adapter_run",
        "private_api.create_answer_validation_run",
        "private_api.get_answer_validation_run",
        "private_api.update_answer_validation_reviewer_action",
    ],
    "apps/mobile/src/components/PrivateNoticeBanner.tsx": [
        "PRIVATE_CONTENT_LABEL",
    ],
    "apps/mobile/src/components/SourceStatusPanel.tsx": [
        "Internal Review Status",
        "rightsStatus",
        "scholarContentStatus",
    ],
    "apps/mobile/app/quran/[surahNumber].tsx": [
        "Source Editions",
        "Ayah Themes",
        "Source Topics",
    ],
    "apps/mobile/app/hadith.tsx": [
        "listHadithRecords",
        "/hadith/[hadithRecordId]",
    ],
    "apps/mobile/app/hadith/[hadithRecordId].tsx": [
        "Text Versions",
        "Grade Assertions",
        "Verification Claims",
    ],
    "apps/mobile/app/search.tsx": [
        "Private Search",
        "searchPrivateContent",
        "Open source context",
        "Open attribution detail",
    ],
    "apps/mobile/app/review.tsx": [
        "Internal Review Queue",
        "listReviewQueue",
        "Open evidence",
        "answer_validation",
    ],
    "apps/mobile/app/review/[queueItemId].tsx": [
        "Review Evidence",
        "getReviewQueueItem",
        "Retrieval Trace",
    ],
    "apps/mobile/app/answer.tsx": [
        "Answer Evidence Policy",
        "createGuidedAnswer",
        "Prompt Package",
        "Model Adapter",
        "createModelAdapterRun",
        "Answer Validation",
        "createAnswerValidationRun",
        "updateAnswerValidationReviewerAction",
        "Validation Gates",
        "Evidence Citations",
        "Open attribution detail",
    ],
    "apps/mobile/app/source-detail.tsx": [
        "Source Detail",
        "getSourceDetail",
        "Release State",
        "Provenance",
    ],
    "apps/mobile/src/services/privateContentApi.ts": [
        "EXPO_PUBLIC_API_URL",
        "/api/private-content/quran/surah/",
        "/api/private-content/hadith/collections",
        "/api/private-content/hadith/records",
        "/api/private-content/hadith/record/",
        "/api/private-content/review/queue",
        "/api/private-content/answer/draft",
        "/api/private-content/answer/guided",
        "/api/private-content/answer/model-adapter",
        "/api/private-content/answer/validation",
        "/api/private-content/source/detail",
    ],
    "packages/shared/src/private-content.ts": [
        "UNAPPROVED CONTENT - NOT FOR PUBLICATION",
        "QuranSurahResponse",
        "HadithCollectionsResponse",
        "HadithRecordsResponse",
        "HadithDetailResponse",
        "PrivateSearchResponse",
        "PrivateRetrievalTraceResponse",
        "PrivateReviewQueueResponse",
        "PrivateReviewQueueItemResponse",
        "PrivateAnswerDraftResponse",
        "PrivateGuidedAnswerResponse",
        "PrivateModelAdapterRunResponse",
        "PrivateAnswerValidationRunResponse",
        "PrivateSourceDetailResponse",
    ],
}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    missing = [path for path in REQUIRED_FILES if not (ROOT / path).exists()]
    require(not missing, f"missing scaffold files: {missing}")

    for path in JSON_FILES:
        with (ROOT / path).open("r", encoding="utf-8") as handle:
            json.load(handle)

    for path, snippets in REQUIRED_SNIPPETS.items():
        text = (ROOT / path).read_text(encoding="utf-8")
        absent = [snippet for snippet in snippets if snippet not in text]
        require(not absent, f"{path} missing snippets: {absent}")

    root_package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    require(root_package["private"] is True, "root package must be private")
    require("apps/*" in (ROOT / "pnpm-workspace.yaml").read_text(encoding="utf-8"), "apps workspace missing")
    require("packages/*" in (ROOT / "pnpm-workspace.yaml").read_text(encoding="utf-8"), "packages workspace missing")

    result = {
        "status": "pass",
        "requiredFiles": len(REQUIRED_FILES),
        "jsonFiles": len(JSON_FILES),
        "apiRoutes": 19,
        "mobileRoutes": 9,
        "sharedContracts": 13,
    }
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
