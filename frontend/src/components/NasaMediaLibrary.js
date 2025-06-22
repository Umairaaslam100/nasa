import React, { useState } from 'react';
import axios from 'axios';

function NasaMediaLibrary() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/nasa-media?q=${encodeURIComponent(query)}`);
      setResults(res.data.collection.items.slice(0, 12));
    } catch (err) {
      console.error('NASA media search failed', err);
      setError('Failed to load NASA media. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">🔍 NASA Image and Video Library</h2>
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow p-2 rounded-l bg-gray-700 border border-gray-600 focus:outline-none"
          placeholder="Search NASA media..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 rounded-r"
        >
          Search
        </button>
      </div>
      {loading && <p className="text-white text-sm">Loading...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.map((item) => {
          const data = item.data[0];
          const mediaType = data.media_type;
          const title = data.title;
          const nasaId = data.nasa_id;
          const thumbnail = item.links ? item.links[0].href : '';

          return (
            <div key={nasaId} className="bg-gray-700 p-2 rounded shadow">
              {mediaType === 'image' && <img src={thumbnail} alt={title} className="rounded w-full h-auto" />}
              {mediaType === 'video' && (
                <video controls className="rounded w-full h-auto">
                  <source src={thumbnail} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <p className="text-xs mt-2">{title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NasaMediaLibrary;
