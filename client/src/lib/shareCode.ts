import type { Contestant } from "@shared/schema";

export function createShareCode(contestant: Contestant): string {
  try {
    const dataToShare = {
      name: contestant.name,
      questions: contestant.questions.map(q => ({
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        prize: q.prize,
      })),
      randomizeQuestions: contestant.randomizeQuestions,
      randomizeOptions: contestant.randomizeOptions,
      enableTimer: contestant.enableTimer,
      timerMinutes: contestant.timerMinutes,
    };
    
    const jsonString = JSON.stringify(dataToShare);
    const base64 = btoa(unescape(encodeURIComponent(jsonString)));
    
    const url = `${window.location.origin}${window.location.pathname}#data=${base64}`;
    return url;
  } catch (error) {
    throw new Error('فشل في إنشاء رابط المشاركة');
  }
}

function extractDataFromUrl(input: string): string | null {
  try {
    const trimmed = input.trim();
    
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const dataFromHash = url.hash.replace('#data=', '');
      if (dataFromHash && dataFromHash !== url.hash) {
        return dataFromHash;
      }
      
      const dataFromQuery = url.searchParams.get('data');
      if (dataFromQuery) {
        return dataFromQuery;
      }
      
      return null;
    }
    
    return trimmed;
  } catch (error) {
    return input.trim();
  }
}

export function importFromShareCode(code: string): Contestant | null {
  try {
    const base64Data = extractDataFromUrl(code);
    
    if (!base64Data) {
      return null;
    }
    
    const jsonString = decodeURIComponent(escape(atob(base64Data)));
    const data = JSON.parse(jsonString);
    
    if (!data.name || !Array.isArray(data.questions)) {
      return null;
    }
    
    return {
      id: '',
      name: data.name,
      questions: data.questions.map((q: any, index: number) => ({
        id: `temp-q-${index}`,
        text: q.text || '',
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: q.correctAnswer || 0,
        prize: q.prize || 0,
      })),
      randomizeQuestions: data.randomizeQuestions ?? false,
      randomizeOptions: data.randomizeOptions ?? false,
      enableTimer: data.enableTimer ?? false,
      timerMinutes: data.timerMinutes ?? 1,
    };
  } catch (error) {
    return null;
  }
}
