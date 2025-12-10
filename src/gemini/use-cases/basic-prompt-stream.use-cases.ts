import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import { BasicPromptDto } from "../dtos/basic-prompt-dto";

interface Options {
    model?: string;
    systemInstruction?: string;
}

export const basicPromptStreamUseCase = async(
    ai: GoogleGenAI,
    basicPromptDto: BasicPromptDto,
    options?: Options,
) => {
    const {prompt, files = []} = basicPromptDto;

    const images = await Promise.all(
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

    const response = await ai.models.generateContentStream({
            model: model,
            // contents: basicPromptDto.prompt,
            contents :[
                createUserContent([
                    prompt,
                    ...images.map((image) =>
                        createPartFromUri(image.uri ?? '', image.mimeType ?? ''),
                )
                ])
            ],
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response;
}