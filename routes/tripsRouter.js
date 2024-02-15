var express = require("express");
var router = express.Router();

const tripsController = require("../controllers/tripsController");
const eventsController = require("../controllers/eventsController");

//* Trips
router.get("/", tripsController.index);
router.post("/", tripsController.createTrip);

//* Collaborators
router.get("/:tripId/collaborators", eventsController.validateUser, tripsController.indexCollaborators)
router.post("/:tripId/collaborators", eventsController.validateUser, tripsController.addCollaborator)
router.delete("/:tripId/collaborators", eventsController.validateUser, tripsController.deleteCollaborator)

//* Events
router.get("/:tripId", eventsController.validateUser, eventsController.index);
router.post(
  "/:tripId",
  eventsController.validateUser,
  eventsController.createEvent
);
router.put(
  "/:tripId/:eventId",
  eventsController.validateUser,
  eventsController.editEvent
);
router.delete(
  "/:tripId/:eventId",
  eventsController.validateUser,
  eventsController.deleteEvent
);


module.exports = router;
