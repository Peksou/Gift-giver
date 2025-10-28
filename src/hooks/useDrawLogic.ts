import { useState } from 'react';
import { Vibration } from 'react-native';
import { Participant, Assignment } from '../types';
import { generateDerangement, generateSessionCode } from '../utils';
import { ANIMATION_DURATIONS } from '../constants';

export function useDrawLogic(
  participants: Participant[],
  playDrumroll: () => void,
  playTada: () => void,
  startSpin: () => void,
  stopSpin: () => void,
  animateResultsReveal: (count: number, onComplete?: () => void) => void
) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [sessionCode, setSessionCode] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const runDraw = async () => {
    if (participants.length < 3) return;

    // Réinitialisation
    setIsDrawing(true);
    setAssignments([]);
    setShowConfetti(false);

    // Effets audio et visuels
    await playDrumroll();
    startSpin();

    // Délai pour l'animation
    setTimeout(async () => {
      const shuffled = generateDerangement(participants);
      const newAssignments = participants.map((giver, i) => ({
        giver,
        receiver: shuffled[i],
      }));
      
      setAssignments(newAssignments);

      // Animation des résultats
      animateResultsReveal(newAssignments.length, async () => {
        stopSpin();
        setIsDrawing(false);
        await playTada();
        Vibration.vibrate(200);
        setShowConfetti(true);
      });
    }, ANIMATION_DURATIONS.DRAW_DELAY);
  };

  const createSession = () => {
    if (participants.length < 3) return false;
    
    const code = generateSessionCode();
    setSessionCode(code);
    setAssignments([]);
    setShowConfetti(false);
    setIsDrawing(false);
    
    return true;
  };

  const resetSession = () => {
    setAssignments([]);
    setSessionCode('');
    setShowConfetti(false);
    setIsDrawing(false);
  };

  return {
    assignments,
    sessionCode,
    isDrawing,
    showConfetti,
    runDraw,
    createSession,
    resetSession,
  };
}