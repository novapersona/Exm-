const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postGender,
  getGenders,
  getGenderById,
  updateGender,
  deleteGender,
  searchGender,
} = require("../controllers/gender.controller");

/**
 * @swagger
 * tags:
 *   name: Gender
 *   description: Jinslar API
 */

router.post("/", postGender);
router.get("/", getGenders);
router.get("/:id", validateObjectId("id"), getGenderById);
router.put("/:id", validateObjectId("id"), updateGender);
router.delete("/:id", validateObjectId("id"), deleteGender);

// Legacy RPC compatibility
router.post("/createGender", postGender);
router.get("/getGender", getGenders);
router.get("/getGenderById/:id", validateObjectId("id"), getGenderById);
router.put("/updateGender/:id", validateObjectId("id"), updateGender);
router.delete("/deleteGender/:id", validateObjectId("id"), deleteGender);
router.get("/searchGender", searchGender);

module.exports = router;
