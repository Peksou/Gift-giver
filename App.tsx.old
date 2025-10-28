import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
  Image,
  Animated,
  Easing,
  Vibration,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

// Types
interface Participant {
  id: string;
  name: string;
  avatarIndex: number;
}

interface Assignment {
  giver: Participant;
  receiver: Participant;
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ❄️ Composant Neige
function Snowfall({ count = 25 }: { count?: number }) {
  const flakes = Array.from({ length: count }, (_, i) => i);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {flakes.map((i) => {
        const x = Math.random() * SCREEN_W;
        const start = -Math.random() * SCREEN_H;
        const y = useRef(new Animated.Value(start)).current;
        const size = 10 + Math.round(Math.random() * 10);
        const duration = 5000 + Math.random() * 4000;

        useEffect(() => {
          const anim = Animated.loop(
            Animated.sequence([
              Animated.timing(y, { toValue: SCREEN_H + 40, duration, easing: Easing.linear, useNativeDriver: true }),
              Animated.timing(y, { toValue: start, duration: 0, useNativeDriver: true }),
            ])
          );
          anim.start();
          return () => anim.stop();
        }, []);

        return (
          <Animated.Text
            key={i}
            style={{
              position: 'absolute',
              left: x,
              transform: [{ translateY: y }],
              opacity: 0.8,
              fontSize: size,
            }}
          >
            ❄️
          </Animated.Text>
        );
      })}
    </View>
  );
}

