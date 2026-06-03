const express = require('express');
const path = require('path');
const youtubedl = require('youtube-dl-exec');

const app = express();
const PORT = 3000;

// Enable middleware to parse incoming JSON payloads
app.use(express.json());

// Serve the front-end HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Post endpoint to receive the URL and trigger yt-dlp execution
app.post('/api/download', async (req, res) => {
    const { videoUrl, formatType } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ success: false, error: 'A valid URL is required.' });
    }

    try {
        // Configure flags based on UI selection (Video vs. Audio Extraction)
        const flags = formatType === 'mp3' 
            ? { extractAudio: true, audioFormat: 'mp3', output: '%(title)s.%(ext)s' }
            : { format: 'bestvideo+bestaudio/best', mergeOutputFormat: 'mp4', output: '%(title)s.%(ext)s' };

        console.log(`Starting download for: ${videoUrl}`);
        
        // Execute yt-dlp wrapper cleanly
        const output = await youtubedl(videoUrl, flags);
        
        console.log('Download complete:', output);
        res.json({ success: true, message: 'Video downloaded successfully to the server environment.' });

    } catch (error) {
        console.error('Execution Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running smoothly at http://localhost:${PORT}`);
});
