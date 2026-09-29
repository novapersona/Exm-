const { PaymentMethod } = require("../models/PaymentMethodSchema");
const {
  paymentmethodValidationSchema,
  paymentmethodUpdateValidationSchema,
} = require("../validation/paymentmethodValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postPaymentMethod = async (req, res, next) => {
  try {
    const { error, value } = paymentmethodValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newMethod = await PaymentMethod.create(value);
    res.status(201).json({
      message: "To'lov usuli yaratildi",
      data: newMethod,
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentMethods = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, search } = req.query;
    const filter = {};

    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      PaymentMethod.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      PaymentMethod.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getPaymentMethodById = async (req, res, next) => {
  try {
    const item = await PaymentMethod.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "To'lov usuli topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updatePaymentMethod = async (req, res, next) => {
  try {
    const { error, value } = paymentmethodUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await PaymentMethod.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "To'lov usuli topilmadi" });

    res.status(200).json({
      message: "To'lov usuli muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deletePaymentMethod = async (req, res, next) => {
  try {
    const deleted = await PaymentMethod.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "To'lov usuli topilmadi" });
    res.status(200).json({ message: "To'lov usuli muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchPaymentMethod = async (req, res, next) => {
  return getPaymentMethods(req, res, next);
};

module.exports = {
  postPaymentMethod,
  getPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod,
  searchPaymentMethod,
};
