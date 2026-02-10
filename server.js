// index.js
import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFibonacci, isPrime, getHCF, getLCM } from './utils.js';

dotenv.config();
const app = express();
app.use(express.json()); // Robust parsing

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET /health
app.get('/health', (req, res) => {
    res.status(200).json({ is_success: true, official_email: process.env.OFFICIAL_EMAIL });
});

// POST /bfhl
app.post('/bfhl', async (req, res) => {
    try {
        const keys = Object.keys(req.body);
        
        // Validation: Exactly one key allowed
        if (keys.length !== 1) {
            return res.status(400).json({ is_success: false, message: "Request must contain exactly one valid key." });
        }

        const key = keys[0];
        const val = req.body[key];
        let resultData;

        switch (key) {
            case 'fibonacci':
                if (!Number.isInteger(val) || val < 0) throw new Error("Invalid integer for Fibonacci");
                resultData = getFibonacci(val);
                break;
            case 'prime':
                if (!Array.isArray(val)) throw new Error("Input must be an array of integers");
                resultData = val.filter(isPrime);
                break;
            case 'lcm':
                if (!Array.isArray(val) || val.length === 0) throw new Error("Input must be a non-empty array");
                resultData = getLCM(val);
                break;
            case 'hcf':
                if (!Array.isArray(val) || val.length === 0) throw new Error("Input must be a non-empty array");
                resultData = getHCF(val);
                break;
            case 'AI':
                if (typeof val !== 'string') throw new Error("AI query must be a string");
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const aiResult = await model.generateContent(`${val} (Answer in exactly one word)`);
                resultData = aiResult.response.text().trim().split(' ')[0].replace(/[^a-zA-Z0-9]/g, "");
                break;
            default:
                return res.status(400).json({ is_success: false, message: "Invalid key provided" });
        }

        res.status(200).json({
            is_success: true,
            official_email: process.env.OFFICIAL_EMAIL,
            data: resultData
        });

    } catch (error) {
        // Graceful error handling
        res.status(400).json({
            is_success: false,
            official_email: process.env.OFFICIAL_EMAIL,
            error_message: error.message
        });
    }
});

// Final Security Guardrail: Catch-all for undefined routes
app.use((req, res) => res.status(404).json({ is_success: false, message: "Route not found" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));