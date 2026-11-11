import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Assignment } from '../../types';
import { Snowfall, AssignmentCard, ShareCapture } from '../ui';
import { globalStyles } from '../../styles';
import { COLORS, SCREEN_WIDTH, SNOWFALL_CONFIG, CONFETTI_CONFIG } from '../../constants';

interface ResultsScreenProps {
  assignments: Assignment[];
  budget: string;
  isDrawing: boolean;
  showConfetti: boolean;
  rowOpacities: React.MutableRefObject<Animated.Value[]>;
  spinTransform: any;
  onRunDraw: () => void;
  onResetSession: () => void;
}

export function ResultsScreen({
  assignments,
  budget,
  isDrawing,
  showConfetti,
  rowOpacities,
  spinTransform,
  onRunDraw,
  onResetSession,
}: ResultsScreenProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  const shareResult = async () => {
    setShowShareModal(true);
  };

  return (
    <LinearGradient colors={COLORS.GRADIENT} style={globalStyles.gradient}>
      <SafeAreaView style={globalStyles.container}>
        <Snowfall count={SNOWFALL_CONFIG.RESULTS_COUNT} />
        
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ flex: 1 }}>
            <View style={globalStyles.header}>
              <Text style={globalStyles.title}>🎅 Résultats du Tirage 🎄</Text>

              <Text style={globalStyles.subtitle}>
                Budget par personne: <Text style={globalStyles.bold}>{budget}€</Text>
              </Text>
            </View>

            <View style={globalStyles.card}>
              <Text style={globalStyles.sectionTitle}>🎁 Qui offre à qui ?</Text>

              {isDrawing && (
                <View style={globalStyles.loadingContainer}>
                  <Animated.Text style={[{ fontSize: 60 }, spinTransform]}>
                    🎲
                  </Animated.Text>
                  <Text style={{ fontSize: 18, marginTop: 10 }}>
                    Tirage en cours…
                  </Text>
                </View>
              )}

              {assignments.length > 0 && (
                <View>
                  {assignments.map((assignment, index) => (
                    <AssignmentCard
                      key={`${assignment.giver.id}-${assignment.receiver.id}`}
                      assignment={assignment}
                      opacity={rowOpacities.current[index] || new Animated.Value(1)}
                    />
                  ))}
                </View>
              )}

              <TouchableOpacity 
                style={globalStyles.primaryButton} 
                onPress={onRunDraw}
              >
                <Text style={globalStyles.buttonText}>
                  {isDrawing ? 'Tirage en cours…' : '🎲 Relancer le tirage'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.secondaryButton}
                onPress={shareResult}
                disabled={assignments.length === 0}
              >
                <Text style={globalStyles.buttonText}>📸 Partager le tirage</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[globalStyles.secondaryButton, { backgroundColor: COLORS.GRAY }]}
                onPress={onResetSession}
              >
                <Text style={globalStyles.buttonText}>🔁 Nouvelle session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* 🎉 Confettis en overlay PLEIN ÉCRAN */}
        {showConfetti && (
          <ConfettiCannon
            count={CONFETTI_CONFIG.COUNT}
            origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
            explosionSpeed={CONFETTI_CONFIG.EXPLOSION_SPEED}
            fallSpeed={CONFETTI_CONFIG.FALL_SPEED}
            fadeOut={CONFETTI_CONFIG.FADE_OUT}
          />
        )}

        {/* Composant de partage */}
        <ShareCapture
          assignments={assignments}
          budget={budget}
          isVisible={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}