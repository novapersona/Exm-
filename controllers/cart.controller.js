const { Cart } = require("../models/CartSchema");
const { CartItem } = require("../models/CartItemSchema");
const {
  cartValidationSchema,
  cartUpdateValidationSchema,
} = require("../validation/cartValidation");
const { getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

/**
 * Create a new Cart
 */
const postCart = async (req, res, next) => {
  try {
    const { error, value } = cartValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const cartData = {
      customer_id: value.customer_id,
      status_id: value.status_id,
      finishedAt: value.finishedAt || value.fineshedAt || null,
      expiresAt: value.expiresAt || new Date(Date.now() + 15 * 60 * 1000),
    };

    const newCart = await Cart.create(cartData);
    const populated = await Cart.findById(newCart._id)
      .populate("customer_id")
      .populate("status_id");

    res.status(201).json({
      message: "Savat muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all Carts with pagination & safe filtering
 */
const getCarts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { customer_id, status_id } = req.query;
    const filter = {};

    if (customer_id) filter.customer_id = customer_id;
    if (status_id) filter.status_id = status_id;

    const [items, total] = await Promise.all([
      Cart.find(filter)
        .populate("customer_id")
        .populate("status_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Cart.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

/**
 * Get Cart by ID (with items and total calculation)
 */
const getCartById = async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate("customer_id")
      .populate("status_id");

    if (!cart) {
      return res.status(404).json({ message: "Savat topilmadi" });
    }

    const items = await CartItem.find({ cart_id: cart._id }).populate("ticket_id");
    const totalAmount = items.reduce((acc, item) => {
      const price = item.ticket_id ? (item.ticket_id.price + item.ticket_id.service_fee) : 0;
      return acc + price * (item.quantity || 1);
    }, 0);

    res.status(200).json({
      data: {
        ...cart.toObject(),
        items,
        totalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Cart
 */
const updateCart = async (req, res, next) => {
  try {
    const { error, value } = cartUpdateValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updateData = { ...value };
    if (updateData.finishedAt) updateData.fineshedAt = updateData.finishedAt;

    const updated = await Cart.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("customer_id")
      .populate("status_id");

    if (!updated) {
      return res.status(404).json({ message: "Savat topilmadi" });
    }

    res.status(200).json({
      message: "Savat muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Cart and its items
 */
const deleteCart = async (req, res, next) => {
  try {
    const deleted = await Cart.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Savat topilmadi" });
    }

    // Cascade delete cart items
    await CartItem.deleteMany({ cart_id: req.params.id });

    res.status(200).json({ message: "Savat muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

/**
 * Search Cart
 */
const searchCart = async (req, res, next) => {
  return getCarts(req, res, next);
};

module.exports = {
  postCart,
  getCarts,
  getCartById,
  updateCart,
  deleteCart,
  searchCart,
};
