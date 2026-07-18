import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import type {
  PrivateCp25RemediationStatus,
  PrivateCp25ReviewerAction,
  PrivateCp25ReviewerRole,
  PrivateCp25ReviewStatus,
  PrivateCp25ReviewSubjectType,
} from '@rafiq/shared';

export class QuranSurahParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(114)
  surahNumber!: number;
}

export class QuranSurahQueryDto {
  @IsOptional()
  @IsString()
  quran?: string;

  @IsOptional()
  @IsString()
  translation?: string;

  @IsOptional()
  @IsString()
  tafsir?: string;
}

export class HadithRecordsQueryDto {
  @IsOptional()
  @IsString()
  collection?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}

export class HadithRecordParamsDto {
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'hadithRecordId must be a UUID-formatted identifier',
  })
  hadithRecordId!: string;
}

export class TafsirPassageParamsDto {
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'passageId must be a UUID-formatted identifier',
  })
  passageId!: string;
}

export class PrivateSearchQueryDto {
  @IsString()
  @IsNotEmpty()
  q!: string;

  @IsOptional()
  @IsString()
  @IsIn(['all', 'quran', 'translation', 'tafsir', 'topics', 'themes', 'hadith', 'verification'])
  domain?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}

export class RetrievalTraceParamsDto {
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'traceId must be a UUID-formatted identifier',
  })
  traceId!: string;
}

export class SourceDetailQueryDto {
  @IsString()
  @IsNotEmpty()
  entityType!: string;

  @IsString()
  @IsNotEmpty()
  entityId!: string;
}

export class ReviewQueueQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['all', 'unreviewed', 'in_review', 'approved_for_internal_testing', 'needs_correction', 'deferred'])
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(['retrieval_trace', 'source_gap', 'grade_assertion', 'verification_claim', 'answer_validation'])
  queueType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;
}

export class ReviewQueueItemParamsDto {
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'queueItemId must be a UUID-formatted identifier',
  })
  queueItemId!: string;
}

export class AnswerDraftQueryDto {
  @IsString()
  @IsNotEmpty()
  q!: string;

  @IsOptional()
  @IsString()
  intent?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  @IsIn(['all', 'quran', 'translation', 'tafsir', 'topics', 'themes', 'hadith', 'verification'])
  domain?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  limit?: number;
}

export class AnswerDraftParamsDto {
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'answerDraftId must be a UUID-formatted identifier',
  })
  answerDraftId!: string;
}

export class GuidedAnswerQueryDto extends AnswerDraftQueryDto {}

export class GuidanceSessionQueryDto {
  @IsString()
  @IsNotEmpty()
  input!: string;

  @IsString()
  @IsIn(['today', 'ask', 'quran_ayah', 'hadith_record', 'learn_theme', 'growth_resume'])
  entryPoint!: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  @IsIn(['all', 'quran', 'translation', 'tafsir', 'topics', 'themes', 'hadith', 'verification'])
  domain?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(114)
  surahNumber?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(286)
  ayahNumber?: number;

  @IsOptional()
  @IsString()
  verseKey?: string;

  @IsOptional()
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'hadithRecordId must be a UUID-formatted identifier',
  })
  hadithRecordId?: string;

  @IsOptional()
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'resumeSessionId must be a UUID-formatted identifier',
  })
  resumeSessionId?: string;
}

export class GuidedAnswerParamsDto {
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'guidedAnswerId must be a UUID-formatted identifier',
  })
  guidedAnswerId!: string;
}

export class ModelAdapterRunQueryDto {
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'guidedAnswerId must be a UUID-formatted identifier',
  })
  guidedAnswerId!: string;
}

export class ModelAdapterRunParamsDto {
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'modelAdapterRunId must be a UUID-formatted identifier',
  })
  modelAdapterRunId!: string;
}

