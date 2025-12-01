import { Injectable } from '@nestjs/common';
import { BasicPromptDto } from './dtos/basic-prompt-dto';
import { GoogleGenAI } from "@google/genai";

@Injectable()
export class GeminiService {
    private ai = new GoogleGenAI({});

    async basicPrompt(basicPromptDto: BasicPromptDto) {
        const response = await this.ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: basicPromptDto.prompt,
            config: {
                systemInstruction: 'Responde únicamente en español, en formato markdown. Usa negritas de esta forma __',
            }
        });

        return response.text;
    }
}
