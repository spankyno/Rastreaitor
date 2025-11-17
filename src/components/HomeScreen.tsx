interface HomeScreenProps {
  onSelectRole: (role: 'tracked' | 'tracker') => void;
}

export function HomeScreen({ onSelectRole }: HomeScreenProps) {
  return (
    <div className="container">
      <header>
        <h1>Rastreaitor</h1>
        <h2>Geolocalización en tiempo real con consentimiento.</h2>
      </header>
      <main className="button-group">
        <button className="btn btn-primary" onClick={() => onSelectRole('tracked')}>
          Compartir mi ubicación
        </button>
        <button className="btn btn-primary" onClick={() => onSelectRole('tracker')}>
          Rastrear un dispositivo
        </button>
      </main>
      <footer>
        <p style={{ color: 'var(--secondary-text)', fontSize: '0.8rem' }}>
            Recuerda usar esta herramienta de forma responsable y siempre con el consentimiento explícito de la otra persona.
        </p>
      </footer>
    </div>
  );
}
