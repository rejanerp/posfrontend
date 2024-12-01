import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';

const EditLocationScreen = () => {
  const { index } = useLocalSearchParams();
  const numericIndex = Number(index);

  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [color, setColor] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isNaN(numericIndex)) {
      loadLocation();
    } else {
      Alert.alert('Índice Inválido', 'O índice fornecido é inválido.');
      router.replace("/dashboard");
    }
  }, []);

  const loadLocation = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem('favoriteLocations');
      if (storedLocations) {
        const locations = JSON.parse(storedLocations);
        if (numericIndex >= 0 && numericIndex < locations.length) {
          const loc = locations[numericIndex];
          setName(loc.name || '');
          setLatitude(loc.latitude ? loc.latitude.toString() : '');
          setLongitude(loc.longitude ? loc.longitude.toString() : '');
          setColor(loc.color || '');
        } else {
          Alert.alert('Localização Não Encontrada', 'A localização não pôde ser encontrada.');
          router.replace("/dashboard");
        }
      } else {
        Alert.alert('Nenhuma Localização', 'Nenhuma localização favorita encontrada.');
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error('Erro ao carregar a localização:', error);
    }
  };

  const saveLocation = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem('favoriteLocations');
      const locations = storedLocations ? JSON.parse(storedLocations) : [];
      locations[numericIndex] = {
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        color,
      };
      await AsyncStorage.setItem('favoriteLocations', JSON.stringify(locations));
      router.replace('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar a localização:', error);
    }
  };

  const deleteLocation = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem('favoriteLocations');
      const locations = storedLocations ? JSON.parse(storedLocations) : [];
      if (numericIndex >= 0 && numericIndex < locations.length) {
        locations.splice(numericIndex, 1);
        await AsyncStorage.setItem('favoriteLocations', JSON.stringify(locations));
      }
      router.replace('/dashboard');
    } catch (error) {
      console.error('Erro ao excluir a localização:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nome do Local"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="Cor do Marcador"
        value={color}
        onChangeText={setColor}
        style={{ marginBottom: 20, borderWidth: 1, padding: 8 }}
      />
      <View style={{ marginBottom: 10 }}>
        <Button title="Salvar Alterações" color="blue" onPress={saveLocation} />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button title="Excluir Localização" color="red" onPress={deleteLocation} />
      </View>
    </View>
  );
};

export default EditLocationScreen;
