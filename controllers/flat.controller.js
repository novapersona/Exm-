const { Flat } = require("../models/FlatSchema");
const {
  flatValidationSchema,
  flatUpdateValidationSchema,
} = require("../validation/flatValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postFlat = async (req, res, next) => {
  try {
    const { error, value } = flatValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const flatData = {
      floor: value.floor !== undefined ? value.floor : value.etaj,
      etaj: value.etaj !== undefined ? value.etaj : value.floor,
      condition: value.condition,
    };

    const newFlat = await Flat.create(flatData);
    res.status(201).json({
      message: "Qavat/kvartira muvaffaqiyatli yaratildi",
      data: newFlat,
    });
  } catch (error) {
    next(error);
  }
};

const getFlats = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { floor, etaj, condition, search } = req.query;
    const filter = {};

    const targetFloor = floor !== undefined ? floor : etaj;
    if (targetFloor !== undefined) {
      filter.$or = [{ floor: targetFloor }, { etaj: targetFloor }];
    }

    const searchTerm = search || condition;
    if (searchTerm) {
      filter.condition = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      Flat.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Flat.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getFlatById = async (req, res, next) => {
  try {
    const item = await Flat.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Qavat/kvartira topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateFlat = async (req, res, next) => {
  try {
    const { error, value } = flatUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updateData = { ...value };
    if (updateData.floor !== undefined && updateData.etaj === undefined) {
      updateData.etaj = updateData.floor;
    }
    if (updateData.etaj !== undefined && updateData.floor === undefined) {
      updateData.floor = updateData.etaj;
    }

    const updated = await Flat.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Qavat/kvartira topilmadi" });

    res.status(200).json({
      message: "Qavat/kvartira muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFlat = async (req, res, next) => {
  try {
    const deleted = await Flat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Qavat/kvartira topilmadi" });
    res.status(200).json({ message: "Qavat/kvartira muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchFlat = async (req, res, next) => {
  return getFlats(req, res, next);
};

module.exports = {
  postFlat,
  getFlats,
  getFlatById,
  updateFlat,
  deleteFlat,
  searchFlat,
};
