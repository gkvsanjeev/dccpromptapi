const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({
    origin: "https://digitalcc-ncs.crm5.dynamics.com", 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));
app.use(bodyParser.urlencoded({ extended: true })); // Parse form data
app.use(bodyParser.json()); // Parse JSON body

app.get('/', (req, res) => {
    res.send('DCC Prompt api running');
});

app.get('/ping', (req, res) => {
    res.send('Hello, I am up and running.');
});

app.post("/getPromptResult", async (req, res) => {
    const { query, url, apikey } = req.body;

    if (!query || !url || !apikey) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        const response = await axios.post(url, { Query: query }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apikey}`
            }
        });

        const answer = response.data.Output || "No answer provided.";
        console.log(answer);
        res.json({ answer });
    } catch (error) {
        console.error("Request failed:", error);
        res.status(error.response?.status || 500).json({ 
            error: `Request failed with status code: ${error.response?.status || 500}` 
        });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
