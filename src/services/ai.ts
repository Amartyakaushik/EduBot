const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";

// Educational context prompts
const EDUCATIONAL_CONTEXTS = {
  programming: "As a programming teacher, explain: ",
  math: "As a math teacher, explain: ",
  science: "As a science educator, explain: ",
  general: "As an educational assistant, explain: "
};

export async function generateAIResponse(userMessage: string): Promise<string> {
  try {
    const API_TOKEN = process.env.NEXT_PUBLIC_HUGGING_FACE_API_TOKEN;
    
    console.log('API Token available:', !!API_TOKEN);
    if (!API_TOKEN) {
      console.warn('No API token found. Using mock response.');
      return generateMockResponse(userMessage);
    }

    const context = determineContext(userMessage);
    const prompt = `${EDUCATIONAL_CONTEXTS[context]}${userMessage}`;

    console.log('Making API request with prompt:', prompt);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', response.status, errorData);
      throw new Error(`API request failed: ${response.status} ${errorData.error || ''}`);
    }

    const data = await response.json();
    console.log('API Response received:', data);
    
    // Handle different response formats
    let generatedText = '';
    if (Array.isArray(data)) {
      generatedText = data[0]?.generated_text || data[0]?.text || '';
    } else if (typeof data === 'object') {
      generatedText = data.generated_text || data.text || '';
    }

    if (!generatedText) {
      console.warn('No generated text in response, using mock response');
      return generateMockResponse(userMessage);
    }

    return formatResponse(generatedText, context);
  } catch (error) {
    console.error('Error generating response:', error);
    return generateMockResponse(userMessage);
  }
}

function determineContext(message: string): 'programming' | 'math' | 'science' | 'general' {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.match(/\b(code|program|function|api|variable|loop|array|algorithm|javascript|python|java)\b/)) {
    return 'programming';
  }
  if (lowerMessage.match(/\b(math|equation|number|calculation|formula|geometry|algebra|calculus)\b/)) {
    return 'math';
  }
  if (lowerMessage.match(/\b(science|physics|chemistry|biology|experiment|theory|molecule|atom)\b/)) {
    return 'science';
  }
  return 'general';
}

function formatResponse(response: string, context: string): string {
  // Clean up the response
  let cleanResponse = response.trim()
    .replace(/^["\s]+|["\s]+$/g, '') // Remove quotes and extra spaces
    .replace(/\\n/g, '\n'); // Handle newlines

  // If response is empty or too short, use mock response
  if (!cleanResponse || cleanResponse.length < 20) {
    return generateMockResponse(context);
  }

  return cleanResponse;
}

function generateMockResponse(context: string): string {
  const responses = {
    programming: [
      "Let me help you understand this programming concept. In programming, we often break down complex problems into smaller, manageable pieces. This makes the code easier to write, test, and maintain.",
      "That's an interesting programming question. When writing code, it's important to consider both functionality and readability. Let's explore this step by step.",
      "Programming is all about logical thinking and problem-solving. Let's analyze this problem and develop a clear solution."
    ],
    math: [
      "Mathematics is about understanding patterns and relationships. Let's break this down into simpler terms and solve it step by step.",
      "This is an interesting mathematical concept. Let's approach it systematically and understand the underlying principles.",
      "In mathematics, visualization can be very helpful. Let's think about this problem in a way that makes it easier to understand."
    ],
    science: [
      "Scientific concepts are best understood through observation and experimentation. Let's explore this topic in detail.",
      "In science, we often start with a hypothesis and then test it. Let's examine this concept more closely.",
      "Science is about understanding the world around us. Let's break down this concept into its fundamental principles."
    ],
    general: [
      "That's an interesting question. Let's explore this topic together and break it down into manageable pieces.",
      "I'll help you understand this better. Let's approach it step by step and focus on the key concepts.",
      "Learning is most effective when we connect new information to what we already know. Let's explore this topic together."
    ]
  };

  const contextResponses = responses[context as keyof typeof responses] || responses.general;
  return contextResponses[Math.floor(Math.random() * contextResponses.length)];
}

// Fallback response generation for when API is unavailable
function generateLocalResponse(userMessage: string): string {
  const topics = {
    programming: [
      "Let me explain this programming concept with a practical example...",
      "In software development, this is how we would approach this problem...",
      "Here's how this code works step by step..."
    ],
    math: [
      "Let's break down this mathematical concept...",
      "Here's a simpler way to understand this formula...",
      "Think about this mathematical problem this way..."
    ],
    science: [
      "In scientific terms, this phenomenon occurs because...",
      "Let me explain this scientific concept using everyday examples...",
      "This is how this scientific principle works in real life..."
    ],
    general: [
      "Here's what you need to know about this topic...",
      "Let me break this down into simpler terms...",
      "Think about it this way..."
    ]
  };

  // Simple topic detection based on keywords
  const message = userMessage.toLowerCase();
  let category = 'general';

  if (message.match(/\b(code|program|function|variable|loop|array|algorithm)\b/)) {
    category = 'programming';
  } else if (message.match(/\b(math|equation|number|calculation|formula|geometry)\b/)) {
    category = 'math';
  } else if (message.match(/\b(science|physics|chemistry|biology|experiment|theory)\b/)) {
    category = 'science';
  }

  const responses = topics[category];
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Generate a more contextual response
  return `${randomResponse}\n\nRegarding your question about "${userMessage}", ${generateContextualDetail(category)}`;
}

function generateContextualDetail(category: string): string {
  const details = {
    programming: [
      "consider breaking the problem into smaller functions for better maintainability.",
      "remember to handle edge cases and add proper error handling.",
      "think about the time and space complexity of your solution."
    ],
    math: [
      "try visualizing the problem using diagrams or graphs.",
      "start with simpler numbers to understand the pattern.",
      "consider using step-by-step problem-solving techniques."
    ],
    science: [
      "observe how this applies to everyday phenomena.",
      "consider the cause-and-effect relationships involved.",
      "think about how we can verify this through experiments."
    ],
    general: [
      "let's approach this systematically.",
      "consider different perspectives on this topic.",
      "think about how this applies in practical situations."
    ]
  };

  const categoryDetails = details[category];
  return categoryDetails[Math.floor(Math.random() * categoryDetails.length)];
} 