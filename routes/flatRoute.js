const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postFlat,
  getFlats,
  getFlatById,
  updateFlat,
  deleteFlat,
  searchFlat,
} = require("../controllers/flat.controller");

/**
 * @swagger
 * tags:
 *   name: Flat
 *   description: Kvartira/Qavat API
 */

router.post("/", postFlat);
router.get("/", getFlats);
router.get("/:id", validateObjectId("id"), getFlatById);
router.put("/:id", validateObjectId("id"), updateFlat);
router.delete("/:id", validateObjectId("id"), deleteFlat);

// Legacy RPC compatibility
router.post("/createFlat", postFlat);
router.get("/getFlat", getFlats);
router.get("/getFlatById/:id", validateObjectId("id"), getFlatById);
router.put("/updateFlat/:id", validateObjectId("id"), updateFlat);
router.delete("/deleteFlat/:id", validateObjectId("id"), deleteFlat);
router.get("/searchFlat", searchFlat);

module.exports = router;
