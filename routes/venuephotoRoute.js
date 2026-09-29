const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postVenuePhoto,
  getVenuePhotos,
  getVenuePhotoById,
  updateVenuePhoto,
  deleteVenuePhoto,
  searchVenuePhoto,
} = require("../controllers/venuephoto.controller");

/**
 * @swagger
 * tags:
 *   name: VenuePhoto
 *   description: Joylar rasmlari API
 */

router.post("/", postVenuePhoto);
router.get("/", getVenuePhotos);
router.get("/:id", validateObjectId("id"), getVenuePhotoById);
router.put("/:id", validateObjectId("id"), updateVenuePhoto);
router.delete("/:id", validateObjectId("id"), deleteVenuePhoto);

// Legacy RPC compatibility
router.post("/createVenuePhoto", postVenuePhoto);
router.get("/getVenuePhoto", getVenuePhotos);
router.get("/getVenuePhotoById/:id", validateObjectId("id"), getVenuePhotoById);
router.put("/updateVenuePhoto/:id", validateObjectId("id"), updateVenuePhoto);
router.delete("/deleteVenuePhoto/:id", validateObjectId("id"), deleteVenuePhoto);
router.get("/searchVenuePhoto", searchVenuePhoto);

module.exports = router;
