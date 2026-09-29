const { Router } = require("express");
const router = Router();
const { validateObjectId } = require("../middlewares/validateObjectId");
const { verifyCustomer, verifyAdmin } = require("../middlewares/authMiddleware");

const {
  registerCustomer,
  loginCustomer,
  refreshTokenCustomer,
  logoutCustomer,
  postCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  searchCustomer,
} = require("../controllers/customer.controller");

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Mijozlar boshqaruvi va Autentifikatsiya API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - phone
 *         - password
 *         - email
 *         - birth_date
 *         - gender_id
 *         - lang_id
 *       properties:
 *         first_name:
 *           type: string
 *           example: "Ali"
 *         last_name:
 *           type: string
 *           example: "Valiyev"
 *         phone:
 *           type: string
 *           example: "+998901234567"
 *         password:
 *           type: string
 *           example: "CustomerPass123"
 *         email:
 *           type: string
 *           example: "ali@example.com"
 *         birth_date:
 *           type: string
 *           format: date
 *           example: "1995-05-20"
 *         gender_id:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         lang_id:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *     CustomerLogin:
 *       type: object
 *       required:
 *         - login
 *         - password
 *       properties:
 *         login:
 *           type: string
 *           example: "ali@example.com"
 *         password:
 *           type: string
 *           example: "CustomerPass123"
 */

/**
 * @swagger
 * /customer/register:
 *   post:
 *     summary: Mijozni ro'yxatdan o'tkazish
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Muvaffaqiyatli ro'yxatdan o'tildi.
 *       400:
 *         description: Validatsiya xatosi.
 *       409:
 *         description: Email yoki telefon allaqachon mavjud.
 */
router.post("/register", registerCustomer);

/**
 * @swagger
 * /customer/login:
 *   post:
 *     summary: Mijoz tizimiga kirish (Login)
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CustomerLogin'
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli kirildi va tokenlar qaytarildi.
 *       401:
 *         description: Email/telefon yoki parol noto'g'ri.
 */
router.post("/login", loginCustomer);

/**
 * @swagger
 * /customer/refresh-token:
 *   post:
 *     summary: Mijoz access tokenini yangilash
 *     tags: [Customer]
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
 */
router.post("/refresh-token", refreshTokenCustomer);

/**
 * @swagger
 * /customer/logout:
 *   post:
 *     summary: Mijoz tizimidan chiqish (Logout)
 *     tags: [Customer]
 *     responses:
 *       200:
 *         description: Chiqildi.
 */
router.post("/logout", logoutCustomer);

/**
 * @swagger
 * /customer:
 *   post:
 *     summary: Mijoz yaratish (RESTful)
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Yaratildi.
 *   get:
 *     summary: Barcha mijozlarni sahifalab olish (RESTful)
 *     tags: [Customer]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mijozlar ro'yxati.
 */
router.post("/", postCustomer);
router.get("/", getCustomers);

/**
 * @swagger
 * /customer/{id}:
 *   get:
 *     summary: ID bo'yicha mijozni olish (RESTful)
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mijoz ma'lumotlari.
 *       404:
 *         description: Topilmadi.
 *   put:
 *     summary: ID bo'yicha mijozni yangilash (RESTful)
 *     tags: [Customer]
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
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Yangilandi.
 *   delete:
 *     summary: ID bo'yicha mijozni o'chirish (RESTful)
 *     tags: [Customer]
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
router.get("/:id", validateObjectId("id"), getCustomerById);
router.put("/:id", validateObjectId("id"), updateCustomer);
router.delete("/:id", validateObjectId("id"), deleteCustomer);

// Legacy RPC compatibility routes
router.post("/createCustomer", postCustomer);
router.get("/getCustomer", getCustomers);
router.get("/getCustomerById/:id", validateObjectId("id"), getCustomerById);
router.put("/updateCustomer/:id", validateObjectId("id"), updateCustomer);
router.delete("/deleteCustomer/:id", validateObjectId("id"), deleteCustomer);
router.get("/searchCustomer", searchCustomer);

module.exports = router;
