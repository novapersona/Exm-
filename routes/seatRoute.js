const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postSeat,
  getSeats,
  getSeatById,
  updateSeat,
  deleteSeat,
  searchSeat,
} = require("../controllers/seat.controller");

/**
 * @swagger
 * tags:
 *   name: Seat
 *   description: O'rindiqlar API
 */

router.post("/", postSeat);
router.get("/", getSeats);
router.get("/:id", validateObjectId("id"), getSeatById);
router.put("/:id", validateObjectId("id"), updateSeat);
router.delete("/:id", validateObjectId("id"), deleteSeat);

// Legacy RPC compatibility
router.post("/createSeat", postSeat);
router.get("/getSeat", getSeats);
router.get("/getSeatById/:id", validateObjectId("id"), getSeatById);
router.put("/updateSeat/:id", validateObjectId("id"), updateSeat);
router.delete("/deleteSeat/:id", validateObjectId("id"), deleteSeat);
router.get("/searchSeat", searchSeat);

module.exports = router;
