import { useEffect, useRef, useState, type ReactNode } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoCoordinates } from '../../lib/geo';

interface LeafletMapProps {
  center: GeoCoordinates;
  zoom?: number;
  className?: string;
  onMapReady?: (map: L.Map) => void;
  children?: ReactNode;
  fallbackMessage?: string;
}

export default function LeafletMap({
  center,
  zoom = 12,
  className = 'w-full h-full min-h-[360px]',
  onMapReady,
  children,
  fallbackMessage,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Leaflet map
    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom,
      scrollWheelZoom: false,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    // OpenStreetMap tile layer
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    tiles.on('tileerror', () => {
      setTileError(true);
    });

    if (onMapReady) {
      onMapReady(map);
    }

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when changed
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom, {
        animate: true,
      });
    }
  }, [center, zoom]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={containerRef}
        className={`${className} z-0`}
        role="region"
        aria-label="Interactive dairy map"
      />

      {tileError && (
        <div className="absolute top-3 left-3 right-3 z-30 p-2.5 bg-amber-50/95 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold shadow-md flex items-center justify-between">
          <span>⚠ {fallbackMessage || 'Map tiles offline. Approximate distance and list fallback active.'}</span>
          <button
            type="button"
            onClick={() => setTileError(false)}
            className="text-[11px] underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {children}
    </div>
  );
}
