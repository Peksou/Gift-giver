import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Participant } from '../types';

const STORAGE_KEY = 'giftGiverData';

export function useStorage(
  participants: Participant[], 
  budget: string,
  setParticipants: (participants: Participant[]) => void,
  setBudget: (budget: string) => void
) {
  // Chargement des données sauvegardées
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const { participants: savedParticipants, budget: savedBudget } = JSON.parse(saved);
          setParticipants(savedParticipants || []);
          setBudget(savedBudget || '25');
        }
      } catch (error) {
        console.warn('Erreur lors du chargement des données:', error);
      }
    })();
  }, []);

  // Sauvegarde automatique des modifications
  useEffect(() => {
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