const { DeliveryMethod } = require("../models/DeliveryMethodSchema");
const {
  deliverymethodValidationSchema,
  deliverymethodUpdateValidationSchema,
} = require("../validation/deliverymethodValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postDeliveryMethod = async (req, res, next) => {
  try {
    const { error, value } = deliverymethodValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newMethod = await DeliveryMethod.create(value);
    res.status(201).json({
      message: "Yetkazib berish usuli yaratildi",
      data: newMethod,
    });
  } catch (error) {
    next(error);
  }
};

const getDeliveryMethods = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, search } = req.query;
    const filter = {};

    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      DeliveryMethod.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      DeliveryMethod.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getDeliveryMethodById = async (req, res, next) => {
  try {
    const item = await DeliveryMethod.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Yetkazib berish usuli topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateDeliveryMethod = async (req, res, next) => {
  try {
    const { error, value } = deliverymethodUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await DeliveryMethod.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Yetkazib berish usuli topilmadi" });

    res.status(200).json({
      message: "Yetkazib berish usuli muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDeliveryMethod = async (req, res, next) => {
  try {
    const deleted = await DeliveryMethod.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Yetkazib berish usuli topilmadi" });
    res.status(200).json({ message: "Yetkazib berish usuli muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchDeliveryMethod = async (req, res, next) => {
  return getDeliveryMethods(req, res, next);
};

module.exports = {
  postDeliveryMethod,
  getDeliveryMethods,
  getDeliveryMethodById,
  updateDeliveryMethod,
  deleteDeliveryMethod,
  searchDeliveryMethod,
};
