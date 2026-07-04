import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import type {
  HadithCollectionsResponse,
  HadithDetailResponse,
  HadithRecordsResponse,
  PrivateAnswerDraftResponse,
  PrivateAnswerValidationRunResponse,
  PrivateGuidedAnswerResponse,
  PrivateModelAdapterRunResponse,
  PrivateRetrievalTraceResponse,
  PrivateReviewQueueItemResponse,
  PrivateReviewQueueResponse,
  PrivateSearchResponse,
  PrivateSourceDetailResponse,
  QuranSurahResponse,
} from '@rafiq/shared';

type QuranOptions = {
  quran?: string;
  translation?: string;
  tafsir?: string;
};

type HadithListOptions = {
  collection?: string;
  language?: string;
  limit?: number;
  offset?: number;
};

type SearchOptions = {
  q: string;
  domain?: string;
  limit?: number;
  offset?: number;
};

type ReviewQueueOptions = {
  status?: string;
  queueType?: string;
  limit?: number;
  offset?: number;
};

type AnswerDraftOptions = {
  q: string;
  intent?: string;
  language?: string;
  domain?: string;
  limit?: number;
};

type AnswerValidationRunOptions = {
  guidedAnswerId: string;
  modelAdapterRunId?: string;
  candidateAnswer?: string;
};

@Injectable()
export class PrivateContentRepository implements OnModuleDestroy {
  private readonly pool = new Pool({
    connectionString:
      process.env.RAFIQ_DATABASE_URL ??
      'postgresql://postgres:postgres@127.0.0.1:55422/postgres',
  });

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  async getQuranSurah(
    surahNumber: number,
    options: QuranOptions,
  ): Promise<QuranSurahResponse> {
    return this.queryJson<QuranSurahResponse>(
      'select private_api.get_quran_surah($1, $2, $3, $4) as payload',
      [surahNumber, options.quran ?? null, options.translation ?? null, options.tafsir ?? null],
    );
  }

  async listHadithCollections(): Promise<HadithCollectionsResponse> {
    return this.queryJson<HadithCollectionsResponse>(
      'select private_api.list_hadith_collections() as payload',
      [],
    );
  }

  async listHadithRecords(
    options: HadithListOptions,
  ): Promise<HadithRecordsResponse> {
    return this.queryJson<HadithRecordsResponse>(
      'select private_api.list_hadith_records($1, $2, $3, $4) as payload',
      [
        options.collection ?? null,
        options.language ?? null,
        options.limit ?? 20,
        options.offset ?? 0,
      ],
    );
  }

  async getHadithRecord(hadithRecordId: string): Promise<HadithDetailResponse> {
    return this.queryJson<HadithDetailResponse>(
      'select private_api.get_hadith_record($1::uuid) as payload',
      [hadithRecordId],
    );
  }

  async searchContent(options: SearchOptions): Promise<PrivateSearchResponse> {
    return this.queryJson<PrivateSearchResponse>(
      'select private_api.search_content($1, $2, $3, $4) as payload',
      [
        options.q,
        options.domain ?? 'all',
        options.limit ?? 20,
        options.offset ?? 0,
      ],
    );
  }

  async getRetrievalTrace(traceId: string): Promise<PrivateRetrievalTraceResponse> {
    return this.queryJson<PrivateRetrievalTraceResponse>(
      'select private_api.get_retrieval_trace($1::uuid) as payload',
      [traceId],
    );
  }

  async getSourceDetail(
    entityType: string,
    entityId: string,
  ): Promise<PrivateSourceDetailResponse> {
    return this.queryJson<PrivateSourceDetailResponse>(
      'select private_api.get_source_detail($1, $2) as payload',
      [entityType, entityId],
    );
  }

  async listReviewQueue(
    options: ReviewQueueOptions,
  ): Promise<PrivateReviewQueueResponse> {
    return this.queryJson<PrivateReviewQueueResponse>(
      'select private_api.list_review_queue($1, $2, $3, $4) as payload',
      [
        options.status ?? 'unreviewed',
        options.queueType ?? null,
        options.limit ?? 20,
        options.offset ?? 0,
      ],
    );
  }

