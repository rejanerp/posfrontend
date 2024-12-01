import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { MapPressEvent } from 'react-native-maps';
import { FAB, Appbar, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import MarkerComponent from './MarkerComponent';
import useLocation from './useLocation';
import { FavoriteLocation } from './types';

const DashboardScreen: React.FC = () => {
  const { location, errorMsg } = useLocation();
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);
  const router = useRouter();
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [selectingLocation, setSelectingLocation] = useState<boolean>(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    checkDeviceType();
    loadFavoriteLocations();
  }, []);

  const checkDeviceType = () => {
    const dim = Dimensions.get('window');
    setIsTablet(dim.width >= 768 && dim.height >= 1024);
  };

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

  const handleMarkerPress = useCallback(
    (index: number) => {
      router.replace(`/EditLocationScreen?index=${index}`);
    },
    [router]
  );

  const handleMapPress = (event: MapPressEvent) => {
    if (selectingLocation) {
      const { coordinate } = event.nativeEvent;
      router.replace(
        `/AddLocationScreen?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}`
      );
      setSelectingLocation(false);
    }
  };

  const navigateToAddLocation = () => {
    setSelectingLocation(true);
  };

  const navigateToFavoriteLocations = () => {
    router.replace('/FavoriteLocations');
  };

  const handleFavoriteLocationPress = (index: number) => {
    const selectedLocation = favoriteLocations[index];
    mapRef.current?.animateToRegion({
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Meu Mapa de Favoritos" />
        <Appbar.Action icon="format-list-bulleted" onPress={navigateToFavoriteLocations} />
      </Appbar.Header>

      {location ? (
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          onPress={handleMapPress}
        >
          {favoriteLocations.map((favLoc, index) => (
            <MarkerComponent
              key={index}
              favLoc={favLoc}
              index={index}
              onPress={handleMarkerPress}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text>Carregando mapa...</Text>
        </View>
      )}

      {errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {selectingLocation && (
        <View style={styles.selectionModeBanner}>
          <Text style={styles.selectionModeText}>Toque no mapa para selecionar um local</Text>
          <FAB
            style={styles.cancelFab}
            small
            icon="close"
            onPress={() => setSelectingLocation(false)}
            accessibilityLabel="Cancelar seleção de local"
          />
        </View>
      )}

      <FAB
        style={styles.fab}
        icon="map-marker-plus"
        onPress={navigateToAddLocation}
        accessibilityLabel="Adicionar nova localização"
      />

      {isTablet && (
        <View style={styles.sideList}>
          <Text style={styles.sideListTitle}>Localizações Favoritas:</Text>
          {favoriteLocations.map((loc, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleFavoriteLocationPress(index)}
              onLongPress={() => handleMarkerPress(index)}
              style={styles.sideListItem}
            >
              <Text>{loc.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  selectionModeBanner: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(98, 0, 238, 0.9)',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionModeText: {
    color: 'white',
    fontSize: 16,
  },
  cancelFab: {
    backgroundColor: 'red',
  },
  sideList: {
    position: 'absolute',
    right: 0,
    width: '30%',
    height: '100%',
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  sideListTitle: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  sideListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});

export default DashboardScreen;
