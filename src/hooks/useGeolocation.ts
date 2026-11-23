import { useState, useCallback } from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

export function useGeolocation(initialCoords: Coordinates | null = null) {
  const [state, setState] = useState<GeolocationState>({
    coordinates: initialCoords,
    loading: false,
    error: null,
    permissionGranted: !!initialCoords,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          loading: false,
          error: null,
          permissionGranted: true,
        });
      },
      (error) => {
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can select a district manually.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: msg,
          permissionGranted: false,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const setManualCoordinates = useCallback((coords: Coordinates) => {
    setState({
      coordinates: coords,
      loading: false,
      error: null,
      permissionGranted: true,
    });
  }, []);

  return {
    ...state,
    requestLocation,
    setManualCoordinates,
  };
}
