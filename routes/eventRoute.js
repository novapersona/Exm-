const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  searchEvent,
} = require("../controllers/event.controller");

/**
 * @swagger
 * tags:
 *   name: Event
 *   description: Tadbirlar boshqaruvi API
 */

router.post("/", postEvent);
router.get("/", getEvents);
router.get("/:id", validateObjectId("id"), getEventById);
router.put("/:id", validateObjectId("id"), updateEvent);
router.delete("/:id", validateObjectId("id"), deleteEvent);

// Legacy RPC compatibility
router.post("/createEvent", postEvent);
router.get("/getEvent", getEvents);
router.get("/getEventById/:id", validateObjectId("id"), getEventById);
router.put("/updateEvent/:id", validateObjectId("id"), updateEvent);
router.delete("/deleteEvent/:id", validateObjectId("id"), deleteEvent);
router.get("/searchEvent", searchEvent);

module.exports = router;
