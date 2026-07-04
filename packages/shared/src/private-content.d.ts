export declare const PRIVATE_CONTENT_LABEL = "UNAPPROVED CONTENT - NOT FOR PUBLICATION";
export type PrivateContentNotice = {
    label: string;
    publicationStatus?: string;
    rightsStatus?: string;
    attributionStatus?: string;
    editorialStatus?: string;
    scholarContentStatus?: string;
    message: string;
};
export type QuranEditionSummary = {
    editionKey: string;
    name?: string;
    scriptLabel?: string;
    bismillahPolicy?: string;
    languageCode?: string;
    translatorName?: string;
    title?: string;
    authorName?: string;
};
export type QuranSurahAyah = {
    ayahId: number;
    verseKey: string;
    surahNumber: number;
    ayahNumber: number;
    globalAyahNumber: number;
    quranText: string;
    translation?: {
        translationTextId: string;
        variantType: string;
        text: string;
        sourceMarkup?: string;
    } | null;
    tafsirPassages: Array<{
        passageId: string;
        passageKey: string;
        text: string;
        blankText: boolean;
        sourceRole?: string;
        sourceOrder?: number;
    }>;
    sourceTopics: Array<{
        topicId: string;
        sourceTopicKey: string;
        name: string;
        arabicName?: string;
    }>;
    sourceAyahThemes: Array<{
        groupId: string;
        sourceGroupKey: string;
        themeText: string;
        rawKeywords?: string;
    }>;
};
export type QuranSurahResponse = {
    notice: PrivateContentNotice;
    surah: {
        surahNumber: number;
        nameArabic?: string;
        nameTransliteration?: string;
        ayahCount: number;
    };
    editions: {
        quran: QuranEditionSummary;
        translation: QuranEditionSummary;
        tafsir: QuranEditionSummary;
    };
    ayahs: QuranSurahAyah[];
};
export type HadithCollectionSummary = {
    collectionId: string;
    collectionKey: string;
    nameEnglish?: string;
    nameArabic?: string;
    editionCount: number;
    recordCount: number;
    textVersionCount: number;
};
export type HadithCollectionsResponse = {
    notice: PrivateContentNotice;
    collections: HadithCollectionSummary[];
};
export type HadithRecordListItem = {
    hadithRecordId: string;
    collectionKey: string;
    collectionName?: string;
    editionKey: string;
    sourceHadithKey: string;
    sourceHadithNumber?: string;
    sourceUrn?: string;
    printedReference?: string;
    previewText?: string;
    previewLanguageCode?: string;
    gradeSummary: Array<{
        graderNameRaw?: string;
        rawGrade?: string;
        normalizedLabel?: string;
        claimScope?: string;
        reviewStatus?: string;
    }>;
};
export type HadithRecordsResponse = {
    notice: PrivateContentNotice;
    pagination: {
        limit: number;
        offset: number;
        total: number;
    };
    records: HadithRecordListItem[];
};
export type HadithDetailResponse = {
    notice: PrivateContentNotice;
    record: {
        hadithRecordId: string;
        collectionKey: string;
        collectionName?: string;
        editionKey: string;
        sourceHadithKey: string;
        sourceHadithNumber?: string;
        sourceArabicNumber?: string;
        sourceUrn?: string;
        printedReference?: string;
    };
    textVersions: Array<{
        textVersionId: string;
        languageCode: string;
        translatorName?: string;
        fullText: string;
        narratorPrefix?: string;
        isnadText?: string;
        matnText?: string;
        sourceHtml?: string;
        textHash?: string;
    }>;
    gradeAssertions: Array<{
        assertionId: string;
        graderNameRaw?: string;
        rawGrade?: string;
        claimScope?: string;
        citation?: string;
        normalizedLabel?: string;
        normalizationVersion?: string;
        mappingMethod?: string;
        reviewStatus?: string;
    }>;
    verificationClaims: Array<{
        claimId: string;
        claimText?: string;
        rawConclusion?: string;
        claimScope?: string;
        scholarResearcherRaw?: string;
        explanation?: string;
        classificationStatus?: string;
        editorialWorkflowStatus?: string;
        reviewStatus?: string;
    }>;
};
