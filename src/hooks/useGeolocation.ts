import { useState, useEffect, useRef } from 'react';
import { LocationData } from '../types';

export function useGeolocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es soportada por tu navegador.');
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      });
      setError(null);
    };

    const handleError = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError("Permiso de geolocalización denegado.");
          break;
        case error.POSITION_UNAVAILABLE:
          setError("Información de ubicación no disponible.");
          break;
        case error.TIMEOUT:
          setError("La solicitud de ubicación ha caducado.");
          break;
        default:
          setError("Ha ocurrido un error desconocido.");
          break;
      }
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { location, error };
}
