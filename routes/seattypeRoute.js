const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postSeatType,
  getSeatTypes,
  getSeatTypeById,
  updateSeatType,
  deleteSeatType,
  searchSeatType,
} = require("../controllers/seattype.controller");

/**
 * @swagger
 * tags:
 *   name: SeatType
 *   description: O'rindiq turlari API
 */

router.post("/", postSeatType);
router.get("/", getSeatTypes);
router.get("/:id", validateObjectId("id"), getSeatTypeById);
router.put("/:id", validateObjectId("id"), updateSeatType);
router.delete("/:id", validateObjectId("id"), deleteSeatType);

// Legacy RPC compatibility
router.post("/createSeatType", postSeatType);
router.get("/getSeatType", getSeatTypes);
router.get("/getSeatTypeById/:id", validateObjectId("id"), getSeatTypeById);
router.put("/updateSeatType/:id", validateObjectId("id"), updateSeatType);
router.delete("/deleteSeatType/:id", validateObjectId("id"), deleteSeatType);
router.get("/searchSeatType", searchSeatType);

module.exports = router;
