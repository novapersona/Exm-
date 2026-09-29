const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");

const {
  postLang,
  getLangs,
  getLangById,
  updateLang,
  deleteLang,
  searchLang,
} = require("../controllers/lang.controller");

/**
 * @swagger
 * tags:
 *   name: Lang
 *   description: Tillar API
 */

router.post("/", postLang);
router.get("/", getLangs);
router.get("/:id", validateObjectId("id"), getLangById);
router.put("/:id", validateObjectId("id"), updateLang);
router.delete("/:id", validateObjectId("id"), deleteLang);

// Legacy RPC compatibility
router.post("/createLang", postLang);
router.get("/getLang", getLangs);
router.get("/getLangById/:id", validateObjectId("id"), getLangById);
router.put("/updateLang/:id", validateObjectId("id"), updateLang);
router.delete("/deleteLang/:id", validateObjectId("id"), deleteLang);
router.get("/searchLang", searchLang);

module.exports = router;
