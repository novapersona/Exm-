const { Lang } = require("../models/LangSchema");
const {
  langValidationSchema,
  langUpdateValidationSchema,
} = require("../validation/langValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postLang = async (req, res, next) => {
  try {
    const { error, value } = langValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newLang = await Lang.create(value);
    res.status(201).json({
      message: "Til muvaffaqiyatli yaratildi",
      data: newLang,
    });
  } catch (error) {
    next(error);
  }
};

const getLangs = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, search } = req.query;
    const filter = {};

    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      Lang.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Lang.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getLangById = async (req, res, next) => {
  try {
    const item = await Lang.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Til topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateLang = async (req, res, next) => {
  try {
    const { error, value } = langUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Lang.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Til topilmadi" });

    res.status(200).json({
      message: "Til muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLang = async (req, res, next) => {
  try {
    const deleted = await Lang.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Til topilmadi" });
    res.status(200).json({ message: "Til muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchLang = async (req, res, next) => {
  return getLangs(req, res, next);
};

module.exports = {
  postLang,
  getLangs,
  getLangById,
  updateLang,
  deleteLang,
  searchLang,
};
