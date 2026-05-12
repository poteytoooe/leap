# Web Speech API Hooks Documentation

This document provides comprehensive guidance on using the Web Speech API hooks in the LEAP platform.

## Overview

Three custom React hooks have been created to handle speech-to-text (STT) and text-to-speech (TTS) functionality:

1. **useSpeechToText** - Speech Recognition (STT)
2. **useTextToSpeech** - Speech Synthesis (TTS)
3. **useWebSpeech** - Combined hook for both STT and TTS

## Hook Reference

### 1. useSpeechToText Hook

Handles converting spoken audio into text using the Web Speech API.

#### Usage

```javascript
import { useSpeechToText } from '../hooks';

function MyComponent() {
  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    changeLanguage,
  } = useSpeechToText({
    language: 'en-US',
    continuous: false,
    interimResults: true,
  });

  return (
    <>
      <button onClick={startListening}>Start Recording</button>
      <button onClick={stopListening}>Stop Recording</button>
      <p>Transcript: {transcript}</p>
      <p>Interim: {interimTranscript}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `language` | string | `'en-US'` | Language code (e.g., 'es-ES', 'fr-FR') |
| `continuous` | boolean | `false` | Keep recording until explicitly stopped |
| `interimResults` | boolean | `true` | Show results as user is speaking |

#### Returned Properties & Methods

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `isListening` | boolean | Whether microphone is actively recording |
| `transcript` | string | Final recognized text |
| `interimTranscript` | string | Text being recognized (updates as user speaks) |
| `error` | string \| null | Any error message |
| `startListening()` | function | Begin capturing audio |
| `stopListening()` | function | Stop capturing audio |
| `resetTranscript()` | function | Clear all transcript data |
| `changeLanguage(lang)` | function | Change recognition language |

### 2. useTextToSpeech Hook

Handles converting text into spoken audio using the Speech Synthesis API.

#### Usage

```javascript
import { useTextToSpeech } from '../hooks';

