import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Video, Upload, SwitchCamera, Info } from 'lucide-react';

// Helper to identify infrared / Windows Hello depth cameras that output black frames in normal room light
const isIrOrDepthCamera = (device) => {
  const label = (device?.label || '').toLowerCase();
  return (
    label.includes('ir ') ||
    label.includes(' ir') ||
    label.includes('infrared') ||
    label.includes('hello') ||
    label.includes('depth') ||
    label.includes('tof')
  );
};

export default function CameraModal({ isOpen, onClose, onCapture, title = "Capture Photo with Camera" }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [isVirtualMode, setIsVirtualMode] = useState(false);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [cameraLabel, setCameraLabel] = useState('');

  // Stop all active MediaStream tracks and reset video srcObject
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  // Start hardware camera stream safely with smart IR detection & fallback
  const startCameraStream = useCallback(async (preferredDeviceId = null) => {
    stopStream();
    setIsInitializing(true);
    setCameraError('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available in this browser environment. Please use HTTPS or localhost.');
      }

      // 1. Discover available video devices
      const devices = await navigator.mediaDevices.enumerateDevices().catch(() => []);
      const videoInputs = devices.filter(d => d.kind === 'videoinput');
      setAvailableDevices(videoInputs);

      // 2. Pick target device: prefer non-IR camera
      let targetDeviceId = preferredDeviceId || selectedDeviceId;
      if (!targetDeviceId && videoInputs.length > 0) {
        const nonIr = videoInputs.filter(d => !isIrOrDepthCamera(d));
        const chosen = nonIr.length > 0 ? nonIr[0] : videoInputs[0];
        if (chosen?.deviceId) {
          targetDeviceId = chosen.deviceId;
        }
      }

      // 3. Request media stream
      const constraints = {
        video: targetDeviceId
          ? {
              deviceId: { exact: targetDeviceId },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          : {
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
        audio: false
      };

      let mediaStream = null;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        console.warn("[CameraModal] Targeted constraints failed, falling back to basic camera request", err);
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        });
      }

      // 4. Update device list with revealed permission labels
      const updatedDevices = await navigator.mediaDevices.enumerateDevices().catch(() => []);
      const updatedVideoInputs = updatedDevices.filter(d => d.kind === 'videoinput');
      setAvailableDevices(updatedVideoInputs);

      // 5. Detect and auto-correct if Windows Hello / IR camera was selected by default
      const currentTrack = mediaStream.getVideoTracks()[0];
      const activeLabel = currentTrack?.label || '';
      setCameraLabel(activeLabel);

      if (isIrOrDepthCamera({ label: activeLabel })) {
        const trueColorDevice = updatedVideoInputs.find(d => !isIrOrDepthCamera(d));
        if (trueColorDevice?.deviceId) {
          console.info(`[CameraModal] Switching from IR sensor ("${activeLabel}") to RGB camera ("${trueColorDevice.label}")`);
          mediaStream.getTracks().forEach(t => t.stop());
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: trueColorDevice.deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false
          });
          const newTrack = mediaStream.getVideoTracks()[0];
          setCameraLabel(newTrack?.label || trueColorDevice.label);
          targetDeviceId = trueColorDevice.deviceId;
        }
      }

      streamRef.current = mediaStream;
      if (targetDeviceId) {
        setSelectedDeviceId(targetDeviceId);
      }

      // 6. Programmatically configure video element for reliable HTML5 playback
      const video = videoRef.current;
      if (video) {
        video.srcObject = mediaStream;
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');

        const onMetadata = () => {
          video.play().catch(e => {
            console.warn("[CameraModal] Video play catch:", e);
          });
          setIsInitializing(false);
        };

        video.onloadedmetadata = onMetadata;
        video.play().catch(() => {});
      }

      // Fallback timeout to clear initializing spinner
      setTimeout(() => {
        setIsInitializing(false);
      }, 1200);

    } catch (err) {
      console.error("[CameraModal] Camera access failure:", err);
      setIsInitializing(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in your browser address bar.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Your camera is currently in use by another app (Zoom, Teams, or Windows Hello). Please close other apps or switch to Virtual HD mode.');
      } else {
        setCameraError('Could not start webcam stream. Please check physical camera connection or try the Virtual HD Feed.');
      }
    }
  }, [selectedDeviceId, stopStream]);

  // Lifecycle management
  useEffect(() => {
    if (isOpen && !isVirtualMode && !capturedImage) {
      startCameraStream();
    } else if (!isOpen) {
      stopStream();
      queueMicrotask(() => {
        setCapturedImage(null);
        setCameraError('');
        setIsVirtualMode(false);
      });
    } else if (isVirtualMode) {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, isVirtualMode, capturedImage, startCameraStream, stopStream]);

  // Cycle to next available camera device
  const handleCycleCamera = () => {
    if (availableDevices.length <= 1) return;
    const currentIndex = availableDevices.findIndex(d => d.deviceId === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % availableDevices.length;
    const nextDevice = availableDevices[nextIndex];
    if (nextDevice?.deviceId) {
      setSelectedDeviceId(nextDevice.deviceId);
      startCameraStream(nextDevice.deviceId);
    }
  };

  // Virtual HD Live Feed Canvas Renderer
  useEffect(() => {
    if (!isOpen || !isVirtualMode || capturedImage) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let step = 0;
    const sampleFitImage = new Image();
    sampleFitImage.crossOrigin = "anonymous";
    sampleFitImage.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80";

    const renderVirtualFeed = () => {
      step += 0.03;
      const w = canvas.width || 640;
      const h = canvas.height || 480;

      ctx.clearRect(0, 0, w, h);

      if (sampleFitImage.complete && sampleFitImage.naturalWidth > 0) {
        const zoom = 1 + Math.sin(step * 0.4) * 0.015;
        const dx = (w * (1 - zoom)) / 2;
        const dy = (h * (1 - zoom)) / 2;
        ctx.drawImage(sampleFitImage, dx, dy, w * zoom, h * zoom);
      } else {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#36241b');
        grad.addColorStop(1, '#1b120e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Dynamic AI Fit Box Overlay
      ctx.strokeStyle = '#D4A373';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      const boxY = 70 + Math.sin(step) * 6;
      ctx.strokeRect(w * 0.22, boxY, w * 0.56, h * 0.7);
      ctx.setLineDash([]);

      // Live HUD Pill
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(16, 16, 175, 30);
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(30, 31, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('LIVE HD STUDIO CAM', 42, 35);

      animFrameRef.current = requestAnimationFrame(renderVirtualFeed);
    };

    animFrameRef.current = requestAnimationFrame(renderVirtualFeed);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isVirtualMode, capturedImage]);

  // Take Snapshot Logic
  const takeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isVirtualMode) {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
      return;
    }

    const video = videoRef.current;
    if (video) {
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.clearRect(0, 0, width, height);
      // Mirror horizontal for natural front-camera orientation
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, width, height);
      ctx.restore();

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
    }
  };

  const handleFileUploadInsideModal = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (!isVirtualMode) {
      startCameraStream();
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopStream();
      onClose();
    }
  };

  const handleCloseModal = () => {
    stopStream();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-fitted-border flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-fitted-border flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-fitted-brown/15 text-fitted-brown flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-fitted-charcoal">{title}</h3>
              <p className="text-[11px] text-fitted-muted flex items-center gap-1.5 truncate max-w-xs sm:max-w-sm">
                <span>{isVirtualMode ? 'Virtual HD Studio Cam' : (cameraLabel || 'Live Laptop Camera Stream')}</span>
                {availableDevices.length > 1 && !isVirtualMode && (
                  <span className="text-[10px] bg-fitted-bg px-1.5 py-0.5 rounded border border-fitted-border font-semibold">
                    {availableDevices.length} Cameras Available
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full hover:bg-fitted-bg text-fitted-muted hover:text-fitted-charcoal transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Display Area */}
        <div className="relative bg-black flex-1 min-h-[380px] flex items-center justify-center overflow-hidden">
          
          {/* Virtual Mode Canvas / Snapshot Canvas */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className={`w-full h-full max-h-[70vh] object-cover ${
              (isVirtualMode || capturedImage) ? 'block' : 'hidden'
            }`}
          />

          {/* Captured Preview Screen */}
          {capturedImage ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured outfit fit"
                className="max-h-[70vh] w-full object-contain"
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Photo Captured Ready</span>
              </div>
            </div>
          ) : (
            !isVirtualMode && (
              <>
                {/* Live Hardware Video Element */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full max-h-[70vh] object-cover scale-x-[-1] ${
                    isInitializing ? 'opacity-40' : 'opacity-100'
                  }`}
                />

                {/* Connection Spinner */}
                {isInitializing && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white space-y-4 p-6 text-center z-20">
                    <RefreshCw className="w-9 h-9 animate-spin text-fitted-gold mx-auto" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">Connecting to Camera...</p>
                      <p className="text-xs text-stone-300">Initializing video sensor & light calibration</p>
                    </div>
                  </div>
                )}

                {/* Permission Error State */}
                {cameraError && (
                  <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-white space-y-4 p-6 text-center z-20">
                    <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
                    <div className="space-y-1 max-w-sm">
                      <p className="text-sm font-bold text-white">Camera Feed Unavailable</p>
                      <p className="text-xs text-stone-300">{cameraError}</p>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => startCameraStream()}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/20 flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsVirtualMode(true)}
                        className="px-4 py-2 rounded-xl bg-fitted-brown text-white text-xs font-bold hover:bg-fitted-brownDark transition-colors shadow-md"
                      >
                        Use Virtual HD Stream
                      </button>
                    </div>
                  </div>
                )}
              </>
            )
          )}

          {/* Top Control Bar HUD */}
          {!capturedImage && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              {/* Switch Camera Button (Active when 2+ cameras detected) */}
              {!isVirtualMode && availableDevices.length > 1 && (
                <button
                  type="button"
                  onClick={handleCycleCamera}
                  className="px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-all shadow-md"
                  title="Switch between front webcam, external camera, or IR sensor"
                >
                  <SwitchCamera className="w-3.5 h-3.5 text-fitted-gold" />
                  <span className="hidden sm:inline">Switch Camera</span>
                </button>
              )}

              {/* Toggle Virtual HD Feed */}
              <button
                type="button"
                onClick={() => {
                  if (isVirtualMode) {
                    setIsVirtualMode(false);
                    startCameraStream();
                  } else {
                    stopStream();
                    setIsVirtualMode(true);
                  }
                }}
                className="px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-all shadow-md"
              >
                <Video className="w-3.5 h-3.5 text-fitted-gold" />
                <span>{isVirtualMode ? 'Try Laptop Webcam' : 'Virtual HD Feed'}</span>
              </button>
            </div>
          )}

          {/* Shutter Privacy Tip Overlay if Camera is active */}
          {!capturedImage && !isVirtualMode && !cameraError && (
            <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex justify-center z-10">
              <span className="bg-black/60 backdrop-blur-sm text-stone-300 text-[10px] px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                <Info className="w-3 h-3 text-fitted-gold" />
                <span>If screen is dark, verify your laptop's physical webcam privacy shutter is open</span>
              </span>
            </div>
          )}

          {/* Camera Frame Corners Overlay */}
          {!capturedImage && !isInitializing && (
            <div className="absolute inset-0 pointer-events-none border-[12px] border-black/20 flex flex-col justify-between p-4">
              <div className="flex justify-between">
                <div className="w-6 h-6 border-t-2 border-l-2 border-white/80"></div>
                <div className="w-6 h-6 border-t-2 border-r-2 border-white/80"></div>
              </div>
              <div className="flex justify-between">
                <div className="w-6 h-6 border-b-2 border-l-2 border-white/80"></div>
                <div className="w-6 h-6 border-b-2 border-r-2 border-white/80"></div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Controls Footer */}
        <div className="p-4 bg-white border-t border-fitted-border flex items-center justify-between">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-xl border border-fitted-border text-fitted-charcoal font-semibold text-xs hover:bg-fitted-bg transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all flex items-center gap-2 shadow-glow-brown"
              >
                <Check className="w-4 h-4" />
                <span>Use Captured Photo</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl border border-fitted-border text-fitted-charcoal font-semibold text-xs hover:bg-fitted-bg transition-colors"
                >
                  Cancel
                </button>

                <label className="px-3.5 py-2.5 rounded-xl border border-fitted-border text-fitted-charcoal font-semibold text-xs hover:bg-fitted-bg transition-colors cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-fitted-brown" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUploadInsideModal}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={takeSnapshot}
                className="px-6 py-2.5 rounded-xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all flex items-center gap-2 shadow-glow-brown"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Photo Now</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
