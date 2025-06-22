import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NeoWs() {
  const [asteroids, setAsteroids] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNeoWs() {
      try {
        const res = await axios.get('http://localhost:5000/api/neows');  // ✅ Backend endpoint
        const neos = Object.values(res.data.near_earth_objects).flat();
        setAsteroids(neos);
      } catch (err) {
        console.error('Failed to fetch NeoWs data', err);
        setError('Failed to load Near Earth Object data. Please try again later.');
      }
    }

    fetchNeoWs();
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">☄️ Near Earth Objects (Next 7 days)</h2>

      {error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : (
        <ul className="max-h-96 overflow-y-auto">
          {asteroids.map((asteroid) => (
            <li key={asteroid.id} className="mb-3 p-3 bg-gray-700 rounded shadow">
              <p><strong>Name:</strong> {asteroid.name}</p>
              <p><strong>Approach Date:</strong> {asteroid.close_approach_data[0]?.close_approach_date}</p>
              <p><strong>Estimated Diameter:</strong> {asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(1)}m - {asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}m</p>
              <p><strong>Potentially Hazardous:</strong> {asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NeoWs;
