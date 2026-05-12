import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for Text-to-Speech (TTS) using Web Speech API
 * @param {Object} options - Configuration options
 * @param {string} options.language - Language code (e.g., 'en-US', 'es-ES')
 * @param {number} options.rate - Speed of speech (0.1 - 10, default 1)
 * @param {number} options.pitch - Pitch of voice (0 - 2, default 1)
 * @param {number} options.volume - Volume (0 - 1, default 1)
 * @returns {Object} Hook state and controls
 */
export const useTextToSpeech = (options = {}) => {
  const {
    language = 'en-US',
    rate = 1,
    pitch = 1,
    volume = 1,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  // Initialize Speech Synthesis API
  useEffect(() => {
    const synth = window.speechSynthesis;

    if (!synth) {
      setError('Speech Synthesis API not supported in this browser');
      return;
    }

    synthRef.current = synth;

    return () => {
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (text) => {
      if (!synthRef.current) {
        setError('Speech Synthesis API not initialized');
        return;
      }

      // Cancel any ongoing speech
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.language = language;
      utterance.rate = Math.max(0.1, Math.min(10, rate));
      utterance.pitch = Math.max(0, Math.min(2, pitch));
      utterance.volume = Math.max(0, Math.min(1, volume));

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setError(null);
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        setError(`Speech synthesis error: ${event.error}`);
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    },
    [language, rate, pitch, volume]
  );

  const pause = useCallback(() => {
    if (synthRef.current && synthRef.current.speaking && !synthRef.current.paused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (synthRef.current && synthRef.current.paused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  const changeLanguage = useCallback((newLanguage) => {
    // Language change will take effect on next speak call
    if (utteranceRef.current) {
      utteranceRef.current.language = newLanguage;
    }
  }, []);

  const getAvailableVoices = useCallback(() => {
    if (synthRef.current) {
      return synthRef.current.getVoices();
    }
    return [];
  }, []);

  const setVoice = useCallback((voiceIndex) => {
    if (utteranceRef.current && synthRef.current) {
      const voices = synthRef.current.getVoices();
      if (voiceIndex >= 0 && voiceIndex < voices.length) {
        utteranceRef.current.voice = voices[voiceIndex];
      }
    }
  }, []);

  return {
    isSpeaking,
    isPaused,
    error,
    speak,
    pause,
    resume,
    stop,
    changeLanguage,
    getAvailableVoices,
    setVoice,
  };
};

export default useTextToSpeech;
