// Initialize MediaPipe Pose
const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});

// Global variable to store current landmarks
window.currentLandmarks = null;

// Camera and canvas setup
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const canvasCtx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusEl = document.getElementById('status');

let camera = null;
let isRunning = false;

// Configure pose detection
pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

// Handle pose detection results
pose.onResults(onResults);

// Start webcam
startBtn.addEventListener('click', async () => {
    try {
        startBtn.disabled = true;
        statusEl.textContent = 'Initializing webcam...';
        statusEl.parentElement.classList.remove('error');
        statusEl.parentElement.classList.add('active');

        // Setup canvas size
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } }
        });

        video.srcObject = stream;
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Initialize camera
            camera = new Camera(video, {
                onFrame: async () => {
                    await pose.send({ image: video });
                },
                width: video.videoWidth,
                height: video.videoHeight
            });

            camera.start();
            isRunning = true;
            stopBtn.disabled = false;
            statusEl.textContent = 'Webcam active - Pose detection running';
            statusEl.parentElement.classList.add('active');
        };

    } catch (error) {
        console.error('Error accessing webcam:', error);
        statusEl.textContent = `Error: ${error.message}`;
        statusEl.parentElement.classList.add('error');
        startBtn.disabled = false;
    }
});

// Stop webcam
stopBtn.addEventListener('click', () => {
    if (camera) {
        camera.stop();
        isRunning = false;
    }

    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    statusEl.textContent = 'Webcam stopped';
    statusEl.parentElement.classList.remove('active');
    statusEl.parentElement.classList.remove('error');
    startBtn.disabled = false;
    stopBtn.disabled = true;
});

// Handle pose detection results
function onResults(results) {
    // Clear canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame
    canvasCtx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    // Store current landmarks for posture checker
    if (results.poseLandmarks && results.poseLandmarks.length > 0) {
        window.currentLandmarks = results.poseLandmarks;
        drawPose(results.poseLandmarks);
        
        // Real-time posture monitoring (always on when webcam is running)
        if (isRunning) {
            const ratios = calculatePostureRatios(results.poseLandmarks);
            const score = calculatePostureScore(ratios);
            drawPostureScore(score);
            drawParallelLines(ratios);
        }
    }

    canvasCtx.restore();
}

// Draw eye and shoulder parallel lines
function drawParallelLines(ratios) {
    if (!ratios.leftEye || !ratios.rightEye || !ratios.leftShoulder || !ratios.rightShoulder) {
        return;
    }
    
    const leftEye = ratios.leftEye;
    const rightEye = ratios.rightEye;
    const leftShoulder = ratios.leftShoulder;
    const rightShoulder = ratios.rightShoulder;
    
    // Draw eye line
    canvasCtx.strokeStyle = '#00FFFF';
    canvasCtx.lineWidth = 3;
    canvasCtx.beginPath();
    canvasCtx.moveTo(leftEye.x * canvas.width, leftEye.y * canvas.height);
    canvasCtx.lineTo(rightEye.x * canvas.width, rightEye.y * canvas.height);
    canvasCtx.stroke();
    
    // Draw shoulder line
    canvasCtx.strokeStyle = '#FF00FF';
    canvasCtx.lineWidth = 3;
    canvasCtx.beginPath();
    canvasCtx.moveTo(leftShoulder.x * canvas.width, leftShoulder.y * canvas.height);
    canvasCtx.lineTo(rightShoulder.x * canvas.width, rightShoulder.y * canvas.height);
    canvasCtx.stroke();
    
    // Draw small circles at endpoints
    canvasCtx.fillStyle = '#00FFFF';
    canvasCtx.beginPath();
    canvasCtx.arc(leftEye.x * canvas.width, leftEye.y * canvas.height, 5, 0, 2 * Math.PI);
    canvasCtx.fill();
    
    canvasCtx.beginPath();
    canvasCtx.arc(rightEye.x * canvas.width, rightEye.y * canvas.height, 5, 0, 2 * Math.PI);
    canvasCtx.fill();
    
    canvasCtx.fillStyle = '#FF00FF';
    canvasCtx.beginPath();
    canvasCtx.arc(leftShoulder.x * canvas.width, leftShoulder.y * canvas.height, 5, 0, 2 * Math.PI);
    canvasCtx.fill();
    
    canvasCtx.beginPath();
    canvasCtx.arc(rightShoulder.x * canvas.width, rightShoulder.y * canvas.height, 5, 0, 2 * Math.PI);
    canvasCtx.fill();
}

// Draw posture score on canvas
function drawPostureScore(score) {
    const x = canvas.width - 120;
    const y = 80;
    
    // Determine color based on score
    let color = '#ff4444'; // Red - poor
    let status = 'Needs Improvement';
    
    if (score >= 85) {
        color = '#44ff44'; // Green - excellent
        status = 'Excellent!';
    } else if (score >= 70) {
        color = '#ffaa00'; // Orange - good
        status = 'Good';
    }
    
    // Draw semi-transparent background
    canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    canvasCtx.fillRect(x - 100, y - 60, 200, 120);
    
    // Draw border
    canvasCtx.strokeStyle = color;
    canvasCtx.lineWidth = 3;
    canvasCtx.strokeRect(x - 100, y - 60, 200, 120);
    
    // Draw score percentage
    canvasCtx.fillStyle = color;
    canvasCtx.font = 'bold 48px Arial';
    canvasCtx.textAlign = 'center';
    canvasCtx.textBaseline = 'middle';
    canvasCtx.fillText(score.toFixed(0) + '%', x, y);
    
    // Draw status text
    canvasCtx.font = 'bold 14px Arial';
    canvasCtx.fillStyle = color;
    canvasCtx.fillText(status, x, y + 35);
}

// Draw pose landmarks and connections
function drawPose(landmarks) {
    // Draw connections (skeleton)
    const connections = [
        [11, 13], [13, 15], // Left arm
        [12, 14], [14, 16], // Right arm
        [11, 23], [12, 24], // Torso to hips
        [23, 25], [25, 27], // Left leg
        [24, 26], [26, 28], // Right leg
        [23, 24], // Hips
        [11, 12]  // Shoulders
    ];

    // Draw skeleton
    canvasCtx.strokeStyle = '#00FF00';
    canvasCtx.lineWidth = 2;

    connections.forEach(([start, end]) => {
        const startPoint = landmarks[start];
        const endPoint = landmarks[end];

        if (startPoint.visibility > 0.3 && endPoint.visibility > 0.3) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
            canvasCtx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
            canvasCtx.stroke();
        }
    });

    // Draw landmarks (points)
    landmarks.forEach((landmark, index) => {
        if (landmark.visibility > 0.3) {
            // Determine color based on visibility
            const alpha = landmark.visibility;
            canvasCtx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
            canvasCtx.beginPath();
            canvasCtx.arc(
                landmark.x * canvas.width,
                landmark.y * canvas.height,
                4,
                0,
                2 * Math.PI
            );
            canvasCtx.fill();
        }
    });
}

// Request camera permissions on load
window.addEventListener('load', () => {
    statusEl.textContent = 'Click "Start Webcam" to begin';
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (camera) {
        camera.stop();
    }
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
});
