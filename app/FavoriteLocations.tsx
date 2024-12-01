import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface FavoriteLocation {
  name: string;
  latitude: number;
  longitude: number;
  color?: string;
}

const FavoriteLocationsScreen: React.FC = () => {
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadFavoriteLocations();
  }, []);

  const loadFavoriteLocations = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem('favoriteLocations');
      if (storedLocations) {
        setFavoriteLocations(JSON.parse(storedLocations));
      }
    } catch (error) {
      console.error('Erro ao carregar localizações favoritas:', error);
    }
  };

  const handleLocationPress = (index: number) => {
    router.push(`/EditLocationScreen?index=${index}`);
  };

  const handleDeleteLocation = (index: number) => {
    Alert.alert(
      'Excluir Localização',
      'Tem certeza que deseja excluir esta localização?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteLocation(index),
        },
      ]
    );
  };

  const deleteLocation = async (index: number) => {
    try {
      const updatedLocations = [...favoriteLocations];
      updatedLocations.splice(index, 1);
      setFavoriteLocations(updatedLocations);
      await AsyncStorage.setItem('favoriteLocations', JSON.stringify(updatedLocations));
    } catch (error) {
      console.error('Erro ao excluir a localização:', error);
    }
  };

  const renderItem = ({ item, index }: { item: FavoriteLocation; index: number }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleLocationPress(index)}
      onLongPress={() => handleDeleteLocation(index)}
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Botão para voltar ao Dashboard */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/dashboard')}>
        <Text style={styles.backButtonText}>Voltar ao Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Localizações Favoritas</Text>
      {favoriteLocations.length > 0 ? (
        <FlatList
          data={favoriteLocations}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noLocationsText}>Nenhuma localização favorita encontrada.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
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
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
  noLocationsText: {
    fontSize: 16,
    color: '#666',
  },
});

export default FavoriteLocationsScreen;
