import { GoogleGenAI, Chat, Operation } from "@google/genai";

let ai: GoogleGenAI;
let chat: Chat | null = null;

const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

const getChat = () => {
    if(!chat) {
        const genAI = getAI();
        chat = genAI.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'You are Vanguard AI, a highly advanced, friendly, and slightly witty assistant integrated into VanguardOS, a virtual mobile OS. Your purpose is to provide concise, accurate, and helpful information. You can access general knowledge, but you are not aware of the host system\'s real-time data unless provided in the prompt. Keep your responses brief and to the point, but feel free to add a touch of personality.',
            },
        });
    }
    return chat;
}

export const streamChat = async (
    message: string, 
    onChunk: (chunk: string) => void
): Promise<void> => {
    try {
        const chatInstance = getChat();
        const result = await chatInstance.sendMessageStream({ message });

        for await (const chunk of result) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error in streamChat:", error);
        onChunk("Sorry, I encountered an error. Please try again.");
    }
};

export const generateText = async (prompt: string): Promise<string> => {
    try {
        const genAI = getAI();
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error in generateText:", error);
        return "Sorry, I couldn't generate a response. Please try again.";
    }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
    try {
        const genAI = getAI();
        const response = await genAI.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
            },
        });
        return response.generatedImages[0].image.imageBytes;
    } catch (error) {
        console.error("Error in generateImage:", error);
        return null;
    }
};

const VIDEO_GENERATION_MESSAGES = [
    "Analyzing your creative prompt...",
    "Gathering visual concepts...",
    "Storyboarding the main sequence...",
    "Rendering initial frames...",
    "Upscaling to high definition...",
    "Applying cinematic effects...",
    "Encoding the final video...",
    "Almost there, finalizing the details...",
];

export const generateVideo = async (
    prompt: string,
    onProgress: (message: string) => void
): Promise<string | null> => {
    try {
        const genAI = getAI();
        onProgress(VIDEO_GENERATION_MESSAGES[0]);

        let operation = await genAI.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
            },
        });

        let messageIndex = 1;
        onProgress(VIDEO_GENERATION_MESSAGES[messageIndex]);

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await genAI.operations.getVideosOperation({ operation: operation });
            
            messageIndex = (messageIndex + 1) % VIDEO_GENERATION_MESSAGES.length;
            if (messageIndex === 0) messageIndex = 1; // Skip the first message
            onProgress(VIDEO_GENERATION_MESSAGES[messageIndex]);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error("Video generation completed but no download link was found.");
        }
        
        onProgress("Downloading your video...");
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error in generateVideo:", error);
        onProgress(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Show error for 5s
        return null;
    }
};
