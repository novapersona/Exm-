const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postDeliveryMethod,
  getDeliveryMethods,
  getDeliveryMethodById,
  updateDeliveryMethod,
  deleteDeliveryMethod,
  searchDeliveryMethod,
} = require("../controllers/deliverymethod.controller");

/**
 * @swagger
 * tags:
 *   name: DeliveryMethod
 *   description: Yetkazib berish usullari API
 */

router.post("/", postDeliveryMethod);
router.get("/", getDeliveryMethods);
router.get("/:id", validateObjectId("id"), getDeliveryMethodById);
router.put("/:id", validateObjectId("id"), updateDeliveryMethod);
router.delete("/:id", validateObjectId("id"), deleteDeliveryMethod);

// Legacy RPC compatibility
router.post("/createDeliveryMethod", postDeliveryMethod);
router.get("/getDeliveryMethod", getDeliveryMethods);
router.get("/getDeliveryMethodById/:id", validateObjectId("id"), getDeliveryMethodById);
router.put("/updateDeliveryMethod/:id", validateObjectId("id"), updateDeliveryMethod);
router.delete("/deleteDeliveryMethod/:id", validateObjectId("id"), deleteDeliveryMethod);
router.get("/searchDeliveryMethod", searchDeliveryMethod);

module.exports = router;
