import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for Speech-to-Text (STT) using Web Speech API
 * @param {Object} options - Configuration options
 * @param {string} options.language - Language code (e.g., 'en-US', 'es-ES')
 * @param {boolean} options.continuous - Keep recording until stop is called
 * @param {boolean} options.interimResults - Return interim results during recording
 * @returns {Object} Hook state and controls
 */
export const useSpeechToText = (options = {}) => {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech Recognition API not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.language = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);
      setTranscript(finalTranscriptRef.current.trim());
    };

    recognition.onerror = (event) => {
      let errorMessage = `Speech recognition error: ${event.error}`;
      
      // Provide helpful error messages
      if (event.error === 'not-allowed') {
        errorMessage = '🎤 Microphone permission denied. Check your browser settings to allow microphone access for this site.';
      } else if (event.error === 'no-speech') {
        errorMessage = '🎤 No speech detected. Please try again or check if your microphone is working.';
      } else if (event.error === 'network') {
        errorMessage = '🌐 Network error. Please check your internet connection.';
      } else if (event.error === 'service-not-allowed') {
        errorMessage = '🔒 Speech recognition service not allowed. This may be a browser security setting.';
      }
      
      setError(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, continuous, interimResults]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      finalTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');
      setError(null);
      recognitionRef.current.start();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    finalTranscriptRef.current = '';
    setError(null);
  }, []);

  const changeLanguage = useCallback((newLanguage) => {
    if (recognitionRef.current) {
      recognitionRef.current.language = newLanguage;
    }
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    changeLanguage,
  };
};

export default useSpeechToText;
