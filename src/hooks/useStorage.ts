import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Participant } from '../types';
import { AVATAR_LIST } from '../constants';

const STORAGE_KEY = 'giftGiverData';

function isParticipant(value: unknown): value is Participant {
  if (!value || typeof value !== 'object') return false;

  const participant = value as Partial<Participant>;
  const photoUri = participant.customPhotoUri;
  const isLocalPhoto = photoUri === undefined || (
    typeof photoUri === 'string' &&
    photoUri.length <= 4096 &&
    ['file://', 'content://', 'ph://', 'assets-library://'].some(prefix => photoUri.startsWith(prefix))
  );

  return typeof participant.id === 'string' &&
    typeof participant.name === 'string' &&
    typeof participant.avatarIndex === 'number' &&
    Number.isInteger(participant.avatarIndex) &&
    participant.avatarIndex >= 0 &&
    participant.avatarIndex < AVATAR_LIST.length &&
    isLocalPhoto;
}

export function useStorage(
  participants: Participant[],
  budget: string,
  setParticipants: (participants: Participant[]) => void,
  setBudget: (budget: string) => void
) {
  const isLoaded = useRef(false);

  // Chargement des données sauvegardées
  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            const data = parsed as { participants?: unknown; budget?: unknown };
            const savedParticipants = Array.isArray(data.participants)
              ? data.participants.filter(isParticipant)
              : [];

            if (isActive) {
              setParticipants(savedParticipants);
              setBudget(typeof data.budget === 'string' ? data.budget : '25');
            }
          }
        }
      } catch (error) {
        console.warn('Erreur lors du chargement des données:', error);
      } finally {
        if (isActive) isLoaded.current = true;
      }
    })();

    return () => {
      isActive = false;
    };
  }, [setParticipants, setBudget]);

  // Sauvegarde automatique des modifications
  useEffect(() => {
    if (!isLoaded.current) return;

    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ participants, budget }));
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde:', error);
      }
    })();
  }, [participants, budget]);

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Erreur lors de la suppression des données:', error);
    }
  };

  return {
    clearStorage,
  };
}