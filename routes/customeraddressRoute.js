const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postCustomerAddress,
  getCustomerAddresses,
  getCustomerAddressById,
  updateCustomerAddress,
  deleteCustomerAddress,
  searchCustomerAddress,
} = require("../controllers/customeraddress.controller");

/**
 * @swagger
 * tags:
 *   name: CustomerAddress
 *   description: Mijoz manzillari API
 */

router.post("/", postCustomerAddress);
router.get("/", getCustomerAddresses);
router.get("/:id", validateObjectId("id"), getCustomerAddressById);
router.put("/:id", validateObjectId("id"), updateCustomerAddress);
router.delete("/:id", validateObjectId("id"), deleteCustomerAddress);

// Legacy RPC compatibility
router.post("/createCustomerAddress", postCustomerAddress);
router.get("/getCustomerAddress", getCustomerAddresses);
router.get("/getCustomerAddressById/:id", validateObjectId("id"), getCustomerAddressById);
router.put("/updateCustomerAddress/:id", validateObjectId("id"), updateCustomerAddress);
router.delete("/deleteCustomerAddress/:id", validateObjectId("id"), deleteCustomerAddress);
router.get("/searchCustomerAddress", searchCustomerAddress);

module.exports = router;
