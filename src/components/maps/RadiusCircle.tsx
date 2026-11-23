import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { GeoCoordinates } from '../../lib/geo';

interface RadiusCircleProps {
  map: L.Map | null;
  center: GeoCoordinates;
  radiusKm: number;
}

export default function RadiusCircle({ map, center, radiusKm }: RadiusCircleProps) {
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!map) return;

    const radiusMeters = radiusKm * 1000;

    if (!circleRef.current) {
      circleRef.current = L.circle([center.lat, center.lng], {
        radius: radiusMeters,
        color: '#0284c7',
        weight: 2,
        dashArray: '5, 5',
        fillColor: '#38bdf8',
        fillOpacity: 0.12,
      }).addTo(map);

      circleRef.current.bindTooltip(`Search Radius: ${radiusKm} km`, {
        permanent: false,
        direction: 'top',
        className: 'ml-radius-tooltip',
      });
    } else {
      circleRef.current.setLatLng([center.lat, center.lng]);
      circleRef.current.setRadius(radiusMeters);
      circleRef.current.setTooltipContent(`Search Radius: ${radiusKm} km`);
    }

    return () => {
      if (circleRef.current) {
        circleRef.current.remove();
        circleRef.current = null;
      }
    };
  }, [map, center, radiusKm]);

  return null;
}
