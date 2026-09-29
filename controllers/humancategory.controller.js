const { HumanCategory } = require("../models/HumanCategorySchema");
const {
  humancategoryValidationSchema,
  humancategoryUpdateValidationSchema,
} = require("../validation/humancategoryValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postHumanCategory = async (req, res, next) => {
  try {
    const { error, value } = humancategoryValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (value.start_age > value.finish_age) {
      return res.status(400).json({ message: "start_age finish_agedan katta bo'lishi mumkin emas" });
    }

    const newCategory = await HumanCategory.create(value);
    const populated = await HumanCategory.findById(newCategory._id).populate("gender_id");

    res.status(201).json({
      message: "Yosh toifasi muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getHumanCategories = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, gender_id, search } = req.query;
    const filter = {};

    if (gender_id) filter.gender_id = gender_id;
    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      HumanCategory.find(filter)
        .populate("gender_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      HumanCategory.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getHumanCategoryById = async (req, res, next) => {
  try {
    const item = await HumanCategory.findById(req.params.id).populate("gender_id");
    if (!item) return res.status(404).json({ message: "Yosh toifasi topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateHumanCategory = async (req, res, next) => {
  try {
    const { error, value } = humancategoryUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (value.start_age !== undefined && value.finish_age !== undefined && value.start_age > value.finish_age) {
      return res.status(400).json({ message: "start_age finish_agedan katta bo'lishi mumkin emas" });
    }

    const updated = await HumanCategory.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    }).populate("gender_id");

    if (!updated) return res.status(404).json({ message: "Yosh toifasi topilmadi" });

    res.status(200).json({
      message: "Yosh toifasi muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteHumanCategory = async (req, res, next) => {
  try {
    const deleted = await HumanCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Yosh toifasi topilmadi" });
    res.status(200).json({ message: "Yosh toifasi muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchHumanCategory = async (req, res, next) => {
  return getHumanCategories(req, res, next);
};

module.exports = {
  postHumanCategory,
  getHumanCategories,
  getHumanCategorys: getHumanCategories, // compatibility with legacy typo
  getHumanCategoryById,
  updateHumanCategory,
  deleteHumanCategory,
  searchHumanCategory,
};
