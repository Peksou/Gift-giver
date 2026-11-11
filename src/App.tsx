import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Participant, ScreenType } from './types';
import { HomeScreen, ResultsScreen } from './components';
import { useAudio, useAnimations, useStorage, useDrawLogic } from './hooks';

export default function App() {
  // État principal de l'application
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(null);
  const [customPhotoUri, setCustomPhotoUri] = useState<string | null>(null);
  const [budget, setBudget] = useState('25');
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  // Hooks personnalisés
  const { playDrumroll, stopDrumroll, playTada, stopTada, toggleBackgroundMusic } = useAudio();
  const { 
    bounceAnim, 
    rowOpacities, 
    startSpin, 
    stopSpin, 
    animateBounce, 
    animateResultsReveal, 
    getSpinTransform 
  } = useAnimations();
  
  useStorage(participants, budget, setParticipants, setBudget);
  
  const {
    assignments,
    isDrawing,
    showConfetti,
    runDraw,
    resetSession,
  } = useDrawLogic(
    participants,
    playDrumroll,
    stopDrumroll,
    playTada,
    stopTada,
    startSpin,
    stopSpin,
    animateResultsReveal
  );

  // Gestionnaires d'événements
  const handleAvatarSelect = (index: number) => {
    setSelectedAvatarIndex(index);
    setCustomPhotoUri(null); // Désélectionner photo si avatar choisi
    animateBounce();
  };

  const handleAddParticipant = () => {
    const name = newParticipantName.trim();
    if (!name) return;
    
    // Vérifier qu'il y a soit un avatar soit une photo
    if (selectedAvatarIndex === null && !customPhotoUri) return;

    const newParticipant: Participant = {
      id: Date.now().toString(),
      name,
      avatarIndex: selectedAvatarIndex ?? 0,
      customPhotoUri: customPhotoUri || undefined,
    };

    setParticipants([...participants, newParticipant]);
    setNewParticipantName('');
    setSelectedAvatarIndex(null);
    setCustomPhotoUri(null);
  };

  const handleEditParticipant = (id: string, newName: string, avatarIndex: number, newCustomPhotoUri?: string) => {
    setParticipants(prev =>
      prev.map(p => (p.id === id ? { 
        ...p, 
        name: newName,
        avatarIndex,
        customPhotoUri: newCustomPhotoUri,
      } : p))
    );
  };

  const handleDeleteParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleCreateSession = () => {
      setCurrentScreen('results');
      // Lancer le tirage après un court délai pour permettre l'affichage de l'écran
      setTimeout(runDraw, 200);
  };

  const handleResetSession = () => {
    resetSession();
    setCurrentScreen('home');
  };

  const handleResetAll = () => {
    setParticipants([]);
    setNewParticipantName('');
    setSelectedAvatarIndex(null);
    setCustomPhotoUri(null);
    setBudget('25');
    resetSession();
    setCurrentScreen('home');
  };

  return (
    <>
      <StatusBar style="light" />
      {currentScreen === 'home' ? (
        <HomeScreen
          participants={participants}
          newParticipantName={newParticipantName}
          setNewParticipantName={setNewParticipantName}
          selectedAvatarIndex={selectedAvatarIndex}
          setSelectedAvatarIndex={setSelectedAvatarIndex}
          customPhotoUri={customPhotoUri}
          setCustomPhotoUri={setCustomPhotoUri}
          budget={budget}
          setBudget={setBudget}
          bounceAnim={bounceAnim}
          onAvatarSelect={handleAvatarSelect}
          onAddParticipant={handleAddParticipant}
          onEditParticipant={handleEditParticipant}
          onDeleteParticipant={handleDeleteParticipant}
          onCreateSession={handleCreateSession}
          onResetAll={handleResetAll}
        />
      ) : (
        <ResultsScreen
          assignments={assignments}
          budget={budget}
          isDrawing={isDrawing}
          showConfetti={showConfetti}
          rowOpacities={rowOpacities}
          spinTransform={getSpinTransform()}
          onRunDraw={runDraw}
          onResetSession={handleResetSession}
        />
      )}
    </>
  );
}