type ElevenLabsSpeechToTextResponse = {
  // Common shapes observed across STT APIs / versions
  text?: string;
  transcript?: string;
  transcription?: string;
  result?: {
    text?: string;
    transcript?: string;
  };
};

function getElevenLabsApiKey(): string {
  // Support both env var names so existing .env.local keeps working.
  // Prefer the conventional upper-case name.
  const key =
    (process.env.ELEVENLABS_API_KEY as string | undefined) ||
    (process.env.Elevenlabs_API_KEY as string | undefined) ||
    '';
  return key;
}

function getElevenLabsVoiceId(): string {
  return (process.env.ELEVENLABS_VOICE_ID as string | undefined) || '21m00Tcm4TlvDq8ikWAM';
}

export async function speechToText(audioBlob: Blob): Promise<string> {
  const apiKey = getElevenLabsApiKey();
  if (!apiKey) throw new Error('Missing ElevenLabs API key. Set ELEVENLABS_API_KEY in .env.local');

  const formData = new FormData();
  formData.append('file', audioBlob, 'speech.webm');
  // ElevenLabs STT requires a model_id.
  // Default to the general-purpose Scribe model.
  formData.append('model_id', (process.env.ELEVENLABS_STT_MODEL_ID as string | undefined) || 'scribe_v1');
  // Voice commands are English for this demo.
  formData.append('language_code', (process.env.ELEVENLABS_STT_LANGUAGE_CODE as string | undefined) || 'en');

  const resp = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
    },
    body: formData,
  });

  if (!resp.ok) {
    const detail = await resp.text().catch(() => '');
    throw new Error(`ElevenLabs STT failed (${resp.status}): ${detail}`);
  }

  const json = (await resp.json()) as ElevenLabsSpeechToTextResponse;
  const candidate =
    json.text ||
    json.transcript ||
    json.transcription ||
    json.result?.text ||
    json.result?.transcript ||
    '';
  return String(candidate).trim();
}

export async function textToSpeechMp3(text: string, voiceId?: string): Promise<Blob> {
  const apiKey = getElevenLabsApiKey();
  if (!apiKey) throw new Error('Missing ElevenLabs API key. Set ELEVENLABS_API_KEY in .env.local');

  const selectedVoiceId = voiceId || getElevenLabsVoiceId();

  const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!resp.ok) {
    const detail = await resp.text().catch(() => '');
    throw new Error(`ElevenLabs TTS failed (${resp.status}): ${detail}`);
  }

  const buf = await resp.arrayBuffer();
  return new Blob([buf], { type: 'audio/mpeg' });
}
