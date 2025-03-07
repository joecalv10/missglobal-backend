import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const createJwtToken = (email, tokenVersion, id, role) => {
  console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
  let fields = { email, tokenVersion, id, role };
  const accesstoken = jwt.sign(fields, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return accesstoken;
};

export const refreshJwtToken = (email, tokenVersion, id, role) => {
  let fields = { email, tokenVersion, id, role };
  const refreshtoken = jwt.sign(fields, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return refreshtoken;
};

const isTokenExpired = (exp) => Date.now() >= exp * 1000;

export const verifyToken = async (token, secret) => {
  try {
    var decoded = jwt.verify(token, secret);
    let user = await User.findById(decoded.id);

    if (
      user &&
      isTokenExpired(decoded.exp) === false &&
      user.tokenVersion === decoded.tokenVersion
    )
      return user;

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
