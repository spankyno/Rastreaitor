import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { TrackedScreen } from './components/TrackedScreen';
import { TrackerScreen } from './components/TrackerScreen';

type Role = 'home' | 'tracked' | 'tracker';

function App() {
  const [role, setRole] = useState<Role>('home');

  const renderContent = () => {
    switch (role) {
      case 'tracked':
        return <TrackedScreen onStop={() => setRole('home')} />;
      case 'tracker':
        return <TrackerScreen onBack={() => setRole('home')} />;
      case 'home':
      default:
        return <HomeScreen onSelectRole={setRole} />;
    }
  };

  return (
    <>
      {renderContent()}
    </>
  );
}

export default App;
