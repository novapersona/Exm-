const { VenuePhoto } = require("../models/VenuePhotoSchema");
const {
  venuephotoValidationSchema,
  venuephotoUpdateValidationSchema,
} = require("../validation/venuephotoValidation");
const { getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postVenuePhoto = async (req, res, next) => {
  try {
    const { error, value } = venuephotoValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const photoData = {
      venueId: value.venueId || value.venue_id,
      venue_id: value.venue_id || value.venueId,
      url: value.url,
    };

    const newPhoto = await VenuePhoto.create(photoData);
    const populated = await VenuePhoto.findById(newPhoto._id)
      .populate("venueId")
      .populate("venue_id");

    res.status(201).json({
      message: "Venue rasmi muvaffaqiyatli saqlandi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getVenuePhotos = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { venue_id, venueId } = req.query;
    const filter = {};

    const targetVenue = venue_id || venueId;
    if (targetVenue) {
      filter.$or = [{ venueId: targetVenue }, { venue_id: targetVenue }];
    }

    const [items, total] = await Promise.all([
      VenuePhoto.find(filter)
        .populate("venueId")
        .populate("venue_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      VenuePhoto.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getVenuePhotoById = async (req, res, next) => {
  try {
    const item = await VenuePhoto.findById(req.params.id)
      .populate("venueId")
      .populate("venue_id");

    if (!item) return res.status(404).json({ message: "Venue rasmi topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateVenuePhoto = async (req, res, next) => {
  try {
    const { error, value } = venuephotoUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updateData = { ...value };
    if (updateData.venueId && !updateData.venue_id) updateData.venue_id = updateData.venueId;
    if (updateData.venue_id && !updateData.venueId) updateData.venueId = updateData.venue_id;

    const updated = await VenuePhoto.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("venueId")
      .populate("venue_id");

    if (!updated) return res.status(404).json({ message: "Venue rasmi topilmadi" });

    res.status(200).json({
      message: "Venue rasmi muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVenuePhoto = async (req, res, next) => {
  try {
    const deleted = await VenuePhoto.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Venue rasmi topilmadi" });
    res.status(200).json({ message: "Venue rasmi muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchVenuePhoto = async (req, res, next) => {
  return getVenuePhotos(req, res, next);
};

module.exports = {
  postVenuePhoto,
  getVenuePhotos,
  getVenuePhotoById,
  updateVenuePhoto,
  deleteVenuePhoto,
  searchVenuePhoto,
};
