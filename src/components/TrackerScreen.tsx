import { useState, useEffect } from 'react';
import { Map } from './Map';
import { LocationData } from '../types';
import Pusher from 'pusher-js';

interface TrackerScreenProps {
  onBack: () => void;
}

// TODO: Replace with your public Pusher Key and Cluster
const PUSHER_KEY = 'PON_AQUÍ_TU_PUSHER_KEY'; 
const PUSHER_CLUSTER = 'PON_AQUÍ_TU_PUSHER_CLUSTER';

export function TrackerScreen({ onBack }: TrackerScreenProps) {
  const [trackingId, setTrackingId] = useState('');
  const [submittedId, setSubmittedId] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
      if (!submittedId || !PUSHER_KEY || !PUSHER_CLUSTER) return;
      
      // Prevent Pusher from logging to the console
      Pusher.logToConsole = false;

      const pusher = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
      });

      const channelName = `location-${submittedId}`;
      const channel = pusher.subscribe(channelName);
      
      setIsConnecting(true);
      setError(null);

      channel.bind('pusher:subscription_succeeded', () => {
        setIsConnecting(false);
        setError(null); // Clear previous errors on successful connection
      });
      
      channel.bind('pusher:subscription_error', () => {
        setError('No se pudo conectar al canal. Revisa el ID y tu conexión.');
        setIsConnecting(false);
      });

      channel.bind('location-update', (data: LocationData) => {
        setLocation(data);
      });

      return () => {
          pusher.unsubscribe(channelName);
          pusher.disconnect();
      };

  }, [submittedId]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trackingId.trim()) {
        setLocation(null);
        setError(null);
        setSubmittedId(trackingId.trim());
    }
  };
  
  const handleNewSearch = () => {
      setSubmittedId('');
      setTrackingId('');
      setLocation(null);
      setError(null);
  }

  return (
    <div className="full-screen-container">
      <header style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0 1rem 0' }}>
        <button onClick={onBack} style={{background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '1rem', padding: '0.5rem 0'}}>&larr; Volver</button>
        {submittedId && <button onClick={handleNewSearch} style={{background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '1rem', padding: '0.5rem 0'}}>Buscar otro ID</button>}
      </header>
      
      {!submittedId ? (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flexGrow: 1, justifyContent: 'center' }}>
            <h2>Ingresa el ID de Rastreo</h2>
            <form onSubmit={handleSubmit} className="input-group">
                <input
                    type="text"
                    className="input"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Pega el ID aquí"
                    aria-label="ID de rastreo"
                />
                <button type="submit" className="btn btn-primary">Buscar</button>
            </form>
        </div>
      ) : (
        <>
            <div style={{ flexGrow: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {isConnecting && <p>Conectando al canal de rastreo...</p>}
              {error && <p style={{ color: 'var(--danger-color)', textAlign: 'center' }}>{error}</p>}
              {!isConnecting && !error && !location && <p>Esperando la primera actualización de ubicación...</p>}
              {location && <Map location={location} />}
              {location && (
                <div className="status-panel">
                  Última actualización: {new Date(location.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
        </>
      )}
    </div>
  );
}