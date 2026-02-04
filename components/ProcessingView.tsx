
import React, { useEffect, useState } from 'react';
import { Sparkles, Wand2, Palette, Zap } from 'lucide-react';
import { CartoonStyle } from '../types';

interface ProcessingViewProps {
  style: CartoonStyle;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ style }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const tips = [
    "AI가 픽셀을 예술로 바꾸는 중...",
    "스케치를 칠하고 선을 따는 중...",
    "당신의 미소를 만화 캐릭터로 변신 중!",
    "거의 다 되었습니다, 잠시만 기다려주세요.",
    "색감을 마법처럼 입히고 있어요 ✨"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="p-12 flex flex-col items-center justify-center text-center">
      <div className="relative mb-12">
        <div className="w-40 h-40 border-8 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-16 h-16 text-indigo-500 animate-pulse" />
        </div>
        
        {/* Floating Icons */}
        <Palette className="absolute -top-4 -right-4 w-10 h-10 text-pink-400 animate-bounce" style={{ animationDelay: '0s' }} />
        <Wand2 className="absolute -bottom-4 -left-4 w-10 h-10 text-yellow-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <Zap className="absolute top-1/2 -left-8 w-8 h-8 text-blue-400 animate-pulse" />
      </div>

      <h3 className="text-2xl font-black text-gray-800 mb-4 tracking-tight">
        {style.split(' ')[0]} 스타일로 변신 중!
      </h3>
      
      <div className="h-12 flex items-center justify-center">
        <p className="text-indigo-600 font-medium text-lg animate-fade-in transition-opacity">
          {tips[tipIndex]}
        </p>
      </div>

      <div className="mt-12 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <div className="bg-indigo-500 h-full animate-[loading_10s_ease-in-out_infinite]" style={{ width: '0%' }}></div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ProcessingView;
