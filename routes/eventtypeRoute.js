const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postEventType,
  getEventTypes,
  getEventTypeById,
  updateEventType,
  deleteEventType,
  searchEventType,
} = require("../controllers/eventtype.controller");

/**
 * @swagger
 * tags:
 *   name: EventType
 *   description: Tadbir toifalari API
 */

router.post("/", postEventType);
router.get("/", getEventTypes);
router.get("/:id", validateObjectId("id"), getEventTypeById);
router.put("/:id", validateObjectId("id"), updateEventType);
router.delete("/:id", validateObjectId("id"), deleteEventType);

// Legacy RPC compatibility
router.post("/createEventType", postEventType);
router.get("/getEventType", getEventTypes);
router.get("/getEventTypeById/:id", validateObjectId("id"), getEventTypeById);
router.put("/updateEventType/:id", validateObjectId("id"), updateEventType);
router.delete("/deleteEventType/:id", validateObjectId("id"), deleteEventType);
router.get("/searchEventType", searchEventType);

module.exports = router;
