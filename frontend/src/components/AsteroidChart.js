import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import API_BASE_URL from '../config';

ChartJS.register(CategoryScale, LinearScale, BarElement);

function AsteroidChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/asteroids`);
        const data = response.data.near_earth_objects;
        if (!data) {
          console.error('No near_earth_objects found in response');
          return;
        }

        const days = Object.keys(data).sort(); // Sort dates ascending
        const counts = days.map(day => data[day].length);

        setChartData({
          labels: days,
          datasets: [
            {
              label: 'Number of Asteroids',
              data: counts,
              backgroundColor: 'rgba(255, 206, 86, 0.6)',
            },
          ],
        });
      } catch (err) {
        console.error('Failed to fetch asteroid data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', background: '#222', padding: 20, borderRadius: 8 }}>
      <h2 style={{ color: '#fff' }}>☄️ Near-Earth Asteroids (Past 7 Days)</h2>
      {chartData ? <Bar data={chartData} /> : <p style={{ color: '#ccc' }}>Loading chart...</p>}
    </div>
  );
}

export default AsteroidChart;
