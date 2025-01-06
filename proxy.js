const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors());

app.get('/proxy', (req, res) => {
    const url = req.query.url;
    console.log('Fetching URL:', url);
    
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    };

    https.get(url, options, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            console.log('Response headers:', response.headers);
            if (response.statusCode === 200) {
                console.log('Found video URLs:', data.match(/(?:video|source)[^>]+src="[^"]+"/g));
                res.send(data);
            } else {
                console.log('Error status:', response.statusCode);
                res.status(response.statusCode).send(`Error: ${response.statusCode}`);
            }
        });
    }).on('error', (error) => {
        console.error('Proxy error:', error);
        res.status(500).send(error.toString());
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));