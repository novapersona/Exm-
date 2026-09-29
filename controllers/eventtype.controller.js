const { EventType } = require("../models/EventTypeSchema");
const {
  eventtypeValidationSchema,
  eventtypeUpdateValidationSchema,
} = require("../validation/eventtypeValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postEventType = async (req, res, next) => {
  try {
    const { error, value } = eventtypeValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newEventType = await EventType.create(value);
    const populated = await EventType.findById(newEventType._id).populate("parent_event_type_id");

    res.status(201).json({
      message: "Tadbir turi muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getEventTypes = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, parent_event_type_id, search } = req.query;
    const filter = {};

    if (parent_event_type_id) filter.parent_event_type_id = parent_event_type_id;

    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      EventType.find(filter)
        .populate("parent_event_type_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      EventType.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getEventTypeById = async (req, res, next) => {
  try {
    const item = await EventType.findById(req.params.id).populate("parent_event_type_id");
    if (!item) return res.status(404).json({ message: "Tadbir turi topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateEventType = async (req, res, next) => {
  try {
    const { error, value } = eventtypeUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (value.parent_event_type_id && value.parent_event_type_id === req.params.id) {
      return res.status(400).json({ message: "O'zini o'ziga ota toifa sifatida belgilab bo'lmaydi" });
    }

    const updated = await EventType.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    }).populate("parent_event_type_id");

    if (!updated) return res.status(404).json({ message: "Tadbir turi topilmadi" });

    res.status(200).json({
      message: "Tadbir turi muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEventType = async (req, res, next) => {
  try {
    const deleted = await EventType.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Tadbir turi topilmadi" });
    res.status(200).json({ message: "Tadbir turi muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchEventType = async (req, res, next) => {
  return getEventTypes(req, res, next);
};

module.exports = {
  postEventType,
  getEventTypes,
  getEventTypeById,
  updateEventType,
  deleteEventType,
  searchEventType,
};
