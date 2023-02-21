const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMS: 60 * 1000, // 1 min
    max: 10, // TODO: figure out what this number should be.
    message: 'Too many requests. Please try again in 1 min.',
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {rateLimiter};