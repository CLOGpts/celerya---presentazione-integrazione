
import { DemoData } from '../types.ts';

export const demoData: DemoData = {
  "version": "1.2",
  "title": "Celerya - Presentazione",
  "languageSelector": true,
  "languages": ["Italiano", "English"],
  "screens": [
    {
      "id": "start",
      "type": "title",
      "text": {
        "Italiano": "Celerya®\nGoditi il tuo business.",
        "English": "Celerya®\nEnjoy your business."
      },
      "actions": [
        { "label": { "Italiano": "Perché Celerya", "English": "Why Celerya" }, "action": "next", "target": "why_presentation" },
        { "label": { "Italiano": "Soluzione", "English": "Solution" }, "action": "next", "target": "ecosystem" },
        { "label": { "Italiano": "Integrazioni", "English": "Integrations" }, "action": "next", "target": "integrations_presentation" },
        { "label": { "Italiano": "Prezzi", "English": "Pricing" }, "action": "next", "target": "pricing" }
      ]
    },
    {
      "id": "why_presentation",
      "type": "presentation",
      "text": { "Italiano": "", "English": "" },
      "steps": [
        {
          "id": "why_step1",
          "text": {
            "Italiano": "Perché Celerya\nLa strategia di scambio delle informazioni è oggi più importante che mai. La complessità dei processi e la mancanza di collaborazione hanno un impatto negativo sui risultati aziendali.",
            "English": "Why Celerya\nThe information exchange strategy is more important today than ever. The complexity of processes and lack of collaboration negatively impact business results."
          }
        },
        {
          "id": "why_step2",
          "text": {
            "Italiano": "Il Problema\nQuasi l'80% delle aziende si affida a processi manuali o dati isolati, causando inefficienze, errori costosi e una visibilità limitata delle operazioni.",
            "English": "The Problem\nNearly 80% of companies rely on manual processing or siloed data, causing inefficiencies, costly errors, and limited visibility of operations."
          }
        },
        {
          "id": "why_step3",
          "text": {
            "Italiano": "Scambio Dati Inefficiente\nNell'era dell'IA, le aziende continuano a scambiare dati manualmente. \"Non doveva la tecnologia risolvere questo casino? Sono ancora sommerso di scartoffie!\"",
            "English": "Inefficient Data Exchange\nIn the AI era, companies still exchange data manually. \"Weren't all these technologies supposed to fix this mess? I'm still buried in paperwork!\""
          }
        },
        {
          "id": "why_step4",
          "text": {
            "Italiano": "Impatto sul Business\nI sistemi disconnessi aumentano i costi fino al 60% e riducono i ROI fino al 20%.",
            "English": "Business Impact\nDisconnected systems increase costs by up to 60% and reduce ROIs by up to 20%."
          }
        }
      ],
      "next": "why_summary"
    },
    {
      "id": "why_summary",
      "type": "summary",
      "text": {
        "Italiano": "Pronto a Semplificare?\nOra che conosci il problema, scopri la nostra soluzione per l'integrazione.",
        "English": "Ready to Simplify?\nNow that you know the problem, discover our integration solution."
      },
      "actions": [
        { "label": { "Italiano": "Scopri le Integrazioni", "English": "Discover Integrations" }, "action": "next", "target": "integrations_presentation" },
        { "label": { "Italiano": "Torna alla Home", "English": "Back to Home" }, "action": "next", "target": "start" }
      ]
    },
    {
      "id": "ecosystem",
      "type": "ecosystem",
      "text": { "Italiano": "", "English": "" },
      "ecosystem": {
        "title": { "Italiano": "L'Ecosistema", "English": "The Ecosystem" },
        "subtitle": {
          "Italiano": "SYD sta rivoluzionando lo scambio di dati B2B abilitando l'<b>accesso in tempo reale ai dati</b> e trasformando la gestione dei dati da fonte di costo in <b>asset monetizzabile</b>, connettendo al contempo agenti AI, LLM/Blockchain e strumenti di automazione con <b>PMI</b> e <b>Grandi Aziende</b>.",
          "English": "SYD is revolutionizing B2B data exchange by enabling the <b>real-time access to data</b> and <b>turn data management from cost source into monetizable asset</b>, while connecting AI agents, LLM/Blockchain, and automation tools with both <b>SMEs</b> and <b>Enterprises</b>"
        },
        "gatewayTitle": { "Italiano": "SYD Data Gateway", "English": "SYD Data Gateway" },
        "gatewayProducer": { "Italiano": "Data Producer", "English": "Data Producer" },
        "gatewayUser": { "Italiano": "Data User", "English": "Data User" },
        "servicesTitle": { "Italiano": "Servizi Aggiuntivi/Terze Parti", "English": "Additional/3rd Parties Services" },
        "services": [
          {
            "title": { "Italiano": "AI Agent", "English": "AI Agent" },
            "description": {
              "Italiano": "SYD funge da <b>fonte dati affidabile</b> fornendo agli strumenti di AI accesso a <b>dati PMI standardizzati e in tempo reale</b> precedentemente inaccessibili.",
              "English": "SYD serves as the <b>trusted data source</b> giving AI tools access to <b>standardized, real-time SME data</b> previously inaccessible"
            }
          },
          {
            "title": { "Italiano": "Strumenti di Automazione", "English": "Automation tools" },
            "description": {
              "Italiano": "SYD potenzia l'<b>automazione no-code in tempo reale</b>, integrando senza problemi dati strutturati in CRM ed ERP.",
              "English": "SYD powers <b>real-time, no-code automation</b>, seamlessly integrating structured data into CRMs and ERPs"
            }
          },
          {
            "title": { "Italiano": "LLM/Blockchain", "English": "LLM/Blockchain" },
            "description": {
              "Italiano": "Fornisce <b>dati aziendali strutturati e in tempo reale</b> a diverse reti per mantenerli privati e condividerli selettivamente.",
              "English": "Provides <b>real-time, structured business data</b> to different networks to keep it private and share it selectively"
            }
          }
        ]
      },
      "actions": [
        { "label": { "Italiano": "Torna alla Home", "English": "Back to Home" }, "action": "next", "target": "start" }
      ]
    },
    {
      "id": "integrations_presentation",
      "type": "presentation",
      "text": {
        "Italiano": "",
        "English": ""
      },
      "steps": [
        {
          "id": "step1",
          "text": {
            "Italiano": "Caricamento manuale\nTrascina o carica i tuoi file (PDF, Excel, immagini). Celerya legge i dati in automatico grazie all'AI.",
            "English": "Manual upload\nDrag or upload your files (PDF, Excel, images). Celerya automatically reads your data thanks to AI."
          }
        },
        {
          "id": "step2",
          "text": {
            "Italiano": "Cartelle condivise\nCollega una cartella Google Drive o OneDrive e Celerya aggiornerà i dati in automatico.",
            "English": "Shared folders\nConnect a Google Drive or OneDrive folder and Celerya will update data automatically."
          }
        },
        {
          "id": "step3",
          "text": {
            "Italiano": "Integrazione sistemi\nCollegati direttamente ai tuoi sistemi software per uno scambio dati automatico.",
            "English": "System integration\nConnect directly to your software systems for automatic data exchange."
          }
        },
        {
          "id": "dashboard_step",
          "text": {
            "Italiano": "Dashboard Celerya\nLotti, scadenze, schede tecniche pronte all'uso.",
            "English": "Celerya Dashboard\nLots, expiries, and technical sheets ready to use."
          }
        }
      ],
      "next": "final_summary"
    },
    {
      "id": "pricing",
      "type": "pricing",
      "text": {
        "Italiano": "Piani Tariffari\nLe nostre offerte",
        "English": "Pricing Plans\nOur offers"
      },
      "scenarios": [
        {
          "id": "scenario1",
          "title": { "Italiano": "Scenario 1 – Utilizzo AI per Dati Interni", "English": "Scenario 1 – AI Usage for Internal Data" },
          "description": { 
            "Italiano": "Il ricevente lavora autonomamente. Utilizza un modulo AI per analizzare i file, estrarre dati strutturati e generare output (es. Excel, alert).",
            "English": "The receiver works autonomously. It uses an AI module to analyze files, extract structured data, and generate outputs (e.g., Excel, alerts)."
          },
          "tiers": [
            { "service": { "Italiano": "Sottoscrizione piattaforma SYD", "English": "SYD platform subscription" }, "cost": { "Italiano": "€270 + IVA /anno", "English": "€270 + VAT /year" } },
            { "service": { "Italiano": "Integrazione sistemi gestionali", "English": "Management systems integration" }, "cost": { "Italiano": "Prezzo su analisi", "English": "Price on analysis" } },
            { "service": { "Italiano": "Accesso semplificato (cartelle/DB)", "English": "Simplified access (folders/DB)" }, "cost": { "Italiano": "Gratuito", "English": "Free" } },
            { "service": { "Italiano": "Interrogazione AI documenti", "English": "AI document query" }, "cost": { "Italiano": "€0,12 + IVA /pagina", "English": "€0.12 + VAT /page" } }
          ]
        },
        {
          "id": "scenario2",
          "title": { "Italiano": "Scenario 2 – Fornitori Integrati (API o MCP)", "English": "Scenario 2 – Integrated Suppliers (API or MCP)" },
          "description": {
            "Italiano": "Il ricevente ottiene i dati da fornitori già integrati nella piattaforma, tramite API dirette o protocollo MCP. Le informazioni sono già strutturate e accessibili tramite QR code.",
            "English": "The receiver gets data from suppliers already integrated into the platform, via direct APIs or MCP protocol. The information is already structured and accessible via QR code."
          },
          "tiers": [
            { "service": { "Italiano": "Sottoscrizione piattaforma SYD", "English": "SYD platform subscription" }, "cost": { "Italiano": "€270 + IVA /anno", "English": "€270 + VAT /year" } },
            { "service": { "Italiano": "Integrazione sistemi gestionali", "English": "Management systems integration" }, "cost": { "Italiano": "Prezzo su analisi", "English": "Price on analysis" } },
            { "service": { "Italiano": "Accesso semplificato (cartelle/DB)", "English": "Simplified access (folders/DB)" }, "cost": { "Italiano": "Gratuito", "English": "Free" } },
            { "service": { "Italiano": "Chiamata API via QR code", "English": "API call via QR code" }, "cost": { "Italiano": "€0,03 – €0,05 /chiamata", "English": "€0.03 – €0.05 /call" } }
          ]
        }
      ],
      "dataProducer": {
        "title": { "Italiano": "DATA PRODUCER", "English": "DATA PRODUCER" },
        "subtitle": { "Italiano": "Coinvolgimento Data Producer – Fase 1 (Accesso Semplice)", "English": "Data Producer Involvement – Phase 1 (Simple Access)" },
        "descriptionTitle": { "Italiano": "I fornitori possono iniziare subito senza sviluppi tecnici:", "English": "Suppliers can start immediately without technical developments:" },
        "descriptionPoints": [
            { "Italiano": "Login sulla piattaforma SYD", "English": "Login to the SYD platform" },
            { "Italiano": "Upload documenti manuale o automatico (cartelle condivise, scanner, upload diretto)", "English": "Manual or automatic document upload (shared folders, scanner, direct upload)" },
            { "Italiano": "I dati diventano interrogabili per i riceventi (Data Subscriber)", "English": "Data becomes queryable for recipients (Data Subscribers)" }
        ],
        "benefitTitle": { "Italiano": "Beneficio immediato:", "English": "Immediate Benefit:" },
        "benefitDescription": { "Italiano": "Il Data Producer riceve una fee del 10% ogni volta che i suoi dati vengono interrogati tramite AI", "English": "The Data Producer receives a 10% fee each time their data is queried via AI" },
        "benefitChecklist": [
            { "Italiano": "Nessun costo di attivazione", "English": "No activation cost" },
            { "Italiano": "Guadagno immediato", "English": "Immediate earnings" },
            { "Italiano": "Percorso naturale verso un futuro upgrade (API / MCP)", "English": "Natural path towards a future upgrade (API / MCP)" }
        ]
      },
      "sydAgent": {
        "title": { "Italiano": "SYD Agent", "English": "SYD Agent" },
        "subtitle": { "Italiano": "Modulo Aggiuntivo – Assistente BI AI", "English": "Add-on Module – AI BI Assistant" },
        "plans": [
          {
            "plan": { "Italiano": "Starter", "English": "Starter" },
            "price": { "Italiano": "€273", "English": "€273" },
            "configuration": { "Italiano": "Inclusa", "English": "Included" },
            "companySize": { "Italiano": "5-20 persone", "English": "5-20 people" },
            "includes": { "Italiano": "Analisi operative pronte all'uso", "English": "Ready-to-use operational analysis" }
          },
          {
            "plan": { "Italiano": "Professional", "English": "Professional" },
            "price": { "Italiano": "€507", "English": "€507" },
            "configuration": { "Italiano": "Inclusa", "English": "Included" },
            "companySize": { "Italiano": "20-50 persone", "English": "20-50 people" },
            "includes": { "Italiano": "Insight avanzati + onboarding prioritario", "English": "Advanced insights + priority onboarding" }
          },
          {
            "plan": { "Italiano": "Enterprise", "English": "Enterprise" },
            "price": { "Italiano": "€931", "English": "€931" },
            "configuration": { "Italiano": "Inclusa", "English": "Included" },
            "companySize": { "Italiano": "50+ persone", "English": "50+ people" },
            "includes": { "Italiano": "Piattaforma completa + supporto dedicato immediato", "English": "Complete platform + immediate dedicated support" }
          }
        ],
        "additionalServicesTitle": { "Italiano": "Servizi Aggiuntivi (Facoltativi)", "English": "Additional Services (Optional)" },
        "additionalServices": [
          {
            "service": { "Italiano": "Pulizia dati complessa", "English": "Complex data cleaning" },
            "when": { "Italiano": "Dati estremamente disordinati", "English": "Extremely messy data" },
            "cost": { "Italiano": "€200/mese (per 3 mesi)", "English": "€200/month (for 3 months)" }
          },
          {
            "service": { "Italiano": "Supporto Premium", "English": "Premium Support" },
            "when": { "Italiano": "Assistenza illimitata", "English": "Unlimited assistance" },
            "cost": { "Italiano": "€99/mese", "English": "€99/month" }
          },
          {
            "service": { "Italiano": "Formazione al Team", "English": "Team Training" },
            "when": { "Italiano": "Onboarding del personale", "English": "Staff onboarding" },
            "cost": { "Italiano": "€150/ora", "English": "€150/hour" }
          }
        ]
      },
      "actions": [
        { "label": { "Italiano": "Torna alla Home", "English": "Back to Home" }, "action": "next", "target": "start" }
      ]
    },
    {
      "id": "final_summary",
      "type": "summary",
      "text": {
        "Italiano": "Tutto sotto controllo\nLotti, scadenze, schede tecniche pronte all'uso.\nCelerya: integra, semplifica, monetizza.",
        "English": "Everything under control\nLots, expiries, and technical sheets ready to use.\nCelerya: integrate, simplify, monetize."
      },
      "actions": [
        { "label": { "Italiano": "Ricomincia", "English": "Restart" }, "action": "next", "target": "start" }
      ]
    }
  ]
};
