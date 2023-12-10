require("dotenv").config();
const jwt = require("jsonwebtoken");

function generateToken(user) {
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ userEmail: user.email }, secretKey, {
    expiresIn: "90d",
  });
  return token;
}

module.exports = generateToken;
