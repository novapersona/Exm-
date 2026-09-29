const { Event } = require("../models/EventSchema");
const {
  eventValidationSchema,
  eventUpdateValidationSchema,
} = require("../validation/eventValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postEvent = async (req, res, next) => {
  try {
    const { error, value } = eventValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (new Date(value.start_date) > new Date(value.finish_date)) {
      return res.status(400).json({ message: "start_date finish_datedan keyin bo'lishi mumkin emas" });
    }

    const newEvent = await Event.create(value);
    const populated = await Event.findById(newEvent._id)
      .populate("event_type_id")
      .populate("human_category_id")
      .populate("venue_id")
      .populate("lang_id");

    res.status(201).json({
      message: "Tadbir muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, event_type_id, venue_id, search } = req.query;
    const filter = {};

    if (event_type_id) filter.event_type_id = event_type_id;
    if (venue_id) filter.venue_id = venue_id;

    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      Event.find(filter)
        .populate("event_type_id")
        .populate("human_category_id")
        .populate("venue_id")
        .populate("lang_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Event.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const item = await Event.findById(req.params.id)
      .populate("event_type_id")
      .populate("human_category_id")
      .populate("venue_id")
      .populate("lang_id");

    if (!item) return res.status(404).json({ message: "Tadbir topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { error, value } = eventUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (value.start_date && value.finish_date && new Date(value.start_date) > new Date(value.finish_date)) {
      return res.status(400).json({ message: "start_date finish_datedan keyin bo'lishi mumkin emas" });
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    })
      .populate("event_type_id")
      .populate("human_category_id")
      .populate("venue_id")
      .populate("lang_id");

    if (!updated) return res.status(404).json({ message: "Tadbir topilmadi" });

    res.status(200).json({
      message: "Tadbir muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Tadbir topilmadi" });
    res.status(200).json({ message: "Tadbir muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchEvent = async (req, res, next) => {
  return getEvents(req, res, next);
};

module.exports = {
  postEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  searchEvent,
};
