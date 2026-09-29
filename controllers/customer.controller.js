const { Customer } = require("../models/CustomerSchema");
const {
  customerRegisterValidationSchema,
  customerLoginValidationSchema,
  customerValidationSchema,
  customerUpdateValidationSchema,
} = require("../validation/customerValidation");
const { generateTokens, verifyToken } = require("../helpers/jwtHelper");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

/**
 * Register a new Customer
 */
const registerCustomer = async (req, res, next) => {
  try {
    const { error, value } = customerRegisterValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingEmail = await Customer.findOne({ email: value.email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ message: "Bunday email bilan foydalanuvchi mavjud" });
    }

    const existingPhone = await Customer.findOne({ phone: value.phone });
    if (existingPhone) {
      return res.status(409).json({ message: "Bunday telefon raqami bilan foydalanuvchi mavjud" });
    }

    const passwordToHash = value.password || value.hashed_password;
    const customerData = {
      first_name: value.first_name,
      last_name: value.last_name,
      phone: value.phone,
      email: value.email.toLowerCase(),
      birth_date: value.birth_date,
      gender_id: value.gender_id,
      lang_id: value.lang_id,
      hashed_password: passwordToHash,
    };

    const newCustomer = await Customer.create(customerData);
    const tokens = generateTokens({
      id: newCustomer._id,
      email: newCustomer.email,
      role: "customer",
    });

    newCustomer.hashed_refresh_token = tokens.refreshToken;
    await newCustomer.save();

    res.status(201).json({
      message: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi",
      data: newCustomer,
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login Customer
 */
const loginCustomer = async (req, res, next) => {
  try {
    const { error, value } = customerLoginValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const searchCriteria = [];
    if (value.email) searchCriteria.push({ email: value.email.toLowerCase() });
    if (value.phone) searchCriteria.push({ phone: value.phone });
    if (value.login) {
      searchCriteria.push({ email: value.login.toLowerCase() });
      searchCriteria.push({ phone: value.login });
    }

    const customer = await Customer.findOne({ $or: searchCriteria });
    if (!customer) {
      return res.status(401).json({ message: "Email/telefon yoki parol noto'g'ri" });
    }

    const isMatch = await customer.comparePassword(value.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email/telefon yoki parol noto'g'ri" });
    }

    const tokens = generateTokens({
      id: customer._id,
      email: customer.email,
      role: "customer",
    });

    customer.hashed_refresh_token = tokens.refreshToken;
    await customer.save();

    res.status(200).json({
      message: "Tizimga muvaffaqiyatli kirildi",
      data: customer,
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Token for Customer
 */
const refreshTokenCustomer = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token talab qilinadi" });
    }

    const decoded = verifyToken(refreshToken);
    const customer = await Customer.findById(decoded.id);

    if (!customer || customer.hashed_refresh_token !== refreshToken) {
      return res.status(401).json({ message: "Yaroqsiz refresh token" });
    }

    const tokens = generateTokens({
      id: customer._id,
      email: customer.email,
      role: "customer",
    });

    customer.hashed_refresh_token = tokens.refreshToken;
    await customer.save();

    res.status(200).json({
      message: "Token muvaffaqiyatli yangilandi",
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout Customer
 */
const logoutCustomer = async (req, res, next) => {
  try {
    const customerId = req.user ? req.user.id : req.body.customerId;
    if (customerId) {
      await Customer.findByIdAndUpdate(customerId, { hashed_refresh_token: "" });
    }
    res.status(200).json({ message: "Tizimdan muvaffaqiyatli chiqildi" });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Customer (Legacy/CRUD)
 */
const postCustomer = async (req, res, next) => {
  return registerCustomer(req, res, next);
};

/**
 * Get all Customers (with pagination, safe search, populate)
 */
const getCustomers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { search, first_name, last_name, email, phone } = req.query;
    const filter = {};

    if (search) {
      const escaped = escapeRegex(search);
      filter.$or = [
        { first_name: { $regex: escaped, $options: "i" } },
        { last_name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
        { phone: { $regex: escaped, $options: "i" } },
      ];
    } else {
      if (first_name) filter.first_name = { $regex: escapeRegex(first_name), $options: "i" };
      if (last_name) filter.last_name = { $regex: escapeRegex(last_name), $options: "i" };
      if (email) filter.email = { $regex: escapeRegex(email), $options: "i" };
      if (phone) filter.phone = { $regex: escapeRegex(phone), $options: "i" };
    }

    const [items, total] = await Promise.all([
      Customer.find(filter)
        .populate("gender_id")
        .populate("lang_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Customer.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

/**
 * Get Customer by ID
 */
const getCustomerById = async (req, res, next) => {
  try {
    const item = await Customer.findById(req.params.id)
      .populate("gender_id")
      .populate("lang_id");

    if (!item) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Customer
 */
const updateCustomer = async (req, res, next) => {
  try {
    const { error, value } = customerUpdateValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updateData = { ...value };
    if (updateData.password) {
      updateData.hashed_password = updateData.password;
      delete updateData.password;
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    Object.assign(customer, updateData);
    const updated = await customer.save();

    res.status(200).json({
      message: "Foydalanuvchi muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Customer
 */
const deleteCustomer = async (req, res, next) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }
    res.status(200).json({ message: "Foydalanuvchi muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

/**
 * Search Customer
 */
const searchCustomer = async (req, res, next) => {
  return getCustomers(req, res, next);
};

module.exports = {
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
};