function MyComponent() {
  const {
    isSpeaking,
    isPaused,
    error,
    speak,
    pause,
    resume,
    stop,
    getAvailableVoices,
  } = useTextToSpeech({
    language: 'en-US',
    rate: 1,
    pitch: 1,
    volume: 1,
  });

  return (
    <>
      <button onClick={() => speak('Hello World')}>Speak</button>
      <button onClick={pause} disabled={!isSpeaking}>Pause</button>
      <button onClick={resume} disabled={!isPaused}>Resume</button>
      <button onClick={stop}>Stop</button>
      {isSpeaking && <p>Speaking...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `language` | string | `'en-US'` | Language code |
| `rate` | number | `1` | Speech speed (0.1 - 10) |
| `pitch` | number | `1` | Voice pitch (0 - 2) |
| `volume` | number | `1` | Volume level (0 - 1) |

#### Returned Properties & Methods

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `isSpeaking` | boolean | Whether audio is playing |
| `isPaused` | boolean | Whether playback is paused |
| `error` | string \| null | Any error message |
| `speak(text)` | function | Play text using speech synthesis |
| `pause()` | function | Pause speech playback |
| `resume()` | function | Resume paused playback |
| `stop()` | function | Stop and cancel speech |
| `changeLanguage(lang)` | function | Change synthesis language |
| `getAvailableVoices()` | function | Get array of available system voices |
| `setVoice(index)` | function | Select voice by index |

### 3. useWebSpeech Hook (Combined)

Combines both STT and TTS for complete voice interaction capabilities.

#### Usage

```javascript
import { useWebSpeech } from '../hooks';

function ChatWithVoice() {
  const speech = useWebSpeech({
    language: 'en-US',
    speechRate: 1,
    speechPitch: 1,
    speechVolume: 1,
    continuous: false,
  });

  const handleSendMessage = (message) => {
    // Send message to AI
    // Then speak the response
    speech.speak('This is the AI response');
  };

  const handleVoiceInput = () => {
    speech.startListening();
  };

  return (
    <>
      {speech.isListening && <p>🎤 Listening...</p>}
      {speech.isSpeaking && <p>🔊 Speaking...</p>}
      
      <button onClick={handleVoiceInput} disabled={speech.isListening}>
        🎤 Listen
      </button>
      <button onClick={() => speech.stopListening()}>Stop</button>
      
      {speech.transcript && <p>You said: {speech.transcript}</p>}
    </>
  );
}
```

#### Returned Properties & Methods

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `isListening` | boolean | STT active status |
| `isSpeaking` | boolean | TTS active status |
| `transcript` | string | Final recognized text |
| `interimTranscript` | string | Text being recognized |
| `isPaused` | boolean | Whether TTS is paused |
| `error` | string \| null | Any error message |
| `startListening()` | function | Begin listening |
| `stopListening()` | function | Stop listening |
| `speak(text)` | function | Speak text |
| `stopSpeech()` | function | Stop speaking |
| `pauseSpeech()` | function | Pause speech |
| `resumeSpeech()` | function | Resume paused speech |
| `resetTranscript()` | function | Clear text |
| `speakAndListen(text, autoListen)` | function | Speak then start listening |
| `listenAndStop()` | function | Stop speaking and start listening |
| `stopListeningAndSpeak(text)` | function | Stop listening and speak |
| `toggleListening()` | function | Switch between listening/not |
| `stopAll()` | function | Stop everything |
| `changeLanguage(lang)` | function | Change language for both |
| `getAvailableVoices()` | function | Get available voices |
| `setVoice(index)` | function | Select voice |

## Usage Examples

### Example 1: AI Chat with Voice Input/Output

```javascript
import { useWebSpeech } from '../hooks';
import { useState } from 'react';

export function AIChatWithVoice() {
  const [messages, setMessages] = useState([]);
  const speech = useWebSpeech({ language: 'en-US' });

  const handleVoiceMessage = async () => {
    speech.startListening();
    
    // Wait for user to finish speaking
    // Then send to AI API
    // Get response and speak it back
  };

  return (
    <>
      <div>
        {speech.isListening && <p>🎤 Listening...</p>}
        {speech.isSpeaking && <p>🔊 Speaking...</p>}
      </div>
      <button onClick={handleVoiceMessage} disabled={speech.isListening || speech.isSpeaking}>
        🎤 Send Voice Message
      </button>
      {speech.transcript && <p>You: {speech.transcript}</p>}
    </>
  );
}
```

### Example 2: Multilingual Support

```javascript
function MultilingualChat() {
  const [language, setLanguage] = useState('en-US');
  const speech = useWebSpeech({ language });

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    speech.changeLanguage(newLang);
  };

  return (
    <>
      <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
        <option value="en-US">English</option>
        <option value="es-ES">Spanish</option>
        <option value="fr-FR">French</option>
        <option value="de-DE">German</option>
      </select>
      {/* Voice controls */}
    </>
  );
}
```

### Example 3: Accessibility Features

```javascript
function AccessibleContent({ text }) {
  const tts = useTextToSpeech();

  return (
    <>
      <p>{text}</p>
      <button 
        onClick={() => tts.speak(text)}
        title="Read aloud (Screen Reader)"
      >
        🔊 Read Aloud
      </button>
      <button 
        onClick={tts.stop}
        disabled={!tts.isSpeaking}
      >
        ⏹️ Stop
      </button>
    </>
  );
}
```

## Browser Compatibility

| Browser | STT Support | TTS Support |
|---------|------------|------------|
| Chrome | ✓ Full | ✓ Full |
| Firefox | ✓ Limited | ✓ Full |
| Safari | ✓ Limited | ✓ Full |
| Edge | ✓ Full | ✓ Full |

The hooks include error handling for unsupported browsers.

## Supported Languages

Common language codes:
- `en-US` - English (US)
- `en-GB` - English (UK)
- `es-ES` - Spanish
- `fr-FR` - French
- `de-DE` - German
- `it-IT` - Italian
- `ja-JP` - Japanese
- `zh-CN` - Chinese (Simplified)
- `pt-BR` - Portuguese (Brazil)

## Error Handling

All hooks include error handling:

```javascript
const { error, speak } = useTextToSpeech();

if (error) {
  console.error('Speech API Error:', error);
  // Show error to user
}
```

## Performance Tips

1. **Avoid re-renders**: Memoize callback functions with `useCallback`
2. **Clean state**: Use `resetTranscript()` between conversations
3. **Language changes**: Only change language when needed
4. **Voice selection**: Cache available voices list

## Accessibility Considerations

- Always provide text-based alternatives
- Add visual indicators for listening/speaking states
- Support keyboard controls as well as voice
- Include clear error messages for users
- Test with screen readers

## Next Steps

These hooks are ready to be integrated into:
1. AI Chat Interface (Student UI)
2. Instructor Dashboard
3. Accessibility features
4. Assignment recording
5. Student feedback collection
