const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postCountry,
  getCountries,
  getCountryById,
  updateCountry,
  deleteCountry,
  searchCountry,
} = require("../controllers/country.controller");

/**
 * @swagger
 * tags:
 *   name: Country
 *   description: Davlatlar boshqaruvi API
 */

router.post("/", postCountry);
router.get("/", getCountries);
router.get("/:id", validateObjectId("id"), getCountryById);
router.put("/:id", validateObjectId("id"), updateCountry);
router.delete("/:id", validateObjectId("id"), deleteCountry);

// Legacy RPC compatibility
router.post("/createCountry", postCountry);
router.get("/getCountry", getCountries);
router.get("/getCountryById/:id", validateObjectId("id"), getCountryById);
router.put("/updateCountry/:id", validateObjectId("id"), updateCountry);
router.delete("/deleteCountry/:id", validateObjectId("id"), deleteCountry);
router.get("/searchCountry", searchCountry);

module.exports = router;
