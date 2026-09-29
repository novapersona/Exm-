const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postRegion,
  getRegions,
  getRegionById,
  updateRegion,
  deleteRegion,
  searchRegion,
} = require("../controllers/region.controller");

/**
 * @swagger
 * tags:
 *   name: Region
 *   description: Viloyatlar API
 */

router.post("/", postRegion);
router.get("/", getRegions);
router.get("/:id", validateObjectId("id"), getRegionById);
router.put("/:id", validateObjectId("id"), updateRegion);
router.delete("/:id", validateObjectId("id"), deleteRegion);

// Legacy RPC compatibility
router.post("/createRegion", postRegion);
router.get("/getRegion", getRegions);
router.get("/getRegionById/:id", validateObjectId("id"), getRegionById);
router.put("/updateRegion/:id", validateObjectId("id"), updateRegion);
router.delete("/deleteRegion/:id", validateObjectId("id"), deleteRegion);
router.get("/searchRegion", searchRegion);

module.exports = router;
