const { Types } = require("../models/TypesSchema");
const {
  typesValidationSchema,
  typesUpdateValidationSchema,
} = require("../validation/typesValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postTypes = async (req, res, next) => {
  try {
    const { error, value } = typesValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newType = await Types.create(value);
    res.status(201).json({
      message: "Tur muvaffaqiyatli yaratildi",
      data: newType,
    });
  } catch (error) {
    next(error);
  }
};

const getTypes = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, search } = req.query;
    const filter = {};

    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      Types.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Types.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getTypesById = async (req, res, next) => {
  try {
    const item = await Types.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Tur topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateTypes = async (req, res, next) => {
  try {
    const { error, value } = typesUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Types.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Tur topilmadi" });

    res.status(200).json({
      message: "Tur muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTypes = async (req, res, next) => {
  try {
    const deleted = await Types.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Tur topilmadi" });
    res.status(200).json({ message: "Tur muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchTypes = async (req, res, next) => {
  return getTypes(req, res, next);
};

module.exports = {
  postTypes,
  getTypes,
  getTypess: getTypes, // compatibility with legacy typo
  getTypesById,
  updateTypes,
  deleteTypes,
  searchTypes,
};
