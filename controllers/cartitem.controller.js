const { CartItem } = require("../models/CartItemSchema");
const {
  cartitemValidationSchema,
  cartitemUpdateValidationSchema,
} = require("../validation/cartitemValidation");
const { getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

/**
 * Add Item to Cart
 */
const postCartItem = async (req, res, next) => {
  try {
    const { error, value } = cartitemValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if item already exists in cart, then increment quantity
    let cartItem = await CartItem.findOne({
      cart_id: value.cart_id,
      ticket_id: value.ticket_id,
    });

    if (cartItem) {
      cartItem.quantity += (value.quantity || 1);
      await cartItem.save();
    } else {
      cartItem = await CartItem.create(value);
    }

    const populated = await CartItem.findById(cartItem._id)
      .populate("ticket_id")
      .populate("cart_id");

    res.status(201).json({
      message: "Chipta savatga muvaffaqiyatli qo'shildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all CartItems with pagination & safe filter
 */
const getCartItems = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { cart_id, ticket_id } = req.query;
    const filter = {};

    if (cart_id) filter.cart_id = cart_id;
    if (ticket_id) filter.ticket_id = ticket_id;

    const [items, total] = await Promise.all([
      CartItem.find(filter)
        .populate("ticket_id")
        .populate("cart_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CartItem.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

/**
 * Get CartItem by ID
 */
const getCartItemById = async (req, res, next) => {
  try {
    const item = await CartItem.findById(req.params.id)
      .populate("ticket_id")
      .populate("cart_id");

    if (!item) {
      return res.status(404).json({ message: "Savat elementi topilmadi" });
    }
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

/**
 * Update CartItem
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { error, value } = cartitemUpdateValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updated = await CartItem.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    })
      .populate("ticket_id")
      .populate("cart_id");

    if (!updated) {
      return res.status(404).json({ message: "Savat elementi topilmadi" });
    }

    res.status(200).json({
      message: "Savat elementi muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete CartItem
 */
const deleteCartItem = async (req, res, next) => {
  try {
    const deleted = await CartItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Savat elementi topilmadi" });
    }
    res.status(200).json({ message: "Savat elementi muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

/**
 * Search CartItem
 */
const searchCartItem = async (req, res, next) => {
  return getCartItems(req, res, next);
};

module.exports = {
  postCartItem,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
  searchCartItem,
};
