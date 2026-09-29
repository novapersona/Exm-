const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postSector,
  getSectors,
  getSectorById,
  updateSector,
  deleteSector,
  searchSector,
} = require("../controllers/sector.controller");

/**
 * @swagger
 * tags:
 *   name: Sector
 *   description: Sektorlar API
 */

router.post("/", postSector);
router.get("/", getSectors);
router.get("/:id", validateObjectId("id"), getSectorById);
router.put("/:id", validateObjectId("id"), updateSector);
router.delete("/:id", validateObjectId("id"), deleteSector);

// Legacy RPC compatibility
router.post("/createSector", postSector);
router.get("/getSector", getSectors);
router.get("/getSectorById/:id", validateObjectId("id"), getSectorById);
router.put("/updateSector/:id", validateObjectId("id"), updateSector);
router.delete("/deleteSector/:id", validateObjectId("id"), deleteSector);
router.get("/searchSector", searchSector);

module.exports = router;
