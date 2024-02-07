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
    })
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

module.exports = {
  index,
  createTrip,
};
