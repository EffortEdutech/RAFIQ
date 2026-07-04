import { Module } from '@nestjs/common';
import { PrivateContentController } from './private-content.controller.js';
import { PrivateContentRepository } from './private-content.repository.js';
import { PrivateContentService } from './private-content.service.js';

@Module({
  controllers: [PrivateContentController],
  providers: [PrivateContentService, PrivateContentRepository],
})
export class PrivateContentModule {}
