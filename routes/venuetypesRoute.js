const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postVenueTypes,
  getVenueTypes,
  getVenueTypesById,
  updateVenueTypes,
  deleteVenueTypes,
  searchVenueTypes,
} = require("../controllers/venuetypes.controller");

/**
 * @swagger
 * tags:
 *   name: VenueTypes
 *   description: Venue va Turlar bog'lanishi API
 */

router.post("/", postVenueTypes);
router.get("/", getVenueTypes);
router.get("/:id", validateObjectId("id"), getVenueTypesById);
router.put("/:id", validateObjectId("id"), updateVenueTypes);
router.delete("/:id", validateObjectId("id"), deleteVenueTypes);

// Legacy RPC compatibility
router.post("/createVenueTypes", postVenueTypes);
router.get("/getVenueTypes", getVenueTypes);
router.get("/getVenueTypesById/:id", validateObjectId("id"), getVenueTypesById);
router.put("/updateVenueTypes/:id", validateObjectId("id"), updateVenueTypes);
router.delete("/deleteVenueTypes/:id", validateObjectId("id"), deleteVenueTypes);
router.get("/searchVenueTypes", searchVenueTypes);

module.exports = router;
