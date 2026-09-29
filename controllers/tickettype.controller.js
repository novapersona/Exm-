const { TicketType } = require("../models/TicketTypeSchema");
const {
  tickettypeValidationSchema,
  tickettypeUpdateValidationSchema,
} = require("../validation/tickettypeValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postTicketType = async (req, res, next) => {
  try {
    const { error, value } = tickettypeValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newType = await TicketType.create(value);
    res.status(201).json({
      message: "Chipta turi muvaffaqiyatli yaratildi",
      data: newType,
    });
  } catch (error) {
    next(error);
  }
};

const getTicketTypes = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { ticket_type, name, search } = req.query;
    const filter = {};

    const searchTerm = search || ticket_type || name;
    if (searchTerm) {
      filter.$or = [
        { ticket_type: { $regex: escapeRegex(searchTerm), $options: "i" } },
        { name: { $regex: escapeRegex(searchTerm), $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      TicketType.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      TicketType.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getTicketTypeById = async (req, res, next) => {
  try {
    const item = await TicketType.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Chipta turi topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateTicketType = async (req, res, next) => {
  try {
    const { error, value } = tickettypeUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await TicketType.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Chipta turi topilmadi" });

    res.status(200).json({
      message: "Chipta turi muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTicketType = async (req, res, next) => {
  try {
    const deleted = await TicketType.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Chipta turi topilmadi" });
    res.status(200).json({ message: "Chipta turi muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchTicketType = async (req, res, next) => {
  return getTicketTypes(req, res, next);
};

module.exports = {
  postTicketType,
  getTicketTypes,
  getTicketTypeById,
  updateTicketType,
  deleteTicketType,
  searchTicketType,
};
