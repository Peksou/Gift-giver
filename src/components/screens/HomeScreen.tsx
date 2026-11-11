import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Participant, EditModal as EditModalType } from '../../types';
import { Snowfall, Avatar, ParticipantCard, EditModal, PhotoPicker } from '../ui';
import { globalStyles } from '../../styles';
import { COLORS, AVATAR_LIST, SNOWFALL_CONFIG } from '../../constants';
import { validateParticipantName } from '../../utils';

interface HomeScreenProps {
  participants: Participant[];
  newParticipantName: string;
  setNewParticipantName: (name: string) => void;
  selectedAvatarIndex: number | null;
  setSelectedAvatarIndex: (index: number | null) => void;
  customPhotoUri: string | null;
  setCustomPhotoUri: (uri: string | null) => void;
  budget: string;
  setBudget: (budget: string) => void;
  bounceAnim: any;
  onAvatarSelect: (index: number) => void;
  onAddParticipant: () => void;
  onEditParticipant: (id: string, newName: string, avatarIndex: number, customPhotoUri?: string) => void;
  onDeleteParticipant: (id: string) => void;
  onCreateSession: () => void;
  onResetAll: () => void;
}

export function HomeScreen({
  participants,
  newParticipantName,
  setNewParticipantName,
  selectedAvatarIndex,
  setSelectedAvatarIndex,
  customPhotoUri,
  setCustomPhotoUri,
  budget,
  setBudget,
  bounceAnim,
  onAvatarSelect,
  onAddParticipant,
  onEditParticipant,
  onDeleteParticipant,
  onCreateSession,
  onResetAll,
}: HomeScreenProps) {
  const [editModal, setEditModal] = useState<EditModalType>({ visible: false });

  const handlePhotoSelected = (uri: string) => {
    setCustomPhotoUri(uri);
    setSelectedAvatarIndex(null); // Désélectionner l'avatar si photo choisie
  };

  const handlePhotoRemoved = () => {
    setCustomPhotoUri(null);
  };

  const handleAvatarSelect = (index: number) => {
    onAvatarSelect(index);
    setCustomPhotoUri(null); // Désélectionner la photo si avatar choisi
  };

  const handleAddParticipant = () => {
    const error = validateParticipantName(
      newParticipantName, 
      participants.map(p => p.name)
    );
    
    if (error) {
      Alert.alert('Erreur', error);
      return;
    }
    
    // Vérifier qu'il y a soit un avatar soit une photo
    if (selectedAvatarIndex === null && !customPhotoUri) {
      Alert.alert('Erreur', 'Choisissez un avatar ou ajoutez une photo');
      return;
    }
    
    onAddParticipant();
  };

  const handleCreateSession = () => {
    if (participants.length < 3) {
      Alert.alert('Erreur', 'Minimum 3 participants');
      return;
    }
    onCreateSession();
  };

  const openEditModal = (id: string, name: string, avatarIndex: number, customPhotoUri?: string) => {
    setEditModal({ visible: true, id, name, avatarIndex, customPhotoUri });
  };

  const handleEditSave = (id: string, newName: string, avatarIndex: number, customPhotoUri?: string) => {
    onEditParticipant(id, newName, avatarIndex, customPhotoUri);
    setEditModal({ visible: false });
  };

  return (
    <LinearGradient colors={COLORS.GRADIENT} style={globalStyles.gradient}>
      <SafeAreaView style={globalStyles.container}>
        <Snowfall count={SNOWFALL_CONFIG.HOME_COUNT} />
        
        <FlatList
          ListHeaderComponent={
            <View>
              <View style={globalStyles.header}>
                <Text style={globalStyles.title}>
                  🎁 Gift Giver Deluxe – édition Noël 🎄
                </Text>
                <Text style={globalStyles.subtitle}>
                  Qui participera au tirage magique ? ✨{'\n'} 
                </Text>
              </View>

              <View style={globalStyles.card}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8, color: '#333' }}>
                  👤 Nom du participant
                </Text>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    borderColor: COLORS.PRIMARY,
                    borderWidth: 2,
                    marginBottom: 15,
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#333',
                  }}
                  placeholder="Entrez le nom..."
                  placeholderTextColor="#aaa"
                  value={newParticipantName}
                  onChangeText={setNewParticipantName}
                />

                {/* Avatars prédéfinis + bouton photo */}
                <Text style={{ fontWeight: 'bold', marginBottom: 6, textAlign: 'center' }}>
                  🎭 Choisissez un avatar ou ajoutez votre photo
                </Text>
                <FlatList
                  data={AVATAR_LIST}
                  horizontal
                  keyExtractor={(_, i) => 'av-' + i}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                  renderItem={({ item, index }) => (
                    <Avatar
                      source={item}
                      index={index}
                      isSelected={selectedAvatarIndex === index && !customPhotoUri}
                      bounceAnim={bounceAnim}
                      onSelect={handleAvatarSelect}
                    />
                  )}
                  ListFooterComponent={
                    <PhotoPicker
                      onPhotoSelected={handlePhotoSelected}
                      currentPhotoUri={customPhotoUri || undefined}
                      onPhotoRemoved={handlePhotoRemoved}
                    />
                  }
                />

                <TouchableOpacity 
                  style={[globalStyles.primaryButton, { backgroundColor: COLORS.PRIMARY }]} 
                  onPress={handleAddParticipant}
                >
                  <Text style={globalStyles.buttonText}>Ajouter le participant</Text>
                </TouchableOpacity>

                <Text style={{ fontWeight: 'bold', marginBottom: 6, fontSize: 16, color: '#333' }}>
                  💰 Budget pour chacun (€)
                </Text>
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    borderColor: COLORS.PRIMARY,
                    borderWidth: 2,
                    marginBottom: 15,
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#333',
                    textAlign: 'center',
                  }}
                  keyboardType="numeric"
                  placeholder="Alors, combien on met ?"
                  placeholderTextColor="#aaa"
                  value={budget}
                  onChangeText={setBudget}
                />

                <TouchableOpacity
                  style={[
                    globalStyles.primaryButton,
                    { paddingVertical: 18 },
                    participants.length < 3 && globalStyles.disabledButton
                  ]}
                  onPress={handleCreateSession}
                  disabled={participants.length < 3}
                >
                  <Text style={[
                    globalStyles.buttonText,
                    { fontSize: 20, fontWeight: 'bold' }
                  ]}>
                    {participants.length < 3
                      ? `Participants : ${participants.length}/3`
                      : '🎅 Lancer le tirage ! 🎄'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={globalStyles.secondaryButton} 
                  onPress={onResetAll}
                >
                  <Text style={globalStyles.buttonText}>♻️ Tout réinitialiser</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          data={participants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <ParticipantCard
              participant={item}
              onEdit={openEditModal}
              onDelete={onDeleteParticipant}
            />
          )}
        />

        <EditModal
          editModal={editModal}
          onSave={handleEditSave}
          onCancel={() => setEditModal({ visible: false })}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}