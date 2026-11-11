import { useRef, useEffect, useCallback } from 'react';
import { useAudioPlayer, AudioPlayer } from 'expo-audio';
import { SOUNDS } from '../constants';

export function useAudio() {
  // Players pour les effets sonores
  const drumrollPlayer = useAudioPlayer(SOUNDS.DRUMROLL);
  const tadaPlayer = useAudioPlayer(SOUNDS.TADA);
  
  // Player pour la musique de fond
  const backgroundPlayer = useAudioPlayer(SOUNDS.JINGLE_BELLS);
  const isMusicPlaying = useRef(false);

  // Démarrer la musique de fond au montage
  useEffect(() => {
    const startBackgroundMusic = async () => {
      try {
        backgroundPlayer.loop = true;
        backgroundPlayer.volume = 0.3;
        backgroundPlayer.play();
        isMusicPlaying.current = true;
      } catch (error) {
        console.warn('Erreur démarrage musique de fond:', error);
      }
    };

    startBackgroundMusic();

    return () => {
      backgroundPlayer.remove();
      drumrollPlayer.remove();
      tadaPlayer.remove();
    };
  }, []);

  // Jouer le son drumroll
  const playDrumroll = useCallback(async () => {
    try {
      drumrollPlayer.seekTo(0);
      drumrollPlayer.play();
    } catch (error) {
      console.warn('Erreur lecture drumroll:', error);
    }
  }, [drumrollPlayer]);

  // Arrêter le son drumroll
  const stopDrumroll = useCallback(async () => {
    try {
      drumrollPlayer.pause();
      drumrollPlayer.seekTo(0);
    } catch (error) {
      console.warn('Erreur arrêt drumroll:', error);
    }
  }, [drumrollPlayer]);

  // Jouer le son tada
  const playTada = useCallback(async () => {
    try {
      tadaPlayer.seekTo(0);
      tadaPlayer.play();
    } catch (error) {
      console.warn('Erreur lecture tada:', error);
    }
  }, [tadaPlayer]);

  // Arrêter le son tada
  const stopTada = useCallback(async () => {
    try {
      tadaPlayer.pause();
      tadaPlayer.seekTo(0);
    } catch (error) {
      console.warn('Erreur arrêt tada:', error);
    }
  }, [tadaPlayer]);

  // Toggle musique de fond
  const toggleBackgroundMusic = useCallback(async () => {
    try {
      if (isMusicPlaying.current) {
        backgroundPlayer.pause();
        isMusicPlaying.current = false;
      } else {
        backgroundPlayer.play();
        isMusicPlaying.current = true;
      }
    } catch (error) {
      console.warn('Erreur toggle musique:', error);
    }
  }, [backgroundPlayer]);

  // Vérification périodique de la musique
  const ensureMusicPlaying = useCallback(async () => {
    try {
      if (isMusicPlaying.current && !backgroundPlayer.playing) {
        backgroundPlayer.play();
      }
    } catch (error) {
      console.warn('Erreur vérification musique:', error);
    }
  }, [backgroundPlayer]);

  // Vérification périodique (toutes les 3 secondes)
  useEffect(() => {
    const interval = setInterval(ensureMusicPlaying, 3000);
    return () => clearInterval(interval);
  }, [ensureMusicPlaying]);

  return {
    playDrumroll,
    stopDrumroll,
    playTada,
    stopTada,
    toggleBackgroundMusic,
  };
}