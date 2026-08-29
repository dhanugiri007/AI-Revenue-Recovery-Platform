const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        // 1. Get the token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, please login" });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

        // 3. Attach user data to req object so controllers can access it
        req.user = { id: decoded.id };
        
        next(); // Move to the controller
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
};

module.exports = { protect };
