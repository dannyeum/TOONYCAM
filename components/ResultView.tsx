
import React, { useState } from 'react';
import { Download, RefreshCw, Home, Share2, Check } from 'lucide-react';
import { ToonifyResult } from '../types';

interface ResultViewProps {
  result: ToonifyResult;
  onRetry: () => void;
  onHome: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onRetry, onHome }) => {
  const [isOriginalShowing, setIsOriginalShowing] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.cartoon;
    link.download = `toonify-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl mb-8 group bg-gray-100">
        <img 
          src={isOriginalShowing ? result.original : result.cartoon} 
          alt="Toonified Result"
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        
        {/* Toggle Overlay */}
        <button 
          onMouseDown={() => setIsOriginalShowing(true)}
          onMouseUp={() => setIsOriginalShowing(false)}
          onTouchStart={() => setIsOriginalShowing(true)}
          onTouchEnd={() => setIsOriginalShowing(false)}
          className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-black/60 transition-colors"
        >
          {isOriginalShowing ? '원본 보기 중' : '꾹 눌러서 원본 비교'}
        </button>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white text-sm font-medium">✨ AI 만화 마법 완료!</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        <button
          onClick={handleDownload}
          className="flex flex-col items-center justify-center p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg transition-all active:scale-95"
        >
          {downloaded ? <Check className="w-6 h-6 mb-2" /> : <Download className="w-6 h-6 mb-2" />}
          <span className="text-sm font-bold">{downloaded ? '저장됨' : '이미지 저장'}</span>
        </button>
        
        <button
          onClick={onRetry}
          className="flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50 rounded-2xl transition-all active:scale-95"
        >
          <RefreshCw className="w-6 h-6 mb-2" />
          <span className="text-sm font-bold">다시 찍기</span>
        </button>
      </div>

      <button
        onClick={onHome}
        className="w-full py-4 text-gray-400 hover:text-gray-600 font-semibold text-sm flex items-center justify-center gap-2"
      >
        <Home className="w-4 h-4" />
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default ResultView;
