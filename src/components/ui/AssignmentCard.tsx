import React from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { Assignment } from '../../types';
import { AVATAR_LIST } from '../../constants';

interface AssignmentCardProps {
  assignment: Assignment;
  opacity: Animated.Value;
}

export function AssignmentCard({ assignment, opacity }: AssignmentCardProps) {
  return (
    <Animated.View style={[styles.assignmentItem, { opacity }]}>
      <View style={styles.participantInfo}>
        <Image 
          source={AVATAR_LIST[assignment.giver.avatarIndex]} 
          style={styles.avatarImage} 
        />
        <Text style={styles.participantName}>{assignment.giver.name}</Text>
      </View>
      
      <Text style={styles.arrowText}>🎁➡️🎁</Text>
      
      <View style={styles.participantInfo}>
        <Image 
          source={AVATAR_LIST[assignment.receiver.avatarIndex]} 
          style={styles.avatarImage} 
        />
        <Text style={styles.participantName}>{assignment.receiver.name}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  assignmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  participantInfo: {
    alignItems: 'center',
    flex: 1,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  participantName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  arrowText: {
    fontSize: 20,
    marginHorizontal: 10,
  },
});