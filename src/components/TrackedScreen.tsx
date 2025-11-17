import { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { LocationData } from '../types';

interface TrackedScreenProps {
  onStop: () => void;
}

export function TrackedScreen({ onStop }: TrackedScreenProps) {
  const [trackingId] = useState(() => crypto.randomUUID());
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState('');
  
  const { location, error } = useGeolocation();

  useEffect(() => {
    // This effect triggers every time the location object changes
    if (location) {
      const sendLocation = async (loc: LocationData) => {
        try {
          const response = await fetch(`/api/trigger`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              id: trackingId,
              location: loc 
            }),
          });
          if (response.ok) {
            setLastUpdate(new Date().toLocaleTimeString());
          } else {
             console.error('Failed to send location trigger');
          }
        } catch (err) {
          console.error('Error sending location trigger:', err);
        }
      };
      
      sendLocation(location);
    }
  }, [location, trackingId]);
  
  const copyToClipboard = () => {
      navigator.clipboard.writeText(trackingId).then(() => {
          setCopySuccess('¡Copiado!');
          setTimeout(() => setCopySuccess(''), 2000);
      }, () => {
          setCopySuccess('Error al copiar');
      });
  };

  return (
    <div className="container">
      <h2>Compartiendo tu ubicación</h2>
      <p>Copia y comparte este ID con la persona que quieres que vea tu ubicación:</p>
      <div className="tracking-id-display" onClick={copyToClipboard} title="Click para copiar">
          {trackingId}
      </div>
      {copySuccess && <p style={{color: 'var(--success-color)'}}>{copySuccess}</p>}
      
      {error && <p style={{ color: 'var(--danger-color)' }}>Error: {error}</p>}
      {!location && !error && <p>Obteniendo tu ubicación inicial...</p>}
      {lastUpdate && <p style={{ color: 'var(--secondary-text)' }}>Última actualización enviada: {lastUpdate}</p>}

      <button className="btn btn-danger" onClick={onStop} style={{marginTop: '2rem'}}>
          DEJAR DE COMPARTIR
      </button>
    </div>
  );
}