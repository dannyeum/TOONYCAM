
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera as CameraIcon, X, SwitchCamera } from 'lucide-react';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const startCamera = useCallback(async () => {
    try {
      setIsReady(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1080 }, height: { ideal: 1080 } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsReady(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("카메라에 접근할 수 없습니다. 권한을 확인해 주세요.");
      onCancel();
    }
  }, [facingMode, onCancel]);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        // Set canvas to a square matching the smaller dimension
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;
        
        // Center crop
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;
        
        // Handle mirroring for front camera
        if (facingMode === 'user') {
          context.translate(size, 0);
          context.scale(-1, 1);
        }
        
        context.drawImage(video, startX, startY, size, size, 0, 0, size, size);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="relative w-full h-full bg-black flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full aspect-square object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
      />
      
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="absolute bottom-8 left-0 right-0 px-8 flex items-center justify-between">
        <button 
          onClick={onCancel}
          className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={capturePhoto}
          disabled={!isReady}
          className="group relative flex items-center justify-center"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-active:scale-90 transition-transform shadow-xl">
            <div className="w-16 h-16 border-2 border-gray-200 rounded-full"></div>
          </div>
          <CameraIcon className="absolute w-8 h-8 text-indigo-600" />
        </button>

        <button 
          onClick={toggleCamera}
          className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <SwitchCamera className="w-6 h-6" />
        </button>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;
