# AI Chat Interface Documentation

## Overview

The AI Chat Interface is a full-featured student learning assistant built with React and integrated with Web Speech API. It supports:

- 💬 Text-based conversations
- 🎤 Voice input (speech-to-text)
- 🔊 Voice output (text-to-speech)
- 🌍 Multi-language support
- 📡 Real-time streaming responses
- 📝 Conversation history
- ♿ Accessibility features

## Components

### AIChatInterface.jsx

Main component that provides a complete chat interface with voice capabilities.

**Location:** `src/components/AIChatInterface.jsx`

**Features:**
- Message display with auto-scrolling
- Text input with keyboard shortcuts (Enter to send)
- Voice recording with visual indicators
- Auto-speech responses for accessibility
- Language selection and management
- Streaming response support
- Error handling and retry logic

**Props:** None (uses context for auth)

## Integration with Backend

### API Endpoint

The component sends messages to: `/api/ai/chat`

**Request Format:**
```json
{
  "message": "What is photosynthesis?",
  "conversationId": "conv_123456",
  "language": "en-US"
}
```

**Response Format:**
The endpoint should stream responses. Support both:

1. **Server-Sent Events (SSE):**
   ```
   data: This 
   data: is 
   data: a 
   data: response
   ```

2. **Chunked Transfer Encoding:**
   Content-Type: `text/event-stream`

### Setting Up with OpenAI

**Step 1: Install OpenAI SDK**

```bash
npm install openai
```

**Step 2: Create AI Service**

```javascript
// backend/services/aiService.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function chatWithAI(message, conversationHistory = [], model = 'gpt-3.5-turbo') {
  const messages = [
    {
      role: 'system',
      content: `You are a friendly and patient AI Learning Assistant for students. 
      Your role is to:
      - Explain concepts clearly
      - Ask guiding questions
      - Provide examples
      - Encourage critical thinking
      - Be supportive and encouraging`,
    },
    ...conversationHistory,
    { role: 'user', content: message },
  ];

  const stream = await openai.chat.completions.create({
    model,
    messages,
    stream: true,
    max_tokens: 500,
  });

  return stream;
}

module.exports = { chatWithAI };
```

**Step 3: Update Route Handler**

```javascript
// backend/routes/aiRoutes.js
const { chatWithAI } = require('../services/aiService');

router.post('/chat', async (req, res) => {
  try {
    const { message, conversationId, language } = req.body;
    const userId = req.user.id;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Get conversation history from database
    // const history = await getConversationHistory(conversationId);

    const stream = await chatWithAI(message);

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${content}`);
      }
    }

    res.end();
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});
```

### Alternative: Using Claude (Anthropic)

```javascript
// backend/services/claudeService.js
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic();

async function chatWithClaude(message, conversationHistory = []) {
  const response = await client.messages.stream({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    system: `You are a friendly and patient AI Learning Assistant for students...`,
    messages: [
      ...conversationHistory,
      { role: 'user', content: message },
    ],
  });

  return response;
}
```

## Frontend Usage

### Basic Implementation

```javascript
import AIChatInterface from './components/AIChatInterface';

export function ChatPage() {
  return <AIChatInterface />;
}
```

### Customization

The component can be extended with custom props (if needed):

```javascript
// Potential future enhancement
<AIChatInterface 
  systemPrompt="You are a math tutor..."
  model="gpt-4"
  language="es-ES"
/>
```

## Features in Detail

### 1. Text Input

- Multi-line textarea
- Keyboard shortcut: `Enter` to send, `Shift+Enter` for new line
- Disabled while loading
- Character limit (configurable in code)

### 2. Voice Input

- Click 🎤 button to start recording
- Browser requests microphone permission (first time only)
- Visual indicator shows "Listening..."
- Interim transcript shown in real-time
- Final transcript automatically inserted into input
- Click 🎤 button again or say "send" to stop

### 3. Voice Output

- Toggle "🔊 Auto Speak" to enable automatic speaking
- Manual "Read" button on each bot response
- Adjustable speech rate
- Multiple voice options (system dependent)
- Auto-stops speaking when new message arrives

### 4. Multi-Language Support

Currently supports:
- English (US & UK)
- Spanish
- French
- German
- Italian
- Japanese
- Chinese (Simplified)

**To add more languages:**

Edit `AIChatInterface.jsx`:
```javascript
<option value="zh-TW">Chinese (Traditional)</option>
<option value="ko-KR">Korean</option>
```

### 5. Error Handling

- Network errors are caught and displayed
- Microphone permission errors
- Browser compatibility warnings
- Graceful fallback for speech APIs

## Testing

### Access the Demo

Navigate to: `http://localhost:5173/test/ai-chat`

