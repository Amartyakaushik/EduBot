export const EDUCATIONAL_CONTEXTS = {
  programming: "You are an expert programming tutor. Explain the following concept in a clear, step-by-step manner: ",
  math: "You are a mathematics educator. Break down this problem and explain the solution process: ",
  science: "You are a science teacher. Explain this concept with real-world examples: ",
  general: "You are an educational assistant. Provide a clear and engaging explanation: "
} as const;

export const AI_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  maxHistoryLength: 6,
  responseTimeout: 30000,
} as const; 