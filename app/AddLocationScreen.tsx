import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

const AddLocationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const paramLatitude = Array.isArray(params.latitude) ? params.latitude[0] : params.latitude;
  const paramLongitude = Array.isArray(params.longitude) ? params.longitude[0] : params.longitude;

  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState<string>(paramLatitude || '');
  const [longitude, setLongitude] = useState<string>(paramLongitude || '');
  const [color, setColor] = useState('');

  const addLocation = async () => {
    if (!name || !latitude || !longitude) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newLocation = {
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      color,
    };

    try {
      const storedLocations = await AsyncStorage.getItem('favoriteLocations');
      const locations = storedLocations ? JSON.parse(storedLocations) : [];
      locations.push(newLocation);
      await AsyncStorage.setItem('favoriteLocations', JSON.stringify(locations));
      router.replace('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar a localização:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Botão para voltar ao Dashboard */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/dashboard')}>
        <Text style={styles.backButtonText}>Voltar ao Dashboard</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Nome do Local"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Salvar Localização" onPress={addLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#6200ee',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 8,
  },
});

export default AddLocationScreen;
