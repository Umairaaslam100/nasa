import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EpicImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEpic() {
      try {
        const res = await axios.get('http://localhost:5000/api/epic');  // 🔁 Call your backend
        setImages(res.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch EPIC images:', err);
        setError('Failed to load EPIC images. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchEpic();
  }, []);

  const getImageUrl = (image, date) => {
    const [year, month, day] = date.split(' ')[0].split('-');
    return `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${image}.png`;
  };

  const handleDownload = async (imgSrc, imageName) => {
    try {
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imgSrc)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${imageName}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Error downloading EPIC image:', err);
      alert('Failed to download image.');
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">🌍 EPIC Earth Images</h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading photos...</p>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : images.length === 0 ? (
        <p className="text-center text-gray-400">No images available.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map(({ image, date }, index) => {
            const imageUrl = getImageUrl(image, date);
            const utcDate = new Date(date).toUTCString();

            return (
              <div key={index} className="bg-gray-700 p-2 rounded shadow text-center">
                <img
                  src={imageUrl}
                  alt={`EPIC Earth on ${utcDate}`}
                  className="rounded w-full h-auto mb-2"
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <p className="text-xs text-gray-400 mb-1">{utcDate}</p>
                <button
                  onClick={() => handleDownload(imageUrl, `epic_image_${image}`)}
                  className="inline-block mt-1 px-3 py-1 text-sm bg-yellow-400 text-black font-medium rounded hover:bg-yellow-300 transition"
                >
                  ⬇ Download
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EpicImages;
