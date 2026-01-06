
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeCallContext = async (info: string) => {
  try {
    // Initialized ai client right before the call to ensure up-to-date API key usage.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise o seguinte pedido de informação de uma ligação para um escritório de advocacia e determine a prioridade (Baixa, Média, Alta) e uma categoria curta (máximo 3 palavras).
      
      Informação: "${info}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING, description: "Baixa, Média ou Alta" },
            category: { type: Type.STRING, description: "Categoria curta do assunto" }
          },
          required: ["priority", "category"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return { priority: "Média", category: "Não Categorizado" };
  }
};

export const analyzeLegalProcess = async (processData: any) => {
  try {
    // Initialized ai client right before the call to ensure up-to-date API key usage.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Como um consultor jurídico sênior, analise os detalhes deste processo e forneça uma avaliação estratégica.
    
    Título: ${processData.title}
    Fase Atual: ${processData.phase}
    Descrição: ${processData.description}
    Petição Inicial: ${processData.initialPetition || 'Não informada'}
    Decisões: ${processData.decisions?.join('; ') || 'Nenhuma registrada'}
    Sentença: ${processData.sentence || 'Não proferida'}

    Forneça uma análise técnica contendo:
    1. Um resumo crítico da situação.
    2. Identificação de riscos jurídicos.
    3. Sugestões de próximos passos.
    4. Três opções estratégicas para o advogado.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            situationSummary: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicOptions: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["label", "description"]
              }
            }
          },
          required: ["situationSummary", "risks", "suggestions", "strategicOptions"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Legal analysis failed", error);
    throw error;
  }
};

export const summarizeInterview = async (notes: string) => {
  try {
    // Initialized ai client right before the call to ensure up-to-date API key usage.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Você é um analista jurídico especializado em conversão de clientes. Analise as seguintes notas de entrevista de um potencial cliente (Lead) e crie um resumo estruturado para o advogado.
    
    Notas da Entrevista: "${notes}"
    
    Retorne um JSON com:
    1. "summary": Um parágrafo curto resumindo o caso.
    2. "rightsFound": Lista de possíveis direitos/pedidos (ex: Horas extras, Danos morais).
    3. "urgencyScore": De 1 a 10 (onde 10 é muito urgente).
    4. "conversionPitch": Uma sugestão de argumento para o advogado usar para fechar o contrato.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            rightsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
            urgencyScore: { type: Type.NUMBER },
            conversionPitch: { type: Type.STRING }
          },
          required: ["summary", "rightsFound", "urgencyScore", "conversionPitch"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Interview summary failed", error);
    throw error;
  }
};
