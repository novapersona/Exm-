const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postTicketStatus,
  getTicketStatuses,
  getTicketStatusById,
  updateTicketStatus,
  deleteTicketStatus,
  searchTicketStatus,
} = require("../controllers/ticketstatus.controller");

/**
 * @swagger
 * tags:
 *   name: TicketStatus
 *   description: Chipta holatlari API
 */

router.post("/", postTicketStatus);
router.get("/", getTicketStatuses);
router.get("/:id", validateObjectId("id"), getTicketStatusById);
router.put("/:id", validateObjectId("id"), updateTicketStatus);
router.delete("/:id", validateObjectId("id"), deleteTicketStatus);

// Legacy RPC compatibility
router.post("/createTicketStatus", postTicketStatus);
router.get("/getTicketStatus", getTicketStatuses);
router.get("/getTicketStatusById/:id", validateObjectId("id"), getTicketStatusById);
router.put("/updateTicketStatus/:id", validateObjectId("id"), updateTicketStatus);
router.delete("/deleteTicketStatus/:id", validateObjectId("id"), deleteTicketStatus);
router.get("/searchTicketStatus", searchTicketStatus);

module.exports = router;
