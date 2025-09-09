import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types.ts";

/* =========================
   CONFIGURAZIONE AI
   ========================= */
// SPOSTA QUESTA CHIAVE IN UNA VARIABILE D’AMBIENTE!
const GEMINI_API_KEY = "AIzaSyAKO92WcvLKSMWgaE0DcAVQnblgSLSCNWw";

let ai: GoogleGenAI | null = null;
if (GEMINI_API_KEY && !GEMINI_API_KEY.startsWith("INCOLLA-QUI")) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

// Utility: file -> generative part
export const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });
  return { inlineData: { data: await base64EncodedDataPromise, mimeType: file.type } };
};

/* =========================
   1) Estrattore di attività
   ========================= */
export const extractTasksFromText = async (
  text: string,
  language: Language
): Promise<{ tasks: string[]; error: string | null }> => {
  if (!ai) {
    const errorMessage =
      language === "Italiano"
        ? "Assistente AI non configurato. Incolla la tua chiave API di Google Gemini nel file `services/gemini.ts`."
        : "AI Assistant not configured. Paste your Google Gemini API key into the `services/gemini.ts` file.";
    return { tasks: [], error: errorMessage };
  }

  try {
    const prompt = [
      {
        role: "user",
        parts: [
          {
            text:
              `Analizza il testo dell'utente ed estrai SOLO attività azionabili (to-do) in forma di frasi chiare.\n` +
              `Rispondi **esclusivamente** con JSON valido conforme allo schema. Nessuna spiegazione, nessun codice.\n\n` +
              `Schema: {"tasks": string[]}\n\n` +
              `Esempio testo:\n` +
              `"Ok, domani devo chiamare Andrea..., poi inviare mail a Claudio, e comprare il latte."\n` +
              `Esempio output:\n` +
              `{"tasks":["Chiamare Andrea per il progetto","Mandare la mail di follow-up a Claudio","Comprare il latte"]}\n\n` +
              `Testo da analizzare:\n` +
              `"${text}"`
          }
        ]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["tasks"]
        }
      }
    });

    // Con responseMimeType=application/json Gemini dovrebbe già dare JSON puro
    let raw = (response as any).text ?? "";
    if (typeof raw !== "string" || !raw.trim()) raw = JSON.stringify(response);

    const cleaned = cleanToJSONObject(raw);
    const json = JSON.parse(cleaned);
    return { tasks: Array.isArray(json.tasks) ? json.tasks : [], error: null };
  } catch (error) {
    console.error("Error extracting actions with Gemini:", error);
    const errorMessage =
      language === "Italiano"
        ? "Errore durante la chiamata all'AI. Controlla la console e verifica che la chiave API sia corretta."
        : "Error calling AI. Check the console and verify your API key is correct.";
    return { tasks: [], error: errorMessage };
  }
};

/* ==================================
   2) Conversazione agente applicativo
   ================================== */
export const getAssistantResponse = async (
  userQuery: string,
  context: string,
  filePart: any,
  language: Language
): Promise<any> => {
  if (!ai) {
    const errorMessage =
      language === "Italiano"
        ? "Assistente AI non configurato. Incolla la tua chiave API di Google Gemini nel file `services/gemini.ts`."
        : "AI Assistant not configured. Paste your Google Gemini API key into the `services/gemini.ts` file.";
    return { responseText: errorMessage, commands: [], error: errorMessage };
  }

  // 🔒 System instruction minimalista e vincolante (niente "thought")
  const systemInstruction =
    `You are Celerya AI, an in-app process agent. Always return **only** a valid JSON object that matches the schema. ` +
    `No markdown, no code fences, no explanations. If the user request is ambiguous, set responseText to a short clarifying question and commands=[]. ` +
    `Language for responseText: ${language}. Today: ${new Date().toLocaleDateString("it-IT")}.`;

  // Schema SENZA "thought"
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      responseText: { type: Type.STRING, description: `Testo di risposta all'utente in ${language}.` },
      commands: {
        type: Type.ARRAY,
        description: "Sequenza di comandi da eseguire.",
        items: {
          type: Type.OBJECT,
          properties: {
            action: {
              type: Type.STRING,
              enum: ["navigate", "open_url", "add_task", "complete_task", "add_note", "open_note"]
            },
            payload: {
              type: Type.OBJECT,
              properties: {
                screenId: { type: Type.STRING, nullable: true },
                url: { type: Type.STRING, nullable: true },
                content: { type: Type.STRING, nullable: true },
                project: { type: Type.STRING, nullable: true },
                priority: { type: Type.STRING, enum: ["high", "medium", "low"], nullable: true },
                dueDate: { type: Type.STRING, nullable: true }, // YYYY-MM-DD
                taskId: { type: Type.STRING, nullable: true },
                title: { type: Type.STRING, nullable: true },
                noteId: { type: Type.STRING, nullable: true }
              }
            }
          },
          required: ["action", "payload"]
        }
      }
    },
    required: ["responseText", "commands"]
  };

  let rawResponseText = "";
  try {
    const parts: any[] = [
      { text: `CONTESTO APP:\n${context}\n\nDOMANDA UTENTE:\n"${userQuery}"` }
    ];
    if (filePart) parts.push(filePart);

    const contents = [{ role: "user", parts }];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    rawResponseText = (response as any).text ?? "";
    if (typeof rawResponseText !== "string" || !rawResponseText.trim()) {
      // Fallback: alcuni SDK serializzano l'oggetto
      rawResponseText = JSON.stringify(response);
    }

    const jsonText = cleanToJSONObject(rawResponseText);
    const parsed = JSON.parse(jsonText);

    // Validazioni minime
    if (!parsed || typeof parsed !== "object" || !("commands" in parsed)) {
      throw new Error("JSON non conforme allo schema atteso.");
    }
    return { ...parsed, error: null };
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (rawResponseText) {
      console.error("Raw AI response:", rawResponseText);
    }
    const errorMessage =
      language === "Italiano"
        ? "Oops! Qualcosa è andato storto. L'AI ha restituito una risposta in un formato non valido. Controlla la console per i dettagli."
        : "Oops! Something went wrong. The AI returned a response in an invalid format. Check the console for details.";
    return { error: errorMessage };
  }
};

/* =========================
   Helpers
   ========================= */
function cleanToJSONObject(text: string): string {
  // elimina eventuali fence ```json ... ```
  let s = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

  // se c'è rumore prima/dopo, prendi dal primo '{' all'ultima '}'
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) s = s.slice(start, end + 1);

  // rimuove caratteri di controllo non validi in JSON (escl. \t \n \r)
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");

  return s;
}
