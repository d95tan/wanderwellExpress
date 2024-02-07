const bcrypt = require("bcrypt");

const db = require("../db/index.js");
const userService = require("../services/userService.js");

const index = async (req, res) => {
  res.json({msg: "all users"});
};

const create = async (req, res) => {
  try {
    const data = req.body;
    const password = await userService.hashPassword(data.password);
    const user = await db.query(
      "INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING *",
      [data.email, data.name, password]
    );
    const token = userService.createJWT(
      userService.transformUser(user.rows[0])
    );
    res.json(token);
  } catch (err) {
    res.status(400).json(err);
  }
};

//* Login user function
async function login(req, res) {
  try {
    const input = req.body
    const query = await db.query("SELECT * FROM users WHERE email = $1", [input.email])
    const user = query.rows[0];
    if (!user) throw new Error();
    const match = await userService.comparePasswords(input.password, user.password);
    console.log(match)
    if (!match) throw new Error();
    res.json(userService.createJWT(userService.transformUser(user)));
  } catch {
    res.status(400).json("Bad Credentials");
  }
}

module.exports = {
  index,
  create,
  login,
};
//? added 'createJWT' here, in order to import to 'userprefersController' to use...
