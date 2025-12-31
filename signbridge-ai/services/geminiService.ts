
import { GoogleGenAI, Modality, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export type VoiceIntent =
  | 'CAMERA_ON'
  | 'CAMERA_OFF'
  | 'RECORD_START'
  | 'RECORD_STOP'
  | 'SEND_CLIP'
  | 'RESET'
  | 'NONE';

export type VoiceIntentResult = {
  intent: VoiceIntent;
  confidence: number;
  normalizedCommand: string;
};

/**
 * Voice command intent classifier.
 * Uses Gemini to map natural phrases ("camera on", "turn it on", "start recording", etc.)
 * into a small set of deterministic intents.
 */
export async function classifyVoiceCommand(params: {
  transcript: string;
  cameraEnabled: boolean;
  hasClip: boolean;
  isRecording: boolean;
}): Promise<VoiceIntentResult> {
  const transcript = (params.transcript || '').trim();
  if (!transcript) {
    return { intent: 'NONE', confidence: 0, normalizedCommand: '' };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          {
            text:
              'You are an intent classifier for a voice-driven sign-language translation demo.\n' +
              'Return ONLY JSON matching the schema.\n\n' +
              'Intents:\n' +
              '- CAMERA_ON: user wants the camera enabled/opened/started\n' +
              '- CAMERA_OFF: user wants the camera disabled/closed/stopped\n' +
              '- RECORD_START: user wants to start recording a short sign-language video\n' +
              '- RECORD_STOP: user wants to stop recording\n' +
              '- SEND_CLIP: user wants to send/submit/upload/translate the last recorded clip\n' +
              '- RESET: user wants to reset/clear/restart the session\n' +
              '- NONE: not a command\n\n' +
              'Context:\n' +
              `- cameraEnabled: ${params.cameraEnabled}\n` +
              `- isRecording: ${params.isRecording}\n` +
              `- hasClip: ${params.hasClip}\n\n` +
              'Rules:\n' +
              '- If user says "translate" and hasClip=true: SEND_CLIP\n' +
              '- If user says "translate" and hasClip=false: RECORD_START\n' +
              '- If user says "stop": if isRecording=true then RECORD_STOP else CAMERA_OFF\n' +
              '- Prefer NONE over guessing when unclear.\n\n' +
              `Transcript: ${transcript}`,
          },
        ],
      },
      config: {
        temperature: 0.0,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              enum: ['CAMERA_ON', 'CAMERA_OFF', 'RECORD_START', 'RECORD_STOP', 'SEND_CLIP', 'RESET', 'NONE'],
            },
            confidence: { type: Type.NUMBER },
            normalizedCommand: { type: Type.STRING },
          },
          required: ['intent', 'confidence', 'normalizedCommand'],
        },
      },
    });

    const raw = (response.text || '').trim();
    const parsed = JSON.parse(raw) as VoiceIntentResult;
    return {
      intent: parsed.intent || 'NONE',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
      normalizedCommand: parsed.normalizedCommand || '',
    };
  } catch (err) {
    console.warn('Voice intent classification failed; falling back to NONE.', err);
    return { intent: 'NONE', confidence: 0, normalizedCommand: '' };
  }
}

/**
 * Decodes raw PCM audio data from Gemini TTS into an AudioBuffer.
 * Uses 24,000Hz mono which is standard for the prebuilt voices.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Normalize Int16 to Float32 [-1.0, 1.0]
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Standard Base64 to Uint8Array helper.
 */
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Vision-to-Text: Analyzes sign language gestures.
 */
export async function interpretSign(base64Image: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Translate this sign language gesture into a single clear English word or phrase. Be concise. If nothing is being signed, return an empty string." }
        ]
      },
      config: { temperature: 0.1 }
    });
    return response.text?.trim() || "";
  } catch (err) {
    console.error("Vision API Error:", err);
    return "";
  }
}

/**
 * Video-to-Text: Analyzes sign language in a short video clip.
 * Note: For demo use, keep clips short (<= 30s) and low bitrate to avoid payload limits.
 */
export async function interpretSignVideo(base64Video: string, mimeType: string = 'video/webm'): Promise<string> {
  try {
    const normalizedMimeType = (mimeType || 'video/webm').split(';')[0].trim();
    const response = await ai.models.generateContent({
      // Use a broadly supported multimodal model for video.
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: normalizedMimeType, data: base64Video } },
          {
            text:
              'Translate the sign language shown in this short video into a single clear English word or phrase. Be concise. If no signing is happening, return an empty string.',
          },
        ],
      },
      config: { temperature: 0.1 },
    });
    return response.text?.trim() || '';
  } catch (err) {
    console.error('Video Vision API Error:', err);
    return '';
  }
}

/**
 * Text-to-Speech: High quality synthesis.
 */
export async function textToSpeech(text: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Audio generation failed");
  return base64Audio;
}