export class AnswerValidationRunQueryDto {
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'guidedAnswerId must be a UUID-formatted identifier',
  })
  guidedAnswerId!: string;

  @IsOptional()
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'modelAdapterRunId must be a UUID-formatted identifier',
  })
  modelAdapterRunId?: string;

  @IsOptional()
  @IsString()
  candidateAnswer?: string;
}

export class AnswerValidationRunParamsDto {
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
    message: 'answerValidationRunId must be a UUID-formatted identifier',
  })
  answerValidationRunId!: string;
}

export class AnswerValidationReviewQueryDto {
  @IsString()
  @IsIn(['queued', 'approved_for_internal_testing', 'needs_correction', 'deferred', 'rejected'])
  action!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class PrivateCp24GraphAwareRetrievalRequestDto {
  @IsString()
  @IsNotEmpty()
  queryText!: string;

  @IsOptional()
  @IsString()
  fixtureId?: string;

  @IsOptional()
  @IsString()
  @IsIn(['guidance', 'learning', 'search', 'reflection', 'journal', 'ruling', 'medical', 'legal', 'crisis', 'other'])
  intent?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  @IsIn(['all', 'quran', 'translation', 'tafsir', 'hadith', 'source', 'topic', 'validation'])
  domain?: string;

  @IsOptional()
  @IsString()
  @IsIn(['off', 'explain_only', 'expand_candidates', 'rank_and_explain'])
  graphMode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2)
  maxDepth?: number;
}

export class PrivateCp25BoundaryAcknowledgementDto {
  @IsBoolean()
  privateOnly!: true;

  @IsBoolean()
  publicReleaseApproved!: false;

  @IsBoolean()
  publicSafeChangeRequested!: false;
}

export class PrivateCp25ReviewerActionRequestDto {
  @IsString()
  @IsNotEmpty()
  queueItemId!: string;

  @IsOptional()
  @IsString()
  remediationId?: string | null;

  @IsString()
  @IsIn([
    'retrieval_trace',
    'evidence_route',
    'route_item',
    'candidate',
    'graph_node',
    'graph_edge',
    'vault_pack',
    'guided_answer',
    'answer_validation_run',
    'remediation',
    'public_boundary',
  ])
  subjectType!: PrivateCp25ReviewSubjectType;

  @IsString()
  @IsNotEmpty()
  subjectId!: string;

  @IsString()
  @IsIn([
    'claim',
    'request_technical_review',
    'request_content_review',
    'request_scholar_review',
    'request_product_owner_review',
    'request_remediation',
    'approve_private',
    'mark_public_candidate',
    'reject',
    'defer',
    'retire',
  ])
  action!: PrivateCp25ReviewerAction;

  @IsString()
  @IsIn([
    'queued',
    'in_review',
    'technical_review',
    'content_review',
    'scholar_review',
    'product_owner_review',
    'remediation_required',
    'resolved_private',
    'approved_public_candidate',
    'rejected',
    'retired',
    'deferred',
    'open',
    'assigned',
    'in_progress',
    'blocked',
  ])
  fromStatus!: PrivateCp25ReviewStatus | PrivateCp25RemediationStatus;

  @IsString()
  @IsIn(['technical_reviewer', 'knowledge_editor', 'scholar_reviewer', 'product_owner', 'admin', 'developer_private'])
  reviewerRole!: PrivateCp25ReviewerRole;

  @IsOptional()
  @IsString()
  reviewerId?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsArray()
  affectedSourceIds!: string[];

  @IsArray()
  affectedGraphNodeIds!: string[];

  @IsArray()
  affectedGraphEdgeIds!: string[];

  @IsArray()
  affectedVaultPackIds!: string[];

  @IsArray()
  affectedEvidenceRouteIds!: string[];

  @IsArray()
  affectedRouteItemIds!: string[];

  @IsArray()
  affectedCandidateIds!: string[];

  @IsArray()
  affectedRemediationIds!: string[];

  boundaryAcknowledgement!: PrivateCp25BoundaryAcknowledgementDto;
}
