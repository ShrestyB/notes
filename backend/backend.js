const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 3001;

app.use(express.json());

app.post('/api/ai/glossary', async (req, res) => {
    const { text } = req.body;
    const apiKey = process.env.GROQ_API_KEY; // Get the API key from the environment variable

    try {
        // Make a request to the Groq API
        const response = await axios.post('https://api.groq.com/glossary', {
            text: text,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`, // Send the API key in the Authorization header
            },
        });

        const glossaryTerms = response.data.terms; // Assuming the API returns terms in this format
        res.json({ terms: glossaryTerms });
    } catch (error) {
        console.error("Error fetching glossary terms:", error);
        res.status(500).json({ error: "Failed to fetch glossary terms" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
