const { Ticket } = require("../models/TicketSchema");
const {
  ticketValidationSchema,
  ticketUpdateValidationSchema,
} = require("../validation/ticketValidation");
const { getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postTicket = async (req, res, next) => {
  try {
    const { error, value } = ticketValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const existingTicket = await Ticket.findOne({
      event_id: value.event_id,
      seat_id: value.seat_id,
    });

    if (existingTicket) {
      return res.status(409).json({
        message: "Ushbu tadbir va o'rindiq uchun chipta allaqachon yaratilgan",
      });
    }

    const ticketData = { ...value };
    if (!ticketData.ticket_code) {
      ticketData.ticket_code = `TCK-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newTicket = await Ticket.create(ticketData);
    const populated = await Ticket.findById(newTicket._id)
      .populate("event_id")
      .populate("seat_id")
      .populate("status_id")
      .populate("ticket_type_id");

    res.status(201).json({
      message: "Chipta muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { event_id, status_id, ticket_type_id, seat_id } = req.query;
    const filter = {};

    if (event_id) filter.event_id = event_id;
    if (status_id) filter.status_id = status_id;
    if (ticket_type_id) filter.ticket_type_id = ticket_type_id;
    if (seat_id) filter.seat_id = seat_id;

    const [items, total] = await Promise.all([
      Ticket.find(filter)
        .populate("event_id")
        .populate("seat_id")
        .populate("status_id")
        .populate("ticket_type_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Ticket.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const item = await Ticket.findById(req.params.id)
      .populate("event_id")
      .populate("seat_id")
      .populate("status_id")
      .populate("ticket_type_id");

    if (!item) return res.status(404).json({ message: "Chipta topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const { error, value } = ticketUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Ticket.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    })
      .populate("event_id")
      .populate("seat_id")
      .populate("status_id")
      .populate("ticket_type_id");

    if (!updated) return res.status(404).json({ message: "Chipta topilmadi" });

    res.status(200).json({
      message: "Chipta muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const deleted = await Ticket.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Chipta topilmadi" });
    res.status(200).json({ message: "Chipta muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchTicket = async (req, res, next) => {
  return getTickets(req, res, next);
};

module.exports = {
  postTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  searchTicket,
};
