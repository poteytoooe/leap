// Backend API endpoint for AI Chat
const express = require('express');
const { chatWithAI, getAvailableModels } = require('../services/aiService');

const router = express.Router();

/**
 * POST /api/ai/chat or /api/ai-test/chat
 * 
 * Send a message to the AI and get a streaming response
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId, language } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Check if OpenAI is configured
    const useOpenAI = process.env.OPENAI_API_KEY && 
                      !process.env.OPENAI_API_KEY.includes('your-api-key');

    if (useOpenAI) {
      try {
        // Try to use OpenAI
        const stream = await chatWithAI(
          message,
          [],
          process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          language || 'en-US'
        );

        // Stream the response
        (async () => {
          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                res.write(content);
              }
            }
            res.end();
          } catch (error) {
            console.error('Streaming error:', error);
            res.write(`\n[Error: ${error.message}]`);
            res.end();
          }
        })();
      } catch (error) {
        console.error('OpenAI Error:', error.message);
        // Fall back to mock if OpenAI fails
        sendMockResponse(message, res);
      }
    } else {
      // Use mock response
      sendMockResponse(message, res);
    }

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process message' });
  }
});

/**
 * Send a mock AI response (for testing/free tier)
 */
function sendMockResponse(userMessage, res) {
  const mockResponse = `I received your message: "${userMessage.substring(0, 40)}..."

This is a demonstration response. In production mode with OpenAI configured, you'll get real AI responses.

Here are some features of this learning assistant:
• Ask any educational question
• Get explanations in simple language
• Use voice input and output
• Multi-language support
• Personalized learning paths

Try asking me about science, math, history, or any subject you're learning!`;

  const words = mockResponse.split(' ');
  let index = 0;

  const sendNextWord = () => {
    if (index < words.length) {
      res.write(`${words[index]} `);
      index++;
      setTimeout(sendNextWord, 30);
    } else {
      res.end();
    }
  };

  setTimeout(sendNextWord, 100);
}

/**
 * GET /api/ai/models
 * Get available AI models
 */
router.get('/models', async (req, res) => {
  try {
    const models = getAvailableModels();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

/**
 * POST /api/ai/conversation
 * Create a new conversation
 */
router.post('/conversation', async (req, res) => {
  try {
    const { title, model } = req.body;

    // TODO: Save to database
    const conversation = {
      id: 'conv_' + Date.now(),
      title: title || 'New Conversation',
      model: model || process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      createdAt: new Date(),
      messages: [],
    };

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

/**
 * GET /api/ai/conversation/:id
 * Get conversation history
 */
router.get('/conversation/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Fetch from database
    const conversation = {
      id,
      title: 'Conversation',
      messages: [],
    };

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

/**
 * DELETE /api/ai/conversation/:id
 * Delete a conversation
 */
router.delete('/conversation/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Delete from database
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

module.exports = router;
