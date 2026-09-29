const { VenueTypes } = require("../models/VenueTypesSchema");
const {
  venuetypesValidationSchema,
  venuetypesUpdateValidationSchema,
} = require("../validation/venuetypesValidation");
const { getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postVenueTypes = async (req, res, next) => {
  try {
    const { error, value } = venuetypesValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const pairData = {
      venueId: value.venueId || value.venue_id,
      venue_id: value.venue_id || value.venueId,
      typeId: value.typeId || value.type_id,
      type_id: value.type_id || value.typeId,
    };

    const newPair = await VenueTypes.create(pairData);
    const populated = await VenueTypes.findById(newPair._id)
      .populate("venueId")
      .populate("venue_id")
      .populate("typeId")
      .populate("type_id");

    res.status(201).json({
      message: "Venue va Tur bog'lanishi yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getVenueTypes = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { venue_id, venueId, type_id, typeId } = req.query;
    const filter = {};

    const targetVenue = venue_id || venueId;
    if (targetVenue) {
      filter.$or = [{ venueId: targetVenue }, { venue_id: targetVenue }];
    }

    const targetType = type_id || typeId;
    if (targetType) {
      if (filter.$or) {
        filter.$and = [
          { $or: filter.$or },
          { $or: [{ typeId: targetType }, { type_id: targetType }] },
        ];
        delete filter.$or;
      } else {
        filter.$or = [{ typeId: targetType }, { type_id: targetType }];
      }
    }

    const [items, total] = await Promise.all([
      VenueTypes.find(filter)
        .populate("venueId")
        .populate("venue_id")
        .populate("typeId")
        .populate("type_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      VenueTypes.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getVenueTypesById = async (req, res, next) => {
  try {
    const item = await VenueTypes.findById(req.params.id)
      .populate("venueId")
      .populate("venue_id")
      .populate("typeId")
      .populate("type_id");

    if (!item) return res.status(404).json({ message: "Bog'lanish topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateVenueTypes = async (req, res, next) => {
  try {
    const { error, value } = venuetypesUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updateData = { ...value };
    if (updateData.venueId && !updateData.venue_id) updateData.venue_id = updateData.venueId;
    if (updateData.venue_id && !updateData.venueId) updateData.venueId = updateData.venue_id;
    if (updateData.typeId && !updateData.type_id) updateData.type_id = updateData.typeId;
    if (updateData.type_id && !updateData.typeId) updateData.typeId = updateData.type_id;

    const updated = await VenueTypes.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("venueId")
      .populate("venue_id")
      .populate("typeId")
      .populate("type_id");

    if (!updated) return res.status(404).json({ message: "Bog'lanish topilmadi" });

    res.status(200).json({
      message: "Bog'lanish muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVenueTypes = async (req, res, next) => {
  try {
    const deleted = await VenueTypes.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Bog'lanish topilmadi" });
    res.status(200).json({ message: "Bog'lanish muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchVenueTypes = async (req, res, next) => {
  return getVenueTypes(req, res, next);
};

module.exports = {
  postVenueTypes,
  getVenueTypes,
  getVenueTypess: getVenueTypes, // compatibility with legacy typo
  getVenueTypesById,
  updateVenueTypes,
  deleteVenueTypes,
  searchVenueTypes,
};
