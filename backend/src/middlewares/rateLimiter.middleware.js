const rateLimit = require('express-rate-limit');

// General API protection - prevents raw request flooding on any route
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,                  // 200 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." }
});

// Tighter limit specifically for payment generation, since each one can
// trigger an AI agent call (Gemini + Chroma) - protects your free-tier quota
const paymentGenerationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,             // 10 payment generations per IP per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many payment events generated. Slow down." }
});

module.exports = { generalLimiter, paymentGenerationLimiter };