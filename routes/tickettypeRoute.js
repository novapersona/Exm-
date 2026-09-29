const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postTicketType,
  getTicketTypes,
  getTicketTypeById,
  updateTicketType,
  deleteTicketType,
  searchTicketType,
} = require("../controllers/tickettype.controller");

/**
 * @swagger
 * tags:
 *   name: TicketType
 *   description: Chipta turlari API
 */

router.post("/", postTicketType);
router.get("/", getTicketTypes);
router.get("/:id", validateObjectId("id"), getTicketTypeById);
router.put("/:id", validateObjectId("id"), updateTicketType);
router.delete("/:id", validateObjectId("id"), deleteTicketType);

// Legacy RPC compatibility
router.post("/createTicketType", postTicketType);
router.get("/getTicketType", getTicketTypes);
router.get("/getTicketTypeById/:id", validateObjectId("id"), getTicketTypeById);
router.put("/updateTicketType/:id", validateObjectId("id"), updateTicketType);
router.delete("/deleteTicketType/:id", validateObjectId("id"), deleteTicketType);
router.get("/searchTicketType", searchTicketType);

module.exports = router;
