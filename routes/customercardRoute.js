const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postCustomerCard,
  getCustomerCards,
  getCustomerCardById,
  updateCustomerCard,
  deleteCustomerCard,
  searchCustomerCard,
} = require("../controllers/customercard.controller");

/**
 * @swagger
 * tags:
 *   name: CustomerCard
 *   description: Mijoz bank kartalari API
 */

router.post("/", postCustomerCard);
router.get("/", getCustomerCards);
router.get("/:id", validateObjectId("id"), getCustomerCardById);
router.put("/:id", validateObjectId("id"), updateCustomerCard);
router.delete("/:id", validateObjectId("id"), deleteCustomerCard);

// Legacy RPC compatibility
router.post("/createCustomerCard", postCustomerCard);
router.get("/getCustomerCard", getCustomerCards);
router.get("/getCustomerCardById/:id", validateObjectId("id"), getCustomerCardById);
router.put("/updateCustomerCard/:id", validateObjectId("id"), updateCustomerCard);
router.delete("/deleteCustomerCard/:id", validateObjectId("id"), deleteCustomerCard);
router.get("/searchCustomerCard", searchCustomerCard);

module.exports = router;
