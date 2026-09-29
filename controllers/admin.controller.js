const { Admin } = require("../models/AdminSchema");
const {
  adminRegisterValidationSchema,
  adminLoginValidationSchema,
  adminValidationSchema,
  adminUpdateValidationSchema,
} = require("../validation/adminValidation");
const { generateTokens, verifyToken } = require("../helpers/jwtHelper");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

/**
 * Register a new Admin
 */
const registerAdmin = async (req, res, next) => {
  try {
    const { error, value } = adminRegisterValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingAdmin = await Admin.findOne({ login: value.login });
    if (existingAdmin) {
      return res.status(409).json({ message: "Bunday loginli admin allaqachon mavjud" });
    }

    const passwordToHash = value.password || value.hashed_password;
    const adminData = {
      name: value.name,
      login: value.login,
      hashed_password: passwordToHash,
      is_active: value.is_active !== undefined ? value.is_active : true,
      is_creator: value.is_creator !== undefined ? value.is_creator : false,
    };

    const newAdmin = await Admin.create(adminData);
    const tokens = generateTokens({
      id: newAdmin._id,
      login: newAdmin.login,
      role: "admin",
      is_creator: newAdmin.is_creator,
    });

    newAdmin.hashed_refresh_token = tokens.refreshToken;
    await newAdmin.save();

    res.status(201).json({
      message: "Admin muvaffaqiyatli ro'yxatdan o'tdi",
      data: newAdmin,
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login Admin
 */
const loginAdmin = async (req, res, next) => {
  try {
    const { error, value } = adminLoginValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const admin = await Admin.findOne({ login: value.login });
    if (!admin) {
      return res.status(401).json({ message: "Login yoki parol noto'g'ri" });
    }

    if (!admin.is_active) {
      return res.status(403).json({ message: "Ushbu admin hisobi faol emas" });
    }

    const isMatch = await admin.comparePassword(value.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Login yoki parol noto'g'ri" });
    }

    const tokens = generateTokens({
      id: admin._id,
      login: admin.login,
      role: "admin",
      is_creator: admin.is_creator,
    });

    admin.hashed_refresh_token = tokens.refreshToken;
    await admin.save();

    res.status(200).json({
      message: "Tizimga muvaffaqiyatli kirildi",
      data: admin,
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Token for Admin
 */
const refreshTokenAdmin = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token talab qilinadi" });
    }

    const decoded = verifyToken(refreshToken);
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.hashed_refresh_token !== refreshToken) {
      return res.status(401).json({ message: "Yaroqsiz refresh token" });
    }

    const tokens = generateTokens({
      id: admin._id,
      login: admin.login,
      role: "admin",
      is_creator: admin.is_creator,
    });

    admin.hashed_refresh_token = tokens.refreshToken;
    await admin.save();

    res.status(200).json({
      message: "Token muvaffaqiyatli yangilandi",
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout Admin
 */
const logoutAdmin = async (req, res, next) => {
  try {
    const adminId = req.user ? req.user.id : req.body.adminId;
    if (adminId) {
      await Admin.findByIdAndUpdate(adminId, { hashed_refresh_token: "" });
    }
    res.status(200).json({ message: "Tizimdan muvaffaqiyatli chiqildi" });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Admin (Legacy/CRUD endpoint)
 */
const postAdmin = async (req, res, next) => {
  return registerAdmin(req, res, next);
};

/**
 * Get all Admins (with pagination & safe search)
 */
const getAdmins = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search, name, login, is_active } = req.query;
    const filter = {};

    if (search) {
      const escaped = escapeRegex(search);
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { login: { $regex: escaped, $options: "i" } },
      ];
    } else {
      if (name) filter.name = { $regex: escapeRegex(name), $options: "i" };
      if (login) filter.login = { $regex: escapeRegex(login), $options: "i" };
    }

    if (is_active !== undefined) {
      filter.is_active = is_active === "true" || is_active === true;
    }

    const [items, total] = await Promise.all([
      Admin.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Admin.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

/**
 * Get Admin by ID
 */
const getAdminById = async (req, res, next) => {
  try {
    const item = await Admin.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Admin topilmadi" });
    }
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Admin
 */
const updateAdmin = async (req, res, next) => {
  try {
    const { error, value } = adminUpdateValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updateData = { ...value };
    if (updateData.password) {
      updateData.hashed_password = updateData.password;
      delete updateData.password;
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin topilmadi" });
    }

    Object.assign(admin, updateData);
    const updated = await admin.save();

    res.status(200).json({
      message: "Admin muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Admin
 */
const deleteAdmin = async (req, res, next) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Admin topilmadi" });
    }
    res.status(200).json({ message: "Admin muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

/**
 * Search Admins
 */
const searchAdmin = async (req, res, next) => {
  return getAdmins(req, res, next);
};

module.exports = {
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
};
