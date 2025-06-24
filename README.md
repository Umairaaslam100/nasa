# NASA Space Explorer 🚀

A comprehensive web application that provides access to various NASA APIs, allowing users to explore space data, images, and information through an intuitive interface.

## Features

- **🌌 Astronomy Picture of the Day (APOD)** - View NASA's daily space images with detailed descriptions
- **🔴 Mars Rover Photos** - Browse photos from NASA's Curiosity rover on Mars
- **☄️ Near-Earth Objects (NEOs)** - Track asteroids and comets near Earth
- **📊 Asteroid Data Visualization** - Interactive charts showing asteroid activity
- **🌍 EPIC Images** - Daily Earth images from NASA's EPIC satellite
- **📚 NASA Media Library** - Search and explore NASA's vast media collection
- **📥 Image Download** - Download high-resolution space images directly

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express.js
- **APIs**: NASA Open APIs
- **Deployment**: Render.com

## Project Structure

```
nasa/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   └── config.js      # API configuration
│   └── package.json
├── backend/           # Node.js/Express server
│   ├── api/           # API route handlers
│   ├── tests/         # Test files
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nasa
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Start the development servers**
   ```bash
   # Terminal 1: Start backend (from backend directory)
   cd backend
   npm start
   
   # Terminal 2: Start frontend (from frontend directory)
   cd frontend
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/apod` | Astronomy Picture of the Day |
| `GET /api/mars` | Mars Rover photos |
| `GET /api/asteroids` | Near-Earth asteroid data |
| `GET /api/neows` | Near-Earth Objects Web Service |
| `GET /api/epic` | EPIC Earth images |
| `GET /api/nasa-media` | NASA media library search |
| `GET /api/image-proxy` | Image proxy for downloads |

## Deployment

### Render.com Setup

1. **Connect your repository** to Render
2. **Create a new Web Service**
3. **Configure the service:**
   - **Root Directory**: `/` (leave empty)
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node

4. **Deploy** - Render will automatically build and deploy your application

## Environment Variables

The application uses NASA's public API key by default. For production, consider setting:

```env
NASA_API_KEY=your_nasa_api_key_here
```

## Testing

Run tests from the backend directory:
```bash
cd backend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Note**: This application uses NASA's public APIs. For heavy usage, consider obtaining your own API key from [NASA API Portal](https://api.nasa.gov/).