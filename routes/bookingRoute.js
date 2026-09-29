const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  searchBooking,
} = require("../controllers/booking.controller");

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Chiptalarni bron qilish API
 */

router.post("/", postBooking);
router.get("/", getBookings);
router.get("/:id", validateObjectId("id"), getBookingById);
router.put("/:id", validateObjectId("id"), updateBooking);
router.delete("/:id", validateObjectId("id"), deleteBooking);

// Legacy RPC compatibility
router.post("/createBooking", postBooking);
router.get("/getBooking", getBookings);
router.get("/getBookingById/:id", validateObjectId("id"), getBookingById);
router.put("/updateBooking/:id", validateObjectId("id"), updateBooking);
router.delete("/deleteBooking/:id", validateObjectId("id"), deleteBooking);
router.get("/searchBooking", searchBooking);

module.exports = router;
