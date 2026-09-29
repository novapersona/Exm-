const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postTypes,
  getTypes,
  getTypesById,
  updateTypes,
  deleteTypes,
  searchTypes,
} = require("../controllers/types.controller");

/**
 * @swagger
 * tags:
 *   name: Types
 *   description: Turlar API
 */

router.post("/", postTypes);
router.get("/", getTypes);
router.get("/:id", validateObjectId("id"), getTypesById);
router.put("/:id", validateObjectId("id"), updateTypes);
router.delete("/:id", validateObjectId("id"), deleteTypes);

// Legacy RPC compatibility
router.post("/createTypes", postTypes);
router.get("/getTypes", getTypes);
router.get("/getTypesById/:id", validateObjectId("id"), getTypesById);
router.put("/updateTypes/:id", validateObjectId("id"), updateTypes);
router.delete("/deleteTypes/:id", validateObjectId("id"), deleteTypes);
router.get("/searchTypes", searchTypes);

module.exports = router;
