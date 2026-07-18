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
  TafsirStudyResponse,
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

  async getTafsirPassage(passageId: string): Promise<TafsirStudyResponse> {
    return this.queryJson<TafsirStudyResponse>(
      `
        with selected as (
          select
            tp.id,
            tp.passage_key,
            tp.passage_text,
            tp.blank_text,
            te.edition_key,
            te.title,
            te.author_name,
            te.language_code
          from content.tafsir_passages tp
          join content.tafsir_editions te on te.id = tp.edition_id
          where tp.id = $1::uuid
        ),
        selected_ayahs as (
          select
            qa.id as ayah_id,
            qa.surah_number,
            qa.ayah_number,
            qa.verse_key,
            (
              select qat.text_value
              from content.quran_ayah_texts qat
              join content.quran_text_editions qte on qte.id = qat.edition_id
              where qat.ayah_id = qa.id and qte.active
              order by qte.edition_key
              limit 1
            ) as quran_text,
            (
              select tt.text_value
              from content.translation_texts tt
              join content.translation_editions te on te.id = tt.edition_id
              where tt.ayah_id = qa.id
                and te.active
                and te.language_code = 'en'
                and tt.variant_type in ('simple', 'plain')
              order by case when tt.variant_type = 'simple' then 0 else 1 end, te.edition_key
              limit 1
            ) as translation_text
          from selected s
          join content.tafsir_passage_ayahs tpa on tpa.passage_id = s.id
          join content.quran_ayahs qa on qa.id = tpa.ayah_id
          order by qa.surah_number, qa.ayah_number
        ),
        comparison_passages as (
          select distinct on (tp.id)
            tp.id,
            tp.passage_key,
            tp.passage_text,
            tp.blank_text,
            tpa.source_role,
            tpa.source_order,
            te.edition_key,
            te.title,
            te.author_name,
            te.language_code
          from selected_ayahs sa
          join content.tafsir_passage_ayahs tpa on tpa.ayah_id = sa.ayah_id
          join content.tafsir_passages tp on tp.id = tpa.passage_id
          join content.tafsir_editions te on te.id = tp.edition_id
          where tp.id <> $1::uuid
            and not tp.blank_text
            and coalesce(tp.passage_text, '') <> ''
          order by tp.id, te.language_code, te.edition_key
          limit 6
        )
        select jsonb_build_object(
          'notice', jsonb_build_object(
            'label', 'UNAPPROVED CONTENT - NOT FOR PUBLICATION',
            'message', 'Private RAFIQ development and testing only. Do not expose through public API, public app, exports, or AI answers until approval gates pass.',
            'rightsStatus', 'pending',
            'attributionStatus', 'pending',
            'editorialStatus', 'unreviewed',
            'scholarContentStatus', 'unreviewed',
            'publicationStatus', 'private_only'
          ),
          'passage', (
            select jsonb_build_object(
              'passageId', s.id,
              'passageKey', s.passage_key,
              'text', coalesce(s.passage_text, ''),
              'blankText', s.blank_text,
              'sourceRole', 'tafsir',
              'sourceOrder', 1,
              'edition', jsonb_build_object(
                'editionKey', s.edition_key,
                'title', s.title,
                'authorName', s.author_name,
                'languageCode', s.language_code,
                'sourceDetailTarget', jsonb_build_object('entityType', 'tafsir_edition', 'entityId', s.edition_key)
              ),
              'sourceDetailTarget', jsonb_build_object('entityType', 'tafsir_passage', 'entityId', s.id)
            )
            from selected s
          ),
          'ayahs', coalesce((
            select jsonb_agg(jsonb_build_object(
              'surahNumber', sa.surah_number,
              'ayahNumber', sa.ayah_number,
              'verseKey', sa.verse_key,
              'quranText', sa.quran_text,
              'translationText', sa.translation_text
            ) order by sa.surah_number, sa.ayah_number)
            from selected_ayahs sa
          ), '[]'::jsonb),
          'comparisons', coalesce((
            select jsonb_agg(jsonb_build_object(
              'passageId', cp.id,
              'passageKey', cp.passage_key,
              'text', cp.passage_text,
              'blankText', cp.blank_text,
              'sourceRole', cp.source_role,
              'sourceOrder', cp.source_order,
              'edition', jsonb_build_object(
                'editionKey', cp.edition_key,
                'title', cp.title,
                'authorName', cp.author_name,
                'languageCode', cp.language_code,
                'sourceDetailTarget', jsonb_build_object('entityType', 'tafsir_edition', 'entityId', cp.edition_key)
              ),
              'sourceDetailTarget', jsonb_build_object('entityType', 'tafsir_passage', 'entityId', cp.id)
            ) order by cp.language_code, cp.edition_key)
            from comparison_passages cp
          ), '[]'::jsonb)
        ) as payload
      `,
      [passageId],
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
