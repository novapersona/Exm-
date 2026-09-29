const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
  searchVenue,
} = require("../controllers/venue.controller");

/**
 * @swagger
 * tags:
 *   name: Venue
 *   description: Arenalar va Joylar API
 */

router.post("/", postVenue);
router.get("/", getVenues);
router.get("/:id", validateObjectId("id"), getVenueById);
router.put("/:id", validateObjectId("id"), updateVenue);
router.delete("/:id", validateObjectId("id"), deleteVenue);

// Legacy RPC compatibility
router.post("/createVenue", postVenue);
router.get("/getVenue", getVenues);
router.get("/getVenueById/:id", validateObjectId("id"), getVenueById);
router.put("/updateVenue/:id", validateObjectId("id"), updateVenue);
router.delete("/deleteVenue/:id", validateObjectId("id"), deleteVenue);
router.get("/searchVenue", searchVenue);

module.exports = router;
