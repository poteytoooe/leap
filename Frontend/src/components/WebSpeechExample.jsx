import React, { useState } from 'react';
import { useWebSpeech } from '../hooks';

/**
 * Example component demonstrating the Web Speech API hooks
 * Shows how to use STT, TTS, and combined functionality
 */
export const WebSpeechExample = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [speechRate, setSpeechRate] = useState(1);
  const [responses, setResponses] = useState([]);

  const speech = useWebSpeech({
    language: selectedLanguage,
    speechRate,
    speechPitch: 1,
    speechVolume: 1,
    continuous: false,
  });

  const handleSpeak = (text) => {
    speech.speak(text);
    setResponses([...responses, { type: 'speak', text, timestamp: new Date() }]);
  };

  const handleSpeakAndListen = (text) => {
    speech.speakAndListen(text, true);
    setResponses([...responses, { type: 'speak-listen', text, timestamp: new Date() }]);
  };

  const handleListenForResponse = () => {
    speech.startListening();
  };

  const handleStopListening = () => {
    speech.stopListening();
    if (speech.transcript) {
      setResponses([...responses, { type: 'transcribed', text: speech.transcript, timestamp: new Date() }]);
    }
  };

  const availableVoices = speech.getAvailableVoices();

  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    speech.changeLanguage(newLang);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Web Speech API Demo</h2>

      {/* Error Display */}
      {speech.error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
          ⚠️ {speech.error}
        </div>
      )}

      {/* Language Selection */}
      <div style={{ marginBottom: '15px' }}>
        <label><strong>Language:</strong></label>
        <select value={selectedLanguage} onChange={(e) => handleLanguageChange(e.target.value)}>
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="de-DE">German</option>
          <option value="it-IT">Italian</option>
          <option value="ja-JP">Japanese</option>
          <option value="zh-CN">Chinese (Simplified)</option>
        </select>
      </div>

      {/* Speech Rate Control */}
      <div style={{ marginBottom: '15px' }}>
        <label><strong>Speech Rate: {speechRate.toFixed(1)}x</strong></label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
        />
      </div>

      {/* Recording Status */}
      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <p><strong>Status:</strong></p>
        <p>🎤 Listening: {speech.isListening ? '✓ Yes' : '✗ No'}</p>
        <p>🔊 Speaking: {speech.isSpeaking ? '✓ Yes' : '✗ No'}</p>
        <p>⏸️ Paused: {speech.isPaused ? '✓ Yes' : '✗ No'}</p>
      </div>

      {/* Text-to-Speech Examples */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
        <h3>Text-to-Speech</h3>
        <button onClick={() => handleSpeak('Hello, how are you today?')} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}>
          Speak: Hello
        </button>
        <button onClick={() => handleSpeak('This is a test of the speech synthesis API.')} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}>
          Speak: Test
        </button>
        <button onClick={() => speech.stopSpeech()} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#ffcdd2' }}>
          Stop Speaking
        </button>
      </div>

      {/* Speech-to-Text Examples */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <h3>Speech-to-Text</h3>
        <button onClick={handleListenForResponse} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#90caf9' }}>
          {speech.isListening ? '🎤 Listening...' : '🎤 Start Listening'}
        </button>
        <button onClick={handleStopListening} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer', backgroundColor: '#ffcdd2' }}>
          Stop Listening
        </button>
        <button onClick={() => speech.resetTranscript()} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Clear Transcript
        </button>
      </div>

      {/* Transcript Display */}
      {speech.transcript && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff9c4', borderRadius: '4px' }}>
          <p><strong>Final Transcript:</strong></p>
          <p style={{ fontSize: '16px', fontStyle: 'italic' }}>{speech.transcript}</p>
        </div>
      )}

      {speech.interimTranscript && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff9c4', borderRadius: '4px' }}>
          <p><strong>Interim Transcript:</strong></p>
          <p style={{ fontSize: '16px', fontStyle: 'italic', opacity: 0.7 }}>{speech.interimTranscript}</p>
        </div>
      )}

      {/* Combined Actions */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
        <h3>Combined Actions</h3>
        <button onClick={() => handleSpeakAndListen('What is your name?')} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}>
          Speak & Listen
        </button>
        <button onClick={() => speech.toggleListening()} style={{ marginRight: '10px', padding: '8px 16px', cursor: 'pointer' }}>
          Toggle Listening
        </button>
        <button onClick={() => speech.stopAll()} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#ffcdd2' }}>
          Stop All
        </button>
      </div>

      {/* Available Voices */}
      {availableVoices.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Available Voices</h3>
          <p>Found {availableVoices.length} voices:</p>
          <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {availableVoices.map((voice, index) => (
              <div key={index} style={{ fontSize: '12px', padding: '5px', borderBottom: '1px solid #ddd' }}>
                <button
                  onClick={() => speech.setVoice(index)}
                  style={{ marginRight: '10px', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Use
                </button>
                {voice.name} ({voice.lang}) {voice.default ? '✓ Default' : ''}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response History */}
      {responses.length > 0 && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <h3>Response History</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {responses.map((response, index) => (
              <div key={index} style={{ fontSize: '12px', padding: '5px', borderBottom: '1px solid #ddd' }}>
                <strong>{response.type}:</strong> {response.text}
                <br />
                <small>{response.timestamp.toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSpeechExample;
