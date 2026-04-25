import React, { useState, useEffect, useRef } from 'react';
import { useWebSpeech } from '../hooks';
import '../css/ai-chat.css';

/**
 * AI Chat Interface for Students
 * Features:
 * - Text and voice input/output
 * - Real-time message streaming
 * - Conversation history
 * - Language support
 * - Accessibility features
 */
export const AIChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your AI Learning Assistant. How can I help you today? You can type or use the voice button to speak with me.',
      sender: 'bot',
      timestamp: new Date(),
      voiceOptionAvailable: true,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [showVoiceControls, setShowVoiceControls] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Web Speech API
  const speech = useWebSpeech({
    language: selectedLanguage,
    speechRate: 1,
    searchPitch: 1,
    speechVolume: 1,
    continuous: false,
  });

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-speak bot responses
  useEffect(() => {
    if (autoSpeak && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot' && lastMessage.voiceOptionAvailable) {
        // Add small delay so user can see message first
        const timer = setTimeout(() => {
          speech.speak(lastMessage.text);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [messages, autoSpeak, speech]);

  // Handle text submission
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Use test endpoint or production endpoint based on token availability
      const token = localStorage.getItem('token');
      const apiEndpoint = token ? '/api/ai/chat' : '/api/ai-test/chat';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: text,
          conversationId: 'default',
          language: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Add bot message placeholder
      const botMessageId = messages.length + 2;
      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          text: '',
          sender: 'bot',
          timestamp: new Date(),
          isStreaming: true,
          voiceOptionAvailable: true,
        },
      ]);

      // Handle streaming response
      let fullResponse = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        // Update message with streamed content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, text: fullResponse }
              : msg
          )
        );
      }

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );

      // Auto-speak if enabled
      if (autoSpeak) {
        setTimeout(() => {
          speech.speak(fullResponse);
        }, 300);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
          sender: 'bot',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (speech.isListening) {
      speech.stopListening();
    } else {
      speech.startListening();
    }
  };

  // Use transcribed voice as message
  useEffect(() => {
    if (
      speech.transcript &&
      !speech.isListening &&
      inputValue === ''
    ) {
      setInputValue(speech.transcript);
    }
  }, [speech.transcript, speech.isListening]);

  // Handle language change
  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    speech.changeLanguage(newLang);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleSpeakMessage = (text) => {
    speech.speak(text);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([
        {
          id: 1,
          text: 'Hello! I\'m your AI Learning Assistant. How can I help you today?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      speech.resetTranscript();
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h2>🤖 AI Learning Assistant</h2>
        <div className="chat-controls">
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="language-select"
            title="Change language"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="it-IT">Italian</option>
            <option value="ja-JP">Japanese</option>
            <option value="zh-CN">Chinese</option>
          </select>

          <label className="auto-speak-toggle">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
            />
            🔊 Auto Speak
          </label>

          <button
            onClick={handleClearChat}
            className="btn-clear"
            title="Clear conversation"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="ai-chat-messages" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message message-${msg.sender} ${
              msg.isError ? 'message-error' : ''
            }`}
          >
            <div className="message-avatar">
              {msg.sender === 'bot' ? '🤖' : '👤'}
            </div>
            <div className="message-content">
              <div className="message-text">
                {msg.isStreaming && <span className="streaming-indicator">▌</span>}
                {msg.text}
              </div>
              <div className="message-timestamp">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              {msg.sender === 'bot' && msg.voiceOptionAvailable && (
                <button
                  onClick={() => handleSpeakMessage(msg.text)}
                  className="btn-speak-message"
                  title="Read message aloud"
                  disabled={!msg.text}
                >
                  🔊 Read
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Input Status */}
      {showVoiceControls && (
        <div className="voice-status">
          {speech.isListening && (
            <div className="status-indicator listening">
              🎤 Listening...
            </div>
          )}
          {speech.isSpeaking && (
            <div className="status-indicator speaking">
              🔊 Speaking...
            </div>
          )}
          {speech.error && (
            <div className="status-indicator error">
              {speech.error}
              {speech.error.includes('permission') && (
                <div style={{ marginTop: '8px', fontSize: '0.85rem', textAlign: 'left' }}>
                  <strong>Fix:</strong> Click the 🔒 lock icon in your address bar → Microphone → Allow
                </div>
              )}
            </div>
          )}
          {speech.interimTranscript && (
            <div className="interim-transcript">
              📝 {speech.interimTranscript}
            </div>
          )}
        </div>
      )}

      <div className="ai-chat-input-area">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message or use voice input..."
          className="chat-input"
          rows="3"
          disabled={isLoading}
        />

        <div className="input-controls">
          <button
            onClick={handleVoiceInput}
            className={`btn-voice ${speech.isListening ? 'active' : ''}`}
            title={speech.isListening ? 'Stop listening' : 'Start voice input'}
          >
            {speech.isListening ? '🎤 Stop' : '🎤 Voice'}
          </button>

          <button
            onClick={() => speech.stopSpeech()}
            className="btn-stop"
            disabled={!speech.isSpeaking}
            title="Stop speech"
          >
            ⏹️ Stop
          </button>

          <button
            onClick={() => handleSendMessage(inputValue)}
            className="btn-send"
            disabled={!inputValue.trim() || isLoading}
            title="Send message"
          >
            {isLoading ? '⏳ Sending...' : '📤 Send'}
          </button>
        </div>
      </div>

      {/* Debug Info (can be hidden in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="ai-chat-debug">
          <details>
            <summary>🔧 Debug Info</summary>
            <pre>
{JSON.stringify(
  {
    isListening: speech.isListening,
    isSpeaking: speech.isSpeaking,
    transcript: speech.transcript,
                interimTranscript: speech.interimTranscript,
                messagesCount: messages.length,
              },
              null,
              2
            )}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default AIChatInterface;
