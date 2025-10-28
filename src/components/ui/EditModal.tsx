import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { EditModal as EditModalType } from '../../types';
import { globalStyles } from '../../styles';

interface EditModalProps {
  editModal: EditModalType;
  onSave: (id: string, newName: string) => void;
  onCancel: () => void;
}

export function EditModal({ editModal, onSave, onCancel }: EditModalProps) {
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (editModal.visible && editModal.name) {
      setEditName(editModal.name);
    }
  }, [editModal]);

  const handleSave = () => {
    const trimmedName = editName.trim();
    if (!trimmedName || !editModal.id) return;
    onSave(editModal.id, trimmedName);
  };

  if (!editModal.visible) return null;

  return (
    <View style={globalStyles.modalContainer}>
      <View style={globalStyles.modalBox}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
          Modifier le nom
        </Text>
        <TextInput
          style={globalStyles.input}
          value={editName}
          onChangeText={setEditName}
          placeholder="Nouveau nom"
          autoFocus
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={[globalStyles.primaryButton, { flex: 1, marginRight: 5 }]}
            onPress={handleSave}
          >
            <Text style={globalStyles.buttonText}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.secondaryButton, { flex: 1, marginLeft: 5 }]}
            onPress={onCancel}
          >
            <Text style={globalStyles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}