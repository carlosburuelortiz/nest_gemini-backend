import { Controller, Post } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('basic-prompt')
  basicPrompt() {
    // const apikey = process.env.GEMINI_APY_KEY;
    return this.geminiService.basicPrompt();
  }
}
