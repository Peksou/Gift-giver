import { useState, useRef } from 'react';
import { Vibration } from 'react-native';
import { Participant, Assignment } from '../types';
import { generateDerangement } from '../utils';
import { ANIMATION_DURATIONS } from '../constants';

export function useDrawLogic(
  participants: Participant[],
  playDrumroll: () => void,
  stopDrumroll: () => void,
  playTada: () => void,
  stopTada: () => void,
  startSpin: () => void,
  stopSpin: () => void,
  animateResultsReveal: (count: number, onComplete?: () => void) => void
) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Flag pour annuler les callbacks si on quitte
  const isSessionActiveRef = useRef(true);

  const runDraw = async () => {
    if (participants.length < 3) return;

    // Arrêter les sons en cours avant de relancer
    stopDrumroll();
    stopTada();
    
    // Marquer la session comme active
    isSessionActiveRef.current = true;

    // Réinitialisation
    setIsDrawing(true);
    setAssignments([]);
    setShowConfetti(false);

    // Effets audio et visuels
    await playDrumroll();
    startSpin();

    // Délai pour l'animation
    setTimeout(async () => {
      // Vérifier si la session est toujours active
      if (!isSessionActiveRef.current) return;
      
      const shuffled = generateDerangement(participants);
      const newAssignments = participants.map((giver, i) => ({
        giver,
        receiver: shuffled[i],
      }));
      
      setAssignments(newAssignments);

      // Animation des résultats
      animateResultsReveal(newAssignments.length, async () => {
        // Vérifier si la session est toujours active avant de jouer tada
        if (!isSessionActiveRef.current) return;
        
        stopSpin();
        setIsDrawing(false);
        await playTada();
        Vibration.vibrate(200);
        setShowConfetti(true);
      });
    }, ANIMATION_DURATIONS.DRAW_DELAY);
  };


  const resetSession = () => {
    // Annuler les callbacks en cours
    isSessionActiveRef.current = false;
    
    stopDrumroll(); // Arrêter le son drumroll si en cours
    stopTada(); // Arrêter le son tada si en cours
    stopSpin(); // Arrêter l'animation du dé
    setAssignments([]);
    setShowConfetti(false);
    setIsDrawing(false);
  };

  return {
    assignments,
    isDrawing,
    showConfetti,
    runDraw,
    resetSession,
  };
}