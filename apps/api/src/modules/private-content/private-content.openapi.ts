import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PrivateContentNoticeDto {
  @ApiProperty({ example: 'UNAPPROVED CONTENT - NOT FOR PUBLICATION' })
  label!: string;

  @ApiProperty()
  message!: string;

  @ApiPropertyOptional()
  rightsStatus?: string;

  @ApiPropertyOptional()
  attributionStatus?: string;

  @ApiPropertyOptional()
  editorialStatus?: string;

  @ApiPropertyOptional()
  scholarContentStatus?: string;

  @ApiPropertyOptional()
  publicationStatus?: string;
}

export class QuranEditionSummaryDto {
  @ApiProperty()
  editionKey!: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  scriptLabel?: string;

  @ApiPropertyOptional()
  languageCode?: string;

  @ApiPropertyOptional()
  translatorName?: string;

  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  authorName?: string;
}

export class QuranSurahSummaryDto {
  @ApiProperty({ example: 1 })
  surahNumber!: number;

  @ApiPropertyOptional()
  nameArabic?: string;

  @ApiPropertyOptional()
  nameTransliteration?: string;

  @ApiProperty({ example: 7 })
  ayahCount!: number;
}

export class QuranTranslationDto {
  @ApiProperty()
  translationTextId!: string;

  @ApiProperty()
  variantType!: string;

  @ApiProperty()
  text!: string;

  @ApiPropertyOptional()
  sourceMarkup?: string;
}

export class QuranTafsirPassageDto {
  @ApiProperty()
  passageId!: string;

  @ApiProperty()
  passageKey!: string;

  @ApiProperty()
  text!: string;

  @ApiProperty()
  blankText!: boolean;

  @ApiPropertyOptional()
  sourceRole?: string;

  @ApiPropertyOptional()
  sourceOrder?: number;
}

export class QuranSourceTopicDto {
  @ApiProperty()
  topicId!: string;

  @ApiProperty()
  sourceTopicKey!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  arabicName?: string;
}

export class QuranSourceAyahThemeDto {
  @ApiProperty()
  groupId!: string;

  @ApiProperty()
  sourceGroupKey!: string;

  @ApiProperty()
  themeText!: string;

  @ApiPropertyOptional()
  rawKeywords?: string;
}

export class QuranAyahDto {
  @ApiProperty({ example: 1 })
  ayahId!: number;

  @ApiProperty({ example: '1:1' })
  verseKey!: string;

  @ApiProperty({ example: 1 })
  surahNumber!: number;

  @ApiProperty({ example: 1 })
  ayahNumber!: number;

  @ApiProperty({ example: 1 })
  globalAyahNumber!: number;

  @ApiProperty()
  quranText!: string;

  @ApiPropertyOptional({ type: QuranTranslationDto, nullable: true })
  translation?: QuranTranslationDto | null;

  @ApiProperty({ type: [QuranTafsirPassageDto] })
  tafsirPassages!: QuranTafsirPassageDto[];

  @ApiProperty({ type: [QuranSourceTopicDto] })
  sourceTopics!: QuranSourceTopicDto[];

  @ApiProperty({ type: [QuranSourceAyahThemeDto] })
  sourceAyahThemes!: QuranSourceAyahThemeDto[];
}

export class QuranEditionsDto {
  @ApiProperty({ type: QuranEditionSummaryDto })
  quran!: QuranEditionSummaryDto;

  @ApiProperty({ type: QuranEditionSummaryDto })
  translation!: QuranEditionSummaryDto;

  @ApiProperty({ type: QuranEditionSummaryDto })
  tafsir!: QuranEditionSummaryDto;
}

export class QuranSurahResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiProperty({ type: QuranSurahSummaryDto })
  surah!: QuranSurahSummaryDto;

  @ApiProperty({ type: QuranEditionsDto })
  editions!: QuranEditionsDto;

  @ApiProperty({ type: [QuranAyahDto] })
  ayahs!: QuranAyahDto[];
}

export class HadithCollectionDto {
  @ApiProperty()
  collectionId!: string;

  @ApiProperty({ example: 'fawaz-linebyline:bukhari' })
  collectionKey!: string;

  @ApiPropertyOptional()
  nameEnglish?: string;

  @ApiPropertyOptional()
  nameArabic?: string;

  @ApiProperty()
  editionCount!: number;

  @ApiProperty({ example: 7563 })
  recordCount!: number;

  @ApiProperty()
  textVersionCount!: number;
}

