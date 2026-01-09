
import { GoogleGenAI, Type } from "@google/genai";
import { DogProfile, DayPlan, ExerciseTemplate, EXERCISE_LIBRARY_KEY, Frequency } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Update generateTrainingPlan to use Frequency type for better type safety
export const generateTrainingPlan = async (profile: DogProfile, frequency: Frequency): Promise<DayPlan[]> => {
  // Get library from localStorage if exists
  const libraryRaw = localStorage.getItem(EXERCISE_LIBRARY_KEY);
  const library: ExerciseTemplate[] = libraryRaw ? JSON.parse(libraryRaw) : [];
  
  const libraryContext = library.length > 0 
    ? `Utiliza preferiblemente estos ejercicios de nuestra biblioteca: ${JSON.stringify(library)}`
    : "Crea ejercicios creativos de obediencia, agilidad y juego.";

  // Fix: changed profile.age to profile.birthDate as age is no longer a property of DogProfile
  const prompt = `Actúa como entrenador jefe de "Eventos GUAU".
  Crea un plan de 7 días para:
  Perro: ${profile.dogName} (${profile.breed}, Nacido el: ${profile.birthDate})
  Problemas a resolver: ${profile.behaviorProblems.join(', ')}
  Nivel energía: ${profile.energyLevel}
  Frecuencia: ${frequency}
  
  ${libraryContext}

  Devuelve un array JSON de 7 días. Cada día tiene "date" (YYYY-MM-DD) y "exercises" (array).
  Cada ejercicio debe tener: id, title, description, duration, category, videoUrl (si existe en la biblioteca) y completed: false.`;

  // Use gemini-3-pro-preview for complex reasoning task (generating a customized training plan)
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  category: { type: Type.STRING },
                  // videoUrl is treated as string; ensure the schema reflects standard types
                  videoUrl: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN }
                }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};
