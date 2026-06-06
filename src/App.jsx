import React, { useState } from 'react';
import './styles/globals.css';
import LandingPage from './components/LandingPage';
import GamePage from './components/GamePage';

export default function App() {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'game'
  const [gameConfig, setGameConfig] = useState(null);

  function startGame(config) {
    setGameConfig(config);
    setScreen('game');
  }

  function goHome() {
    setScreen('landing');
    setGameConfig(null);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {screen === 'landing' && <LandingPage onStart={startGame} />}
      {screen === 'game' && <GamePage config={gameConfig} onHome={goHome} />}
    </div>
  );
}
