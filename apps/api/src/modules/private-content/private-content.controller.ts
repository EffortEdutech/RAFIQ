import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type {
  HadithCollectionsResponse,
  HadithDetailResponse,
  HadithRecordsResponse,
  GuidanceSessionEntryPoint,
  GuidanceSessionResponse,
  PrivateAnswerDraftResponse,
  PrivateAnswerValidationRunResponse,
  PrivateCp24GraphAwareRetrievalResponse,
  PrivateCp25ReviewerActionResponse,
  PrivateCp25WorkbenchStateResponse,
  PrivateCp26SnapshotStatusResponse,
  PrivateCp27InternalUiInspectionResponse,
  PrivateGuidedAnswerResponse,
  PrivateKnowledgeGraphifyCp21cResponse,
  PrivateKnowledgeGraphifyCp22Response,
  PrivateModelAdapterRunResponse,
  PrivateModelAdapterStatusResponse,
  PrivateRetrievalTraceResponse,
  PrivateReviewQueueItemResponse,
  PrivateReviewQueueResponse,
  PrivateReviewWorkbenchCp23Response,
  PrivateSearchResponse,
  PrivateSourceDetailResponse,
  PrivateSourceSearchResponse,
  QuranSurahResponse,
  TafsirStudyResponse,
} from '@rafiq/shared';
import { PrivateContentService } from './private-content.service.js';
import {
  AnswerDraftParamsDto,
  AnswerDraftQueryDto,
  AnswerValidationReviewQueryDto,
  AnswerValidationRunParamsDto,
  AnswerValidationRunQueryDto,
  GuidanceSessionQueryDto,
  GuidedAnswerParamsDto,
  GuidedAnswerQueryDto,
  HadithRecordParamsDto,
  HadithRecordsQueryDto,
  ModelAdapterRunParamsDto,
  ModelAdapterRunQueryDto,
  PrivateCp24GraphAwareRetrievalRequestDto,
  PrivateCp25ReviewerActionRequestDto,
  PrivateSearchQueryDto,
  ReviewQueueItemParamsDto,
  ReviewQueueQueryDto,
  RetrievalTraceParamsDto,
  QuranSurahParamsDto,
  QuranSurahQueryDto,
  SourceDetailQueryDto,
  TafsirPassageParamsDto,
} from './private-content.dto.js';
import {
  HadithCollectionsResponseDto,
  HadithDetailResponseDto,
  HadithRecordsResponseDto,
  GuidanceSessionResponseDto,
  PrivateAnswerDraftResponseDto,
  PrivateAnswerValidationRunResponseDto,
  PrivateCp24GraphAwareRetrievalResponseDto,
  PrivateCp25ReviewerActionResponseDto,
  PrivateCp25WorkbenchStateResponseDto,
  PrivateCp26SnapshotStatusResponseDto,
  PrivateCp27InternalUiInspectionResponseDto,
  PrivateGuidedAnswerResponseDto,
  PrivateKnowledgeGraphifyCp21cResponseDto,
  PrivateKnowledgeGraphifyCp22ResponseDto,
  PrivateModelAdapterRunResponseDto,
  PrivateModelAdapterStatusResponseDto,
  PrivateRetrievalTraceResponseDto,
  PrivateReviewQueueItemResponseDto,
  PrivateReviewQueueResponseDto,
  PrivateReviewWorkbenchCp23ResponseDto,
  PrivateSearchResponseDto,
  PrivateSourceDetailResponseDto,
  PrivateSourceSearchResponseDto,
  QuranSurahResponseDto,
  TafsirStudyResponseDto,
} from './private-content.openapi.js';

@ApiTags('private-content')
@Controller('private-content')
export class PrivateContentController {
  constructor(private readonly privateContent: PrivateContentService) {}

