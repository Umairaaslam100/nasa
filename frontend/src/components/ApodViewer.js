import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../config';

function ApodViewer() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [apodList, setApodList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchApodByDate = async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    try {
      const res = await axios.get(`${API_BASE_URL}/api/apod?date=${formattedDate}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching APOD for ${formattedDate}`, err);
      return null;
    }
  };

  const handleDatePick = async (date) => {
    setSelectedDate(date);
    const data = await fetchApodByDate(date);
    if (!data) {
      setError('❌ No data available for this date.');
      return;
    }

    setApodList((prev) => {
      const alreadyExists = prev.some((item) => item.date === data.date);
      return alreadyExists ? prev : [data, ...prev];
    });
    setError(null);
  };

  const handleClear = () => {
    setApodList([]);
    setError(null);
  };

  // Download image via backend proxy to avoid CORS issues
  const handleDownload = async (url, title, date) => {
    try {
      // Proxy endpoint with encoded original image URL
      const proxyUrl = `${API_BASE_URL}/api/image-proxy?url=${encodeURIComponent(url)}`;

      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.replace(/\s+/g, '_')}_${date}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading the image:', error);
      alert('Sorry, failed to download the image.');
    }
  };

  // ✅ Only fetch today's APOD on first load
  useEffect(() => {
    const loadTodayApod = async () => {
      setLoading(true);
      const data = await fetchApodByDate(new Date());
      if (data) {
        setApodList([data]);
      }
      setLoading(false);
    };
    loadTodayApod();
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-4">
      <h2 className="text-xl font-semibold mb-4">🌅 Astronomy Picture of the Day</h2>

      <div className="flex items-center gap-4 flex-wrap mb-4">
        <DatePicker
          className="p-2 text-black rounded"
          selected={selectedDate}
          onChange={handleDatePick}
          maxDate={new Date()}
        />
         <button
                onClick={handleClear}
                className="inline-block mt-1 px-3 py-1 text-sm bg-yellow-400 text-black font-medium rounded hover:bg-yellow-300 transition"
              >
                Clear Gallery
              </button>
        
        {loading && <p className="text-yellow-400 text-sm">Loading...</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {apodList.map((apod) => (
          <div key={apod.date} className="bg-gray-700 p-2 rounded shadow">
          {apod.media_type === 'image' ? (
            <>
              <img
                src={apod.url}
                alt={apod.title}
                className="rounded w-full h-auto mb-2"
              />
            </>
          ) : (
            <>
              <iframe
                title={apod.title}
                src={apod.url}
                className="w-full h-48 rounded mb-2"
                allowFullScreen
              />
            </>
          )}
          <h4 className="font-bold text-sm">{apod.title}</h4>
          <p className="text-xs text-gray-300">{apod.date}</p>
          <div className="flex justify-center mb-2">
                <button
                  onClick={() => handleDownload(apod.url, apod.title, apod.date)}
                  className="px-3 py-1 text-sm bg-yellow-400 text-black font-medium rounded hover:bg-yellow-300 transition"
                >
                  ⬇ Download
                </button>
              </div>
        </div>
        
        
        ))}
      </div>
    </div>
  );
}

export default ApodViewer;
