import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

function MarsRoverPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNewPhotos, setHasNewPhotos] = useState(false);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/mars?sol=1000`);
      const newPhotos = res.data.photos.slice(0, 12);
      setLoading(false);

      if (photos.length > 0 && newPhotos[0]?.id !== photos[0]?.id) {
        setHasNewPhotos(true);
      } else {
        setPhotos(newPhotos);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 10 * 60 * 1000); // every 10 mins

    return () => clearInterval(interval);
  }, [photos]);

  const handleDownload = async (imgSrc, photoId) => {
    try {
      const proxyUrl = `${API_BASE_URL}/api/image-proxy?url=${encodeURIComponent(imgSrc)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `mars_photo_${photoId}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading the image:', error);
      alert('Sorry, failed to download the image.');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4 relative">
      <h2 className="text-xl font-semibold mb-4">🔴 Mars Rover Photos</h2>

      {/* Notification Banner */}
      {hasNewPhotos && (
        <div
          className="fixed top-4 right-4 bg-yellow-400 text-black p-3 rounded shadow cursor-pointer z-50"
          onClick={() => {
            fetchPhotos();
            setHasNewPhotos(false);
          }}
          title="Click to refresh photos"
        >
          🚀 New photos available! Click to load.
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-400">Loading photos...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-gray-700 p-2 rounded shadow">
              <img
                src={photo.img_src}
                alt="Mars"
                className="rounded w-full h-auto mb-2"
              />
              <p className="text-sm">📷 {photo.camera.full_name}</p>
              <p className="text-xs text-gray-400">Rover: {photo.rover.name}</p>
              <div className="flex justify-center mb-2">
                <button
                  onClick={() => handleDownload(photo.img_src, photo.id)}
                  className="bg-yellow-400 text-black font-medium px-3 py-1 rounded text-sm hover:bg-yellow-300 transition shadow-lg"
                >
                  ⬇ Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MarsRoverPhotos;
