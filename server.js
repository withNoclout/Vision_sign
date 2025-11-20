const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to save posture data
app.post('/api/save-posture', (req, res) => {
    const { type, data, current, differences, score, timestamp } = req.body;
    const dataFile = path.join(__dirname, 'good_posture_ratio.json');
    
    try {
        let jsonData = {};
        
        // Read existing data
        if (fs.existsSync(dataFile)) {
            const fileContent = fs.readFileSync(dataFile, 'utf-8');
            jsonData = JSON.parse(fileContent);
        }
        
        if (type === 'good_posture') {
            // Save good posture reference
            jsonData.good_posture_reference = {
                timestamp: new Date().toISOString(),
                measurements: data,
                status: 'set'
            };
            jsonData.metadata.created = new Date().toISOString();
            jsonData.metadata.last_updated = new Date().toISOString();
        } else if (type === 'posture_check') {
            // Save posture check history
            const checkRecord = {
                timestamp: timestamp,
                current_posture: current,
                differences: differences,
                score: score
            };
            
            if (!Array.isArray(jsonData.posture_history)) {
                jsonData.posture_history = [];
            }
            
            jsonData.posture_history.push(checkRecord);
            jsonData.metadata.last_updated = new Date().toISOString();
            jsonData.metadata.total_checks = jsonData.posture_history.length;
        }
        
        // Write updated data
        fs.writeFileSync(dataFile, JSON.stringify(jsonData, null, 2));
        res.json({ success: true, message: 'Posture data saved successfully' });
    } catch (error) {
        console.error('Error saving posture data:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API endpoint to get good posture reference
app.get('/api/good-posture', (req, res) => {
    const dataFile = path.join(__dirname, 'good_posture_ratio.json');
    
    try {
        if (fs.existsSync(dataFile)) {
            const fileContent = fs.readFileSync(dataFile, 'utf-8');
            const jsonData = JSON.parse(fileContent);
            res.json(jsonData.good_posture_reference);
        } else {
            res.json({ status: 'not_set' });
        }
    } catch (error) {
        console.error('Error reading posture data:', error);
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get posture history
app.get('/api/posture-history', (req, res) => {
    const dataFile = path.join(__dirname, 'good_posture_ratio.json');
    
    try {
        if (fs.existsSync(dataFile)) {
            const fileContent = fs.readFileSync(dataFile, 'utf-8');
            const jsonData = JSON.parse(fileContent);
            res.json(jsonData.posture_history || []);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error reading posture history:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Vision Sign running at http://localhost:${PORT}`);
});
