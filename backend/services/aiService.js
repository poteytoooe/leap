const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI client lazily to avoid crash if key is missing
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  console.warn('Warning: OPENAI_API_KEY not set. AI features disabled.');
}

/**
 * Send a message to OpenAI and get a streaming response
 * @param {string} message - User's message
 * @param {array} conversationHistory - Previous messages for context
 * @param {string} model - Model to use (e.g., 'gpt-3.5-turbo')
 * @param {string} language - Language code (for system prompt adaptation)
 * @returns {Promise<Stream>} OpenAI stream
 */
async function chatWithAI(
  message,
  conversationHistory = [],
  model = 'gpt-3.5-turbo',
  language = 'en-US'
) {
  // Build system prompt
  const systemPrompt = buildSystemPrompt(language);

  // Build messages array
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: message },
  ];

  try {
    // Create streaming response
    const stream = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
      max_tokens: 500,
      temperature: 0.7,
    });

    return stream;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
}

/**
 * Build system prompt based on language
 * @param {string} language - Language code
 * @returns {string} System prompt
 */
function buildSystemPrompt(language = 'en-US') {
  const prompts = {
    'en-US': `You are a friendly and patient AI Learning Assistant for students. Your role is to:
- Explain concepts clearly and concisely
- Ask guiding questions to encourage critical thinking
- Provide relevant examples and analogies
- Suggest resources for further learning
- Be supportive and encouraging
- Keep responses focused and not too long (2-3 paragraphs max)

Be conversational, warm, and genuinely interested in helping the student learn.`,

    'es-ES': `Eres un asistente de aprendizaje de IA amable y paciente para estudiantes. Tu rol es:
- Explicar conceptos de manera clara y concisa
- Hacer preguntas guiadas para fomentar el pensamiento crítico
- Proporcionar ejemplos y analogías relevantes
- Sugerir recursos para aprender más
- Ser solidario y alentador
- Mantener las respuestas enfocadas y no demasiado largas

Sé conversacional, cálido y genuinamente interesado en ayudar al estudiante a aprender.`,

    'fr-FR': `Vous êtes un assistant d'apprentissage IA amical et patient pour les étudiants. Votre rôle est de:
- Expliquer les concepts de manière claire et concise
- Poser des questions directrices pour encourager la pensée critique
- Fournir des exemples et des analogies pertinents
- Suggérer des ressources pour approfondir l'apprentissage
- Être solidaire et encourageant
- Garder les réponses courtes et concises

Soyez conversationnel, chaleureux et véritablement intéressé à aider l'étudiant à apprendre.`,

    'de-DE': `Sie sind ein freundlicher und geduldiger KI-Lernassistent für Schüler. Ihre Rolle ist es,
- Konzepte klar und prägnant zu erklären
- Führungsfragen zu stellen, um kritisches Denken zu fördern
- Relevante Beispiele und Analogien bereitzustellen
- Ressourcen zum weiteren Lernen vorschlagen
- Unterstützend und ermutigend zu sein
- Antworten fokussiert und nicht zu lang zu halten

Seien Sie gesprächig, warm und wirklich daran interessiert, dem Schüler beim Lernen zu helfen.`,
  };

  return prompts[language] || prompts['en-US'];
}

/**
 * Create a conversation with multiple exchanges
 * @param {array} messages - Array of {role, content} objects
 * @param {string} model - Model to use
 * @returns {Promise<string>} Full response text
 */
async function completeConversation(messages, model = 'gpt-3.5-turbo') {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to complete conversation: ${error.message}`);
  }
}

/**
 * Get available models (placeholder for future use)
 * @returns {array} List of available models
 */
function getAvailableModels() {
  return [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'Most advanced model',
      costPer1kTokens: 0.03,
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Fast and affordable',
      costPer1kTokens: 0.002,
    },
  ];
}

module.exports = {
  chatWithAI,
  buildSystemPrompt,
  completeConversation,
  getAvailableModels,
};
