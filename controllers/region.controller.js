const { Region } = require("../models/RegionSchema");
const {
  regionValidationSchema,
  regionUpdateValidationSchema,
} = require("../validation/regionValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postRegion = async (req, res, next) => {
  try {
    const { error, value } = regionValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newRegion = await Region.create(value);
    const populated = await Region.findById(newRegion._id).populate("country_id");

    res.status(201).json({
      message: "Viloyat muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getRegions = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, country_id, search } = req.query;
    const filter = {};

    if (country_id) filter.country_id = country_id;
    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      Region.find(filter)
        .populate("country_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Region.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getRegionById = async (req, res, next) => {
  try {
    const item = await Region.findById(req.params.id).populate("country_id");
    if (!item) return res.status(404).json({ message: "Viloyat topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateRegion = async (req, res, next) => {
  try {
    const { error, value } = regionUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Region.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    }).populate("country_id");

    if (!updated) return res.status(404).json({ message: "Viloyat topilmadi" });

    res.status(200).json({
      message: "Viloyat muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRegion = async (req, res, next) => {
  try {
    const deleted = await Region.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Viloyat topilmadi" });
    res.status(200).json({ message: "Viloyat muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchRegion = async (req, res, next) => {
  return getRegions(req, res, next);
};

module.exports = {
  postRegion,
  getRegions,
  getRegionById,
  updateRegion,
  deleteRegion,
  searchRegion,
};
