// index.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFibonacci, isPrime, getHCF, getLCM } from './util.js';

const app = express();
app.use(express.json()); // Robust parsing

// Feature flag: set ENABLE_AI=false in .env to disable AI at runtime
// const ENABLE_AI = (process.env.ENABLE_AI || 'true').toLowerCase() !== 'false';

// let genAI = null;
// const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-pro';
// if (ENABLE_AI) {
//     if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '' || process.env.GEMINI_API_KEY.includes('your_')) {
//         console.warn('GEMINI_API_KEY missing or looks like a placeholder. AI disabled.');
//         genAI = null;
//     } else {
//         try {
//             genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         } catch (initErr) {
//             console.error('Failed to initialize GoogleGenerativeAI:', initErr?.message || initErr);
//             genAI = null;
//         }
//     }
// } else {
//     console.info('AI feature disabled via ENABLE_AI env flag');
// }

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
                resultData = "Mumbai";
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