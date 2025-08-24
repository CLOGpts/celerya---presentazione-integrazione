import React from 'react';
import { EcosystemData, Language, Action } from '../types.ts';

interface EcosystemScreenProps {
  ecosystem: EcosystemData;
  language: Language;
  actions: Action[];
  onNavigate: (targetId: string) => void;
}

const EcosystemScreen: React.FC<EcosystemScreenProps> = ({ ecosystem, language, actions, onNavigate }) => {
  if (!ecosystem) return null;
  
  const handleAction = (action: Action) => {
    if (action.action === 'next' && action.target) {
      onNavigate(action.target);
    }
  };

  return (
    <div className="w-full mx-auto p-4 sm:p-6 animate-fade-in">
      <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-center mb-8" style={{ color: '#2D5F9D' }}>
        {ecosystem.title[language]}
      </h1>
      <p 
        className="text-center text-slate-600 max-w-5xl mx-auto text-lg sm:text-xl md:text-2xl mb-16"
        dangerouslySetInnerHTML={{ __html: ecosystem.subtitle[language] }}
      />

      {/* SYD Data Gateway Section */}
      <div className="border border-blue-300 rounded-2xl p-4 sm:p-6 md:p-8 relative mb-12 shadow-lg bg-white">
        <h2 className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 bg-white px-4 text-lg sm:text-2xl md:text-3xl font-semibold border border-blue-300 rounded-lg" style={{color: '#3B74B8'}}>
          {ecosystem.gatewayTitle[language]}
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
          {/* Data Producer */}
          <div className="text-center p-4 py-6 sm:py-8 border-2 border-blue-400 rounded-xl shadow-md bg-white w-full md:flex-1">
            <h3 className="text-lg sm:text-xl md:text-3xl font-semibold" style={{color: '#2D5F9D'}}>{ecosystem.gatewayProducer[language]}</h3>
          </div>
          
          {/* Connector */}
          <div className="flex flex-col md:flex-row items-center w-full md:w-auto">
             <div className="w-px h-8 md:w-12 md:h-px bg-blue-400"></div>
             <div className="mx-8 my-4 p-4 sm:p-6 md:p-8 border-2 border-blue-400 rounded-lg shadow-md bg-white" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'}}>
                 <div className="text-center leading-tight">
                     <p className="font-bold text-base sm:text-lg md:text-2xl" style={{color: '#2D5F9D'}}>CELERYA</p>
                     <p className="font-semibold text-sm sm:text-base md:text-xl" style={{color: '#2D5F9D'}}>SYD</p>
                 </div>
             </div>
             <div className="w-px h-8 md:w-12 md:h-px bg-blue-400"></div>
          </div>
          
          {/* Data User */}
          <div className="text-center p-4 py-6 sm:py-8 border-2 border-blue-400 rounded-xl shadow-md bg-white w-full md:flex-1">
            <h3 className="text-lg sm:text-xl md:text-3xl font-semibold" style={{color: '#2D5F9D'}}>{ecosystem.gatewayUser[language]}</h3>
          </div>
        </div>
      </div>
      
      <div className="w-1.5 h-12 bg-black mx-auto"></div>

      {/* Additional/3rd Parties Services Section */}
      <div className="bg-slate-100/70 rounded-2xl p-4 sm:p-6 md:p-8 relative shadow-lg">
         <h2 className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 bg-white px-4 text-lg sm:text-xl md:text-3xl font-semibold border-2 border-black rounded-lg text-slate-800 text-center">
          {ecosystem.servicesTitle[language]}
        </h2>
        <div className="relative pt-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-full bg-black md:w-auto md:h-1.5 md:left-[5%] md:right-[5%] md:top-auto"></div>
            <div className="flex flex-col md:flex-row justify-around gap-8 relative">
                {ecosystem.services.map((service, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 min-w-[200px] z-10">
                        <div className="w-1.5 h-8 bg-black"></div>
                        <div className="w-full text-center p-4 rounded-xl shadow-lg" style={{backgroundColor: '#086972'}}>
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{service.title[language]}</h3>
                        </div>
                        <p 
                            className="mt-6 text-slate-700 text-center text-base sm:text-lg md:text-xl"
                            dangerouslySetInnerHTML={{ __html: service.description[language] }}
                        />
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-16 flex-wrap">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleAction(action)}
            className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-2xl font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[#3B74B8]"
            style={{ 
              backgroundColor: '#3B74B8',
              color: 'white',
              boxShadow: '0 10px 15px -3px rgba(59, 116, 184, 0.3), 0 4px 6px -2px rgba(59, 116, 184, 0.2)',
            }}
          >
            {action.label[language]}
          </button>
        ))}
        <a
          href="https://syd.celerya.com/login"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-2xl font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[#3B74B8] text-center"
          style={{ 
            backgroundColor: '#3B74B8',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(59, 116, 184, 0.3), 0 4px 6px -2px rgba(59, 116, 184, 0.2)',
          }}
        >
          SYD
        </a>
        <a
          href="https://aistudio.google.com/app/apps/drive/1JTKm_Xu_sI1NQ0kSyFOIP9pqAFH4WGWP?showPreview=true&showCode=true&showAssistant=true"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-2xl font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[#3B74B8] text-center"
          style={{ 
            backgroundColor: '#3B74B8',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(59, 116, 184, 0.3), 0 4px 6px -2px rgba(59, 116, 184, 0.2)',
          }}
        >
          prototype
        </a>
        <a
          href="https://celeryacom.sharepoint.com/:p:/s/SviluppoCommerciale/EduVN_DwXchJukLVTfxWbzQBZ48Pd4S1Os0W-DSz-8r3LQ?e=iskHch"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-2xl font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[#3B74B8] text-center"
          style={{ 
            backgroundColor: '#3B74B8',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(59, 116, 184, 0.3), 0 4px 6px -2px rgba(59, 116, 184, 0.2)',
          }}
        >
          Slide
        </a>
        <a
          href="https://chatgpt.com/g/g-rgbSRHU8u-celerya-cvo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-2xl font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[#3B74B8] text-center"
          style={{ 
            backgroundColor: '#3B74B8',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(59, 116, 184, 0.3), 0 4px 6px -2px rgba(59, 116, 184, 0.2)',
          }}
        >
          Assistente Virtuale
        </a>
      </div>
    </div>
  );
};

export default EcosystemScreen;
