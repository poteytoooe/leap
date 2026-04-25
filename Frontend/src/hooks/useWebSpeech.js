import { useState, useCallback } from 'react';
import { useSpeechToText } from './useSpeechToText';
import { useTextToSpeech } from './useTextToSpeech';

/**
 * Combined hook for Speech-to-Text and Text-to-Speech
 * Useful for voice chat, accessibility features, and verbal interactions
 * @param {Object} options - Configuration options
 * @param {string} options.language - Language code (e.g., 'en-US', 'es-ES')
 * @param {number} options.speechRate - Speed of speech (0.1 - 10, default 1)
 * @param {number} options.speechPitch - Pitch of voice (0 - 2, default 1)
 * @param {number} options.speechVolume - Volume (0 - 1, default 1)
 * @param {boolean} options.continuous - Keep recording until stop is called
 * @returns {Object} Combined hook state and controls
 */
export const useWebSpeech = (options = {}) => {
  const {
    language = 'en-US',
    speechRate = 1,
    speechPitch = 1,
    speechVolume = 1,
    continuous = false,
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize STT
  const stt = useSpeechToText({
    language,
    continuous,
    interimResults: true,
  });

  // Initialize TTS
  const tts = useTextToSpeech({
    language,
    rate: speechRate,
    pitch: speechPitch,
    volume: speechVolume,
  });

  // Utility: Speak a response and optionally start listening
  const speakAndListen = useCallback(
    (text, autoListen = false) => {
      tts.speak(text);
      
      if (autoListen) {
        // Wait for speech to start before starting to listen
        setTimeout(() => {
          stt.startListening();
        }, 500);
      }
    },
    [tts, stt]
  );

  // Utility: Start listening and stop speaking
  const listenAndStop = useCallback(() => {
    tts.stop();
    stt.startListening();
  }, [tts, stt]);

  // Utility: Stop listening and start speaking
  const stopListeningAndSpeak = useCallback((text) => {
    stt.stopListening();
    tts.speak(text);
  }, [stt, tts]);

  // Utility: Toggle between listening and speaking
  const toggleListening = useCallback(() => {
    if (stt.isListening) {
      stt.stopListening();
    } else {
      stt.startListening();
    }
  }, [stt]);

  // Utility: Stop all speech
  const stopAll = useCallback(() => {
    stt.stopListening();
    tts.stop();
    setIsProcessing(false);
  }, [stt, tts]);

  // Utility: Change language for both STT and TTS
  const changeLanguage = useCallback(
    (newLanguage) => {
      stt.changeLanguage(newLanguage);
      tts.changeLanguage(newLanguage);
    },
    [stt, tts]
  );

  return {
    // STT properties
    isListening: stt.isListening,
    transcript: stt.transcript,
    interimTranscript: stt.interimTranscript,
    
    // TTS properties
    isSpeaking: tts.isSpeaking,
    isPaused: tts.isPaused,
    
    // Combined state
    isProcessing,
    error: stt.error || tts.error,
    
    // STT methods
    startListening: stt.startListening,
    stopListening: stt.stopListening,
    resetTranscript: stt.resetTranscript,
    
    // TTS methods
    speak: tts.speak,
    pauseSpeech: tts.pause,
    resumeSpeech: tts.resume,
    stopSpeech: tts.stop,
    getAvailableVoices: tts.getAvailableVoices,
    setVoice: tts.setVoice,
    
    // Utility methods
    speakAndListen,
    listenAndStop,
    stopListeningAndSpeak,
    toggleListening,
    stopAll,
    changeLanguage,
  };
};

export default useWebSpeech;
