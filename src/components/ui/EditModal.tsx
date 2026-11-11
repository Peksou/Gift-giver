import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, ScrollView } from 'react-native';
import { EditModal as EditModalType } from '../../types';
import { globalStyles } from '../../styles';
import { AVATAR_LIST, COLORS } from '../../constants';
import { PhotoPicker } from './PhotoPicker';

interface EditModalProps {
  editModal: EditModalType;
  onSave: (id: string, newName: string, avatarIndex: number, customPhotoUri?: string) => void;
  onCancel: () => void;
}

export function EditModal({ editModal, onSave, onCancel }: EditModalProps) {
  const [editName, setEditName] = useState('');
  const [editAvatarIndex, setEditAvatarIndex] = useState(0);
  const [editCustomPhotoUri, setEditCustomPhotoUri] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (editModal.visible) {
      setEditName(editModal.name || '');
      setEditAvatarIndex(editModal.avatarIndex ?? 0);
      setEditCustomPhotoUri(editModal.customPhotoUri);
    }
  }, [editModal]);

  const handleSave = () => {
    const trimmedName = editName.trim();
    if (!trimmedName || !editModal.id) return;
    onSave(editModal.id, trimmedName, editAvatarIndex, editCustomPhotoUri);
  };

  const handleAvatarSelect = (index: number) => {
    setEditAvatarIndex(index);
    setEditCustomPhotoUri(undefined); // Supprimer la photo custom si on choisit un avatar
  };

  const handlePhotoSelected = (uri: string) => {
    setEditCustomPhotoUri(uri);
  };

  const handlePhotoRemoved = () => {
    setEditCustomPhotoUri(undefined);
  };

  if (!editModal.visible) return null;

  return (
    <View style={globalStyles.modalContainer}>
      <View style={[globalStyles.modalBox, styles.modalBoxLarge]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalTitle}>✏️ Modifier le participant</Text>
          
          {/* Nom */}
          <Text style={styles.sectionTitle}>Nom</Text>
          <TextInput
            style={globalStyles.input}
            value={editName}
            onChangeText={setEditName}
            placeholder="Nouveau nom"
            autoFocus
          />
          
          {/* Avatars prédéfinis + bouton photo */}
          <Text style={styles.sectionTitle}>🎭 Avatar ou photo</Text>
          <FlatList
            data={AVATAR_LIST}
            horizontal
            keyExtractor={(_, i) => 'edit-av-' + i}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.avatarList}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                onPress={() => handleAvatarSelect(index)}
                style={[
                  styles.avatarOption,
                  editAvatarIndex === index && !editCustomPhotoUri && styles.avatarSelected
                ]}
              >
                <Image source={item} style={styles.avatarImage} />
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <PhotoPicker
                onPhotoSelected={handlePhotoSelected}
                currentPhotoUri={editCustomPhotoUri}
                onPhotoRemoved={handlePhotoRemoved}
              />
            }
          />
          
          {/* Boutons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[globalStyles.primaryButton, styles.button]}
              onPress={handleSave}
            >
              <Text style={globalStyles.buttonText}>✅ Valider</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.secondaryButton, styles.button]}
              onPress={onCancel}
            >
              <Text style={globalStyles.buttonText}>❌ Annuler</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBoxLarge: {
    maxHeight: '85%',
    width: '90%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
    color: '#555',
  },
  avatarList: {
    paddingVertical: 10,
  },
  avatarOption: {
    marginRight: 10,
    padding: 4,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  avatarImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
  },
});