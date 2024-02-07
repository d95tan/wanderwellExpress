const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const hashPassword = async (password) => {
  const saltRounds = 6;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};

const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const transformUser = (user) => {
  if (user) {
    const { password, ...rest } = user;
    return rest;
  }
  return null;
};

function createJWT(user, expiresIn = "24h") {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn }
  );
}

module.exports = {
  hashPassword,
  comparePasswords,
  transformUser,
  createJWT,
};
