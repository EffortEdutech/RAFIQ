import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublicContentNoticeDto {
  @ApiProperty()
  label!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  deploymentMode!: string;

  @ApiProperty()
  publicReleaseEnabled!: boolean;

  @ApiProperty()
  pendingContentBlocked!: boolean;
}

export class PublicSearchReferenceDto {
  @ApiPropertyOptional({ nullable: true })
  surahNumber?: number | null;

  @ApiPropertyOptional({ nullable: true })
  ayahNumber?: number | null;

  @ApiPropertyOptional({ nullable: true })
  verseKey?: string | null;

  @ApiPropertyOptional({ nullable: true })
  hadithRecordId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  collectionKey?: string | null;
}

export class PublicSearchTargetDto extends PublicSearchReferenceDto {
  @ApiProperty()
  route!: string;

  @ApiPropertyOptional({ nullable: true })
  passageId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  topicId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  sourceTopicKey?: string | null;

  @ApiPropertyOptional({ nullable: true })
  themeGroupId?: string | null;

  @ApiPropertyOptional({ nullable: true })
  sourceHadithNumber?: string | null;

  @ApiPropertyOptional({ nullable: true })
  languageCode?: string | null;
}

export class PublicSearchReleaseDto {
  @ApiProperty()
  entityType!: string;

  @ApiProperty()
  entityId!: string;

  @ApiProperty()
  gatePassed!: boolean;
}

export class PublicSearchResultDto {
  @ApiProperty()
  domain!: string;

  @ApiProperty()
  resultId!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  subtitle?: string | null;

  @ApiProperty()
  snippet!: string;

  @ApiPropertyOptional()
  score?: number;

  @ApiProperty({ type: PublicSearchReferenceDto })
  reference!: PublicSearchReferenceDto;

  @ApiProperty({ type: PublicSearchTargetDto })
  target!: PublicSearchTargetDto;

  @ApiPropertyOptional({ type: PublicSearchReleaseDto })
  release?: PublicSearchReleaseDto;
}

export class PublicSearchQuerySummaryDto {
  @ApiPropertyOptional({ nullable: true })
  text!: string | null;

  @ApiProperty()
  domain!: string;
}

export class PublicSearchPaginationDto {
  @ApiProperty()
  limit!: number;

  @ApiProperty()
  offset!: number;

  @ApiProperty()
  total!: number;
}

export class PublicReleaseFilterDto {
  @ApiProperty()
  status!: string;

  @ApiProperty()
  source!: string;

  @ApiProperty()
  pendingContentBlocked!: boolean;

  @ApiProperty()
  privateSearchIndexReadable!: boolean;
}

export class PublicSearchResponseDto {
  @ApiProperty({ type: PublicContentNoticeDto })
  notice!: PublicContentNoticeDto;

  @ApiProperty({ type: PublicSearchQuerySummaryDto })
  query!: PublicSearchQuerySummaryDto;

  @ApiProperty({ type: PublicSearchPaginationDto })
  pagination!: PublicSearchPaginationDto;

  @ApiProperty({ type: Object })
  facets!: Record<string, number>;

  @ApiProperty({ type: [PublicSearchResultDto] })
  results!: PublicSearchResultDto[];

  @ApiProperty({ type: PublicReleaseFilterDto })
  releaseFilter!: PublicReleaseFilterDto;
}

export class PublicAnswerEvidenceItemDto {
  @ApiProperty()
  citationId!: string;

  @ApiProperty()
  domain!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  subtitle?: string | null;

  @ApiProperty()
  snippet!: string;

  @ApiProperty({ type: PublicSearchReferenceDto })
  reference!: PublicSearchReferenceDto;

  @ApiProperty({ type: PublicSearchTargetDto })
  target!: PublicSearchTargetDto;

  @ApiPropertyOptional({ type: PublicSearchReleaseDto })
  release?: PublicSearchReleaseDto;

  @ApiProperty()
  publicReleaseStatus!: string;
}

export class PublicAnswerDraftDto {
  @ApiProperty()
  questionText!: string;

  @ApiProperty()
  detectedIntent!: string;

  @ApiProperty()
  requestedLanguage!: string;

  @ApiProperty()
  domainFilter!: string;

