
export type Language = "Italiano" | "English";

export interface LocalizedText {
  Italiano: string;
  English: string;
}

export interface Action {
  label: LocalizedText;
  action: "next" | "restart";
  target: string;
}

export interface PresentationStep {
  id: string;
  text: LocalizedText;
}

export interface PricingTier {
    service: LocalizedText;
    cost: LocalizedText;
}

export interface PricingScenario {
    id: string;
    title: LocalizedText;
    description: LocalizedText;
    tiers: PricingTier[];
}

export interface SydAgentPlan {
    plan: LocalizedText;
    price: LocalizedText;
    configuration: LocalizedText;
    companySize: LocalizedText;
    includes: LocalizedText;
}

export interface SydAgentService {
    service: LocalizedText;
    when: LocalizedText;
    cost: LocalizedText;
}

export interface SydAgentPricing {
    title: LocalizedText;
    subtitle: LocalizedText;
    plans: SydAgentPlan[];
    additionalServicesTitle: LocalizedText;
    additionalServices: SydAgentService[];
}

export interface DataProducerInfo {
    title: LocalizedText;
    subtitle: LocalizedText;
    descriptionTitle: LocalizedText;
    descriptionPoints: LocalizedText[];
    benefitTitle: LocalizedText;
    benefitDescription: LocalizedText;
    benefitChecklist: LocalizedText[];
}

export interface EcosystemServiceItem {
    title: LocalizedText;
    description: LocalizedText;
}

export interface EcosystemData {
    title: LocalizedText;
    subtitle: LocalizedText;
    gatewayTitle: LocalizedText;
    gatewayProducer: LocalizedText;
    gatewayUser: LocalizedText;
    servicesTitle: LocalizedText;
    services: EcosystemServiceItem[];
}

export interface Screen {
  id: string;
  type: "title" | "summary" | "presentation" | "pricing" | "ecosystem";
  text: LocalizedText;
  actions?: Action[];
  next?: string;
  steps?: PresentationStep[];
  scenarios?: PricingScenario[];
  sydAgent?: SydAgentPricing;
  dataProducer?: DataProducerInfo;
  ecosystem?: EcosystemData;
}

export interface DemoData {
  version: string;
  title: string;
  languageSelector: boolean;
  languages: Language[];
  screens: Screen[];
}