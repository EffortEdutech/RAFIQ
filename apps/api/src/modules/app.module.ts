import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module.js';
import { PrivateContentModule } from './private-content/private-content.module.js';
import { PublicContentModule } from './public-content/public-content.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    PrivateContentModule,
    PublicContentModule,
  ],
})
export class AppModule {}
