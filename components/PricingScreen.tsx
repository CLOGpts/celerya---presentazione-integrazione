
import React, { useState } from 'react';
import { Action, Language, PricingScenario, SydAgentPricing, DataProducerInfo } from '../types';
import { CheckCircleIcon } from './Icons';

interface PricingScreenProps {
  text: string;
  scenarios: PricingScenario[];
  sydAgent?: SydAgentPricing;
  dataProducer?: DataProducerInfo;
  actions: Action[];
  onNavigate: (targetId: string) => void;
  language: Language;
}

const PricingScreen: React.FC<PricingScreenProps> = ({ text, scenarios, sydAgent, dataProducer, actions, onNavigate, language }) => {
  const [activeTab, setActiveTab] = useState(scenarios[0]?.id || '');
  const [title, subtitle] = text.split('\n');
  const activeScenario = scenarios.find(s => s.id === activeTab);

  const handleAction = (action: Action) => {
    if (action.action === 'next' && action.target) {
      onNavigate(action.target);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-7xl md:text-8xl font-bold" style={{ color: '#2D5F9D' }}>
          {title}
        </h1>
        {subtitle && <p className="text-3xl md:text-4xl text-slate-600 mt-5">{subtitle}</p>}
      </div>

      {/* DATA SUBSCRIBER SECTION */}
      <div className="animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-5xl md:text-6xl font-bold" style={{ color: '#2D5F9D' }}>
              DATA SUBSCRIBER
            </h2>
        </div>
        <div className="flex justify-center border-b border-gray-200 mb-8">
            {scenarios.map(scenario => (
            <button
                key={scenario.id}
                onClick={() => setActiveTab(scenario.id)}
                className={`px-6 py-3 text-lg md:text-xl font-semibold transition-colors duration-200 border-b-2 -mb-px ${
                activeTab === scenario.id
                    ? 'border-[#3B74B8] text-[#3B74B8]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-gray-300'
                }`}
            >
                {scenario.title[language].split('–')[0].trim()}
            </button>
            ))}
        </div>

        <div className="w-full">
            {activeScenario && (
            <div key={activeScenario.id} className="animate-fade-in-fast">
                <h3 className="text-4xl font-bold text-slate-800 text-center mb-4">{activeScenario.title[language]}</h3>
                <p className="text-slate-600 text-center max-w-3xl mx-auto mb-10 text-xl">{activeScenario.description[language]}</p>
                
                <div className="border border-gray-200 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead style={{ backgroundColor: '#3B74B8' }}>
                    <tr>
                        <th scope="col" className="px-8 py-5 text-left text-base font-bold text-white uppercase tracking-wider">
                        {language === 'Italiano' ? 'Servizio' : 'Service'}
                        </th>
                        <th scope="col" className="px-8 py-5 text-left text-base font-bold text-white uppercase tracking-wider">
                        {language === 'Italiano' ? 'Costo' : 'Cost'}
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {activeScenario.tiers.map((tier, index) => (
                        <tr key={index} className="odd:bg-white even:bg-slate-50/70">
                        <td className="px-8 py-5 whitespace-nowrap text-lg font-medium text-slate-800">{tier.service[language]}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-lg text-slate-600">{tier.cost[language]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            )}
        </div>
      </div>

      {/* DATA PRODUCER SECTION */}
      {dataProducer && (
        <div className="mt-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold" style={{ color: '#2D5F9D' }}>
              {dataProducer.title[language]}
            </h2>
            <p className="text-3xl md:text-4xl text-slate-600 mt-5">{dataProducer.subtitle[language]}</p>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 text-left">
            <div className="space-y-4 text-slate-700 text-xl mb-10">
              <p className="font-semibold">{dataProducer.descriptionTitle[language]}</p>
              <div className="pl-6 space-y-4 mt-5">
                {dataProducer.descriptionPoints.map((point, index) => (
                  <p key={index}>{point[language]}</p>
                ))}
              </div>
            </div>

            <div className="mb-10">
                <p className="text-xl font-semibold text-slate-800">{dataProducer.benefitTitle[language]}</p>
                <p className="text-2xl font-bold mt-3" style={{color: '#3B74B8'}}>{dataProducer.benefitDescription[language]}</p>
            </div>
            
            <ul className="space-y-4">
              {dataProducer.benefitChecklist.map((item, index) => (
                <li key={index} className="flex items-start text-xl">
                    <CheckCircleIcon className="h-8 w-8 text-green-500 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-slate-700">{item[language]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* SYD AGENT SECTION */}
      {sydAgent && (
        <div className="mt-20 animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-5xl md:text-6xl font-bold" style={{ color: '#2D5F9D' }}>
                    {sydAgent.title[language]}
                </h2>
                <p className="text-3xl md:text-4xl text-slate-600 mt-4">{sydAgent.subtitle[language]}</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg shadow-md overflow-x-auto mb-14">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead style={{ backgroundColor: '#3B74B8' }}>
                        <tr>
                            <th scope="col" className="px-8 py-5 text-left text-base font-bold text-white uppercase tracking-wider">{language === 'Italiano' ? 'Piano' : 'Plan'}</th>
                            <th scope="col" className="px-8 py-5 text-left text-base font-bold text-white uppercase tracking-wider">{language === 'Italiano' ? 'Prezzo Mensile' : 'Monthly Price'}</th>
                            <th scope="col" className="px-8 py-5 text-left text-base font-bold text-white uppercase tracking-wider">{language === 'Italiano' ? 'Configurazione' : 'Configuration'}</th>
                            <th scope="col" className="px-8 py-5 text-left text-base font-bold text-white uppercase tracking-wider">{language === 'Italiano' ? 'Dimensione Azienda' : 'Company Size'}</th>
                            <th scope="col" className="px-8 py-5 text-left text-base font-bold text-white uppercase tracking-wider">{language === 'Italiano' ? 'Cosa Include Subito' : 'What\'s Included'}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sydAgent.plans.map((plan, index) => (
                            <tr key={index} className="odd:bg-white even:bg-slate-50/70">
                                <td className="px-8 py-5 whitespace-nowrap text-lg font-medium text-slate-800">{plan.plan[language]}</td>
                                <td className="px-8 py-5 whitespace-nowrap text-lg text-slate-600">{plan.price[language]}</td>
                                <td className="px-8 py-5 whitespace-nowrap text-lg text-slate-600">{plan.configuration[language]}</td>
                                <td className="px-8 py-5 whitespace-nowrap text-lg text-slate-600">{plan.companySize[language]}</td>
                                <td className="px-8 py-5 whitespace-normal text-lg text-slate-600">{plan.includes[language]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-slate-800">{sydAgent.additionalServicesTitle[language]}</h3>
            </div>
            <div className="border border-gray-200 rounded-lg shadow-md overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead style={{ backgroundColor: '#3B74B8' }}>
                        <tr>
                            <th scope="col" className="px-8 py-5 text-left text-base font-bold text-white uppercase tracking-wider">{language === 'Italiano' ? 'Servizio' : 'Service'}</th>
                            <th scope="col" className="px-8 py-5 text-left text-base font-bold text-white uppercase tracking-wider">{language === 'Italiano' ? 'Quando Serve' : 'When Needed'}</th>
                            <th scope="col" className="px-8 py-5 text-left text-base font-bold text-white uppercase tracking-wider">{language === 'Italiano' ? 'Costo' : 'Cost'}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sydAgent.additionalServices.map((service, index) => (
                            <tr key={index} className="odd:bg-white even:bg-slate-50/70">
                                <td className="px-8 py-5 whitespace-nowrap text-lg font-medium text-slate-800">{service.service[language]}</td>
                                <td className="px-8 py-5 whitespace-nowrap text-lg text-slate-600">{service.when[language]}</td>
                                <td className="px-8 py-5 whitespace-nowrap text-lg text-slate-600">{service.cost[language]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* Savings Section */}
      <div className="mt-20 animate-fade-in">
          <div className="max-w-4xl mx-auto bg-sky-50/70 border border-sky-200 rounded-2xl p-8 shadow-md">
              <h3 className="text-3xl font-bold text-center mb-6" style={{ color: '#2D5F9D' }}>
                  💡 {language === 'Italiano' ? 'Risparmio rispetto all’elaborazione AI' : 'Savings Compared to AI Processing'}
              </h3>
              <p className="text-center text-slate-600 text-lg mb-8">
                  {language === 'Italiano' ? 'Confronto su 1 scheda tecnica (3 pagine):' : 'Comparison for 1 technical sheet (3 pages):'}
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-8 text-center">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 flex-1 shadow-sm">
                      <p className="font-semibold text-slate-700">AI (Scenario 1)</p>
                      <p className="text-4xl font-bold text-slate-800 mt-2">€0,36</p>
                      <p className="text-slate-500 text-sm">({language === 'Italiano' ? '0,12 €/pagina' : '€0.12/page'})</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 flex-1 shadow-sm">
                      <p className="font-semibold text-slate-700">API (Scenario 2)</p>
                      <p className="text-4xl font-bold text-slate-800 mt-2">€0,03 – €0,05</p>
                      <p className="text-slate-500 text-sm">({language === 'Italiano' ? 'chiamata a dati strutturati' : 'call to structured data'})</p>
                  </div>
              </div>
              <div className="text-center mt-8">
                  <p className="text-xl font-semibold text-green-700 bg-green-100/80 inline-block px-4 py-2 rounded-full border border-green-200">
                      {language === 'Italiano' ? 'Risparmio stimato: ~85–92%' : 'Estimated savings: ~85–92%'}
                  </p>
                  <p className="text-slate-700 mt-5 text-lg font-medium">
                      → {language === 'Italiano' ? 'Accesso immediato e maggiore affidabilità' : 'Immediate access and greater reliability'}
                  </p>
              </div>
          </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 mt-16">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleAction(action)}
            className="px-10 py-4 text-xl font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[#3B74B8]"
            style={{ 
              backgroundColor: '#3B74B8',
              color: 'white',
              boxShadow: '0 10px 15px -3px rgba(59, 116, 184, 0.3), 0 4px 6px -2px rgba(59, 116, 184, 0.2)',
            }}
          >
            {action.label[language]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PricingScreen;
