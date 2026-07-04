import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import type {
  PublicAnswerDraftResponse,
  PublicGuidedAnswerResponse,
  PublicSearchResponse,
  PublicSourceDetailResponse,
} from '@rafiq/shared';

type PublicSearchOptions = {
  q: string;
  domain?: string;
  limit?: number;
  offset?: number;
};

type PublicAnswerOptions = {
  q: string;
  intent?: string;
  language?: string;
  domain?: string;
  limit?: number;
};

@Injectable()
export class PublicContentRepository implements OnModuleDestroy {
  private readonly pool = new Pool({
    connectionString:
      process.env.RAFIQ_DATABASE_URL ??
      'postgresql://postgres:postgres@127.0.0.1:55422/postgres',
  });

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  async searchPublicContent(
    options: PublicSearchOptions,
  ): Promise<PublicSearchResponse> {
    return this.queryJson<PublicSearchResponse>(
      'select public_api.search_public_content($1, $2, $3, $4) as payload',
      [
        options.q,
        options.domain ?? 'all',
        options.limit ?? 20,
        options.offset ?? 0,
      ],
    );
  }

  async createPublicAnswerDraft(
    options: PublicAnswerOptions,
  ): Promise<PublicAnswerDraftResponse> {
    return this.queryJson<PublicAnswerDraftResponse>(
      'select public_api.create_public_answer_draft($1, $2, $3, $4, $5) as payload',
      [
        options.q,
        options.intent ?? null,
        options.language ?? 'en',
        options.domain ?? 'all',
        options.limit ?? 5,
      ],
    );
  }

  async createPublicGuidedAnswer(
    options: PublicAnswerOptions,
  ): Promise<PublicGuidedAnswerResponse> {
    return this.queryJson<PublicGuidedAnswerResponse>(
      'select public_api.create_public_guided_answer($1, $2, $3, $4, $5) as payload',
      [
        options.q,
        options.intent ?? null,
        options.language ?? 'en',
        options.domain ?? 'all',
        options.limit ?? 5,
      ],
    );
  }

  async getPublicSourceDetail(options: {
    entityType: string;
    entityId: string;
  }): Promise<PublicSourceDetailResponse> {
    return this.queryJson<PublicSourceDetailResponse>(
      `select jsonb_build_object(
         'notice', public_api.public_release_notice(),
         'sourceDetail', jsonb_build_object(
           'entityType', lower(nullif(trim(coalesce($1, '')), '')),
           'entityId', nullif(trim(coalesce($2, '')), ''),
           'publicStatus', case
             when public_api.release_gate_passed($1, $2) then 'approved_public'
             else 'not_public'
           end,
           'title', case
             when public_api.release_gate_passed($1, $2) then 'Approved public source'
             else 'Source is not public'
           end,
           'sourceName', null,
           'sourceKey', null,
           'snapshotKey', null,
           'editionKey', null,
           'authorTranslatorEditor', null,
           'publisherOrMaintainer', null,
           'licenseName', null,
           'licenseUrl', null,
           'attributionText', null,
           'requiredLinks', jsonb_build_array(),
           'rightsStatus', case when public_api.release_gate_passed($1, $2) then 'approved' else 'not_public' end,
           'attributionStatus', case when public_api.release_gate_passed($1, $2) then 'approved' else 'not_public' end,
           'editorialStatus', case when public_api.release_gate_passed($1, $2) then 'approved' else 'not_public' end,
           'scholarContentStatus', case when public_api.release_gate_passed($1, $2) then 'approved' else 'not_public' end,
           'publicationStatus', case when public_api.release_gate_passed($1, $2) then 'public' else 'not_public' end,
           'publicReleaseGatePassed', public_api.release_gate_passed($1, $2),
           'rollbackStatus', case when public_api.release_gate_passed($1, $2) then 'active' else 'excluded_from_public_release' end,
           'permittedUseNote', case
             when public_api.release_gate_passed($1, $2) then 'This source entity has passed the public release gate.'
             else 'This entity is not available on public surfaces. Public source detail returns only release-approved attribution data.'
           end,
           'unavailableReason', case
             when public_api.release_gate_passed($1, $2) then null
             else 'not_public_or_pending_approval'
           end,
           'privateFieldsExcluded', jsonb_build_array(
             'rawObjectPath',
             'privateProvenance',
             'reviewerNotes',
             'retrievalTraces',
             'validationInternals',
             'serviceRoleDetails'
           )
         )
       ) as payload`,
      [options.entityType, options.entityId],
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
