import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type {
  PublicAnswerDraftResponse,
  PublicGuidedAnswerResponse,
  PublicSearchResponse,
  PublicSourceDetailResponse,
} from '@rafiq/shared';
import { PublicAnswerQueryDto, PublicSearchQueryDto, PublicSourceDetailQueryDto } from './public-content.dto.js';
import {
  PublicAnswerDraftResponseDto,
  PublicGuidedAnswerResponseDto,
  PublicSearchResponseDto,
  PublicSourceDetailResponseDto,
} from './public-content.openapi.js';
import { PublicContentService } from './public-content.service.js';

@ApiTags('public-content')
@Controller('public-content')
export class PublicContentController {
  constructor(private readonly publicContent: PublicContentService) {}

  @Get('search')
  @ApiOperation({
    summary: 'Search only content that has passed every public release gate.',
  })
  @ApiOkResponse({ type: PublicSearchResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query, domain, limit, or offset.' })
  searchPublicContent(
    @Query() query: PublicSearchQueryDto,
  ): Promise<PublicSearchResponse> {
    return this.publicContent.searchPublicContent({
      q: query.q,
      domain: query.domain,
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Get('answer/draft')
  @ApiOperation({
    summary: 'Create a public answer-policy draft using only release-approved evidence.',
  })
  @ApiOkResponse({ type: PublicAnswerDraftResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid answer draft query, domain, or limit.' })
  createPublicAnswerDraft(
    @Query() query: PublicAnswerQueryDto,
  ): Promise<PublicAnswerDraftResponse> {
    return this.publicContent.createPublicAnswerDraft({
      q: query.q,
      intent: query.intent,
      language: query.language,
      domain: query.domain,
      limit: query.limit,
    });
  }

  @Get('answer/guided')
  @ApiOperation({
    summary: 'Create a public guided-answer prompt package using only release-approved evidence.',
  })
  @ApiOkResponse({ type: PublicGuidedAnswerResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid guided answer query, domain, or limit.' })
  createPublicGuidedAnswer(
    @Query() query: PublicAnswerQueryDto,
  ): Promise<PublicGuidedAnswerResponse> {
    return this.publicContent.createPublicGuidedAnswer({
      q: query.q,
      intent: query.intent,
      language: query.language,
      domain: query.domain,
      limit: query.limit,
    });
  }

  @Get('source/detail')
  @ApiOperation({
    summary: 'Return public-safe source detail only for release-approved entities.',
  })
  @ApiOkResponse({ type: PublicSourceDetailResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid public source detail entity type or ID.' })
  getPublicSourceDetail(
    @Query() query: PublicSourceDetailQueryDto,
  ): Promise<PublicSourceDetailResponse> {
    return this.publicContent.getPublicSourceDetail({
      entityType: query.entityType,
      entityId: query.entityId,
    });
  }
}
