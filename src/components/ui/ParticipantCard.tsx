import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Participant } from '../../types';
import { AVATAR_LIST } from '../../constants';

interface ParticipantCardProps {
  participant: Participant;
  onEdit: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function ParticipantCard({ participant, onEdit, onDelete }: ParticipantCardProps) {
  return (
    <View style={styles.participantItem}>
      <Image 
        source={AVATAR_LIST[participant.avatarIndex]} 
        style={styles.avatarImageSmall} 
      />
      <Text style={styles.participantName}>{participant.name}</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          onPress={() => onEdit(participant.id, participant.name)} 
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