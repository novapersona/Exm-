const { District } = require("../models/DistrictSchema");
const {
  districtValidationSchema,
  districtUpdateValidationSchema,
} = require("../validation/districtValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postDistrict = async (req, res, next) => {
  try {
    const { error, value } = districtValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newDistrict = await District.create(value);
    const populated = await District.findById(newDistrict._id).populate("region_id");

    res.status(201).json({
      message: "Tuman muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getDistricts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, region_id, search } = req.query;
    const filter = {};

    if (region_id) filter.region_id = region_id;
    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      District.find(filter)
        .populate("region_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      District.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getDistrictById = async (req, res, next) => {
  try {
    const item = await District.findById(req.params.id).populate("region_id");
    if (!item) return res.status(404).json({ message: "Tuman topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateDistrict = async (req, res, next) => {
  try {
    const { error, value } = districtUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await District.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    }).populate("region_id");

    if (!updated) return res.status(404).json({ message: "Tuman topilmadi" });

    res.status(200).json({
      message: "Tuman muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDistrict = async (req, res, next) => {
  try {
    const deleted = await District.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Tuman topilmadi" });
    res.status(200).json({ message: "Tuman muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchDistrict = async (req, res, next) => {
  return getDistricts(req, res, next);
};

module.exports = {
  postDistrict,
  getDistricts,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
  searchDistrict,
};
