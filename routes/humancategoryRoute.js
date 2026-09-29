const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postHumanCategory,
  getHumanCategories,
  getHumanCategoryById,
  updateHumanCategory,
  deleteHumanCategory,
  searchHumanCategory,
} = require("../controllers/humancategory.controller");

/**
 * @swagger
 * tags:
 *   name: HumanCategory
 *   description: Yosh toifalari API
 */

router.post("/", postHumanCategory);
router.get("/", getHumanCategories);
router.get("/:id", validateObjectId("id"), getHumanCategoryById);
router.put("/:id", validateObjectId("id"), updateHumanCategory);
router.delete("/:id", validateObjectId("id"), deleteHumanCategory);

// Legacy RPC compatibility
router.post("/createHumanCategory", postHumanCategory);
router.get("/getHumanCategory", getHumanCategories);
router.get("/getHumanCategoryById/:id", validateObjectId("id"), getHumanCategoryById);
router.put("/updateHumanCategory/:id", validateObjectId("id"), updateHumanCategory);
router.delete("/deleteHumanCategory/:id", validateObjectId("id"), deleteHumanCategory);
router.get("/searchHumanCategory", searchHumanCategory);

module.exports = router;
