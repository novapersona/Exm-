const { Seat } = require("../models/SeatSchema");
const {
  seatValidationSchema,
  seatUpdateValidationSchema,
} = require("../validation/seatValidation");
const { getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postSeat = async (req, res, next) => {
  try {
    const { error, value } = seatValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const existingSeat = await Seat.findOne({
      venue_id: value.venue_id,
      sector_id: value.sector_id,
      row_number: value.row_number,
      number: value.number,
    });

    if (existingSeat) {
      return res.status(409).json({
        message: "Ushbu joy (zal, sektor, qator va o'rin) allaqachon mavjud",
      });
    }

    const newSeat = await Seat.create(value);
    const populated = await Seat.findById(newSeat._id)
      .populate("sector_id")
      .populate("venue_id")
      .populate("seat_type_id");

    res.status(201).json({
      message: "O'rindiq muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getSeats = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { venue_id, sector_id, seat_type_id, row_number } = req.query;
    const filter = {};

    if (venue_id) filter.venue_id = venue_id;
    if (sector_id) filter.sector_id = sector_id;
    if (seat_type_id) filter.seat_type_id = seat_type_id;
    if (row_number) filter.row_number = Number(row_number);

    const [items, total] = await Promise.all([
      Seat.find(filter)
        .populate("sector_id")
        .populate("venue_id")
        .populate("seat_type_id")
        .sort({ row_number: 1, number: 1 })
        .skip(skip)
        .limit(limit),
      Seat.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getSeatById = async (req, res, next) => {
  try {
    const item = await Seat.findById(req.params.id)
      .populate("sector_id")
      .populate("venue_id")
      .populate("seat_type_id");

    if (!item) return res.status(404).json({ message: "O'rindiq topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateSeat = async (req, res, next) => {
  try {
    const { error, value } = seatUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Seat.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    })
      .populate("sector_id")
      .populate("venue_id")
      .populate("seat_type_id");

    if (!updated) return res.status(404).json({ message: "O'rindiq topilmadi" });

    res.status(200).json({
      message: "O'rindiq muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSeat = async (req, res, next) => {
  try {
    const deleted = await Seat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "O'rindiq topilmadi" });
    res.status(200).json({ message: "O'rindiq muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchSeat = async (req, res, next) => {
  return getSeats(req, res, next);
};

module.exports = {
  postSeat,
  getSeats,
  getSeatById,
  updateSeat,
  deleteSeat,
  searchSeat,
};
