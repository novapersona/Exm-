const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  searchTicket,
} = require("../controllers/ticket.controller");

/**
 * @swagger
 * tags:
 *   name: Ticket
 *   description: Chiptalar API
 */

router.post("/", postTicket);
router.get("/", getTickets);
router.get("/:id", validateObjectId("id"), getTicketById);
router.put("/:id", validateObjectId("id"), updateTicket);
router.delete("/:id", validateObjectId("id"), deleteTicket);

// Legacy RPC compatibility
router.post("/createTicket", postTicket);
router.get("/getTicket", getTickets);
router.get("/getTicketById/:id", validateObjectId("id"), getTicketById);
router.put("/updateTicket/:id", validateObjectId("id"), updateTicket);
router.delete("/deleteTicket/:id", validateObjectId("id"), deleteTicket);
router.get("/searchTicket", searchTicket);

module.exports = router;
