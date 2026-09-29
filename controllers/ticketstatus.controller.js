const { TicketStatus } = require("../models/TicketStatusSchema");
const {
  ticketstatusValidationSchema,
  ticketstatusUpdateValidationSchema,
} = require("../validation/ticketstatusValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postTicketStatus = async (req, res, next) => {
  try {
    const { error, value } = ticketstatusValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newStatus = await TicketStatus.create(value);
    res.status(201).json({
      message: "Chipta holati muvaffaqiyatli yaratildi",
      data: newStatus,
    });
  } catch (error) {
    next(error);
  }
};

const getTicketStatuses = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { name, search } = req.query;
    const filter = {};

    const searchTerm = search || name;
    if (searchTerm) {
      filter.name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      TicketStatus.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      TicketStatus.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getTicketStatusById = async (req, res, next) => {
  try {
    const item = await TicketStatus.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Chipta holati topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateTicketStatus = async (req, res, next) => {
  try {
    const { error, value } = ticketstatusUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await TicketStatus.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Chipta holati topilmadi" });

    res.status(200).json({
      message: "Chipta holati muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTicketStatus = async (req, res, next) => {
  try {
    const deleted = await TicketStatus.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Chipta holati topilmadi" });
    res.status(200).json({ message: "Chipta holati muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchTicketStatus = async (req, res, next) => {
  return getTicketStatuses(req, res, next);
};

module.exports = {
  postTicketStatus,
  getTicketStatuses,
  getTicketStatuss: getTicketStatuses, // compatibility with legacy typo
  getTicketStatusById,
  updateTicketStatus,
  deleteTicketStatus,
  searchTicketStatus,
};
