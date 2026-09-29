const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postCart,
  getCarts,
  getCartById,
  updateCart,
  deleteCart,
  searchCart,
} = require("../controllers/cart.controller");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Savat boshqaruvi API
 */

router.post("/", postCart);
router.get("/", getCarts);
router.get("/:id", validateObjectId("id"), getCartById);
router.put("/:id", validateObjectId("id"), updateCart);
router.delete("/:id", validateObjectId("id"), deleteCart);

// Legacy RPC compatibility
router.post("/createCart", postCart);
router.get("/getCart", getCarts);
router.get("/getCartById/:id", validateObjectId("id"), getCartById);
router.put("/updateCart/:id", validateObjectId("id"), updateCart);
router.delete("/deleteCart/:id", validateObjectId("id"), deleteCart);
router.get("/searchCart", searchCart);

module.exports = router;
