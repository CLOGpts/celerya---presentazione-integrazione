import React, { useState, useEffect } from 'react';
import { PresentationStep, Language } from '../types.ts';
import { 
    ChevronLeftIcon, ChevronRightIcon, 
    PlayIcon, PauseIcon 
} from './Icons.tsx';

interface PresentationScreenProps {
  steps: PresentationStep[];
  next?: string;
  onNavigate: (targetId: string) => void;
  language: Language;
}

const DURATION_PER_STEP = 5000; // 5 seconds

const StepVisual = ({ id, language }: { id: string, language: Language }) => {
    const visualContainerClasses = "w-full lg:w-2/5 flex items-center justify-center p-4 md:p-8 min-h-[250px]";
    
    switch (id) {
        case 'why_step1':
            return (
                <div className={visualContainerClasses}>
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-300 rounded-full animate-fade-in" />
                        <div className="absolute top-1/2 left-1/2 w-32 sm:w-40 h-32 sm:h-40 border-2 border-slate-300 rounded-full -translate-x-1/2 -translate-y-1/2 animate-fade-in" style={{animationDelay: '100ms'}} />
                        <div className="absolute top-1/4 left-1/4 w-16 sm:w-20 h-16 sm:h-20 bg-sky-200/50 rounded-full animate-fade-in" style={{animationDelay: '200ms'}}/>
                        <div className="absolute bottom-1/4 right-1/4 w-12 sm:w-16 h-12 sm:h-16 bg-red-200/50 rounded-full animate-fade-in" style={{animationDelay: '300ms'}} />
                    </div>
                </div>
            );
        case 'why_step2':
            return (
                <div className={visualContainerClasses}>
                    <div className="text-center p-6 rounded-lg bg-red-50/50 border border-red-200/50 shadow-inner">
                        <div className="text-8xl sm:text-9xl font-bold" style={{color: '#D0342C'}}>80%</div>
                        <p className="text-xl sm:text-2xl text-slate-600 mt-2 max-w-xs">{language === 'Italiano' ? 'delle aziende si affida a processi manuali' : 'of companies rely on manual processes'}</p>
                    </div>
                </div>
            );
        case 'why_step3':
            return (
                 <div className={`${visualContainerClasses} perspective-1000`}>
                    <div className="relative w-full max-w-xs h-40 transform-style-3d rotate-x-10 -rotate-y-20">
                        {[...Array(8)].map((_, i) => (
                            <div 
                                key={i} 
                                className="absolute w-full h-32 bg-white border border-slate-300 rounded-md shadow-md"
                                style={{ 
                                    transform: `translateZ(-${i * 5}px) translateY(${i * 5}px)`,
                                    opacity: 1 - i * 0.1,
                                }}
                            ></div>
                        ))}
                        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-lg sm:text-xl font-semibold text-slate-600 italic">"Sommerso di scartoffie!"</p>
                    </div>
                </div>
            );
        case 'why_step4':
             return (
                <div className={`${visualContainerClasses} flex-col sm:flex-row gap-6 sm:gap-10`}>
                    <div className="text-center p-6 sm:p-8 rounded-lg bg-slate-50 border shadow-inner">
                        <div className="text-7xl sm:text-8xl font-bold" style={{color: '#D0342C'}}>+60%</div>
                        <p className="text-xl sm:text-2xl text-slate-600 mt-2">{language === 'Italiano' ? 'Costi' : 'Costs'}</p>
                    </div>
                    <div className="text-center p-6 sm:p-8 rounded-lg bg-slate-50 border shadow-inner">
                        <div className="text-7xl sm:text-8xl font-bold" style={{color: '#D0342C'}}>-20%</div>
                        <p className="text-xl sm:text-2xl text-slate-600 mt-2">ROI</p>
                    </div>
                </div>
            );
        case 'step1': // Manual Upload
            return (
                <div className={visualContainerClasses}>
                   <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                       <div className="w-24 h-32 sm:w-32 sm:h-40 bg-white border-2 border-slate-300 rounded-md p-3 flex flex-col gap-3">
                            <div className="w-full h-2.5 bg-slate-200 rounded-sm"></div>
                            <div className="w-5/6 h-2.5 bg-slate-200 rounded-sm"></div>
                            <div className="w-full h-2.5 bg-slate-200 rounded-sm"></div>
                            <div className="w-2/3 h-2.5 bg-slate-200 rounded-sm"></div>
                       </div>
                       <div className="text-3xl sm:text-5xl font-light text-slate-400 rotate-90 sm:rotate-0">→</div>
                       <div className="w-40 h-28 sm:w-48 sm:h-32 bg-sky-100 border-2 border-dashed border-sky-400 rounded-lg flex items-center justify-center text-sky-600 font-bold text-xl sm:text-2xl">
                           Celerya
                       </div>
                   </div>
                </div>
            );
        case 'step2': // Shared Folders
            return (
                <div className={visualContainerClasses}>
                   <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                        <div className="relative w-32 h-24 sm:w-40 sm:h-32">
                            <div className="absolute -bottom-2 -right-2 w-24 sm:w-28 h-20 sm:h-24 bg-blue-300/80 rounded-full"></div>
                            <div className="absolute -bottom-1 -left-4 w-20 sm:w-24 h-16 sm:h-20 bg-blue-300/80 rounded-full"></div>
                            <div className="absolute w-full h-full bg-blue-400/80 rounded-full z-10"></div>
                        </div>
                       <div className="text-3xl sm:text-5xl font-light text-slate-400 rotate-90 sm:rotate-0">→</div>
                       <div className="w-40 h-28 sm:w-48 sm:h-32 bg-sky-100 border-2 border-sky-400 rounded-lg flex items-center justify-center text-sky-600 font-bold text-xl sm:text-2xl">
                           Celerya
                       </div>
                   </div>
                </div>
            );
        case 'step3': // System Integration
            return (
                 <div className={visualContainerClasses}>
                   <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                       <div className="w-32 h-24 sm:w-40 sm:h-28 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-semibold p-3 text-center text-base sm:text-lg">Your System</div>
                       <div className="w-16 h-1 sm:w-20 sm:h-1.5 bg-slate-400 relative">
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-slate-500 top-1/2 -translate-y-1/2 left-0 animate-ping"></div>
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-slate-500 top-1/2 -translate-y-1/2 right-0 animate-ping" style={{animationDelay: '0.5s'}}></div>
                       </div>
                       <div className="w-32 h-24 sm:w-40 sm:h-28 bg-sky-100 border-2 border-sky-400 rounded-lg flex items-center justify-center text-sky-600 font-bold text-xl sm:text-2xl p-3 text-center">
                           Celerya
                       </div>
                   </div>
                </div>
            );
        case 'dashboard_step': // Dashboard
            return (
                <div className={visualContainerClasses}>
                    <div className="w-full max-w-sm sm:w-96 h-64 bg-white rounded-lg p-5 shadow-lg border border-slate-200 grid grid-cols-2 gap-4">
                        <div className="bg-sky-200 rounded p-3 text-sm text-sky-800 flex flex-col justify-between">
                            <span className="font-bold">Sales</span>
                            <div className="w-full h-10 bg-sky-300/50 rounded mt-1"></div>
                        </div>
                        <div className="bg-green-200 rounded p-3 text-sm text-green-800 flex flex-col items-center justify-center">
                           <span className="font-bold text-lg">Efficiency</span>
                           <span className="text-4xl font-bold mt-1">98%</span>
                        </div>
                        <div className="bg-yellow-100 rounded p-3 col-span-2 text-sm text-yellow-800">
                            <span className="font-bold">Activity Log</span>
                            <div className="w-full h-1.5 bg-yellow-300/50 rounded-sm mt-2.5"></div>
                            <div className="w-3/4 h-1.5 bg-yellow-300/50 rounded-sm mt-1.5"></div>
                        </div>
                    </div>
                </div>
            );
        default:
            return <div className={visualContainerClasses}></div>;
    }
};

