import { useRef, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';
import { SOUNDS } from '../constants';

export function useAudio() {
  const drumSound = useRef<Audio.Sound | null>(null);
  const tadaSound = useRef<Audio.Sound | null>(null);
  const backgroundSound = useRef<Audio.Sound | null>(null);

  // Préchargement des sons au démarrage
  useEffect(() => {
    (async () => {
      const { drum, tada } = await preloadSounds();
      drumSound.current = drum;
      tadaSound.current = tada;
    })();

    // Déchargement à la fermeture
    return () => {
      drumSound.current?.unloadAsync();
      tadaSound.current?.unloadAsync();
    };
  }, []);

  // Musique de fond (Noël)
  useEffect(() => {
    let backgroundMusicSound: Audio.Sound;
    
    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          SOUNDS.JINGLE_BELLS,
          { 
            isLooping: true,
            volume: 0.3 // Volume plus bas pour la musique de fond
          }
        );
        backgroundMusicSound = sound;
        backgroundSound.current = sound;
        await sound.playAsync();
      } catch (error) {
        console.warn('Erreur chargement musique de fond:', error);
      }
    })();

    return () => {
      if (backgroundMusicSound) {
        backgroundMusicSound.unloadAsync();
      }
      backgroundSound.current?.unloadAsync();
    };
  }, []);

  async function preloadSounds() {
    const drum = new Audio.Sound();
    const tada = new Audio.Sound();
    await drum.loadAsync(SOUNDS.DRUMROLL);
    await tada.loadAsync(SOUNDS.TADA);
    return { drum, tada };
  }

  async function playSound(soundRef: React.MutableRefObject<Audio.Sound | null>) {
    try {
      const sound = soundRef.current;
      if (!sound) return;
      
      // Vérifier le statut avant de jouer
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        // Arrêter et remettre à zéro avant de rejouer
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }
    } catch (e) {
      console.warn('Erreur son', e);
      // En cas d'erreur, recharger le son
      await reloadSound(soundRef);
    }
  }

  async function reloadSound(soundRef: React.MutableRefObject<Audio.Sound | null>) {
    try {
      const sound = soundRef.current;
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Recharger selon le type de son
      if (soundRef === drumSound) {
        const newSound = new Audio.Sound();
        await newSound.loadAsync(SOUNDS.DRUMROLL);
        drumSound.current = newSound;
      } else if (soundRef === tadaSound) {
        const newSound = new Audio.Sound();
        await newSound.loadAsync(SOUNDS.TADA);
        tadaSound.current = newSound;
      }
    } catch (error) {
      console.warn('Erreur lors du rechargement du son', error);
    }
  }

  const playDrumroll = () => playSound(drumSound);
  const playTada = () => playSound(tadaSound);

  const toggleBackgroundMusic = async () => {
    try {
      const sound = backgroundSound.current;
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
        }
      }
    } catch (error) {
      console.warn('Erreur toggle musique:', error);
    }
  };

  // Fonction pour redémarrer automatiquement la musique si elle s'arrête
  const ensureMusicPlaying = useCallback(async () => {
    try {
      const sound = backgroundSound.current;
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded && !status.isPlaying && !status.didJustFinish) {
          console.log('🔄 Redémarrage automatique de la musique...');
          await sound.playAsync();
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification de la musique:', error);
    }
  }, []);

  // Vérification périodique de la musique (toutes les 3 secondes)
  useEffect(() => {
    const interval = setInterval(ensureMusicPlaying, 3000);
    return () => clearInterval(interval);
  }, [ensureMusicPlaying]);

  return {
    playDrumroll,
    playTada,
    toggleBackgroundMusic,
  };
}