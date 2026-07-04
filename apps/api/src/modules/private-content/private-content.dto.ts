import { Type } from 'class-transformer';
import {
  IsInt,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

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
