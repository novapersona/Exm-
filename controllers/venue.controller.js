const { Venue } = require("../models/VenueSchema");
const {
  venueValidationSchema,
  venueUpdateValidationSchema,
} = require("../validation/venueValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postVenue = async (req, res, next) => {
  try {
    const { error, value } = venueValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newVenue = await Venue.create(value);
    const populated = await Venue.findById(newVenue._id)
      .populate("region_id")
      .populate("district_id");

    res.status(201).json({
      message: "Venue muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getVenues = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, region_id, district_id, search } = req.query;
    const filter = {};

    if (region_id) filter.region_id = region_id;
    if (district_id) filter.district_id = district_id;

    const searchTerm = search || name;
    if (searchTerm) {
      const escaped = escapeRegex(searchTerm);
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { address: { $regex: escaped, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Venue.find(filter)
        .populate("region_id")
        .populate("district_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Venue.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getVenueById = async (req, res, next) => {
  try {
    const item = await Venue.findById(req.params.id)
      .populate("region_id")
      .populate("district_id");

    if (!item) return res.status(404).json({ message: "Venue topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateVenue = async (req, res, next) => {
  try {
    const { error, value } = venueUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Venue.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    })
      .populate("region_id")
      .populate("district_id");

    if (!updated) return res.status(404).json({ message: "Venue topilmadi" });

    res.status(200).json({
      message: "Venue muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVenue = async (req, res, next) => {
  try {
    const deleted = await Venue.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Venue topilmadi" });
    res.status(200).json({ message: "Venue muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchVenue = async (req, res, next) => {
  return getVenues(req, res, next);
};

module.exports = {
  postVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
  searchVenue,
};
