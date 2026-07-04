import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

class HealthResponseDto {
  ok!: boolean;
  service!: string;
  privateContent!: boolean;
  deploymentMode!: string;
  publicContentEnabled!: boolean;
  publicReleaseGo!: boolean;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({ type: HealthResponseDto })
  getHealth(): HealthResponseDto {
    const publicContentEnabled = process.env.RAFIQ_PUBLIC_CONTENT_ENABLED === 'true';
    return {
      ok: true,
      service: 'rafiq-api',
      privateContent: true,
      deploymentMode: process.env.RAFIQ_DEPLOYMENT_MODE ?? 'private_local',
      publicContentEnabled,
      publicReleaseGo: false,
    };
  }
}
