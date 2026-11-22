import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationMap.css';

type Coordinates = { lat: number; lng: number };
// Approximate district town centres, used only when GPS has not been selected.
const districtCentres: Record<string, [number, number]> = {
 Colombo:[6.9271,79.8612],Gampaha:[7.0873,79.999],Kalutara:[6.5854,79.9607],
 Kandy:[7.2906,80.6337],Matale:[7.4675,80.6234],'Nuwara Eliya':[6.9497,80.7891],
 Galle:[6.0535,80.221],Matara:[5.9549,80.555],Hambantota:[6.1241,81.1185],
 Anuradhapura:[8.3114,80.4037],Polonnaruwa:[7.9403,81.0188],Kurunegala:[7.4863,80.3647],
 Puttalam:[8.0362,79.8283],Badulla:[6.9934,81.055],Monaragala:[6.8728,81.3507],
 Ratnapura:[6.6828,80.3992],Kegalle:[7.2513,80.3464],Jaffna:[9.6615,80.0255],
 Kilinochchi:[9.3803,80.377],Mannar:[8.981,79.9044],Vavuniya:[8.7542,80.4982],
 Mullaitivu:[9.2671,80.8142],Trincomalee:[8.5874,81.2152],Batticaloa:[7.731,81.6747],Ampara:[7.2975,81.682],
};

export default function LocationMap({ district, coordinates }: { district: string; coordinates: Coordinates | null }) {
 const container = useRef<HTMLDivElement>(null);
 const map = useRef<L.Map | null>(null);
 const marker = useRef<L.CircleMarker | null>(null);
 const [tileError, setTileError] = useState(false);
 useEffect(() => {
  if (!container.current) return;
  const instance = L.map(container.current, { scrollWheelZoom: false }).setView([7.2906,80.6337], 11);
  map.current = instance;
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom:19,
  }).addTo(instance);
  tiles.on('tileerror', () => setTileError(true));
  marker.current = L.circleMarker([7.2906,80.6337], { radius:10, color:'#fff', weight:3, fillColor:'#11834b', fillOpacity:1 }).addTo(instance);
  const observer = new ResizeObserver(() => instance.invalidateSize());
  observer.observe(container.current);
  return () => { observer.disconnect();instance.remove();map.current=null;marker.current=null; };
 }, []);
 useEffect(() => {
  const centre: [number, number] = coordinates ? [coordinates.lat, coordinates.lng] : districtCentres[district] || districtCentres.Kandy;
  map.current?.setView(centre, coordinates ? 15 : 11);
  marker.current?.setLatLng(centre).bindTooltip(coordinates ? 'Your GPS location' : `${district} area (approximate)`);
 }, [district, coordinates]);
 return <>
  <div className="ml-location-map" ref={container} role="region" aria-label={`Interactive map: ${coordinates ? 'your GPS location' : district + ' area'}`} />
  <p className="ml2-map-caption" aria-live="polite">{tileError ? 'Map tiles could not load. Check your internet connection; district and GPS selection are still available.' : coordinates ? 'Showing your GPS location. Drag to explore or use + / − to zoom.' : `${district} area — approximate town centre. Use GPS to show your actual location.`}</p>
 </>;
}
