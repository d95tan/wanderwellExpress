const db = require("../db/index.js");

const index = async (req, res) => {
  const userId = req.user.id;
  try {
    const trips = await db.query(
      "SELECT * FROM trips WHERE id IN (SELECT tripid FROM usertrips WHERE userid = $1)",
      [userId]
    );
    console.log(trips.rows);
    trips.rows.sort((a, b) => {
      const dateA = a.startdate;
      const dateB = b.startdate;
      if (dateA > dateB) {
        return 1;
      } else {
        return -1;
      }
    });
    res.json(trips.rows);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong", error: e });
  }
};

const createTrip = async (req, res) => {
  // console.log(req.user)
  const userId = req.user.id;
  try {
    const data = req.body;
    const trip = await db.query(
      "INSERT INTO trips (name, startdate, enddate) VALUES ($1, $2, $3) RETURNING *",
      [data.name, data.startDate, data.endDate]
    );
    const usertrips = await db.query(
      "INSERT INTO usertrips (userid, tripid) VALUES ($1, $2) RETURNING *",
      [userId, trip.rows[0].id]
    );
    res.json(trip.rows[0]);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong", error: e });
  }
};

const indexCollaborators = async (req, res) => {
  const { tripId } = req.params;
  try {
    const collaborators = await db.query(
      "SELECT users.email FROM usertrips JOIN users ON usertrips.userid = users.id WHERE usertrips.tripid=$1",
      [tripId]
    );
    res.json(collaborators.rows);
  } catch (e) {
    res.status(500).json({ msg: "Something went wrong", error: e });
  }
};

const addCollaborator = async (req, res) => {
  const { tripId } = req.params;
  const { email } = req.body;
  if (req.user.isPremium) {
    try {
      const user = await db.query("SELECT id FROM users WHERE email = $1", [
        email,
      ]);
      const userId = user.rows[0].id;
      const collaborator = await db.query(
        "INSERT INTO usertrips (userid, tripid) VALUES ($1, $2) RETURNING *",
        [userId, tripId]
      );
      if (collaborator.rows.length > 0) {
        res.json({ email });
      } else {
        res.status(400).json({ msg: "Something went wrong" });
      }
    } catch (e) {
      res.status(500).json({ msg: "Something went wrong", error: e });
    }
  } else {
    res
      .status(403)
      .json({ msg: "This feature is only available for premium users" });
  }
};

const deleteCollaborator = async (req, res) => {
  const { tripId } = req.params;
  const { email } = req.query;
  if (req.user.isPremium) {
    try {
      const user = await db.query("SELECT id FROM users WHERE email = $1", [
        email,
      ]);
      const userId = user.rows[0].id;
      const deleted = await db.query(
        "DELETE FROM usertrips WHERE userid = $1 AND tripid = $2 RETURNING *",
        [userId, tripId]
      );
      if (deleted.rows.length > 0) {
        res.json({ email });
      } else {
        res.status(400).json({ msg: "Something went wrong" });
      } 
    } catch (e) {
      res.status(500).json({ msg: "Something went wrong", error: e });
    }
  } else {
    res
      .status(403)
      .json({ msg: "This feature is only available for premium users" });
  }
};

module.exports = {
  index,
  createTrip,
  indexCollaborators,
  addCollaborator,
  deleteCollaborator,
};
