
import React, { useState, useCallback } from 'react';
import { Camera, RefreshCw, Download, Sparkles, Image as ImageIcon, ArrowLeft, Camera as CameraIcon } from 'lucide-react';
import { AppMode, ToonifyResult, CartoonStyle } from './types';
import CameraView from './components/CameraView';
import ProcessingView from './components/ProcessingView';
import ResultView from './components/ResultView';
import HomeView from './components/HomeView';
import { cartoonizeImage } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('home');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<ToonifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<CartoonStyle>(CartoonStyle.PIXAR);

  const handleCapture = useCallback((imageData: string) => {
    setCapturedImage(imageData);
    setMode('processing');
    processImage(imageData, selectedStyle);
  }, [selectedStyle]);

  const processImage = async (imageData: string, style: CartoonStyle) => {
    try {
      setError(null);
      const cartoonUrl = await cartoonizeImage(imageData, style);
      setResult({
        original: imageData,
        cartoon: cartoonUrl
      });
      setMode('result');
    } catch (err: any) {
      console.error(err);
      setError("AI 변환 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setMode('home');
    }
  };

  const handleRetry = () => {
    setResult(null);
    setCapturedImage(null);
    setMode('camera');
  };

  const handleBackToHome = () => {
    setMode('home');
    setResult(null);
    setCapturedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-white/20">
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <button 
            onClick={handleBackToHome}
            className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${mode === 'home' ? 'invisible' : 'visible'}`}
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="logo-font text-3xl text-indigo-600 tracking-wider">TOONIFY</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Content Area */}
        <div className="relative min-h-[500px]">
          {mode === 'home' && (
            <HomeView 
              onStart={() => setMode('camera')} 
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
            />
          )}
          
          {mode === 'camera' && (
            <CameraView onCapture={handleCapture} onCancel={() => setMode('home')} />
          )}

          {mode === 'processing' && (
            <ProcessingView style={selectedStyle} />
          )}

          {mode === 'result' && result && (
            <ResultView 
              result={result} 
              onRetry={handleRetry} 
              onHome={handleBackToHome} 
            />
          )}
        </div>

        {/* Footer info if error */}
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm text-center">
            {error}
          </div>
        )}
      </div>

      <p className="mt-6 text-gray-500 text-sm font-medium">
        Powered by Gemini AI • Made with ✨
      </p>
    </div>
  );
};

export default App;
