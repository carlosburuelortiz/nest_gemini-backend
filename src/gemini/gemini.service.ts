import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt-dto';
import { GoogleGenAI } from "@google/genai";
import { basicPromptUseCase } from './use-cases/basic-prompt.use-cases';

@Injectable()
export class GeminiService {
    private ai = new GoogleGenAI({});

    async basicPrompt(basicPromptDto: BasicPromptDto) {
        return basicPromptUseCase(this.ai, basicPromptDto);
    }

    async basicPromptStream(basicPromptDto: BasicPromptDto) {
        // return basicPromptUseCase(this.ai, basicPromptDto);
        return 'Hola mundo como stream';
    }
}
