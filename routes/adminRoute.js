const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");
const { verifyAdmin, verifyCreator } = require("../middlewares/authMiddleware");

const {
  registerAdmin,
  loginAdmin,
  refreshTokenAdmin,
  logoutAdmin,
  postAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  searchAdmin,
} = require("../controllers/admin.controller");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin boshqaruvi va Autentifikatsiya API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - name
 *         - login
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "Super Admin"
 *         login:
 *           type: string
 *           example: "admin_user"
 *         password:
 *           type: string
 *           example: "SecretPassword123!"
 *         is_active:
 *           type: boolean
 *           example: true
 *         is_creator:
 *           type: boolean
 *           example: false
 *     AdminLogin:
 *       type: object
 *       required:
 *         - login
 *         - password
 *       properties:
 *         login:
 *           type: string
 *           example: "admin_user"
 *         password:
 *           type: string
 *           example: "SecretPassword123!"
 */

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Yangi Admin ro'yxatdan o'tkazish
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: Admin muvaffaqiyatli ro'yxatdan o'tdi.
 *       400:
 *         description: Validatsiya xatosi.
 *       409:
 *         description: Login allaqachon band.
 */
router.post("/register", registerAdmin);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Adminga tizimga kirish (Login)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLogin'
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirildi va tokenlar qaytarildi.
 *       401:
 *         description: Login yoki parol noto'g'ri.
 */
router.post("/login", loginAdmin);

/**
 * @swagger
 * /admin/refresh-token:
 *   post:
 *     summary: Access tokenni yangilash
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token yangilandi.
 *       401:
 *         description: Yaroqsiz refresh token.
 */
router.post("/refresh-token", refreshTokenAdmin);

/**
 * @swagger
 * /admin/logout:
 *   post:
 *     summary: Admin tizimidan chiqish (Logout)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Chiqildi.
 */
router.post("/logout", logoutAdmin);

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Admin yaratish (RESTful)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: Yaratildi.
 *   get:
 *     summary: Barcha Adminlarni sahifalab olish (RESTful)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sahifadagi elementlar soni
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Qidiruv so'zi
 *     responses:
 *       200:
 *         description: Adminlar ro'yxati.
 */
router.post("/", postAdmin);
router.get("/", getAdmins);

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: ID bo'yicha Adminni olish (RESTful)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin ma'lumotlari.
 *       404:
 *         description: Topilmadi.
 *   put:
 *     summary: ID bo'yicha Adminni yangilash (RESTful)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: Yangilandi.
 *   delete:
 *     summary: ID bo'yicha Adminni o'chirish (RESTful)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: O'chirildi.
 */
router.get("/:id", validateObjectId("id"), getAdminById);
router.put("/:id", validateObjectId("id"), updateAdmin);
router.delete("/:id", validateObjectId("id"), deleteAdmin);

// Legacy RPC compatibility routes
router.post("/createAdmin", postAdmin);
router.get("/getAdmin", getAdmins);
router.get("/getAdminById/:id", validateObjectId("id"), getAdminById);
router.put("/updateAdmin/:id", validateObjectId("id"), updateAdmin);
router.delete("/deleteAdmin/:id", validateObjectId("id"), deleteAdmin);
router.get("/searchAdmin", searchAdmin);

module.exports = router;