  @ApiProperty()
  responseState!: string;

  @ApiProperty({ type: [String] })
  retrievedSourceIds!: string[];

  @ApiProperty({ type: [PublicAnswerEvidenceItemDto] })
  evidenceItems!: PublicAnswerEvidenceItemDto[];

  @ApiProperty({ type: Object })
  validationGateResults!: Record<string, unknown>;

  @ApiProperty()
  draftAnswer!: string;

  @ApiProperty()
  modelName!: string;

  @ApiProperty()
  policyVersion!: string;

  @ApiProperty()
  publicReleaseReady!: boolean;
}

export class PublicAnswerDraftResponseDto {
  @ApiProperty({ type: PublicContentNoticeDto })
  notice!: PublicContentNoticeDto;

  @ApiProperty({ type: PublicAnswerDraftDto })
  answerDraft!: PublicAnswerDraftDto;

  @ApiProperty({ type: PublicSearchResponseDto })
  search!: PublicSearchResponseDto;
}

export class PublicGuidedAnswerDto {
  @ApiProperty()
  promptVersion!: string;

  @ApiProperty()
  promptStatus!: string;

  @ApiProperty()
  responseState!: string;

  @ApiProperty()
  systemPrompt!: string;

  @ApiProperty()
  userPrompt!: string;

  @ApiProperty({ type: [PublicAnswerEvidenceItemDto] })
  evidencePrompt!: PublicAnswerEvidenceItemDto[];

  @ApiProperty()
  guidedAnswer!: string;

  @ApiProperty({ type: [String] })
  citationIds!: string[];

  @ApiProperty()
  modelProvider!: string;

  @ApiProperty()
  modelName!: string;

  @ApiProperty()
  publicReleaseReady!: boolean;
}

export class PublicGuidedAnswerResponseDto {
  @ApiProperty({ type: PublicContentNoticeDto })
  notice!: PublicContentNoticeDto;

  @ApiProperty({ type: PublicGuidedAnswerDto })
  guidedAnswer!: PublicGuidedAnswerDto;

  @ApiProperty({ type: PublicAnswerDraftDto })
  answerDraft!: PublicAnswerDraftDto;

  @ApiProperty({ type: PublicSearchResponseDto })
  search!: PublicSearchResponseDto;
}

export class PublicSourceDetailDto {
  @ApiProperty()
  entityType!: string;

  @ApiProperty()
  entityId!: string;

  @ApiProperty()
  publicStatus!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  sourceName?: string | null;

  @ApiPropertyOptional({ nullable: true })
  sourceKey?: string | null;

  @ApiPropertyOptional({ nullable: true })
  snapshotKey?: string | null;

  @ApiPropertyOptional({ nullable: true })
  editionKey?: string | null;

  @ApiPropertyOptional({ nullable: true })
  authorTranslatorEditor?: string | null;

  @ApiPropertyOptional({ nullable: true })
  publisherOrMaintainer?: string | null;

  @ApiPropertyOptional({ nullable: true })
  licenseName?: string | null;

  @ApiPropertyOptional({ nullable: true })
  licenseUrl?: string | null;

  @ApiPropertyOptional({ nullable: true })
  attributionText?: string | null;

  @ApiProperty({ type: [String] })
  requiredLinks!: string[];

  @ApiProperty()
  rightsStatus!: string;

  @ApiProperty()
  attributionStatus!: string;

  @ApiProperty()
  editorialStatus!: string;

  @ApiProperty()
  scholarContentStatus!: string;

  @ApiProperty()
  publicationStatus!: string;

  @ApiProperty()
  publicReleaseGatePassed!: boolean;

  @ApiProperty()
  rollbackStatus!: string;

  @ApiProperty()
  permittedUseNote!: string;

  @ApiPropertyOptional({ nullable: true })
  unavailableReason?: string | null;

  @ApiProperty({ type: [String] })
  privateFieldsExcluded!: string[];
}

export class PublicSourceDetailResponseDto {
  @ApiProperty({ type: PublicContentNoticeDto })
  notice!: PublicContentNoticeDto;

  @ApiProperty({ type: PublicSourceDetailDto })
  sourceDetail!: PublicSourceDetailDto;
}