  async getReviewQueueItem(queueItemId: string): Promise<PrivateReviewQueueItemResponse> {
    return this.queryJson<PrivateReviewQueueItemResponse>(
      'select private_api.get_review_queue_item($1::uuid) as payload',
      [queueItemId],
    );
  }

  async createAnswerDraft(options: AnswerDraftOptions): Promise<PrivateAnswerDraftResponse> {
    return this.queryJson<PrivateAnswerDraftResponse>(
      'select private_api.create_answer_draft($1, $2, $3, $4, $5) as payload',
      [
        options.q,
        options.intent ?? null,
        options.language ?? 'en',
        options.domain ?? 'all',
        options.limit ?? 5,
      ],
    );
  }

  async getAnswerDraft(answerDraftId: string): Promise<PrivateAnswerDraftResponse> {
    return this.queryJson<PrivateAnswerDraftResponse>(
      'select private_api.get_answer_draft($1::uuid) as payload',
      [answerDraftId],
    );
  }

  async createGuidedAnswer(options: AnswerDraftOptions): Promise<PrivateGuidedAnswerResponse> {
    return this.queryJson<PrivateGuidedAnswerResponse>(
      'select private_api.create_guided_answer($1, $2, $3, $4, $5) as payload',
      [
        options.q,
        options.intent ?? null,
        options.language ?? 'en',
        options.domain ?? 'all',
        options.limit ?? 5,
      ],
    );
  }

  async getGuidedAnswer(guidedAnswerId: string): Promise<PrivateGuidedAnswerResponse> {
    return this.queryJson<PrivateGuidedAnswerResponse>(
      'select private_api.get_guided_answer($1::uuid) as payload',
      [guidedAnswerId],
    );
  }

  async createModelAdapterRun(options: {
    guidedAnswerId: string;
    providerEnabled: boolean;
    providerKey: string;
    modelName: string;
    executionMode: string;
  }): Promise<PrivateModelAdapterRunResponse> {
    return this.queryJson<PrivateModelAdapterRunResponse>(
      'select private_api.create_model_adapter_run($1::uuid, $2, $3, $4, $5) as payload',
      [
        options.guidedAnswerId,
        options.providerEnabled,
        options.providerKey,
        options.modelName,
        options.executionMode,
      ],
    );
  }

  async getModelAdapterRun(modelAdapterRunId: string): Promise<PrivateModelAdapterRunResponse> {
    return this.queryJson<PrivateModelAdapterRunResponse>(
      'select private_api.get_model_adapter_run($1::uuid) as payload',
      [modelAdapterRunId],
    );
  }

  async createAnswerValidationRun(
    options: AnswerValidationRunOptions,
  ): Promise<PrivateAnswerValidationRunResponse> {
    return this.queryJson<PrivateAnswerValidationRunResponse>(
      'select private_api.create_answer_validation_run($1::uuid, $2::uuid, $3) as payload',
      [
        options.guidedAnswerId,
        options.modelAdapterRunId ?? null,
        options.candidateAnswer ?? null,
      ],
    );
  }

  async getAnswerValidationRun(
    answerValidationRunId: string,
  ): Promise<PrivateAnswerValidationRunResponse> {
    return this.queryJson<PrivateAnswerValidationRunResponse>(
      'select private_api.get_answer_validation_run($1::uuid) as payload',
      [answerValidationRunId],
    );
  }

  async updateAnswerValidationReviewerAction(options: {
    answerValidationRunId: string;
    action: string;
    notes?: string;
  }): Promise<PrivateAnswerValidationRunResponse> {
    return this.queryJson<PrivateAnswerValidationRunResponse>(
      'select private_api.update_answer_validation_reviewer_action($1::uuid, $2, $3) as payload',
      [options.answerValidationRunId, options.action, options.notes ?? null],
    );
  }

  private async queryJson<T>(sql: string, values: unknown[]): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('begin');
      await client.query('set local role service_role');
      const result = await client.query<{ payload: T }>(sql, values);
      await client.query('commit');
      return result.rows[0].payload;
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  }
}
