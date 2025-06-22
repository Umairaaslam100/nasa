import React, { useState } from 'react';
import ApodViewer from './components/ApodViewer';
import MarsRoverPhotos from './components/MarsRoverPhotos';
import AsteroidChart from './components/AsteroidChart';
import EpicImages from './components/EpicImages';
import NeoWs from './components/NeoWs';
import NasaMediaLibrary from './components/NasaMediaLibrary';

function App() {
  const [tab, setTab] = useState('apod');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="text-center py-6 bg-black shadow-md">
        <div className="flex justify-center items-center gap-2">
          <span className="text-3xl animate-bounce">🚀</span>
          <h1 className="text-3xl font-bold">NASA Space Explorer</h1>
        </div>
        <p className="text-sm text-gray-400 mt-1">Explore space with real NASA data</p>
      </header>

      <nav className="flex justify-center flex-wrap gap-4 bg-gray-800 py-4">
        {['apod', 'mars', 'asteroids', 'epic', 'neows', 'media'].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded ${
              tab === key ? 'bg-yellow-500 text-black' : 'hover:bg-yellow-400 hover:text-black'
            }`}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="p-4 max-w-6xl mx-auto">
        {tab === 'apod' && <ApodViewer />}
        {tab === 'mars' && <MarsRoverPhotos />}
        {tab === 'asteroids' && <AsteroidChart />}
        {tab === 'epic' && <EpicImages />}
        {tab === 'neows' && <NeoWs />}
        {tab === 'media' && <NasaMediaLibrary />}
      </main>
    </div>
  );
}

export default App;
