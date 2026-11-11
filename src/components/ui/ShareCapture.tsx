import React, { useRef, useState } from 'react';
import { View, Text, Modal, StyleSheet, Dimensions, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Assignment } from '../../types';
import { COLORS, AVATAR_LIST } from '../../constants';

interface ShareCaptureProps {
  assignments: Assignment[];
  budget: string;
  isVisible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ShareCapture({ 
  assignments, 
  budget, 
  isVisible, 
  onClose 
}: ShareCaptureProps) {
  const captureRef_internal = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  React.useEffect(() => {
    if (isVisible && assignments.length > 0 && !isCapturing) {
      captureAndShare();
    }
  }, [isVisible]);

  const captureAndShare = async () => {
    if (!captureRef_internal.current || isCapturing) return;
    
    setIsCapturing(true);
    try {
      // Délai plus long pour le rendu complet
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const uri = await captureRef(captureRef_internal.current, {
        format: 'png',
        quality: 1.0,
        result: 'tmpfile',
        // Forcer le rendu complet
        snapshotContentContainer: false,
      });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Partage non disponible', 'Le partage n\'est pas disponible sur cette plateforme');
      }
      onClose();
    } catch (error) {
      console.error('Erreur partage:', error);
      Alert.alert('Erreur', 'Impossible de partager le tirage');
      onClose();
    } finally {
      setIsCapturing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent>
      <View style={styles.container}>
        {/* Vue de capture - visible pour debug */}
        <View ref={captureRef_internal} style={styles.captureView}>
          {/* Header */}
          <Text style={styles.title}>🎅 Résultats du Tirage 🎄</Text>
          <Text style={styles.info}>Budget: {budget}€ par personne</Text>
          
          {/* Ligne séparatrice */}
          <View style={styles.separator} />
          
          {/* Résultats */}
          <Text style={styles.subtitle}>🎁 Qui offre à qui ?</Text>
          
          {assignments.map((assignment, index) => (
            <View key={index} style={styles.resultRow}>
              {/* Giver avec avatar */}
              <View style={styles.participantContainer}>
                {assignment.giver.customPhotoUri ? (
                  <Image source={{ uri: assignment.giver.customPhotoUri }} style={styles.avatar} />
                ) : (
                  <Image source={AVATAR_LIST[assignment.giver.avatarIndex]} style={styles.avatar} />
                )}
                <Text style={styles.giver} numberOfLines={1}>{assignment.giver.name}</Text>
              </View>
              
              <Text style={styles.arrow}>→</Text>
              
              {/* Receiver avec avatar */}
              <View style={styles.participantContainer}>
                {assignment.receiver.customPhotoUri ? (
                  <Image source={{ uri: assignment.receiver.customPhotoUri }} style={styles.avatar} />
                ) : (
                  <Image source={AVATAR_LIST[assignment.receiver.avatarIndex]} style={styles.avatar} />
                )}
                <Text style={styles.receiver} numberOfLines={1}>{assignment.receiver.name}</Text>
              </View>
            </View>
          ))}
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>🎄 Joyeuses Fêtes ! 🎄</Text>
          </View>
        </View>

        {/* Message de chargement par-dessus */}
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>📸 Création de l'image...</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  captureView: {
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  separator: {
    height: 3,
    backgroundColor: '#e74c3c',
    marginVertical: 15,
    borderRadius: 1.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 15,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  participantContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  giver: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'left',
  },
  arrow: {
    fontSize: 20,
    marginHorizontal: 8,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  receiver: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#bdc3c7',
  },
  footerText: {
    color: '#e74c3c',
    fontSize: 18,
    fontWeight: 'bold',
  },
});