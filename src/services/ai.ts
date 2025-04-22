'use client';

const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";

export async function generateAIResponse(userMessage: string): Promise<string> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Google API key not found. Please check your .env.local file');
    }

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: userMessage
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response generated from the AI model');
    }

    return generatedText;
  } catch (error) {
    console.error('AI Response Error:', error);
    if (error instanceof Error) {
      return `Error: ${error.message}. Please check your API key in .env.local file or try again.`;
    }
    return 'An unknown error occurred. Please try again.';
  }
}

function buildPrompt(userMessage: string, context: string): string {
  const contextPrompt = EDUCATIONAL_CONTEXTS[context];
  const history = conversationHistory.length > 0 
    ? `Previous conversation:\n${conversationHistory.join('\n')}\n\n`
    : '';
  
  return `${history}${contextPrompt}${userMessage}`;
}

function determineContext(message: string): 'programming' | 'math' | 'science' | 'general' {
  const lowerMessage = message.toLowerCase();
  
  const programmingKeywords = [
    'code', 'program', 'function', 'api', 'variable', 'loop', 'array', 
    'algorithm', 'javascript', 'python', 'java', 'react', 'typescript',
    'database', 'server', 'client', 'frontend', 'backend'
  ];
  
  const mathKeywords = [
    'math', 'equation', 'number', 'calculation', 'formula', 'geometry',
    'algebra', 'calculus', 'statistics', 'probability', 'matrix'
  ];
  
  const scienceKeywords = [
    'science', 'physics', 'chemistry', 'biology', 'experiment', 'theory',
    'molecule', 'atom', 'cell', 'genetics', 'evolution', 'energy'
  ];

  if (programmingKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'programming';
  }
  if (mathKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'math';
  }
  if (scienceKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'science';
  }
  return 'general';
}

function formatResponse(response: string, context: string): string {
  let cleanResponse = response
    .trim()
    .replace(/^["\s]+|["\s]+$/g, '')
    .replace(/\\n/g, '\n')
    .replace(/\n+/g, '\n');

  // Add formatting based on context
  if (context === 'programming') {
    cleanResponse = cleanResponse.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `\n\`\`\`${lang || ''}\n${code.trim()}\n\`\`\`\n`;
    });
  }

  if (!cleanResponse || cleanResponse.length < 20) {
    return generateMockResponse(context);
  }

  return cleanResponse;
}

// ... existing code ... 