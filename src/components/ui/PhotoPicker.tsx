import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../constants';

interface PhotoPickerProps {
  onPhotoSelected: (uri: string) => void;
  currentPhotoUri?: string;
  onPhotoRemoved?: () => void;
}

export function PhotoPicker({ onPhotoSelected, currentPhotoUri, onPhotoRemoved }: PhotoPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Demander les permissions caméra et galerie
  const requestPermissions = async (type: 'camera' | 'gallery') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin d\'accéder à votre caméra pour prendre une photo.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin d\'accéder à votre galerie pour sélectionner une photo.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  // Sélectionner une photo depuis la galerie
  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions('gallery');
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    } finally {
      setIsLoading(false);
    }
  };

  // Prendre une photo avec la caméra
  const takePhotoWithCamera = async () => {
    const hasPermission = await requestPermissions('camera');
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher les options de sélection
  const showImageOptions = () => {
    setShowOptionsModal(true);
  };

  const handleCameraPress = () => {
    setShowOptionsModal(false);
    takePhotoWithCamera();
  };

  const handleGalleryPress = () => {
    setShowOptionsModal(false);
    pickImageFromGallery();
  };

  return (
    <View style={styles.container}>
      
      {currentPhotoUri ? (
        <TouchableOpacity onPress={showImageOptions} style={styles.photoContainer}>
          <Image source={{ uri: currentPhotoUri }} style={styles.photoPreview} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={showImageOptions}
          disabled={isLoading}
        >
          <Text style={styles.addButtonIcon}>📷</Text>
          <Text style={styles.addButtonText}>
            {isLoading ? '...' : 'Photo'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Modal de sélection d'image */}
      <Modal
        visible={showOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📷 Choisir une photo</Text>
            <Text style={styles.modalSubtitle}>Comment souhaitez-vous ajouter votre photo ?</Text>
            
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.modalOptionButton} onPress={handleCameraPress}>
                <Text style={styles.modalOptionIcon}>📸</Text>
                <Text style={styles.modalOptionText}>Caméra</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalOptionButton} onPress={handleGalleryPress}>
                <Text style={styles.modalOptionIcon}>🖼️</Text>
                <Text style={styles.modalOptionText}>Galerie</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.modalCancelButton} 
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: COLORS.SECONDARY,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: {
    fontSize: 20,
  },
  addButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 9,
  },
  // Styles du modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  modalOptionButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOptionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  modalOptionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
});


