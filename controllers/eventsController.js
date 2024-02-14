const db = require("../db/index.js");

const validateUser = async (req, res, next) => {
  const userId = req.user.id;
  const { tripId } = req.params;
  try {
    const trip = await db.query(
      "SELECT * FROM usertrips WHERE userid=$1 AND tripid=$2",
      [userId, tripId]
    );
    console.log(trip.rows);
    if (trip.rows.length > 0) {
      next();
    } else {
      res.status(403).json({ error: "Unauthorised access" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: error });
  }
};

const index = async (req, res) => {
  const { tripId } = req.params;
  try {
    const events = await db.query("SELECT * FROM events WHERE tripid = $1", [
      tripId,
    ]);
    console.log(events.rows);
    res.json(events.rows);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong", error: e });
  }
};

const createEvent = async (req, res) => {
  const { tripId } = req.params;
  try {
    const { name, type, description, start, end } = req.body;
    console.log(name, type, description, start, end);
    const event = await db.query(
      'INSERT INTO events (tripid, name, type, description, start, "end") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tripId, name, type, description, start, end]
    );
    res.json(event.rows[0]);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong", error: e });
  }
};

module.exports = {
  validateUser,
  index,
  createEvent,
};
