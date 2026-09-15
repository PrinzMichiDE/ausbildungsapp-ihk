import { Global, Module } from '@nestjs/common';
import { AiService } from './ai.service.js';
import { RagService } from './rag.service.js';

@Global()
@Module({
  providers: [AiService, RagService],
  exports: [AiService, RagService],
})
export class AiModule {}
