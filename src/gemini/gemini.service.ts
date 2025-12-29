import { Injectable } from '@nestjs/common';
import { Content, GoogleGenAI } from "@google/genai";

import { BasicPromptDto } from './dtos/basic-prompt-dto';
import { basicPromptUseCase } from './use-cases/basic-prompt.use-cases';
import { basicPromptStreamUseCase } from './use-cases/basic-prompt-stream.use-cases';
import { ChatPromptDto } from './dtos/chat-prompt-dto';
import { chatPromptStreamUseCase } from './use-cases/chat-prompt-stream.use-case';
import { ImageGenerationDto } from './dtos/image-generation-dto';
import { imageGenerationUseCase } from './use-cases/image-generation.use-case';
import { PokemonHelperDto } from './dtos/pokemon-helper-dto';
import { getPokemonHelpUseCase } from './use-cases/get-pokemon-help-use-case';

@Injectable()
export class GeminiService {
    private ai = new GoogleGenAI({});
    private chatHistory = new Map<string, Content[]>();

    async basicPrompt(basicPromptDto: BasicPromptDto) {
        return basicPromptUseCase(this.ai, basicPromptDto);
    }

    async basicPromptStream(basicPromptDto: BasicPromptDto) {
        return basicPromptStreamUseCase(this.ai, basicPromptDto);
    }
    async chatStream(chatPromptDto: ChatPromptDto) {
        const chatHistory = this.getChatHistory(chatPromptDto.chatId);
        return chatPromptStreamUseCase(this.ai, chatPromptDto, { history: chatHistory });
    }

    saveMessage(chatId: string, message: Content) {
        const messages = this.getChatHistory(chatId);
        messages.push(message);
        this.chatHistory.set(chatId, messages);
    }

    getChatHistory(chatId: string) {
        return structuredClone(this.chatHistory.get(chatId) ?? []);
    }

    imageGeneration(imageGenerationDto: ImageGenerationDto) {
        return imageGenerationUseCase(this.ai, imageGenerationDto)
    }

    getPokemonHelper(pokemonHelperDto: PokemonHelperDto) {
        return getPokemonHelpUseCase(this.ai, pokemonHelperDto);
    }
}
