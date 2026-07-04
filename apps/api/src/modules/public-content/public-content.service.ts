import { Injectable } from '@nestjs/common';
import type {
  PublicAnswerDraftResponse,
  PublicGuidedAnswerResponse,
  PublicSearchResponse,
  PublicSourceDetailResponse,
} from '@rafiq/shared';
import { PublicContentRepository } from './public-content.repository.js';

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
export class PublicContentService {
  constructor(private readonly repository: PublicContentRepository) {}

  searchPublicContent(
    options: PublicSearchOptions,
  ): Promise<PublicSearchResponse> {
    return this.repository.searchPublicContent(options);
  }

  createPublicAnswerDraft(
    options: PublicAnswerOptions,
  ): Promise<PublicAnswerDraftResponse> {
    return this.repository.createPublicAnswerDraft(options);
  }

  createPublicGuidedAnswer(
    options: PublicAnswerOptions,
  ): Promise<PublicGuidedAnswerResponse> {
    return this.repository.createPublicGuidedAnswer(options);
  }

  getPublicSourceDetail(options: {
    entityType: string;
    entityId: string;
  }): Promise<PublicSourceDetailResponse> {
    return this.repository.getPublicSourceDetail(options);
  }
}