export class HadithCollectionsResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiProperty({ type: [HadithCollectionDto] })
  collections!: HadithCollectionDto[];
}

export class PaginationDto {
  @ApiProperty({ example: 7563 })
  total!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 0 })
  offset!: number;
}

export class HadithGradeSummaryDto {
  @ApiPropertyOptional()
  graderNameRaw?: string;

  @ApiPropertyOptional()
  rawGrade?: string;

  @ApiPropertyOptional()
  normalizedLabel?: string;

  @ApiPropertyOptional()
  claimScope?: string;

  @ApiPropertyOptional()
  reviewStatus?: string;
}

export class HadithRecordSummaryDto {
  @ApiProperty()
  hadithRecordId!: string;

  @ApiProperty()
  collectionKey!: string;

  @ApiPropertyOptional()
  collectionName?: string;

  @ApiProperty()
  editionKey!: string;

  @ApiProperty()
  sourceHadithKey!: string;

  @ApiPropertyOptional()
  sourceHadithNumber?: string;

  @ApiPropertyOptional()
  sourceUrn?: string;

  @ApiPropertyOptional()
  printedReference?: string;

  @ApiPropertyOptional()
  previewText?: string;

  @ApiPropertyOptional()
  previewLanguageCode?: string;

  @ApiProperty({ type: [HadithGradeSummaryDto] })
  gradeSummary!: HadithGradeSummaryDto[];
}

export class HadithRecordsResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiProperty({ type: PaginationDto })
  pagination!: PaginationDto;

  @ApiProperty({ type: [HadithRecordSummaryDto] })
  records!: HadithRecordSummaryDto[];
}

export class HadithDetailRecordDto extends HadithRecordSummaryDto {
  @ApiPropertyOptional()
  sourceArabicNumber?: string;
}

export class HadithTextVersionDto {
  @ApiProperty()
  textVersionId!: string;

  @ApiProperty()
  languageCode!: string;

  @ApiPropertyOptional()
  translatorName?: string;

  @ApiProperty()
  fullText!: string;

  @ApiPropertyOptional()
  narratorPrefix?: string;

  @ApiPropertyOptional()
  isnadText?: string;

  @ApiPropertyOptional()
  matnText?: string;

  @ApiPropertyOptional()
  sourceHtml?: string;

  @ApiPropertyOptional()
  textHash?: string;
}

export class HadithGradeAssertionDto extends HadithGradeSummaryDto {
  @ApiProperty()
  assertionId!: string;

  @ApiPropertyOptional()
  citation?: string;

  @ApiPropertyOptional()
  normalizationVersion?: string;

  @ApiPropertyOptional()
  mappingMethod?: string;
}

export class HadithVerificationClaimDto {
  @ApiProperty()
  claimId!: string;

  @ApiPropertyOptional()
  claimText?: string;

  @ApiPropertyOptional()
  rawConclusion?: string;

  @ApiPropertyOptional()
  claimScope?: string;

  @ApiPropertyOptional()
  scholarResearcherRaw?: string;

  @ApiPropertyOptional()
  explanation?: string;

  @ApiPropertyOptional()
  classificationStatus?: string;

  @ApiPropertyOptional()
  editorialWorkflowStatus?: string;

  @ApiPropertyOptional()
  reviewStatus?: string;
}

export class HadithDetailResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiProperty({ type: HadithDetailRecordDto })
  record!: HadithDetailRecordDto;

  @ApiProperty({ type: [HadithTextVersionDto] })
  textVersions!: HadithTextVersionDto[];

  @ApiProperty({ type: [HadithGradeAssertionDto] })
  gradeAssertions!: HadithGradeAssertionDto[];

  @ApiProperty({ type: [HadithVerificationClaimDto] })
  verificationClaims!: HadithVerificationClaimDto[];
}

export class PrivateSearchReferenceDto {
  @ApiPropertyOptional()
  surahNumber?: number;

  @ApiPropertyOptional()
  ayahNumber?: number;

  @ApiPropertyOptional()
  verseKey?: string;

  @ApiPropertyOptional()
  hadithRecordId?: string;

  @ApiPropertyOptional()
  collectionKey?: string;
}

export class PrivateSearchTargetDto extends PrivateSearchReferenceDto {
  @ApiProperty()
  route!: string;

  @ApiPropertyOptional()
  passageId?: string;

  @ApiPropertyOptional()
  topicId?: string;

  @ApiPropertyOptional()
  sourceTopicKey?: string;

