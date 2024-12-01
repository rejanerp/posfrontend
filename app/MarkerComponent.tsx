// MarkerComponent.tsx
import React from 'react';
import { Marker } from 'react-native-maps';
import { FavoriteLocation } from './types'; 

interface MarkerComponentProps {
  favLoc: FavoriteLocation;
  index: number;
  onPress: (index: number) => void;
}

const MarkerComponent: React.FC<MarkerComponentProps> = React.memo(
  ({ favLoc, index, onPress }) => (
    <Marker
      coordinate={{
        latitude: favLoc.latitude,
        longitude: favLoc.longitude,
      }}
      pinColor={favLoc.color || 'red'}
      onPress={() => onPress(index)}
    />
  )
);

export default MarkerComponent;
