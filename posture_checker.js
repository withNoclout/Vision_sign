// Posture Checker Module
// Simplified posture calculation based on eye-shoulder line parallelism
// Real-time monitoring starts automatically with webcam

// Calculate posture ratios from landmarks
function calculatePostureRatios(landmarks) {
    const ratios = {};
    
    // Eye landmarks (indices 2=left eye, 5=right eye)
    const leftEye = landmarks[2];
    const rightEye = landmarks[5];
    
    // Shoulder landmarks (indices 11=left shoulder, 12=right shoulder)
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    
    // Calculate angle of eye line (left eye to right eye)
    const eyeAngle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI);
    
    // Calculate angle of shoulder line (left shoulder to right shoulder)
    const shoulderAngle = Math.atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x) * (180 / Math.PI);
    
    // Parallelism: absolute difference in angles (0 means perfectly parallel)
    ratios.eyeShoulderParallelism = Math.abs(eyeAngle - shoulderAngle);
    
    // Store angles and landmarks for visualization
    ratios.eyeAngle = eyeAngle;
    ratios.shoulderAngle = shoulderAngle;
    ratios.leftEye = leftEye;
    ratios.rightEye = rightEye;
    ratios.leftShoulder = leftShoulder;
    ratios.rightShoulder = rightShoulder;
    
    return ratios;
}

// Calculate real-time posture score based on eye-shoulder parallelism
function calculatePostureScore(currentPosture) {
    if (!currentPosture || currentPosture.eyeShoulderParallelism === undefined) {
        return 0;
    }
    
    // Parallelism angle difference (0-180 degrees possible)
    const parallelismDiff = currentPosture.eyeShoulderParallelism;
    
    // Convert to percentage score (0 degrees diff = 100%, 45 degrees = 0%)
    // Linear scaling: score = 100 - (angle * 100/45)
    const score = Math.max(0, 100 - (parallelismDiff * (100 / 45)));
    
    return Math.min(100, Math.max(0, score));
}
