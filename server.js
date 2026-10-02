const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.all('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Error: Walang nailagay na target URL.');
    }

    try {
        console.log(`[PROXY] Kinukuha ang: ${targetUrl}`);
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const contentType = response.headers.get('content-type') || 'text/html';
        res.setHeader('Content-Type', contentType);
        
        const data = await response.text();
        res.send(data);
    } catch (err) {
        res.status(500).send('Proxy Error: ' + err.message);
    }
});

app.get('/', (req, res) => {
    res.send('🚀 Cloud Proxy Server ay Online!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
