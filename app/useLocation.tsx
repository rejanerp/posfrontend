// useLocation.ts
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    let isMounted = true; 

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (isMounted) {
            setErrorMsg('Permissão de localização foi negada');
          }
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          setLocation(loc.coords);
        }
      } catch (error) {
        console.error('Erro ao obter a localização:', error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { location, errorMsg };
};

export default useLocation;