// 🔄 Dérangement (aucun participant ne se tire lui-même)
function generateDerangement<T>(array: T[]): T[] {
  let result = [...array];
  let attempts = 0;
  do {
    result = [...array].sort(() => Math.random() - 0.5);
    attempts++;
  } while (result.some((item, i) => item === array[i]) && attempts < 1000);

  if (result.some((item, i) => item === array[i])) {
    for (let i = 0; i < result.length; i++) {
      if (result[i] === array[i]) {
        const j = (i + 1) % result.length;
        [result[i], result[j]] = [result[j], result[i]];
      }
    }
  }
  return result;
}

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(null);
  const [budget, setBudget] = useState('25');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [sessionCode, setSessionCode] = useState('');
  const [currentScreen, setCurrentScreen] = useState<'home' | 'results'>('home');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const spinAnim = useRef(new Animated.Value(0)).current;
  const spinLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const rowOpacities = useRef<Animated.Value[]>([]);
  const captureRootRef = useRef<View>(null);
  const [editModal, setEditModal] = useState<{ visible: boolean; id?: string; name?: string }>({ visible: false });
  const [editName, setEditName] = useState('');

  // --- Refs sons
  const drumSound = useRef<Audio.Sound | null>(null);
  const tadaSound = useRef<Audio.Sound | null>(null);
  const backgroundSound = useRef<Audio.Sound | null>(null);

  // --- Préchargement des sons au démarrage
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

  // --- Données sauvegardées
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('giftGiverData');
      if (saved) {
        const { participants, budget } = JSON.parse(saved);
        setParticipants(participants || []);
        setBudget(budget || '25');
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('giftGiverData', JSON.stringify({ participants, budget }));
  }, [participants, budget]);

  const avatarList = [
    require('./assets/avatars/avatar01.png'),
    require('./assets/avatars/avatar02.png'),
    require('./assets/avatars/avatar03.png'),
    require('./assets/avatars/avatar04.png'),
    require('./assets/avatars/avatar05.png'),
    require('./assets/avatars/avatar06.png'),
    require('./assets/avatars/avatar07.png'),
    require('./assets/avatars/avatar08.png'),
    require('./assets/avatars/avatar09.png'),
    require('./assets/avatars/avatar10.png'),
    require('./assets/avatars/avatar11.png'),
    require('./assets/avatars/avatar12.png'),
  ];

  // --- Avatars et participants
  const handleAvatarSelect = (i: number) => {
    setSelectedAvatarIndex(i);
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 1.2, duration: 120, useNativeDriver: true }),
      Animated.spring(bounceAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const addParticipant = () => {
    const name = newParticipantName.trim();
    if (!name) return Alert.alert('Erreur', 'Entrez un nom');
    if (selectedAvatarIndex === null) return Alert.alert('Erreur', 'Choisissez un avatar');
    if (participants.some((p) => p.name.toLowerCase() === name.toLowerCase()))
      return Alert.alert('Erreur', 'Nom déjà utilisé');

    const newP: Participant = { id: Date.now().toString(), name, avatarIndex: selectedAvatarIndex };
    setParticipants([...participants, newP]);
    setNewParticipantName('');
    setSelectedAvatarIndex(null);
  };

  const openEditModal = (id: string, currentName: string) => {
    setEditModal({ visible: true, id, name: currentName });
    setEditName(currentName);
  };

  const deleteParticipant = (id: string) =>
    setParticipants((prev) => prev.filter((p) => p.id !== id));

  // 🔊 Préchargement & lecture fiable (Expo SDK 52+)
  async function preloadSounds() {
    const drum = new Audio.Sound();
    const tada = new Audio.Sound();
    await drum.loadAsync(require('./assets/sounds/drumroll.mp3'));
    await tada.loadAsync(require('./assets/sounds/tada.mp3'));
    return { drum, tada };
  }

  async function playSound(soundRef: React.MutableRefObject<Audio.Sound | null>) {
    try {
      const sound = soundRef.current;
      if (!sound) return;
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) await sound.loadAsync();
      await sound.replayAsync();
    } catch (e) {
      console.warn('Erreur son', e);
    }
  }

  // --- Musique de fond (Noël)
  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/sounds/Jingle_Bells.mp3'),
        { isLooping: true }
      );
      backgroundSound.current = sound;
      await sound.playAsync();
    })();

    return () => {
      backgroundSound.current?.unloadAsync();
    };
  }, [currentScreen]);

  // --- Tirage
  const runDraw = async () => {
    if (participants.length < 3) return;

    spinLoopRef.current?.stop();
    spinAnim.stopAnimation();
    spinAnim.setValue(0);
    setIsDrawing(true);
    setAssignments([]);
    setShowConfetti(false);

    // Jouer le roulement
    await playSound(drumSound);

    // spinner
    spinLoopRef.current = Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })
    );
    spinLoopRef.current.start();

    setTimeout(async () => {
      const shuffled = generateDerangement(participants);
      const newAssign = participants.map((giver, i) => ({
        giver,
        receiver: shuffled[i],
      }));
      setAssignments(newAssign);

      rowOpacities.current = newAssign.map(() => new Animated.Value(0));
      Animated.stagger(
        150,
        rowOpacities.current.map((v) =>
          Animated.timing(v, { toValue: 1, duration: 400, useNativeDriver: true })
        )
      ).start(async () => {
        spinLoopRef.current?.stop();
        spinAnim.stopAnimation();
        setIsDrawing(false);
        await playSound(tadaSound);
        Vibration.vibrate(200);
        setShowConfetti(true);
      });
    }, 1800);
  };

  // --- Créer la session -> lance directement le tirage
  const createSession = () => {
    if (participants.length < 3) return Alert.alert('Erreur', 'Minimum 3 participants');
    const code = 'GG' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setSessionCode(code);
    setAssignments([]);
    setShowConfetti(false);
    setIsDrawing(false);
    setCurrentScreen('results');
    // on attend un frame pour rendre l'écran puis on lance le tirage
    setTimeout(runDraw, 200);
  };

  // --- Capture + partage
  const shareResult = async () => {
    try {
      // s'assure que tout est rendu
      await new Promise((res) => setTimeout(res, 300));
      // IMPORTANT: passer la ref React, et demander un fichier temporaire
      const uri = await captureRef(captureRootRef, { format: 'png', quality: 0.9, result: 'tmpfile' });
      await Sharing.shareAsync(uri);
    } catch (err) {
      console.error('Capture error', err);
      Alert.alert('Erreur', 'Impossible de partager le tirage.');
    }
  };

  // --- Reset
  const resetSession = async () => {
    setAssignments([]);
    setSessionCode('');
    setIsDrawing(false);
    setShowConfetti(false);
    spinLoopRef.current?.stop();
    setCurrentScreen('home');
    await AsyncStorage.removeItem('giftGiverData');
  };

  const resetAll = () => {
    setParticipants([]);
    setBudget('25');
    resetSession();
  };

  const spinnerRotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // --- UI Résultats
  if (currentScreen === 'results') {
    return (
      <LinearGradient colors={['#B30000', '#FFD700']} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <ScrollView
            ref={captureRootRef}
            collapsable={false}
            style={{ flexGrow: 1 }}
            contentContainerStyle={{ paddingBottom: 60 }}
          >
            <StatusBar barStyle="light-content" backgroundColor="#B30000" />
            <Snowfall count={24} />

            <View style={styles.header}>
              <Text style={styles.title}>🎁 Gift Giver Noël</Text>
              <Text style={styles.subtitle}>Session {sessionCode}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sessionInfo}>
                Budget : <Text style={styles.bold}>{budget}€</Text>
              </Text>

              <Text style={styles.sectionTitle}>🎯 Résultats</Text>

              {isDrawing ? (
                <View style={styles.loadingContainer}>
                  <Animated.View style={{ transform: [{ rotate: spinnerRotation }] }}>
                    <Text style={{ fontSize: 40 }}>🎲</Text>
                  </Animated.View>
                  <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Tirage en cours...</Text>
                </View>
              ) : assignments.length === 0 ? (
                <Text style={{ marginBottom: 10 }}>Lancez le tirage pour voir les résultats.</Text>
              ) : (
                <View style={{ gap: 8 }}>
                  {assignments.map((a, i) => (
                    <Animated.View
                      key={i}
                      style={{
                        opacity: rowOpacities.current[i] ?? 1,
                        transform: [
                          {
                            scale: (rowOpacities.current[i] ?? new Animated.Value(1)).interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.95, 1],
                            }),
                          },
                        ],
                      }}
                    >
                      <View style={styles.assignmentItem}>
                        <Image
                          source={avatarList[a.giver.avatarIndex]}
                          style={styles.avatarImageSmall}
                        />
                        <Text style={styles.assignmentText}>
                          {a.giver.name} ➡️ {a.receiver.name}
                        </Text>
                        <Image
                          source={avatarList[a.receiver.avatarIndex]}
                          style={styles.avatarImageSmall}
                        />
                      </View>
                    </Animated.View>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.primaryButton} onPress={runDraw}>
                <Text style={styles.buttonText}>
                  {isDrawing ? 'Tirage en cours…' : '🎲 Relancer le tirage'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={shareResult}
                disabled={assignments.length === 0}
              >
                <Text style={styles.buttonText}>📸 Partager le tirage</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { backgroundColor: '#6b7280' }]}
                onPress={resetSession}
              >
                <Text style={styles.buttonText}>🔁 Nouvelle session</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* 🎉 Confettis en overlay PLEIN ÉCRAN */}
          {showConfetti && (
            <ConfettiCannon
              count={180}
              origin={{ x: SCREEN_W / 2, y: 0 }}
              explosionSpeed={350}
              fallSpeed={3000}
              fadeOut={false}
            />
          )}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // --- UI Accueil
  return (
    <LinearGradient colors={['#B30000', '#FFD700']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <Snowfall count={20} />
        <FlatList
          ListHeaderComponent={
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>🎁 Gift Giver Deluxe – édition Noël 🎄</Text>
                <Text style={styles.subtitle}>Créez votre tirage magique ✨{'\n'}qui participe ?</Text>
              </View>

              <View style={styles.card}>
                <TextInput
                  style={styles.input}
                  placeholder="Nom du participant"
                  value={newParticipantName}
                  onChangeText={setNewParticipantName}
                />

                <FlatList
                  data={avatarList}
                  horizontal
                  keyExtractor={(_, i) => 'av-' + i}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => handleAvatarSelect(index)}>
                      <Animated.View
                        style={[
                          styles.avatarWrapper,
                          selectedAvatarIndex === index && styles.selectedAvatar,
                          { transform: [{ scale: selectedAvatarIndex === index ? bounceAnim : 1 }] },
                        ]}
                      >
                        <Image source={item} style={styles.avatarImage} />
                      </Animated.View>
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity style={styles.addButton} onPress={addParticipant}>
                  <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>

                <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Budget pour chacun (en €)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={budget}
                  onChangeText={setBudget}
                />

                <TouchableOpacity
                  style={[styles.primaryButton, participants.length < 3 && styles.disabledButton]}
                  onPress={createSession}
                  disabled={participants.length < 3}
                >
                  <Text style={styles.buttonText}>
                    {participants.length < 3
                      ? `Participants : ${participants.length}/3`
                      : 'Créer la session et lancer 🎅'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={resetAll}>
                  <Text style={styles.buttonText}>♻️ Tout réinitialiser</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          data={participants}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.participantItem}>
              <Image source={avatarList[item.avatarIndex]} style={styles.avatarImageSmall} />
              <Text style={styles.participantName}>{item.name}</Text>
              <View style={{ flexDirection: 'row', marginLeft: 'auto', gap: 8 }}>
                <TouchableOpacity onPress={() => openEditModal(item.id, item.name)} style={styles.iconBtn}>
                  <Text>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteParticipant(item.id)} style={styles.iconBtn}>
                  <Text>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Modal d'édition */}
        {editModal.visible && (
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Modifier le nom</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Nouveau nom"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={[styles.primaryButton, { flex: 1, marginRight: 5 }]}
                  onPress={() => {
                    const t = editName.trim();
                    if (!t) return;
                    setParticipants((prev: Participant[]) =>
                      prev.map((p: Participant) => (p.id === editModal.id ? { ...p, name: t } : p))
                    );
                    setEditModal({ visible: false });
                  }}
                >
                  <Text style={styles.buttonText}>Valider</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.secondaryButton, { flex: 1, marginLeft: 5 }]}
                  onPress={() => setEditModal({ visible: false })}
                >
                  <Text style={styles.buttonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  header: { alignItems: 'center', paddingVertical: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'white', textAlign: 'center' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  card: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 20, padding: 20, margin: 20 },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: Platform.OS === 'ios' ? 12 : 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
  },
  addButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 10, marginVertical: 10, alignItems: 'center' },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  avatarWrapper: { marginRight: 10, borderRadius: 50, borderWidth: 2, borderColor: '#ddd', overflow: 'hidden' },
  avatarImage: { width: 60, height: 60, borderRadius: 30 },
  avatarImageSmall: { width: 40, height: 40, borderRadius: 20 },
  selectedAvatar: { borderColor: '#4CAF50', borderWidth: 3 },
  primaryButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  secondaryButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  disabledButton: { backgroundColor: '#aaa' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  iconBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  participantName: { fontSize: 16, marginLeft: 10 },
  assignmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    padding: 10,
    borderRadius: 10,
  },
  assignmentText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  sessionInfo: { fontSize: 16, color: '#333', marginBottom: 10 },
  bold: { fontWeight: 'bold' },
  loadingContainer: { alignItems: 'center', marginVertical: 20 },
  modalContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});
