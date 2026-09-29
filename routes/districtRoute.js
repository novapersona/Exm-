const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postDistrict,
  getDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
  searchDistrict,
} = require("../controllers/district.controller");

/**
 * @swagger
 * tags:
 *   name: District
 *   description: Tumanlar boshqaruvi API
 */

router.post("/", postDistrict);
router.get("/", getDistricts);
router.get("/:id", validateObjectId("id"), getDistrictById);
router.put("/:id", validateObjectId("id"), updateDistrict);
router.delete("/:id", validateObjectId("id"), deleteDistrict);

// Legacy RPC compatibility
router.post("/createDistrict", postDistrict);
router.get("/getDistrict", getDistricts);
router.get("/getDistrictById/:id", validateObjectId("id"), getDistrictById);
router.put("/updateDistrict/:id", validateObjectId("id"), updateDistrict);
router.delete("/deleteDistrict/:id", validateObjectId("id"), deleteDistrict);
router.get("/searchDistrict", searchDistrict);

module.exports = router;
