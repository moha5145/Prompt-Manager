import { GoogleGenAI } from '../lib/google-genai.js';

const storage = {
  get: (key) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return chrome.storage.local.get(key);
    }
    // Mock storage for non-extension environment
    const data = localStorage.getItem(key);
    return Promise.resolve({ [key]: data ? JSON.parse(data) : undefined });
  },
  set: (data) => {
     if (typeof chrome !== 'undefined' && chrome.storage) {
      return chrome.storage.local.set(data);
    }
    // Mock storage
    Object.keys(data).forEach(key => {
        localStorage.setItem(key, JSON.stringify(data[key]));
    });
    return Promise.resolve();
  }
};

// API Key Management
export const getApiKey = async () => {
    const result = await storage.get('gemini_api_key');
    return result.gemini_api_key || null;
};

export const setApiKey = async (key) => {
    await storage.set({ 'gemini_api_key': key });
};


// Gemini API Call
export const callGeminiAPI = async (prompt) => {
    const API_KEY = await getApiKey();

    if (!API_KEY) {
        throw new Error("API key not configured. Please add your key in the Settings page.");
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error(`API call failed. Please check your key and network, then see the console for details.`);
    }
};


// Prompts Management
export const getPrompts = async () => {
  const result = await storage.get('prompts');
  return result.prompts || [];
};

const savePrompts = async (prompts) => {
  await storage.set({ prompts });
};

export const addPrompt = async (promptData) => {
  const prompts = await getPrompts();
  const newPrompt = {
    id: `prompt_${Date.now()}`,
    ...promptData,
    category: promptData.category?.trim() || 'Uncategorized',
  };
  await savePrompts([...prompts, newPrompt]);
  return newPrompt;
};

export const updatePrompt = async (updatedPrompt) => {
  let prompts = await getPrompts();
  updatedPrompt.category = updatedPrompt.category?.trim() || 'Uncategorized';
  prompts = prompts.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p));
  await savePrompts(prompts);
};

export const deletePrompt = async (id) => {
  let prompts = await getPrompts();
  prompts = prompts.filter((p) => p.id !== id);
  await savePrompts(prompts);
};

export const importPrompts = async (newPrompts) => {
  if (!Array.isArray(newPrompts)) {
    throw new Error("Imported data is not an array.");
  }

  const existingPrompts = await getPrompts();
  const existingIds = new Set(existingPrompts.map(p => p.id));
  
  const uniqueNewPrompts = newPrompts.filter(p => p && p.id && p.title && p.text && !existingIds.has(p.id));

  const mergedPrompts = [...existingPrompts, ...uniqueNewPrompts];
  await savePrompts(mergedPrompts);
  
  return { mergedPrompts, importedCount: uniqueNewPrompts.length };
};

// Template Management
const defaultTemplates = [
  {
    id: 'template_default_1',
    title: 'Persona Generator',
    text: 'Act as a {{persona_role}}. You are an expert in {{domain}}. Your task is to respond to the following request in the persona described.\n\nRequest: {{user_request}}',
  },
  {
    id: 'template_default_2',
    title: 'Text Summarizer',
    text: 'Summarize the following text into {{number}} key bullet points. Focus on the main ideas and conclusions.\n\nText:\n"""\n{{text_to_summarize}}\n"""',
  },
  {
    id: 'template_default_3',
    title: 'Email Writer',
    text: 'Write a professional email with the following characteristics:\n- Tone: {{tone_of_email}}\n- Recipient: {{recipient}}\n- Goal: {{goal_of_email}}\n- Key points to include: {{key_points}}\n\nGenerate the email subject and body.',
  },
  {
    id: 'template_default_4',
    title: 'Code Explainer',
    text: 'Act as an expert software engineer. Explain the following code snippet in a clear and concise way. Describe what it does, how it works, and suggest potential improvements.\n\nLanguage: {{programming_language}}\n\nCode:\n```\n{{code_snippet}}\n```',
  }
];

const saveTemplates = async (templates) => {
  await storage.set({ templates });
};

export const getTemplates = async () => {
  const result = await storage.get('templates');
  // If templates have never been set before, initialize with defaults
  if (result.templates === undefined) {
    await saveTemplates(defaultTemplates);
    return defaultTemplates;
  }
  return result.templates; // Return existing templates (even if it's an empty array)
};

export const addTemplate = async (templateData) => {
  const templates = await getTemplates();
  const newTemplate = {
    id: `template_${Date.now()}`,
    ...templateData,
  };
  await saveTemplates([...templates, newTemplate]);
  return newTemplate;
};

export const deleteTemplate = async (id) => {
  let templates = await getTemplates();
  templates = templates.filter((t) => t.id !== id);
  await saveTemplates(templates);
};