### Test Scenarios

1. **Text Input:**
   - Type a message and click "Send"
   - Press Enter to send
   - Try Shift+Enter for multiline

2. **Voice Input:**
   - Click "🎤 Voice" button
   - Wait for "Listening..." indicator
   - Speak clearly and naturally
   - Wait for recognition to complete

3. **Voice Output:**
   - Enable "🔊 Auto Speak"
   - Send a message
   - Listen for response
   - Adjust speech rate slider

4. **Multi-language:**
   - Select different language
   - Message in that language
   - Test voice input/output

5. **Accessibility:**
   - Test with keyboard only (Tab navigation)
   - Test with screen reader
   - Verify text alternatives for icons

## Styling

The chat interface uses a modern gradient design with responsive layout.

**Color Scheme:**
- Primary Gradient: `#667eea` → `#764ba2` (purple/blue)
- Light Background: `#ffffff`
- Accent Colors:
  - User messages: Purple gradient
  - Bot messages: Light gray
  - Buttons: Green (voice), Orange (stop), Purple (send)

**Customization:**

Edit `src/css/ai-chat.css`:

```css
.ai-chat-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.message-user .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Performance Tips

1. **Message Pagination:**
   - Only display last 50 messages
   - Load earlier messages on scroll up

2. **Streaming Optimization:**
   - Batch updates if messages are very long
   - Debounce DOM updates

3. **Voice Processing:**
   - Process voice in Web Worker if needed
   - Cache recognized text

4. **Memory Management:**
   - Clean up intervals on component unmount
   - Limit conversation history in memory
   - Archive old conversations to database

## Accessibility Features

✅ **Screen Reader Support:**
- Semantic HTML structure
- ARIA labels
- Status announcements

✅ **Keyboard Navigation:**
- Tab through all controls
- Enter to send message
- Space for buttons

✅ **Visual Indicators:**
- Color + text for status
- Not relying on color alone
- Clear focus states

✅ **Voice Features:**
- Read messages aloud
- Input via voice
- Multiple language support

## Future Enhancements

1. **Conversation Management:**
   - Save/load conversations
   - Export as PDF
   - Search history

2. **Advanced Features:**
   - File uploads for context
   - Code highlighting
   - LaTeX equation rendering
   - Image generation

3. **Personalization:**
   - User preferences
   - Learning style adaptation
   - Performance tracking

4. **Integration:**
   - Course-specific prompts
   - Connected to assignments
   - Linked to learning objectives

## Troubleshooting

### Streaming not working

Check:
- Backend is sending `Content-Type: text/event-stream`
- No middleware is buffering response
- Browser supports `ReadableStream`

### Voice not working

Check:
- Microphone permissions granted
- Browser supports Web Speech API
- No other app using microphone
- Try refreshing page

### Messages blank

Check:
- API endpoint is correctly configured
- Backend is returning data
- Network tab shows response
- Check browser console for errors

## API Reference

### POST /api/ai/chat

Send a message and receive streaming response.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request:**
```json
{
  "message": "string",
  "conversationId": "string (optional)",
  "language": "string (optional)"
}
```

**Response (Streaming):**
```
data: token1 
data: token2 
data: token3 
...
```

### GET /api/ai/conversation/:id

Retrieve conversation history.

**Response:**
```json
{
  "id": "conv_123",
  "title": "Physics Help",
  "createdAt": "2024-01-15T10:30:00Z",
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "What is Newton's first law?",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "Newton's first law states that...",
      "timestamp": "2024-01-15T10:30:05Z"
    }
  ]
}
```

## License

Part of the LEAP Learning Management System