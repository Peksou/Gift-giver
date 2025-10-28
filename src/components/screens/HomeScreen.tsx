import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Participant, EditModal as EditModalType } from '../../types';
import { Snowfall, Avatar, ParticipantCard, EditModal } from '../ui';
import { globalStyles } from '../../styles';
import { COLORS, AVATAR_LIST, SNOWFALL_CONFIG } from '../../constants';
import { validateParticipantName } from '../../utils';

interface HomeScreenProps {
  participants: Participant[];
  newParticipantName: string;
  setNewParticipantName: (name: string) => void;
  selectedAvatarIndex: number | null;
  setSelectedAvatarIndex: (index: number | null) => void;
  budget: string;
  setBudget: (budget: string) => void;
  bounceAnim: any;
  onAvatarSelect: (index: number) => void;
  onAddParticipant: () => void;
  onEditParticipant: (id: string, newName: string) => void;
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

  const handleAddParticipant = () => {
    const error = validateParticipantName(
      newParticipantName, 
      participants.map(p => p.name)
    );
    
    if (error) {
      Alert.alert('Erreur', error);
      return;
    }
    
    if (selectedAvatarIndex === null) {
      Alert.alert('Erreur', 'Choisissez un avatar');
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

  const openEditModal = (id: string, name: string) => {
    setEditModal({ visible: true, id, name });
  };

  const handleEditSave = (id: string, newName: string) => {
    onEditParticipant(id, newName);
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
                  Créez votre tirage magique ✨{'\n'}qui participe ?
                </Text>
              </View>

              <View style={globalStyles.card}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Nom du participant"
                  value={newParticipantName}
                  onChangeText={setNewParticipantName}
                />

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
                      isSelected={selectedAvatarIndex === index}
                      bounceAnim={bounceAnim}
                      onSelect={onAvatarSelect}
                    />
                  )}
                />

                <TouchableOpacity 
                  style={[globalStyles.primaryButton, { backgroundColor: COLORS.PRIMARY }]} 
                  onPress={handleAddParticipant}
                >
                  <Text style={globalStyles.buttonText}>Ajouter</Text>
                </TouchableOpacity>

                <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>
                  Budget pour chacun (en €)
                </Text>
                <TextInput
                  style={globalStyles.input}
                  keyboardType="numeric"
                  value={budget}
                  onChangeText={setBudget}
                />

                <TouchableOpacity
                  style={[
                    globalStyles.primaryButton, 
                    participants.length < 3 && globalStyles.disabledButton
                  ]}
                  onPress={handleCreateSession}
                  disabled={participants.length < 3}
                >
                  <Text style={globalStyles.buttonText}>
                    {participants.length < 3
                      ? `Participants : ${participants.length}/3`
                      : 'Créer la session et lancer 🎅'}
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