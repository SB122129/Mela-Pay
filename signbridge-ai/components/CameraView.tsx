
import React, { useRef, useEffect, useCallback } from 'react';

interface CameraViewProps {
  onFrame: (base64Image: string) => void;
  isCameraEnabled: boolean;
  isAiActive: boolean;
  intervalMs?: number;
  onStreamChange?: (stream: MediaStream | null) => void;
  isRecording?: boolean;
  recordingSeconds?: number;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  onFrame, 
  isCameraEnabled, 
  isAiActive,
  intervalMs = 3000,
  onStreamChange,
  isRecording = false,
  recordingSeconds = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      onStreamChange?.(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [onStreamChange]);

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        // Keep resolution modest for demo recording uploads.
        video: { width: { ideal: 640 }, height: { ideal: 360 }, facingMode: 'user' },
        audio: false
      });
      streamRef.current = stream;
      onStreamChange?.(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed:", err);
    }
  };

  useEffect(() => {
    if (isCameraEnabled) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCameraEnabled]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isCameraEnabled || !isAiActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      onFrame(dataUrl.split(',')[1]);
    }
  }, [isCameraEnabled, isAiActive, onFrame]);

  useEffect(() => {
    if (isCameraEnabled && isAiActive) {
      intervalRef.current = window.setInterval(captureFrame, intervalMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isCameraEnabled, isAiActive, captureFrame, intervalMs]);

  return (
    <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden bg-white border border-zinc-200 shadow-sm">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-700 ${isCameraEnabled ? 'opacity-100' : 'opacity-0'}`}
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
        <div className="flex justify-between items-start">
          <div className="px-4 py-2 bg-white/70 apple-blur border border-zinc-200/50 rounded-full flex items-center gap-2 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${isCameraEnabled ? 'bg-black' : 'bg-zinc-300'}`} />
            <span className="text-[10px] font-bold tracking-widest uppercase text-black">Camera Active</span>
          </div>
          {isAiActive && isCameraEnabled && (
            <div className="px-4 py-2 bg-black text-white rounded-full flex items-center gap-2 shadow-md">
              <span className="text-[10px] font-black tracking-widest uppercase">Processing</span>
            </div>
          )}
        </div>

        {isRecording && (
          <div className="self-start px-4 py-2 bg-black text-white rounded-full flex items-center gap-3 shadow-md">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase">REC</span>
            <span className="text-[10px] font-bold tracking-widest font-mono">{Math.min(30, recordingSeconds)}s</span>
          </div>
        )}
        
        {/* Minimal Corner Accents */}
        <div className="relative h-full w-full pointer-events-none opacity-10">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-black" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-black" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-black" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-black" />
        </div>
      </div>

      {!isCameraEnabled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-zinc-400 text-[10px] font-bold tracking-[0.2em] uppercase">Camera Paused</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;
