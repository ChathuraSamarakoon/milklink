import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { approximateCoordinates } from '../../lib/geo';
import type { FarmerSearchResult } from '../../features/discovery/types';

interface ApproximateFarmMarkerProps {
  map: L.Map | null;
  farmer: FarmerSearchResult;
  isSelected?: boolean;
  onSelect: (farmer: FarmerSearchResult) => void;
}

export default function ApproximateFarmMarker({
  map,
  farmer,
  isSelected = false,
  onSelect,
}: ApproximateFarmMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);
  const privacyCircleRef = useRef<L.Circle | null>(null);

  // Pre-acceptance location is approximate (~1 km)
  const approxCoords = approximateCoordinates(farmer.coordinates, farmer.id, 0.9);

  useEffect(() => {
    if (!map) return;

    // Custom HTML divIcon for the farm marker
    const iconHtml = `
      <div class="ml-farm-map-pin ${isSelected ? 'is-selected' : ''}">
        <div class="ml-pin-bubble">
          <span class="ml-pin-emoji">🥛</span>
          <span class="ml-pin-litres">${farmer.availableLitres}L</span>
        </div>
        <div class="ml-pin-stem"></div>
        <div class="ml-pin-label">${farmer.farmName.split(' ')[0]}</div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'ml-custom-leaflet-marker',
      iconSize: [60, 42],
      iconAnchor: [30, 42],
    });

    const marker = L.marker([approxCoords.lat, approxCoords.lng], {
      icon: customIcon,
      title: `${farmer.farmName} (Approximate Area)`,
    }).addTo(map);

    markerRef.current = marker;

    // Approximate area halo circle (~800m privacy buffer)
    const privacyCircle = L.circle([approxCoords.lat, approxCoords.lng], {
      radius: 800,
      color: isSelected ? '#10b981' : '#64748b',
      weight: 1,
      dashArray: '3, 4',
      fillColor: isSelected ? '#10b981' : '#94a3b8',
      fillOpacity: isSelected ? 0.18 : 0.08,
    }).addTo(map);

    privacyCircleRef.current = privacyCircle;

    // Popup with privacy explanation and details
    marker.bindPopup(`
      <div style="font-family: inherit; font-size: 12px; min-width: 170px;">
        <strong style="color: #0f172a; font-size: 13px;">${farmer.farmName}</strong>
        <div style="color: #64748b; font-size: 11px; margin-top: 2px;">
          📍 ~${farmer.distanceKm.toFixed(1)} km away (${farmer.village})
        </div>
        <div style="color: #0284c7; font-weight: bold; margin-top: 4px;">
          ${farmer.availableLitres} L Available @ Rs. ${farmer.pricePerLitre}/L
        </div>
        <div style="margin-top: 5px; font-size: 10px; color: #94a3b8; background: #f8fafc; padding: 4px 6px; border-radius: 6px;">
          🔒 Approximate location (~1 km buffer). Exact farm location provided upon order acceptance.
        </div>
      </div>
    `);

    marker.on('click', () => {
      onSelect(farmer);
    });

    return () => {
      marker.remove();
      privacyCircle.remove();
      markerRef.current = null;
      privacyCircleRef.current = null;
    };
  }, [map, approxCoords.lat, approxCoords.lng, isSelected, farmer, onSelect]);

  return null;
}
