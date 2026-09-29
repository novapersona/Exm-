const { SeatType } = require("../models/SeatTypeSchema");
const {
  seattypeValidationSchema,
  seattypeUpdateValidationSchema,
} = require("../validation/seattypeValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postSeatType = async (req, res, next) => {
  try {
    const { error, value } = seattypeValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newType = await SeatType.create(value);
    res.status(201).json({
      message: "O'rindiq turi muvaffaqiyatli yaratildi",
      data: newType,
    });
  } catch (error) {
    next(error);
  }
};

const getSeatTypes = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, search } = req.query;
    const filter = {};

    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      SeatType.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      SeatType.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getSeatTypeById = async (req, res, next) => {
  try {
    const item = await SeatType.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "O'rindiq turi topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateSeatType = async (req, res, next) => {
  try {
    const { error, value } = seattypeUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await SeatType.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "O'rindiq turi topilmadi" });

    res.status(200).json({
      message: "O'rindiq turi muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSeatType = async (req, res, next) => {
  try {
    const deleted = await SeatType.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "O'rindiq turi topilmadi" });
    res.status(200).json({ message: "O'rindiq turi muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchSeatType = async (req, res, next) => {
  return getSeatTypes(req, res, next);
};

module.exports = {
  postSeatType,
  getSeatTypes,
  getSeatTypeById,
  updateSeatType,
  deleteSeatType,
  searchSeatType,
};
