const { Booking } = require("../models/BookingSchema");
const { CartItem } = require("../models/CartItemSchema");
const {
  bookingValidationSchema,
  bookingUpdateValidationSchema,
} = require("../validation/bookingValidation");
const { getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

/**
 * Create a new Booking
 */
const postBooking = async (req, res, next) => {
  try {
    const { error, value } = bookingValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const bookingData = {
      cart_id: value.cart_id,
      payment_method_id: value.payment_method_id,
      delivery_method_id: value.delivery_method_id,
      discount_id: value.discount_id || null,
      status_id: value.status_id,
      finished: value.finished || value.fineshed || new Date(),
      total_price: value.total_price || 0,
    };

    // Calculate total price from cart items if not provided
    if (!bookingData.total_price) {
      const items = await CartItem.find({ cart_id: value.cart_id }).populate("ticket_id");
      bookingData.total_price = items.reduce((acc, item) => {
        const price = item.ticket_id ? (item.ticket_id.price + item.ticket_id.service_fee) : 0;
        return acc + price * (item.quantity || 1);
      }, 0);
    }

    const newBooking = await Booking.create(bookingData);
    const populated = await Booking.findById(newBooking._id)
      .populate("cart_id")
      .populate("payment_method_id")
      .populate("delivery_method_id")
      .populate("discount_id")
      .populate("status_id");

    res.status(201).json({
      message: "Bron muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all Bookings with pagination & safe filter
 */
const getBookings = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { cart_id, status_id, payment_method_id, delivery_method_id } = req.query;
    const filter = {};

    if (cart_id) filter.cart_id = cart_id;
    if (status_id) filter.status_id = status_id;
    if (payment_method_id) filter.payment_method_id = payment_method_id;
    if (delivery_method_id) filter.delivery_method_id = delivery_method_id;

    const [items, total] = await Promise.all([
      Booking.find(filter)
        .populate("cart_id")
        .populate("payment_method_id")
        .populate("delivery_method_id")
        .populate("discount_id")
        .populate("status_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

/**
 * Get Booking by ID
 */
const getBookingById = async (req, res, next) => {
  try {
    const item = await Booking.findById(req.params.id)
      .populate("cart_id")
      .populate("payment_method_id")
      .populate("delivery_method_id")
      .populate("discount_id")
      .populate("status_id");

    if (!item) {
      return res.status(404).json({ message: "Bron topilmadi" });
    }
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Booking
 */
const updateBooking = async (req, res, next) => {
  try {
    const { error, value } = bookingUpdateValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updated = await Booking.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    })
      .populate("cart_id")
      .populate("payment_method_id")
      .populate("delivery_method_id")
      .populate("discount_id")
      .populate("status_id");

    if (!updated) {
      return res.status(404).json({ message: "Bron topilmadi" });
    }

    res.status(200).json({
      message: "Bron muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Booking
 */
const deleteBooking = async (req, res, next) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Bron topilmadi" });
    }
    res.status(200).json({ message: "Bron muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

/**
 * Search Booking (Safe query)
 */
const searchBooking = async (req, res, next) => {
  return getBookings(req, res, next);
};

module.exports = {
  postBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  searchBooking,
};
