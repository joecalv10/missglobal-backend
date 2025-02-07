import User from "../models/user.js";
import { createJwtToken, refreshJwtToken, verifyToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/auth.js";

// Ensure JWT secret is available
const jwtSecret = process.env.JWT_SECRET || "Missglobal2025"; // Fallback to default if not set in the environment

const AuthController = {
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "Email and Password are required!" });

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User Not Found!" });

      const pinMatch = await comparePassword(password, user.password);
      if (!pinMatch) return res.status(400).json({ message: "Invalid Password!" });

      // Create the JWT tokens using the new JWT_SECRET
      const accesstoken = createJwtToken(
        email,
        user.tokenVersion,
        user._id,
        user.role,
        jwtSecret // pass the JWT secret here
      );

      const refreshtoken = refreshJwtToken(
        email,
        user.tokenVersion,
        user._id,
        user.role,
        jwtSecret // pass the JWT secret here
      );

      return res.status(200).json({
        message: {
          accesstoken,
          refreshtoken,
          role: user.role,
        },
        status: true,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message, status: false });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refresh } = req.body;

      if (!refresh) return res.status(400).json({ message: "Refresh token is required!" });
      
      // Verify the refresh token using the JWT_SECRET
      const tokenDetails = await verifyToken(refresh, jwtSecret); // pass the JWT secret here

      if (!tokenDetails) return res.status(401).json({ message: "Unauthorised" });

      // Create a new access token after refreshing
      const accesstoken = createJwtToken(
        tokenDetails.email,
        tokenDetails.tokenVersion,
        tokenDetails.id,
        tokenDetails.role,
        jwtSecret // pass the JWT secret here
      );

      return res.status(200).json({ message: accesstoken, status: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      const JWT = req.headers["authorization"].replace("JWT ", "");
      const tokenDetails = await verifyToken(JWT, jwtSecret); // pass the JWT secret here
      if (!tokenDetails) return res.status(401).json({ message: "Unauthorised" });

      await User.findByIdAndUpdate(tokenDetails.id, {
        tokenVersion: tokenDetails.tokenVersion + 1,
      });

      return res.json({ message: "Signout success", status: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false, message: error.message });
    }
  },

  addNewAdmin: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password)
        return res.status(400).json({ message: "Email, name, or password is missing!" });

      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists!" });

      const hashedPassword = await hashPassword(password);
      const newUser = await User.create({
        email,
        name,
        password: hashedPassword,
        role: "ADMIN", // Setting role as admin for the new user
      });

      return res.status(200).json({ message: newUser, status: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: err.message, status: false });
    }
  },
};

export default AuthController;
