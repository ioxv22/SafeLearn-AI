const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = 3000;

// SafeLearn Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { text } = req.body;

        // Build prompt for KILWA-CHAT simulating the SafeLearn behavior
        const safeLearnPrompt = `أنت SafeLearn AI، مساعد تعليمي أخلاقي. لا تعطي الإجابة النهائية أبداً. وجه الطالب خطوة بخطوة بالأسئلة. الطالب يقول: ${text}`;

        const apiUrl = `http://de3.bot-hosting.net:21007/kilwa-chat?text=${encodeURIComponent(safeLearnPrompt)}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();

        // Clean up response if it contains JSON or weird formatting
        let reply = data.reply || "عذراً، حدث خطأ في النظام.";

        res.json({
            success: true,
            reply: reply
        });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ success: false, reply: "عذراً، الخادم غير متوفر حالياً. يرجى المحاولة لاحقاً." });
    }
});

// SafeLearn Video Generation Endpoint (Seedance AI)
app.post('/api/video', async (req, res) => {
    try {
        const { prompt } = req.body;

        // Add educational context to video prompt
        const videoPrompt = `Educational 3D animation, highly detailed, explaining: ${prompt}`;

        const response = await fetch('https://zecora0.serv00.net/ai/Seedance.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: videoPrompt,
                model: "Seedance 1.5 Pro",
                duration: 8,
                resolution: "720p",
                aspect_ratio: "16:9"
            })
        });

        if (!response.ok) {
            throw new Error(`Video API returned status ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data && data.data.video_url) {
            res.json({
                success: true,
                video_url: data.data.video_url
            });
        } else {
            throw new Error("Failed to get video URL from Seedance API");
        }
    } catch (error) {
        console.error("Video Error:", error);
        res.status(500).json({ success: false, error: "فشل إنشاء الفيديو، حاول مرة أخرى." });
    }
});

app.get('/api/youtube', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ success: false, error: 'Query missing' });
        const response = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
        const html = await response.text();
        const match = html.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
        if (match && match[1]) {
            res.json({ success: true, videoId: match[1] });
        } else {
            res.json({ success: false, error: 'No video found' });
        }
    } catch (error) {
        console.error("YouTube Search Error:", error);
        res.status(500).json({ success: false, error: "Search failed" });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 SafeLearn Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