  @ApiPropertyOptional()
  themeGroupId?: string;

  @ApiPropertyOptional()
  sourceHadithNumber?: string;

  @ApiPropertyOptional()
  languageCode?: string;
}

export class PrivateSearchResultDto {
  @ApiProperty({ enum: ['quran', 'translation', 'tafsir', 'topic', 'ayah_theme', 'hadith', 'verification'] })
  domain!: string;

  @ApiProperty()
  resultId!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  subtitle?: string;

  @ApiProperty()
  snippet!: string;

  @ApiPropertyOptional()
  score?: number;

  @ApiProperty({ type: PrivateSearchReferenceDto })
  reference!: PrivateSearchReferenceDto;

  @ApiProperty({ type: PrivateSearchTargetDto })
  target!: PrivateSearchTargetDto;
}

export class PrivateRetrievalTraceSummaryDto {
  @ApiProperty()
  traceId!: string;

  @ApiProperty()
  traceType!: string;

  @ApiProperty()
  reviewStatus!: string;
}

export class PrivateSearchQuerySummaryDto {
  @ApiProperty()
  text!: string;

  @ApiProperty()
  domain!: string;

  @ApiPropertyOptional({ enum: ['guidance', 'sources'] })
  mode?: string;
}

export class PrivateSearchResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiProperty({ type: PrivateSearchQuerySummaryDto })
  query!: PrivateSearchQuerySummaryDto;

  @ApiProperty({ type: PaginationDto })
  pagination!: PaginationDto;

  @ApiProperty({ type: Object })
  facets!: Record<string, number>;

  @ApiProperty({ type: PrivateRetrievalTraceSummaryDto })
  retrievalTrace!: PrivateRetrievalTraceSummaryDto;

  @ApiProperty({ type: [PrivateSearchResultDto] })
  results!: PrivateSearchResultDto[];
}

export class PrivateSourceSearchGroupDto {
  @ApiProperty({ enum: ['quran', 'translation', 'tafsir', 'hadith', 'topics', 'themes', 'verification'] })
  groupKey!: string;

  @ApiProperty()
  label!: string;

  @ApiProperty()
  total!: number;

  @ApiProperty({ type: [PrivateSearchResultDto] })
  results!: PrivateSearchResultDto[];
}

export class PrivateSourceSearchResponseDto extends PrivateSearchResponseDto {
  @ApiProperty({ type: [PrivateSourceSearchGroupDto] })
  groups!: PrivateSourceSearchGroupDto[];
}

export class PrivateRetrievalTraceDetailDto extends PrivateRetrievalTraceSummaryDto {
  @ApiPropertyOptional()
  queryText?: string;

  @ApiProperty()
  domainFilter!: string;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  offset!: number;

  @ApiProperty()
  totalResults!: number;

  @ApiProperty({ type: [String] })
  returnedResultIds!: string[];

  @ApiProperty({ type: Object })
  facets!: Record<string, number>;

  @ApiProperty()
  source!: string;

  @ApiProperty()
  createdAt!: string;
}

export class PrivateRetrievalTraceResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiProperty({ type: PrivateRetrievalTraceDetailDto })
  trace!: PrivateRetrievalTraceDetailDto;
}

export class PrivateReviewQueueItemDto {
  @ApiProperty()
  queueItemId!: string;

  @ApiProperty({ enum: ['retrieval_trace', 'source_gap', 'grade_assertion', 'verification_claim', 'answer_validation'] })
  queueType!: string;

  @ApiProperty()
  subjectType!: string;

  @ApiProperty()
  subjectId!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  summary?: string;

  @ApiProperty({ enum: ['low', 'medium', 'high'] })
  severity!: string;

  @ApiProperty()
  reviewStatus!: string;

  @ApiProperty()
  source!: string;

  @ApiProperty({ type: Object })
  evidence!: Record<string, unknown>;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class PrivateReviewQueueQuerySummaryDto {
  @ApiProperty()
  status!: string;

  @ApiPropertyOptional()
  queueType?: string;
}

export class PrivateReviewQueueResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiProperty({ type: PrivateReviewQueueQuerySummaryDto })
  query!: PrivateReviewQueueQuerySummaryDto;

  @ApiProperty({ type: PaginationDto })
  pagination!: PaginationDto;

  @ApiProperty({ type: Object })
  facets!: Record<string, number>;

  @ApiProperty({ type: [PrivateReviewQueueItemDto] })
  items!: PrivateReviewQueueItemDto[];
}

export class PrivateReviewQueueItemResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiPropertyOptional({ type: PrivateReviewQueueItemDto, nullable: true })
  item?: PrivateReviewQueueItemDto | null;

  @ApiPropertyOptional({ type: PrivateRetrievalTraceDetailDto, nullable: true })
  retrievalTrace?: PrivateRetrievalTraceDetailDto | null;
}

export class PrivateSourceReleaseStateDto {
  @ApiPropertyOptional()
  entityVersion?: string;

  @ApiPropertyOptional()
  technicalStatus?: string;

  @ApiPropertyOptional()
  rightsStatus?: string;

  @ApiPropertyOptional()
  attributionStatus?: string;

  @ApiPropertyOptional()
  editorialStatus?: string;

  @ApiPropertyOptional()
  scholarContentStatus?: string;

  @ApiPropertyOptional()
  publicationStatus?: string;

  @ApiPropertyOptional()
  effectiveFrom?: string;

  @ApiPropertyOptional()
  effectiveTo?: string;

  @ApiPropertyOptional()
  notes?: string;
}

export class PrivateSourceDetailDto {
  @ApiProperty()
  entityType!: string;

  @ApiProperty()
  entityId!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  subtitle?: string;

  @ApiPropertyOptional({ type: PrivateSourceReleaseStateDto, nullable: true })
  releaseState?: PrivateSourceReleaseStateDto | null;

  @ApiProperty()
  provenanceCount!: number;

  @ApiProperty({ type: [Object] })
  provenance!: Array<Record<string, unknown>>;
}

export class PrivateSourceDetailResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiProperty({ type: PrivateSourceDetailDto })
  sourceDetail!: PrivateSourceDetailDto;
}

export class PrivateAnswerEvidenceItemDto {
  @ApiProperty()
  citationId!: string;

  @ApiProperty({ enum: ['quran', 'translation', 'tafsir', 'topic', 'ayah_theme', 'hadith', 'verification'] })
  domain!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional()
  subtitle?: string;

  @ApiProperty()
  snippet!: string;

  @ApiProperty({ type: PrivateSearchReferenceDto })
  reference!: PrivateSearchReferenceDto;

  @ApiProperty({ type: PrivateSearchTargetDto })
  target!: PrivateSearchTargetDto;

  @ApiProperty()
  reviewStatus!: string;

  @ApiProperty()
  publicReleaseStatus!: string;
}

export class PrivateAnswerDraftDto {
  @ApiProperty()
  answerDraftId!: string;

  @ApiProperty()
  questionText!: string;

  @ApiProperty()
  detectedIntent!: string;

  @ApiProperty()
  requestedLanguage!: string;

  @ApiProperty()
  domainFilter!: string;

  @ApiProperty({ enum: ['approved', 'approved_with_disclaimer', 'source_unavailable', 'scholar_escalation', 'safety_escalation', 'blocked'] })
  responseState!: string;

  @ApiPropertyOptional()
  retrievalTraceId?: string;

  @ApiProperty({ type: [String] })
  retrievedSourceIds!: string[];

  @ApiProperty({ type: [PrivateAnswerEvidenceItemDto] })
  evidenceItems!: PrivateAnswerEvidenceItemDto[];

  @ApiProperty({ type: Object })
  validationGateResults!: Record<string, unknown>;

  @ApiProperty()
  draftAnswer!: string;

  @ApiProperty()
  modelName!: string;

  @ApiProperty()
  policyVersion!: string;

  @ApiProperty()
  reviewStatus!: string;

  @ApiProperty()
  createdAt!: string;
}

export class PrivateAnswerDraftResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiPropertyOptional({ type: PrivateAnswerDraftDto, nullable: true })
  answerDraft?: PrivateAnswerDraftDto | null;
}

export class PrivateGuidedAnswerDto {
  @ApiProperty()
  guidedAnswerId!: string;

  @ApiProperty()
  answerDraftId!: string;

  @ApiProperty()
  promptVersion!: string;

  @ApiProperty({ enum: ['model_ready', 'blocked_by_guardrail', 'blocked_no_evidence'] })
  promptStatus!: string;

  @ApiProperty()
  responseState!: string;

  @ApiProperty()
  systemPrompt!: string;

  @ApiProperty()
  userPrompt!: string;

  @ApiProperty({ type: [PrivateAnswerEvidenceItemDto] })
  evidencePrompt!: PrivateAnswerEvidenceItemDto[];

  @ApiProperty()
  guidedAnswer!: string;

