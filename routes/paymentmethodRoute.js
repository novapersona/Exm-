const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postPaymentMethod,
  getPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod,
  searchPaymentMethod,
} = require("../controllers/paymentmethod.controller");

/**
 * @swagger
 * tags:
 *   name: PaymentMethod
 *   description: To'lov usullari API
 */

router.post("/", postPaymentMethod);
router.get("/", getPaymentMethods);
router.get("/:id", validateObjectId("id"), getPaymentMethodById);
router.put("/:id", validateObjectId("id"), updatePaymentMethod);
router.delete("/:id", validateObjectId("id"), deletePaymentMethod);

// Legacy RPC compatibility
router.post("/createPaymentMethod", postPaymentMethod);
router.get("/getPaymentMethod", getPaymentMethods);
router.get("/getPaymentMethodById/:id", validateObjectId("id"), getPaymentMethodById);
router.put("/updatePaymentMethod/:id", validateObjectId("id"), updatePaymentMethod);
router.delete("/deletePaymentMethod/:id", validateObjectId("id"), deletePaymentMethod);
router.get("/searchPaymentMethod", searchPaymentMethod);

module.exports = router;
