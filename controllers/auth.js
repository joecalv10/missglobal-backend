import User from "../models/users.js";
import { createJwtToken, refreshJwtToken, verifyToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/auth.js";

// Ensure JWT secret is available
const jwtSecret = process.env.JWT_SECRET || "Misssglobal2025"; // Fallback to default if not set in the environment

const AuthController = {
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        throw new Error("Email or Password is required!");

      const user = await User.findOne({ email });
      if (!user) throw new Error("User Not Found!");

      const pinMatch = await comparePassword(password, user.password);
      if (!pinMatch) throw new Error("Invalid Password!");

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

      res.status(200).json({
        message: {
          accesstoken,
          refreshtoken,
          role: user.role,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message, status: false });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refresh } = req.body;

      if (!refresh) return res.status(401).json({ message: "Invalid Fields" });
      
      // Verify the refresh token using the JWT_SECRET
      const tokenDetails = await verifyToken(refresh, jwtSecret); // pass the JWT secret here

      if (!tokenDetails)
        return res.status(401).json({ message: "Unauthorised" });

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
      res.status(400).json({ status: false, message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      const JWT = req.headers["authorization"].replaceAll("JWT ", "");
      const tokenDetails = await verifyToken(JWT, jwtSecret); // pass the JWT secret here
      if (!tokenDetails)
        return res.status(401).json({ message: "Unauthorised" });

      await User.findByIdAndUpdate(tokenDetails.id, {
        tokenVersion: tokenDetails.tokenVersion + 1,
      });

      return res.json({ message: "signout success", status: true });
    } catch (error) {
      return res.status(400).json({ status: false });
    }
  },

  addNewAdmin: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password)
        throw new Error("Email, name, role Or Password is required!");

      const user = await User.findOne({ email });
      if (user) throw new Error("User already Exists!");

      const hashedPassword = await hashPassword(password);
      const newUser = await User.create({
        email,
        name,
        password: hashedPassword,
      });

      return res.status(200).json({ message: newUser });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};

export default AuthController;