const PresentationScreen: React.FC<PresentationScreenProps> = ({ steps, next, onNavigate, language }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0); // To reset animation

  useEffect(() => {
    if (isPaused) {
      return;
    }
    const timer = setTimeout(() => {
      if (activeIndex < steps.length - 1) {
        setActiveIndex(prevIndex => prevIndex + 1);
        setProgressKey(k => k + 1);
      } else if (next) {
        onNavigate(next);
      }
    }, DURATION_PER_STEP);

    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, steps.length, next, onNavigate]);

  const handlePrevClick = () => {
    if (activeIndex > 0) {
        setIsPaused(true);
        setActiveIndex(i => i - 1);
        setProgressKey(k => k + 1);
    }
  };

  const handleNextClick = () => {
    setIsPaused(true);
    if (activeIndex < steps.length - 1) {
        setActiveIndex(i => i + 1);
        setProgressKey(k => k + 1);
    } else if (next) {
        onNavigate(next);
    }
  };

  const togglePlayPause = () => {
    if (isPaused) {
        setProgressKey(k => k + 1); // Reset animation when resuming
    }
    setIsPaused(p => !p);
  };

  const activeStep = steps[activeIndex];
  if (!activeStep) return null;

  const [title, ...descriptionParts] = activeStep.text[language].split('\n');
  const description = descriptionParts.join('\n');

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full min-h-[calc(100vh-200px)]">
      {/* Progress Bars */}
      <div className="flex gap-2.5 mb-6 sm:mb-12 w-full max-w-2xl">
        {steps.map((_, index) => (
          <div key={index} className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            {index < activeIndex && <div className="bg-[#3B74B8] h-full rounded-full w-full"></div>}
            {index === activeIndex && 
              <div 
                key={`${activeIndex}-${progressKey}`}
                className="bg-[#3B74B8] h-full rounded-full" 
                style={{
                    animation: `progress-bar-animation ${DURATION_PER_STEP}ms linear`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                }}>
              </div>
            }
          </div>
        ))}
      </div>

      {/* Animated Content */}
      <div key={activeIndex} className="flex flex-col-reverse lg:flex-row items-center justify-center animate-slide-up-fade w-full max-w-6xl mx-auto flex-grow">
        {/* Text Content */}
        <div className="w-full lg:w-3/5 text-center lg:text-left p-4 md:p-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-6 sm:mb-8">{title}</h2>
            <p className="text-lg sm:text-2xl md:text-3xl text-slate-600 max-w-2xl mx-auto lg:mx-0">{description}</p>
        </div>
        
        {/* Visual Content */}
        <StepVisual id={activeStep.id} language={language} />
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6 sm:gap-8 mt-8 sm:mt-12 text-slate-500">
        <button 
          onClick={handlePrevClick} 
          disabled={activeIndex === 0} 
          className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous step"
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>
        <button 
          onClick={togglePlayPause} 
          className="p-3 rounded-full hover:bg-slate-200/70 transition-colors bg-white shadow-lg"
          aria-label={isPaused ? 'Play' : 'Pause'}
        >
            {isPaused ? <PlayIcon className="h-10 w-10 text-[#3B74B8] -mr-1" /> : <PauseIcon className="h-10 w-10 text-[#3B74B8]" />}
        </button>
        <button 
          onClick={handleNextClick} 
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Next step"
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
};

export default PresentationScreen;
