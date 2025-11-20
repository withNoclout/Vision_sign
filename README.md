# Vision Sign

A real-time webcam capture and pose detection application using MediaPipe, designed for Arduino integration and low-level processing.

## Features

- Real-time webcam capture
- MediaPipe Pose detection for skeleton tracking
- Live visualization of body landmarks and skeleton
- Arduino-ready pose data output
- Cross-platform deployment

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Vision_sign
```

2. Install dependencies
```bash
npm install
```

## Usage

1. Start the server
```bash
npm start
```

2. Open your browser and navigate to
```
http://localhost:3000
```

3. Click "Start Webcam" to begin pose detection

## System Requirements

- Node.js >= 14.0.0
- Modern web browser with WebRTC support
- Webcam

## Project Structure

```
Vision_sign/
├── index.html       # Main HTML file
├── styles.css       # Styling
├── app.js          # Client-side MediaPipe logic
├── server.js       # Express server
├── package.json    # Dependencies
└── README.md       # This file
```

## Technologies

- **Express.js** - Web server
- **MediaPipe** - Pose detection
- **Canvas API** - Real-time visualization
- **WebRTC** - Webcam access

## Development

To run in development mode:
```bash
npm run dev
```

The server will start on port 3000 (or the PORT environment variable if set).

## Deployment

This project can be deployed on any Node.js hosting platform (Heroku, AWS, DigitalOcean, etc.):

1. Push to git repository
2. Install dependencies: `npm install`
3. Run: `npm start`

## Notes

- MediaPipe libraries are loaded from CDN
- Ensure webcam permissions are granted in the browser
- For Arduino integration, pose landmarks data is available in the app.js file

## License

MIT
