import { createPartFromUri, GoogleGenAI } from "@google/genai";
import { ChatPromptDto } from "../dtos/chat-prompt-dto";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const chatPromptStreamUseCase = async(
    ai: GoogleGenAI,
    chatPromptDto: ChatPromptDto,
    options?: Options,
) => {
    const {prompt, files = []} = chatPromptDto;

    // TODO: refactorizar
    const uploadedFiles = await Promise.all(
        files.map(async (file) => {
            return await ai.files.upload({
                file: new Blob([new Uint8Array(file.buffer)], {
                    type: file.mimetype.includes('image') ? file.mimetype : 'image/jpg',
                }),
            });
        })
    );

    const {
        model = 'gemini-2.5-flash',
        systemInstruction = `
        Responde únicamente en español
        En formato markdown
        Usa negritas de esta forma __
        Usa el sistema métrico decimal
    `,
    } = options ?? {};

    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: systemInstruction,
        },
        history: [
            {
                role: "user",
                parts: [{ text: "Hello" }],
            },
            {
                role: "model",
                parts: [{text: "Hola mundo, que tal?"}]
            },
        ]
    });

    return chat.sendMessageStream({
        message: [
            prompt,
            ...uploadedFiles.map((files) =>
                createPartFromUri(files.uri ?? '', files.mimeType ?? '')
            )
        ]
    })
}