  @ApiProperty({ type: [String] })
  citationIds!: string[];

  @ApiProperty()
  modelProvider!: string;

  @ApiProperty()
  modelName!: string;

  @ApiProperty()
  reviewStatus!: string;

  @ApiProperty()
  createdAt!: string;
}

export class PrivateGuidedAnswerResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiPropertyOptional({ type: PrivateGuidedAnswerDto, nullable: true })
  guidedAnswer?: PrivateGuidedAnswerDto | null;

  @ApiPropertyOptional({ type: PrivateAnswerDraftDto, nullable: true })
  answerDraft?: PrivateAnswerDraftDto | null;
}

export class GuidanceSessionResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiPropertyOptional({ type: Object, nullable: true })
  session?: Record<string, unknown> | null;
}

export class PrivateModelAdapterConfigDto {
  @ApiProperty()
  providerEnabled!: boolean;

  @ApiProperty()
  providerKey!: string;

  @ApiProperty()
  modelName!: string;

  @ApiProperty()
  executionMode!: string;

  @ApiProperty()
  liveExecutionAllowed!: boolean;

  @ApiProperty({ enum: ['disabled', 'configured_dry_run'] })
  status!: string;
}

export class PrivateModelAdapterStatusResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiProperty({ type: PrivateModelAdapterConfigDto })
  modelAdapter!: PrivateModelAdapterConfigDto;
}

export class PrivateModelAdapterRunDto {
  @ApiProperty()
  modelAdapterRunId!: string;

  @ApiProperty()
  guidedAnswerId!: string;

  @ApiProperty({ enum: ['disabled_by_configuration', 'blocked_by_guardrail', 'blocked_no_evidence', 'adapter_ready_not_executed'] })
  adapterStatus!: string;

  @ApiProperty()
  providerKey!: string;

  @ApiProperty()
  modelName!: string;

  @ApiProperty()
  providerEnabled!: boolean;

  @ApiProperty()
  executionMode!: string;

  @ApiPropertyOptional()
  refusalReason?: string;

  @ApiProperty({ type: Object })
  requestPayload!: Record<string, unknown>;

  @ApiProperty({ type: Object })
  responsePayload!: Record<string, unknown>;

  @ApiProperty()
  createdAt!: string;
}

export class PrivateModelAdapterRunResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiPropertyOptional({ type: PrivateModelAdapterRunDto, nullable: true })
  modelAdapterRun?: PrivateModelAdapterRunDto | null;

  @ApiPropertyOptional({ type: PrivateGuidedAnswerDto, nullable: true })
  guidedAnswer?: PrivateGuidedAnswerDto | null;
}

export class PrivateAnswerValidationRunDto {
  @ApiProperty()
  answerValidationRunId!: string;

  @ApiProperty()
  guidedAnswerId!: string;

  @ApiPropertyOptional()
  modelAdapterRunId?: string;

  @ApiProperty()
  candidateAnswer!: string;

  @ApiProperty({ enum: ['passed_private_review_required', 'failed_missing_citations', 'failed_uncited_claims', 'blocked_by_adapter', 'blocked_by_guardrail'] })
  validationStatus!: string;

  @ApiProperty({ type: [String] })
  citationIds!: string[];

  @ApiProperty({ type: [String] })
  citedSourceIds!: string[];

  @ApiProperty({ type: [String] })
  missingCitationIds!: string[];

  @ApiProperty({ type: [Object] })
  uncitedClaimFlags!: Array<Record<string, unknown>>;

  @ApiProperty({ type: Object })
  validationResults!: Record<string, unknown>;

  @ApiProperty({ enum: ['queued', 'approved_for_internal_testing', 'needs_correction', 'deferred', 'rejected'] })
  reviewerActionStatus!: string;

  @ApiPropertyOptional()
  reviewerNotes?: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class PrivateAnswerValidationRunResponseDto {
  @ApiProperty({ type: PrivateContentNoticeDto })
  notice!: PrivateContentNoticeDto;

  @ApiPropertyOptional({ type: PrivateAnswerValidationRunDto, nullable: true })
  answerValidationRun?: PrivateAnswerValidationRunDto | null;

  @ApiPropertyOptional({ type: PrivateGuidedAnswerDto, nullable: true })
  guidedAnswer?: PrivateGuidedAnswerDto | null;

  @ApiPropertyOptional({ type: PrivateModelAdapterRunDto, nullable: true })
  modelAdapterRun?: PrivateModelAdapterRunDto | null;
}