  @Get('quran/surah/:surahNumber')
  @ApiOperation({ summary: 'Return one private Quran surah payload.' })
  @ApiOkResponse({ type: QuranSurahResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid surah number or query parameter.' })
  getQuranSurah(
    @Param() params: QuranSurahParamsDto,
    @Query() query: QuranSurahQueryDto,
  ): Promise<QuranSurahResponse> {
    return this.privateContent.getQuranSurah(params.surahNumber, {
      quran: query.quran,
      translation: query.translation,
      tafsir: query.tafsir,
    });
  }

  @Get('hadith/collections')
  @ApiOperation({ summary: 'List private source-qualified Hadith collections.' })
  @ApiOkResponse({ type: HadithCollectionsResponseDto })
  listHadithCollections(): Promise<HadithCollectionsResponse> {
    return this.privateContent.listHadithCollections();
  }

  @Get('hadith/records')
  @ApiOperation({ summary: 'List private Hadith records with optional collection and language filters.' })
  @ApiOkResponse({ type: HadithRecordsResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid limit, offset, or filter parameter.' })
  listHadithRecords(
    @Query() query: HadithRecordsQueryDto,
  ): Promise<HadithRecordsResponse> {
    return this.privateContent.listHadithRecords({
      collection: query.collection,
      language: query.language,
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Get('hadith/record/:hadithRecordId')
  @ApiOperation({ summary: 'Return one private Hadith record detail payload.' })
  @ApiOkResponse({ type: HadithDetailResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid Hadith record UUID.' })
  getHadithRecord(
    @Param() params: HadithRecordParamsDto,
  ): Promise<HadithDetailResponse> {
    return this.privateContent.getHadithRecord(params.hadithRecordId);
  }

  @Get('tafsir/passage/:passageId')
  @ApiOperation({ summary: 'Return one private tafsir study-room payload.' })
  @ApiOkResponse({ type: TafsirStudyResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid tafsir passage UUID.' })
  getTafsirPassage(
    @Param() params: TafsirPassageParamsDto,
  ): Promise<TafsirStudyResponse> {
    return this.privateContent.getTafsirPassage(params.passageId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search private Quran, tafsir, topics/themes, and Hadith content.' })
  @ApiOkResponse({ type: PrivateSearchResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query, domain, limit, or offset.' })
  searchContent(
    @Query() query: PrivateSearchQueryDto,
  ): Promise<PrivateSearchResponse> {
    return this.privateContent.searchContent({
      q: query.q,
      domain: query.domain,
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Get('search/sources')
  @ApiOperation({ summary: 'Search private source material as grouped Quran, tafsir, topic/theme, and Hadith research results.' })
  @ApiOkResponse({ type: PrivateSourceSearchResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid source-search query, domain, limit, or offset.' })
  searchSources(
    @Query() query: PrivateSearchQueryDto,
  ): Promise<PrivateSourceSearchResponse> {
    return this.privateContent.searchSources({
      q: query.q,
      domain: query.domain,
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Get('search/trace/:traceId')
  @ApiOperation({ summary: 'Return one private retrieval trace for review.' })
  @ApiOkResponse({ type: PrivateRetrievalTraceResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid retrieval trace UUID.' })
  getRetrievalTrace(
    @Param() params: RetrievalTraceParamsDto,
  ): Promise<PrivateRetrievalTraceResponse> {
    return this.privateContent.getRetrievalTrace(params.traceId);
  }

  @Get('source/detail')
  @ApiOperation({ summary: 'Return private attribution, release state, and provenance for a canonical entity.' })
  @ApiOkResponse({ type: PrivateSourceDetailResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid source detail entity type or ID.' })
  getSourceDetail(
    @Query() query: SourceDetailQueryDto,
  ): Promise<PrivateSourceDetailResponse> {
    return this.privateContent.getSourceDetail(query.entityType, query.entityId);
  }

  @Get('knowledge-graphify/cp21c')
  @ApiOperation({ summary: 'Return private CP21C Product Knowledge Graphify verification summary.' })
  @ApiOkResponse({ type: PrivateKnowledgeGraphifyCp21cResponseDto })
  getKnowledgeGraphifyCp21c(): Promise<PrivateKnowledgeGraphifyCp21cResponse> {
    return this.privateContent.getKnowledgeGraphifyCp21c();
  }

  @Get('knowledge-graphify/cp22')
  @ApiOperation({ summary: 'Return private CP22 full resource graph and vault inspection summary.' })
  @ApiOkResponse({ type: PrivateKnowledgeGraphifyCp22ResponseDto })
  getKnowledgeGraphifyCp22(): Promise<PrivateKnowledgeGraphifyCp22Response> {
    return this.privateContent.getKnowledgeGraphifyCp22();
  }

  @Get('knowledge-graphify/cp27')
  @ApiOperation({ summary: 'Return bounded private CP27 graph/vault internal UI inspection status.' })
  @ApiOkResponse({ type: PrivateCp27InternalUiInspectionResponseDto })
  getKnowledgeGraphifyCp27(): Promise<PrivateCp27InternalUiInspectionResponse> {
    return this.privateContent.getKnowledgeGraphifyCp27();
  }

  @Get('review-workbench/cp23')
  @ApiOperation({ summary: 'Return private CP23 graph-aware review workbench prototype.' })
  @ApiOkResponse({ type: PrivateReviewWorkbenchCp23ResponseDto })
  getReviewWorkbenchCp23(): Promise<PrivateReviewWorkbenchCp23Response> {
    return this.privateContent.getReviewWorkbenchCp23();
  }

  @Get('reviewer-workbench/cp25')
  @ApiOperation({ summary: 'Return private CP25 reviewer action workflow state.' })
  @ApiOkResponse({ type: PrivateCp25WorkbenchStateResponseDto })
  getReviewerWorkbenchCp25(): Promise<PrivateCp25WorkbenchStateResponse> {
    return this.privateContent.getReviewerWorkbenchCp25();
  }

  @Get('snapshots/cp26')
  @ApiOperation({ summary: 'Return bounded private CP26 snapshot, refresh, diff, rollback, and blocker status.' })
  @ApiOkResponse({ type: PrivateCp26SnapshotStatusResponseDto })
  getCp26SnapshotStatus(): Promise<PrivateCp26SnapshotStatusResponse> {
    return this.privateContent.getCp26SnapshotStatus();
  }

  @Post('reviewer-workbench/cp25/actions')
  @ApiOperation({ summary: 'Validate a private CP25 reviewer action and return an audit-event preview.' })
  @ApiOkResponse({ type: PrivateCp25ReviewerActionResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid CP25 reviewer action target or malformed action request.' })
  createReviewerWorkbenchCp25Action(
    @Body() body: PrivateCp25ReviewerActionRequestDto,
  ): Promise<PrivateCp25ReviewerActionResponse> {
    return this.privateContent.createReviewerWorkbenchCp25Action(body);
  }

  @Post('graph-aware-retrieval/cp24')
  @ApiOperation({ summary: 'Run the private CP24 graph-aware retrieval prototype against bounded fixture artifacts.' })
  @ApiOkResponse({ type: PrivateCp24GraphAwareRetrievalResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid CP24 retrieval request or unknown fixture.' })
  createGraphAwareRetrievalCp24(
    @Body() body: PrivateCp24GraphAwareRetrievalRequestDto,
  ): Promise<PrivateCp24GraphAwareRetrievalResponse> {
    return this.privateContent.createGraphAwareRetrievalCp24(body);
  }

  @Get('review/queue')
  @ApiOperation({ summary: 'List private internal review queue items.' })
  @ApiOkResponse({ type: PrivateReviewQueueResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid review queue filter, limit, or offset.' })
  listReviewQueue(
    @Query() query: ReviewQueueQueryDto,
  ): Promise<PrivateReviewQueueResponse> {
    return this.privateContent.listReviewQueue({
      status: query.status,
      queueType: query.queueType,
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Get('review/queue/:queueItemId')
  @ApiOperation({ summary: 'Return one private review queue item with evidence.' })
  @ApiOkResponse({ type: PrivateReviewQueueItemResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid review queue item UUID.' })
  getReviewQueueItem(
    @Param() params: ReviewQueueItemParamsDto,
  ): Promise<PrivateReviewQueueItemResponse> {
    return this.privateContent.getReviewQueueItem(params.queueItemId);
  }

  @Get('answer/draft')
  @ApiOperation({ summary: 'Create a guarded private answer draft from retrieved evidence.' })
  @ApiOkResponse({ type: PrivateAnswerDraftResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid answer draft query, domain, or limit.' })
  createAnswerDraft(
    @Query() query: AnswerDraftQueryDto,
  ): Promise<PrivateAnswerDraftResponse> {
    return this.privateContent.createAnswerDraft({
      q: query.q,
      intent: query.intent,
      language: query.language,
      domain: query.domain,
      limit: query.limit,
    });
  }

  @Get('answer/draft/:answerDraftId')
  @ApiOperation({ summary: 'Return one guarded private answer draft and evidence policy result.' })
  @ApiOkResponse({ type: PrivateAnswerDraftResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid answer draft UUID.' })
  getAnswerDraft(
    @Param() params: AnswerDraftParamsDto,
  ): Promise<PrivateAnswerDraftResponse> {
    return this.privateContent.getAnswerDraft(params.answerDraftId);
  }

  @Get('answer/guided')
  @ApiOperation({ summary: 'Create a private guided answer prompt package behind guardrails.' })
  @ApiOkResponse({ type: PrivateGuidedAnswerResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid guided answer query, domain, or limit.' })
  createGuidedAnswer(
    @Query() query: GuidedAnswerQueryDto,
  ): Promise<PrivateGuidedAnswerResponse> {
    return this.privateContent.createGuidedAnswer({
      q: query.q,
      intent: query.intent,
      language: query.language,
      domain: query.domain,
      limit: query.limit,
    });
  }

  @Get('answer/guided/:guidedAnswerId')
  @ApiOperation({ summary: 'Return one private guided answer prompt package and draft evidence.' })
  @ApiOkResponse({ type: PrivateGuidedAnswerResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid guided answer UUID.' })
  getGuidedAnswer(
    @Param() params: GuidedAnswerParamsDto,
  ): Promise<PrivateGuidedAnswerResponse> {
    return this.privateContent.getGuidedAnswer(params.guidedAnswerId);
  }

  @Get('guidance/session')
  @ApiOperation({ summary: 'Create an orchestrated RAFIQ GuidanceSession package.' })
  @ApiOkResponse({ type: GuidanceSessionResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid guidance session query.' })
  createGuidanceSession(
    @Query() query: GuidanceSessionQueryDto,
  ): Promise<GuidanceSessionResponse> {
    return this.privateContent.createGuidanceSession({
      entryPoint: query.entryPoint as GuidanceSessionEntryPoint,
      input: query.input,
      language: query.language,
      domain: query.domain,
      quran:
        query.surahNumber || query.ayahNumber || query.verseKey
          ? {
              surahNumber: query.surahNumber ?? 1,
              ayahNumber: query.ayahNumber,
              verseKey: query.verseKey,
            }
          : undefined,
      hadithRecordId: query.hadithRecordId,
      resumeSessionId: query.resumeSessionId,
    });
  }

  @Get('answer/model-adapter/status')
  @ApiOperation({ summary: 'Return private model-provider adapter configuration status.' })
  @ApiOkResponse({ type: PrivateModelAdapterStatusResponseDto })
  getModelAdapterStatus(): PrivateModelAdapterStatusResponse {
    return this.privateContent.getModelAdapterStatus();
  }

  @Get('answer/model-adapter/run')
  @ApiOperation({ summary: 'Create a disabled-by-default private model adapter audit run.' })
  @ApiOkResponse({ type: PrivateModelAdapterRunResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid guided answer UUID.' })
  createModelAdapterRun(
    @Query() query: ModelAdapterRunQueryDto,
  ): Promise<PrivateModelAdapterRunResponse> {
    return this.privateContent.createModelAdapterRun(query.guidedAnswerId);
  }

  @Get('answer/model-adapter/run/:modelAdapterRunId')
  @ApiOperation({ summary: 'Return one private model adapter audit run.' })
  @ApiOkResponse({ type: PrivateModelAdapterRunResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid model adapter run UUID.' })
  getModelAdapterRun(
    @Param() params: ModelAdapterRunParamsDto,
  ): Promise<PrivateModelAdapterRunResponse> {
    return this.privateContent.getModelAdapterRun(params.modelAdapterRunId);
  }

  @Get('answer/validation/run')
  @ApiOperation({ summary: 'Create a private post-generation answer validation run.' })
  @ApiOkResponse({ type: PrivateAnswerValidationRunResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid guided answer, adapter run, or candidate answer.' })
  createAnswerValidationRun(
    @Query() query: AnswerValidationRunQueryDto,
  ): Promise<PrivateAnswerValidationRunResponse> {
    return this.privateContent.createAnswerValidationRun({
      guidedAnswerId: query.guidedAnswerId,
      modelAdapterRunId: query.modelAdapterRunId,
      candidateAnswer: query.candidateAnswer,
    });
  }

  @Get('answer/validation/run/:answerValidationRunId')
  @ApiOperation({ summary: 'Return one private post-generation answer validation run.' })
  @ApiOkResponse({ type: PrivateAnswerValidationRunResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid answer validation run UUID.' })
  getAnswerValidationRun(
    @Param() params: AnswerValidationRunParamsDto,
  ): Promise<PrivateAnswerValidationRunResponse> {
    return this.privateContent.getAnswerValidationRun(params.answerValidationRunId);
  }

  @Get('answer/validation/review/:answerValidationRunId')
  @ApiOperation({ summary: 'Apply a private reviewer action to an answer validation run.' })
  @ApiOkResponse({ type: PrivateAnswerValidationRunResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid answer validation run UUID or reviewer action.' })
  updateAnswerValidationReviewerAction(
    @Param() params: AnswerValidationRunParamsDto,
    @Query() query: AnswerValidationReviewQueryDto,
  ): Promise<PrivateAnswerValidationRunResponse> {
    return this.privateContent.updateAnswerValidationReviewerAction({
      answerValidationRunId: params.answerValidationRunId,
      action: query.action,
      notes: query.notes,
    });
  }
}
