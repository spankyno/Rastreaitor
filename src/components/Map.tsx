import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LocationData } from '../types';
import { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';

interface MapProps {
  location: LocationData;
}

function ChangeView({ center, zoom }: { center: LatLngExpression, zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export function Map({ location }: MapProps) {
  const position: LatLngExpression = [location.lat, location.lng];
  const zoomLevel = 16;

  return (
    <MapContainer center={position} zoom={zoomLevel} scrollWheelZoom={true} className="leaflet-container">
      <ChangeView center={position} zoom={zoomLevel} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Ubicación aproximada. <br /> Precisión: {location.accuracy.toFixed(0)} metros.
        </Popup>
      </Marker>
    </MapContainer>
  );
}
