const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postCartItem,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
  searchCartItem,
} = require("../controllers/cartitem.controller");

/**
 * @swagger
 * tags:
 *   name: CartItem
 *   description: Savat elementlari API
 */

router.post("/", postCartItem);
router.get("/", getCartItems);
router.get("/:id", validateObjectId("id"), getCartItemById);
router.put("/:id", validateObjectId("id"), updateCartItem);
router.delete("/:id", validateObjectId("id"), deleteCartItem);

// Legacy RPC compatibility
router.post("/createCartItem", postCartItem);
router.get("/getCartItem", getCartItems);
router.get("/getCartItemById/:id", validateObjectId("id"), getCartItemById);
router.put("/updateCartItem/:id", validateObjectId("id"), updateCartItem);
router.delete("/deleteCartItem/:id", validateObjectId("id"), deleteCartItem);
router.get("/searchCartItem", searchCartItem);

module.exports = router;
