import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Participant } from '../../types';
import { AVATAR_LIST } from '../../constants';

interface ParticipantCardProps {
  participant: Participant;
  onEdit: (id: string, name: string, avatarIndex: number, customPhotoUri?: string) => void;
  onDelete: (id: string) => void;
}

export function ParticipantCard({ participant, onEdit, onDelete }: ParticipantCardProps) {
  // Déterminer la source de l'avatar (photo custom ou avatar prédéfini)
  const avatarSource = participant.customPhotoUri 
    ? { uri: participant.customPhotoUri }
    : AVATAR_LIST[participant.avatarIndex];

  return (
    <View style={styles.participantItem}>
      <Image 
        source={avatarSource} 
        style={[
          styles.avatarImageSmall,
          participant.customPhotoUri && styles.customPhotoStyle
        ]} 
      />
      <Text style={styles.participantName}>{participant.name}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          onPress={() => onEdit(
            participant.id, 
            participant.name, 
            participant.avatarIndex,
            participant.customPhotoUri
          )} 
          style={styles.iconBtn}
        >
          <Text>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => onDelete(participant.id)} 
          style={styles.iconBtn}
        >
          <Text>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  avatarImageSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  customPhotoStyle: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  participantName: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});