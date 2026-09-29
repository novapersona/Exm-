const { Gender } = require("../models/GenderSchema");
const {
  genderValidationSchema,
  genderUpdateValidationSchema,
} = require("../validation/genderValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postGender = async (req, res, next) => {
  try {
    const { error, value } = genderValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newGender = await Gender.create(value);
    res.status(201).json({
      message: "Jins muvaffaqiyatli yaratildi",
      data: newGender,
    });
  } catch (error) {
    next(error);
  }
};

const getGenders = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, search } = req.query;
    const filter = {};

    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      Gender.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Gender.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getGenderById = async (req, res, next) => {
  try {
    const item = await Gender.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Jins topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateGender = async (req, res, next) => {
  try {
    const { error, value } = genderUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Gender.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Jins topilmadi" });

    res.status(200).json({
      message: "Jins muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteGender = async (req, res, next) => {
  try {
    const deleted = await Gender.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Jins topilmadi" });
    res.status(200).json({ message: "Jins muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchGender = async (req, res, next) => {
  return getGenders(req, res, next);
};

module.exports = {
  postGender,
  getGenders,
  getGenderById,
  updateGender,
  deleteGender,
  searchGender,
};
