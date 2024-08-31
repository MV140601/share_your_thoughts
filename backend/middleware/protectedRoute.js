import jwt from "jsonwebtoken";
import Users from '../models/user.model.js'; // Ensure the correct path

export const protectedRoute = async (req, res, next) => {
    try {
        // Extract token from cookies
        const token = req.cookies.jwt;

        // Check if token is present
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "qsds9qhd92qus1");

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // Find user by ID and exclude password from result
        const user = await Users.findById(decoded.userId).select("-passWord");

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (err) {
        // Handle errors (e.g., token expired, malformed token)
        console.error("Error in protectedRoute:", err.message);
        res.status(400).json({ error: "Bad Request: " + err.message });
    }
};
