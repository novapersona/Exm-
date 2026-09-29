const { Sector } = require("../models/SectorSchema");
const {
  sectorValidationSchema,
  sectorUpdateValidationSchema,
} = require("../validation/sectorValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postSector = async (req, res, next) => {
  try {
    const { error, value } = sectorValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newSector = await Sector.create(value);
    const populated = await Sector.findById(newSector._id).populate("venue_id");

    res.status(201).json({
      message: "Sektor muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getSectors = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { sector_name, venue_id, search } = req.query;
    const filter = {};

    if (venue_id) filter.venue_id = venue_id;
    const searchTerm = search || sector_name;
    if (searchTerm) {
      filter.sector_name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      Sector.find(filter)
        .populate("venue_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Sector.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getSectorById = async (req, res, next) => {
  try {
    const item = await Sector.findById(req.params.id).populate("venue_id");
    if (!item) return res.status(404).json({ message: "Sektor topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateSector = async (req, res, next) => {
  try {
    const { error, value } = sectorUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Sector.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    }).populate("venue_id");

    if (!updated) return res.status(404).json({ message: "Sektor topilmadi" });

    res.status(200).json({
      message: "Sektor muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSector = async (req, res, next) => {
  try {
    const deleted = await Sector.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Sektor topilmadi" });
    res.status(200).json({ message: "Sektor muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchSector = async (req, res, next) => {
  return getSectors(req, res, next);
};

module.exports = {
  postSector,
  getSectors,
  getSectorById,
  updateSector,
  deleteSector,
  searchSector,
};
