const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postDiscount,
  getDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  searchDiscount,
} = require("../controllers/discount.controller");

/**
 * @swagger
 * tags:
 *   name: Discount
 *   description: Chegirmalar boshqaruvi API
 */

router.post("/", postDiscount);
router.get("/", getDiscounts);
router.get("/:id", validateObjectId("id"), getDiscountById);
router.put("/:id", validateObjectId("id"), updateDiscount);
router.delete("/:id", validateObjectId("id"), deleteDiscount);

// Legacy RPC compatibility
router.post("/createDiscount", postDiscount);
router.get("/getDiscount", getDiscounts);
router.get("/getDiscountById/:id", validateObjectId("id"), getDiscountById);
router.put("/updateDiscount/:id", validateObjectId("id"), updateDiscount);
router.delete("/deleteDiscount/:id", validateObjectId("id"), deleteDiscount);
router.get("/searchDiscount", searchDiscount);

module.exports = router;
