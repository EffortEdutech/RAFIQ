import { Module } from '@nestjs/common';
import { PublicContentController } from './public-content.controller.js';
import { PublicContentRepository } from './public-content.repository.js';
import { PublicContentService } from './public-content.service.js';

@Module({
  controllers: [PublicContentController],
  providers: [PublicContentService, PublicContentRepository],
})
export class PublicContentModule {}
