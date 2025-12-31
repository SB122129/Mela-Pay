import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { AppStatus, Message } from '../types';
import CameraView from './CameraView';
import * as gemini from '../services/geminiService';
import * as eleven from '../services/elevenLabsService';

const Upload: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [lastTranslation, setLastTranslation] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [lastHeard, setLastHeard] = useState<string>('');
  const [lastCommand, setLastCommand] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [hasClip, setHasClip] = useState<boolean>(false);
  const [clipInfo, setClipInfo] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const isSpeakingRef = useRef<boolean>(false);
  const isCameraEnabledRef = useRef<boolean>(false);
  const hasClipRef = useRef<boolean>(false);
  const isRecordingRef = useRef<boolean>(false);

  const cameraStreamRef = useRef<MediaStream | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const videoTimeoutRef = useRef<number | null>(null);
  const videoTimerRef = useRef<number | null>(null);

  const voiceStreamRef = useRef<MediaStream | null>(null);
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const voiceLoopActiveRef = useRef(false);
  const voiceRequestInFlightRef = useRef(false);

  const voiceAudioCtxRef = useRef<AudioContext | null>(null);
  const voiceAnalyserRef = useRef<AnalyserNode | null>(null);
  const voiceSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const vadIntervalRef = useRef<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const lastVideoBlobRef = useRef<Blob | null>(null);

  useEffect(() => {
    isCameraEnabledRef.current = isCameraEnabled;
  }, [isCameraEnabled]);

  useEffect(() => {
    hasClipRef.current = hasClip;
  }, [hasClip]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = String(reader.result || '');
        const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : '';
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Failed to read blob'));
      reader.readAsDataURL(blob);
    });
  };

  const handleSpeak = async (text: string) => {
    if (!text) return;
    try {
      setErrorText('');
      setStatus(AppStatus.SPEAKING);
      const mp3 = await eleven.textToSpeechMp3(text);
      const url = URL.createObjectURL(mp3);
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = '';
      }
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onended = () => {
        URL.revokeObjectURL(url);
        setStatus(AppStatus.LISTENING);
      };
      await audio.play();
    } catch (err) {
      console.error("Voice Error:", err);
      setErrorText(err instanceof Error ? err.message : String(err));
      setStatus(AppStatus.ERROR);
    }
  };

  const stopVideoRecording = useCallback(() => {
    if (videoTimeoutRef.current) {
      window.clearTimeout(videoTimeoutRef.current);
      videoTimeoutRef.current = null;
    }
    if (videoTimerRef.current) {
      window.clearInterval(videoTimerRef.current);
      videoTimerRef.current = null;
    }
    setRecordingSeconds(0);
    setIsRecording(false);
    if (videoRecorderRef.current && videoRecorderRef.current.state !== 'inactive') {
      videoRecorderRef.current.stop();
    }
  }, []);

  const startVideoRecording = useCallback(async () => {
    if (isRecordingRef.current || isProcessing) return;
    const stream = cameraStreamRef.current;
    if (!stream) {
      console.warn('No camera stream available; enable camera first.');
      return;
    }

    setErrorText('');
    setStatus(AppStatus.LISTENING);
    videoChunksRef.current = [];
    setRecordingSeconds(0);
    setHasClip(false);
    setClipInfo('');
    lastVideoBlobRef.current = null;

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8',
        videoBitsPerSecond: 450_000,
      });
    } catch {
      recorder = new MediaRecorder(stream);
    }

    videoRecorderRef.current = recorder;
    recorder.ondataavailable = (evt) => {
      if (evt.data && evt.data.size > 0) videoChunksRef.current.push(evt.data);
    };

    recorder.onstop = async () => {
      try {
        const rawType = recorder.mimeType || 'video/webm';
        const cleanType = rawType.split(';')[0].trim() || 'video/webm';
        const blob = new Blob(videoChunksRef.current, { type: cleanType });
        lastVideoBlobRef.current = blob;
        setHasClip(true);
        setClipInfo(`${Math.min(30, recordingSeconds)}s • ${(blob.size / 1024).toFixed(0)} KB • ${blob.type}`);
        setStatus(AppStatus.LISTENING);
      } catch (err) {
        console.error('Video translation error:', err);
        setErrorText(err instanceof Error ? err.message : String(err));
        setStatus(AppStatus.ERROR);
      }
    };

    recorder.start(1000);
    setIsRecording(true);

    videoTimerRef.current = window.setInterval(() => {
      setRecordingSeconds((s) => {
        const next = Math.min(30, s + 1);
        return next;
      });
    }, 1000);

    videoTimeoutRef.current = window.setTimeout(() => stopVideoRecording(), 30_000);
  }, [isProcessing, stopVideoRecording]);

  const sendLastClipToGemini = useCallback(async () => {
    if (isProcessing) return;
    const blob = lastVideoBlobRef.current;
    if (!blob) {
      setErrorText('No clip recorded yet. Say “record” first.');
      return;
    }
    try {
      setErrorText('');
      setIsProcessing(true);
      setStatus(AppStatus.INTERPRETING);

      const base64Video = await blobToBase64(blob);
      const text = await gemini.interpretSignVideo(base64Video, blob.type || 'video/webm');

      if (text && text.toLowerCase() !== lastTranslation.toLowerCase()) {
        setLastTranslation(text);
        setHistory(prev => [{ role: 'assistant', content: text, timestamp: Date.now() }, ...prev].slice(0, 10));
        await handleSpeak(text);
      } else {
        setStatus(AppStatus.LISTENING);
      }
    } catch (err) {
      console.error('Send clip error:', err);
      setErrorText(err instanceof Error ? err.message : String(err));
      setStatus(AppStatus.ERROR);
    } finally {
      setIsProcessing(false);
    }
  }, [handleSpeak, isProcessing, lastTranslation]);

  const quickRuleCommand = (raw: string): gemini.VoiceIntent | null => {
    const t = (raw || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!t) return null;
    if (/(camera on|turn on camera|open camera|enable camera|start camera)/.test(t)) return 'CAMERA_ON';
    if (/(camera off|turn off camera|close camera|disable camera|stop camera)/.test(t)) return 'CAMERA_OFF';
    if (/(stop recording|end recording)/.test(t)) return 'RECORD_STOP';
    if (/(start recording|record a video|record video|record clip|start video)/.test(t)) return 'RECORD_START';
    if (/(send|submit|upload|translate this|translate now|send clip)/.test(t)) return hasClipRef.current ? 'SEND_CLIP' : 'RECORD_START';
    if (/(reset|restart|clear|start over)/.test(t)) return 'RESET';
    return null;
  };

  const ensureVoiceStream = useCallback(async () => {
    if (voiceStreamRef.current) return voiceStreamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
      },
      video: false,
    });
    voiceStreamRef.current = stream;
    return stream;
  }, []);

  const startVad = useCallback((stream: MediaStream) => {
    if (vadIntervalRef.current) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    voiceAudioCtxRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.8;
    voiceAnalyserRef.current = analyser;

    const src = ctx.createMediaStreamSource(stream);
    voiceSourceRef.current = src;
    src.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);
    let speakingFrames = 0;
    let silentFrames = 0;
    const threshold = 0.02;

    vadIntervalRef.current = window.setInterval(() => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);

      if (rms > threshold) {
        speakingFrames++;
        silentFrames = 0;
      } else {
        silentFrames++;
        speakingFrames = 0;
      }

      if (speakingFrames >= 3) {
        isSpeakingRef.current = true;
        setIsSpeaking(true);
      }
      if (silentFrames >= 10) {
        isSpeakingRef.current = false;
        setIsSpeaking(false);
      }
    }, 50);
  }, []);

  const stopVoiceLoop = useCallback(() => {
    voiceLoopActiveRef.current = false;
    if (voiceRecorderRef.current && voiceRecorderRef.current.state !== 'inactive') {
      voiceRecorderRef.current.stop();
    }
    if (voiceStreamRef.current) {
      voiceStreamRef.current.getTracks().forEach(t => t.stop());
      voiceStreamRef.current = null;
    }

    if (vadIntervalRef.current) {
      window.clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
    voiceSourceRef.current?.disconnect();
    voiceAnalyserRef.current = null;
    if (voiceAudioCtxRef.current) {
      voiceAudioCtxRef.current.close().catch(() => undefined);
      voiceAudioCtxRef.current = null;
    }
    setIsSpeaking(false);
    isSpeakingRef.current = false;
  }, []);

  const startVoiceLoop = useCallback(async () => {
    if (voiceLoopActiveRef.current) return;
    voiceLoopActiveRef.current = true;

    const stream = await ensureVoiceStream();
    startVad(stream);

    const tick = async () => {
      if (!voiceLoopActiveRef.current) return;
      if (voiceRequestInFlightRef.current) {
        window.setTimeout(tick, 600);
        return;
      }

      if (!isSpeakingRef.current) {
        window.setTimeout(tick, 200);
        return;
      }

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      } catch {
        recorder = new MediaRecorder(stream);
      }
      voiceRecorderRef.current = recorder;
      const chunks: Blob[] = [];

      recorder.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0) chunks.push(evt.data);
      };

      recorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          if (blob.size < 1500) {
            window.setTimeout(tick, 150);
            return;
          }

          voiceRequestInFlightRef.current = true;
          const transcript = await eleven.speechToText(blob);
          setLastHeard(transcript);

          const quick = quickRuleCommand(transcript);
          const result = quick
            ? { intent: quick, confidence: 0.7, normalizedCommand: quick }
            : await gemini.classifyVoiceCommand({
                transcript,
                cameraEnabled: isCameraEnabledRef.current,
                hasClip: hasClipRef.current,
                isRecording: isRecordingRef.current,
              });

          if (result.intent !== 'NONE') setLastCommand(`${result.intent}${result.confidence ? ` (${Math.round(result.confidence * 100)}%)` : ''}`);

          if (result.intent === 'CAMERA_ON') setIsCameraEnabled(true);
          if (result.intent === 'CAMERA_OFF') setIsCameraEnabled(false);
          if (result.intent === 'RECORD_START') {
            setIsCameraEnabled(true);
            window.setTimeout(() => startVideoRecording(), 600);
          }
          if (result.intent === 'RECORD_STOP') stopVideoRecording();
          if (result.intent === 'SEND_CLIP') await sendLastClipToGemini();
          if (result.intent === 'RESET') {
            setStatus(AppStatus.IDLE);
            setIsCameraEnabled(false);
            setIsVoiceEnabled(false);
            stopVoiceLoop();
            stopVideoRecording();
            setHistory([]);
            setLastTranslation('');
            setHasClip(false);
            setClipInfo('');
            lastVideoBlobRef.current = null;
            setLastHeard('');
            setLastCommand('');
            setErrorText('');
          }
        } catch (err) {
          console.warn('Voice loop error:', err);
          setErrorText(err instanceof Error ? err.message : String(err));
        } finally {
          voiceRequestInFlightRef.current = false;
          window.setTimeout(tick, 250);
        }
      };

      recorder.start();
      window.setTimeout(() => {
        if (recorder.state !== 'inactive') recorder.stop();
      }, 2200);
    };

    tick();
  }, [ensureVoiceStream, hasClip, isCameraEnabled, isRecording, sendLastClipToGemini, startVad, startVideoRecording, stopVideoRecording, stopVoiceLoop]);

  const onFrame = useCallback((_base64: string) => {
    return;
  }, []);

  useEffect(() => {
    if (!isVoiceEnabled) stopVoiceLoop();
  }, [isVoiceEnabled, stopVoiceLoop]);

  const statusLabel = useMemo(() => {
    if (status === AppStatus.IDLE) return 'Idle';
    if (status === AppStatus.LISTENING) return 'Listening';
    if (status === AppStatus.INTERPRETING) return 'Translating';
    if (status === AppStatus.SPEAKING) return 'Speaking';
    if (status === AppStatus.ERROR) return 'Error';
    return status;
  }, [status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-10 to-zinc-30 flex flex-col p-6 md:p-10 lg:p-14">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black">
            SignBridge
          </h1>
          <p className="mt-1.5 text-sm font-medium text-zinc-500 tracking-wide">
            Voice-driven sign language translation demo
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Status:{' '}
              <span className="text-black font-semibold">{statusLabel}</span>
            </span>
          </div>

          <button
            onClick={() => {
              setStatus(AppStatus.IDLE);
              setIsCameraEnabled(false);
              setIsVoiceEnabled(false);
              stopVoiceLoop();
              stopVideoRecording();
              setLastHeard('');
              setLastCommand('');
              setErrorText('');
              setHistory([]);
              setLastTranslation('');
              setHasClip(false);
            }}
            className="px-5 py-2 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition shadow-sm"
          >
            Reset All
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 flex-grow">
        <div className="lg:col-span-7 space-y-6">
          {/* Voice Control */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-black">1. Voice Control</h2>
                <p className="mt-1.5 text-sm text-zinc-500">Say: “open camera”, “record”, “send”, “stop recording”...</p>
              </div>
              <button
                onClick={() => {
                  const next = !isVoiceEnabled;
                  setIsVoiceEnabled(next);
                  if (next) {
                    setStatus(AppStatus.LISTENING);
                    startVoiceLoop().catch((e) => setErrorText(e instanceof Error ? e.message : String(e)));
                  } else {
                    stopVoiceLoop();
                  }
                }}
                className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all shadow-sm ${
                  isVoiceEnabled
                    ? 'bg-black text-white hover:bg-zinc-800'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-300'
                }`}
              >
                Voice {isVoiceEnabled ? 'On' : 'Off'}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-30 border border-zinc-100">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Heard</div>
                <div className="mt-2 text-sm font-medium text-black min-h-[1.5rem] break-words">
                  {lastHeard || '—'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-30 border border-zinc-100">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Last Command</div>
                <div className="mt-2 text-sm font-medium text-black">{lastCommand || '—'}</div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-500">Voice activity</span>
              <span className={`font-bold uppercase tracking-wider ${isSpeaking ? 'text-emerald-600' : 'text-zinc-400'}`}>
                {isSpeaking ? 'Speaking' : 'Silent'}
              </span>
            </div>

            {errorText && (
              <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm text-red-800">
                {errorText}
              </div>
            )}
          </div>

          {/* Camera & Recording */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-black">2. Camera & Recording</h2>
                <p className="mt-1.5 text-sm text-zinc-500">Max 30 seconds (demo limit)</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsCameraEnabled(v => !v)}
                  className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition shadow-sm ${
                    isCameraEnabled
                      ? 'bg-black text-white hover:bg-zinc-800'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-300'
                  }`}
                >
                  Camera {isCameraEnabled ? 'On' : 'Off'}
                </button>
                <button
                  onClick={startVideoRecording}
                  disabled={!isCameraEnabled || isProcessing || isRecording}
                  className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-white border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 transition shadow-sm"
                >
                  Record
                </button>
                <button
                  onClick={stopVideoRecording}
                  disabled={!isRecording}
                  className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-white border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 transition shadow-sm"
                >
                  Stop
                </button>
                <button
                  onClick={sendLastClipToGemini}
                  disabled={!hasClip || isProcessing}
                  className="px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-zinc-800 disabled:opacity-50 transition shadow-sm"
                >
                  Send Clip
                </button>
              </div>
            </div>

            <div className="relative  overflow-hidden  aspect-video shadow-inner">
              <CameraView
                isCameraEnabled={isCameraEnabled}
                isAiActive={true}
                onFrame={onFrame}
                isRecording={isRecording}
                recordingSeconds={recordingSeconds}
                onStreamChange={(s) => { cameraStreamRef.current = s; }}
              />
              {isRecording && (
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white text-white text-xs font-bold rounded-full backdrop-blur-sm">
                  REC {recordingSeconds}s
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="font-medium text-zinc-600">{recordingSeconds}s / 30s</div>
              <div className="font-medium text-zinc-500">
                {isRecording ? 'Recording…' : isProcessing ? 'Processing…' : hasClip ? 'Clip ready' : 'Ready to record'}
              </div>
            </div>

            {hasClip && (
              <div className="text-sm text-zinc-600 bg-zinc-30 p-4 rounded-2xl border border-zinc-100">
                Clip ready ({clipInfo || '—'}) • Say “send” or click button
              </div>
            )}
          </div>

          {/* New Textarea Card */}
          <div className="p-8 bg-white border border-zinc-200 rounded-[2rem] flex flex-col space-y-4 shadow-sm">
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Write Here To Communicate</span>
               <button 
                 onClick={() => setLastTranslation("")}
                 className="text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors"
               >
                 Reset
               </button>
             </div>
             <textarea
               className="w-full min-h-[120px] bg-transparent text-2xl font-semibold text-black focus:outline-none resize-none placeholder-zinc-200 leading-tight"
               value={lastTranslation}
               onChange={(e) => setLastTranslation(e.target.value)}
               placeholder="Hello ..."
             />
          </div>
        </div>

        {/* Translation Results */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight text-black">3. Translation</h2>
              <button
                onClick={() => setHistory([])}
                className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-black transition"
              >
                Clear history
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-30 border border-zinc-100">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Latest</div>
              <div className="mt-3 text-2xl md:text-3xl font-semibold leading-tight text-black break-words">
                {lastTranslation || '—'}
              </div>
              {lastTranslation && (
                <button
                  onClick={() => handleSpeak(lastTranslation)}
                  className="mt-5 px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold uppercase tracking-wider hover:bg-zinc-800 transition shadow-sm"
                >
                  Play
                </button>
              )}
            </div>

            <div className="mt-8 space-y-4">
              {history.length === 0 ? (
                <p className="text-sm text-zinc-400 italic">
                  No translations yet. Start by enabling voice and camera.
                </p>
              ) : (
                history.map((msg) => (
                  <button
                    key={msg.timestamp}
                    onClick={() => { setLastTranslation(msg.content); handleSpeak(msg.content); }}
                    className="w-full text-left p-5 rounded-2xl border border-zinc-100 hover:bg-zinc-50 transition text-sm"
                  >
                    <div className="text-xs text-zinc-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="mt-1 font-medium text-black break-words">{msg.content}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;