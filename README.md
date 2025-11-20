# Vision Sign

Real-time posture detection and analysis system using MediaPipe pose estimation. Monitor your posture alignment in real-time with visual feedback on your eye-shoulder line parallelism.

## 🎯 Overview

Vision Sign is a web-based application that uses MediaPipe's pose detection to analyze body posture in real-time through your webcam. The system calculates the parallelism between your eye line (connecting left and right eyes) and your shoulder line (connecting left and right shoulders), providing an instant posture score from 0-100%.

**Key Feature**: The system automatically starts posture monitoring as soon as you activate your webcam - no setup required!

## ✨ Features

- **Real-Time Posture Detection**: Continuous posture analysis from your webcam feed
- **Eye-Shoulder Parallelism Analysis**: Measures alignment between eye level and shoulder level
- **Live Visual Feedback**: 
  - Cyan line showing eye level alignment
  - Magenta line showing shoulder level alignment
  - Color-coded posture score (Green: 85%+, Orange: 70-84%, Red: <70%)
- **Skeleton Overlay**: Green skeleton visualization of detected pose landmarks
- **Responsive Web Interface**: Works on modern browsers with WebRTC support
- **No Configuration Needed**: Start webcam → automatic posture monitoring begins
- **Server-Based**: Express.js backend for future Arduino/IoT integration

## 🚀 Getting Started

### Prerequisites

- Node.js >= 14.0.0
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Webcam access
- Internet connection (for CDN libraries)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/vision-sign.git
cd vision-sign

# Install dependencies
npm install

# Start the server
npm start
```

The application will be available at `http://localhost:3000`

## 📖 Usage

1. **Open the Website**
   - Navigate to `http://localhost:3000`

2. **Start Webcam**
   - Click "Start Webcam" button
   - Grant camera permissions when prompted
   - Your skeleton and posture score will appear automatically

3. **Monitor Your Posture**
   - Watch the cyan (eye line) and magenta (shoulder line) lines on the video
   - Check the percentage score in the top-right corner
   - Adjust your sitting position for better alignment

4. **Stop Monitoring**
   - Click "Stop Webcam" to end the session

### Understanding the Score

- **85-100%**: Excellent posture - Your eye and shoulder lines are nearly parallel
- **70-84%**: Good posture - Minor misalignment detected
- **Below 70%**: Needs improvement - Significant angle difference detected

## 🏗️ Project Structure

```
vision-sign/
├── index.html              # Main HTML structure
├── styles.css              # Styling and layout
├── app.js                  # MediaPipe integration and pose drawing
├── posture_checker.js      # Posture calculation logic
├── server.js               # Express.js server
├── package.json            # Node.js dependencies
├── good_posture_ratio.json # Default posture baseline data
├── README.md               # Documentation
└── .gitignore              # Git ignore rules
```

## 🔧 Technical Details

### Technologies Used

- **Frontend**
  - HTML5 Canvas API for real-time visualization
  - MediaPipe Pose for skeleton detection
  - WebRTC for webcam access
  - Vanilla JavaScript (no frameworks)

- **Backend**
  - Express.js for web server
  - Node.js runtime

### How It Works

1. **Pose Detection**: MediaPipe detects 33 body landmarks in real-time
2. **Angle Calculation**: 
   - Eye line angle = atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x)
   - Shoulder line angle = atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x)
   - Parallelism = absolute difference between angles
3. **Score Generation**: 
   - 0° difference = 100% (perfect parallelism)
   - 45° difference = 0%
   - Linear scaling between

### Pose Landmarks Used

- **Left Eye** (index 2)
- **Right Eye** (index 5)
- **Left Shoulder** (index 11)
- **Right Shoulder** (index 12)
- **Additional landmarks** for full skeleton visualization

## 📊 Data Storage

- `good_posture_ratio.json` stores baseline posture reference
- Default values provided for immediate testing
- Can be updated when new posture baseline is created

## 🎨 Visual Elements

- **Cyan Line**: Eye-level alignment (connecting left and right eyes)
- **Magenta Line**: Shoulder-level alignment (connecting left and right shoulders)
- **Green Skeleton**: Full body pose with joints and connections
- **Green Dots**: Individual pose landmarks with confidence indicators
- **Score Display**: Top-right corner showing percentage and status

## 🚀 Future Enhancements

- [ ] Arduino integration for physical feedback
- [ ] Posture history and analytics
- [ ] Multiple posture metrics (spine alignment, head tilt, etc.)
- [ ] Audio alerts for bad posture
- [ ] Mobile app version
- [ ] Real-time data export for analysis
- [ ] Custom posture profiles for different activities

## 💡 Use Cases

- **Ergonomic Monitoring**: Monitor desk posture during work
- **Fitness Training**: Track body alignment during exercises
- **Physical Therapy**: Rehabilitation posture monitoring
- **Accessibility**: Assistive technology for posture awareness
- **Research**: Data collection for posture studies

## ⚙️ Environment Variables

```bash
PORT=3000  # Default server port (optional)
```

## 🐛 Troubleshooting

### No skeleton appears
- Ensure good lighting for body visibility
- Position yourself fully in frame (head to shoulders minimum)
- Check webcam permissions in browser settings

### Percentage shows 0%
- Make sure MediaPipe has loaded landmarks
- Position yourself in neutral standing/sitting pose
- Ensure both eyes and shoulders are visible

### Server won't start
```bash
# Kill any existing process on port 3000
lsof -i :3000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
npm start
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📧 Contact & Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 🙏 Acknowledgments

- **MediaPipe**: Google's pose detection framework
- **Express.js**: Web application framework
- **Node.js**: JavaScript runtime

---

**Version**: 1.0.0  
**Last Updated**: November 20, 2025  
**Status**: Active Development

