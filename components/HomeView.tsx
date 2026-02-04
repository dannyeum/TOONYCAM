
import React from 'react';
import { Camera, Sparkles, Wand2 } from 'lucide-react';
import { CartoonStyle } from '../types';

interface HomeViewProps {
  onStart: () => void;
  selectedStyle: CartoonStyle;
  onStyleChange: (style: CartoonStyle) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onStart, selectedStyle, onStyleChange }) => {
  const styles = [
    { id: CartoonStyle.PIXAR, name: '3D Pixar', icon: '🎬' },
    { id: CartoonStyle.GHIBLI, name: 'Ghibli', icon: '☁️' },
    { id: CartoonStyle.COMIC, name: 'Comic', icon: '💥' },
    { id: CartoonStyle.CYBERPUNK, name: 'Cyberpunk', icon: '🌃' },
  ];

  return (
    <div className="p-8 flex flex-col items-center text-center">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
          <Sparkles className="w-16 h-16 text-indigo-500" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-lg shadow-lg rotate-12">
          <Wand2 className="w-6 h-6 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">당신의 사진을 만화처럼!</h2>
      <p className="text-gray-500 mb-8 max-w-xs">
        셀카나 풍경 사진을 찍으면 AI가 멋진 만화 스타일 예술 작품으로 변신시켜 줍니다.
      </p>

      <div className="w-full mb-8">
        <p className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">스타일 선택</p>
        <div className="grid grid-cols-2 gap-3">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => onStyleChange(style.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedStyle === style.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
                  : 'border-gray-100 hover:border-gray-200 text-gray-600'
              }`}
            >
              <span className="text-2xl">{style.icon}</span>
              <span className="font-semibold text-sm">{style.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 transition-all active:scale-95"
      >
        <Camera className="w-6 h-6" />
        <span className="text-lg">사진 찍기 시작</span>
      </button>
    </div>
  );
};

export default HomeView;
