import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SubNiche } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const subNicheSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "O nome curto e cativante do sub-nicho.",
      },
      description: {
        type: Type.STRING,
        description: "Uma explicação breve sobre do que se trata este nicho.",
      },
      competitionLevel: {
        type: Type.STRING,
        enum: ["Baixa", "Média", "Alta"],
        description: "O nível estimado de competição atual no YouTube.",
      },
      demandLevel: {
        type: Type.STRING,
        enum: ["Média", "Alta", "Muito Alta"],
        description: "O nível de procura ou interesse do público.",
      },
      monetizationScore: {
        type: Type.NUMBER,
        description: "Uma pontuação de 1 a 10 indicando o potencial de lucro (adsense, afiliados, produtos).",
      },
      videoIdeas: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 exemplos de títulos de vídeos virais para este sub-nicho (clickbait ético).",
      },
      targetAudience: {
        type: Type.STRING,
        description: "Quem é o público-alvo principal.",
      },
      growthPotential: {
        type: Type.STRING,
        description: "Análise técnica de por que este nicho é uma oportunidade de ouro agora.",
      },
      scriptOutline: {
        type: Type.STRING,
        description: "Um roteiro estruturado (Gancho Impactante -> Conteúdo Principal -> CTA) para a PRIMEIRA ideia de vídeo sugerida. Seja direto e prático.",
      },
    },
    required: ["title", "description", "competitionLevel", "demandLevel", "monetizationScore", "videoIdeas", "targetAudience", "growthPotential", "scriptOutline"],
  },
};

export const generateSubNiches = async (topic: string, location?: string, country: string = "Brasil"): Promise<SubNiche[]> => {
  try {
    let locationPrompt = `CONTEXTO GEOGRÁFICO: PAÍS: ${country}.`;
    
    if (location && location.trim() !== "") {
      locationPrompt += ` REGIÃO/CIDADE ESPECÍFICA: "${location}".`;
    }

    const prompt = `
      Atue como um estrategista de Elite do YouTube e Especialista em "Community Guidelines" (Diretrizes da Comunidade).
      O usuário quer dominar o tema: "${topic}".
      
      ${locationPrompt}
      
      IMPORTANTE - SEGURANÇA E BRAND SAFETY (DIRETRIZES DO YOUTUBE):
      O usuário busca nichos, especialmente se o tema for "TERROR", "CRIME" ou "MISTÉRIO", que sejam 100% Monetizáveis.
      
      REGRAS INEGOCIÁVEIS:
      1. Se o tema envolver MEDO/TERROR: Foque em "Terror Psicológico", "Lendas Folclóricas", "Mistérios sem Resposta", "Locais Abandonados" (Exploração Urbana).
      2. NUNCA sugira conteúdo que envolva: Sangue real, gore, violência explícita, abuso, nudez ou atos perigosos.
      3. O foco deve ser o ENTRETENIMENTO e a CURIOSIDADE, não o choque visual barato.
      4. Garanta que o conteúdo seja "AdSense Friendly" (Seguro para Anunciantes).
      
      Sua missão crítica: Identificar 6 SUB-NICHOS "Oceano Azul" (Blue Ocean).
      
      CRITÉRIOS DE SUCESSO:
      1. IGNORE o óbvio. Busque ângulos inexplorados.
      2. FOCO TOTAL em: Alta Demanda vs. Baixa Oferta de Qualidade.
      3. As Ideias de Vídeo devem ser títulos altamente clicáveis (estilo MrBeast ou canais de documentário viral), mas HONESTOS e SEGUROS.
      4. Para cada nicho, crie um ROTEIRO (scriptOutline) focado em SEGURAR A ATENÇÃO (Watchtime) sem violar regras.
      
      Critérios para um Sub-Nicho Forte:
      - Lacuna de Conteúdo: O público procura, mas só encontra vídeos antigos ou ruins.
      - Ângulo Único: Uma nova forma de abordar o tema.
      
      Responda EXCLUSIVAMENTE em Português do Brasil seguindo o schema JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: subNicheSchema,
        temperature: 0.7, 
      },
    });

    if (response.text) {
      // CLEANUP BUG FIX: Remove markdown code blocks if the AI adds them (common issue)
      let cleanText = response.text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      try {
        return JSON.parse(cleanText) as SubNiche[];
      } catch (parseError) {
        console.error("Erro ao fazer parse do JSON:", parseError);
        console.log("Texto recebido:", cleanText);
        throw new Error("Erro ao processar resposta da IA. Tente novamente.");
      }
    }
    
    throw new Error("Nenhuma resposta gerada.");
  } catch (error) {
    console.error("Erro ao gerar nichos:", error);
    throw error;
  }
};