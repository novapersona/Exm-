const { CustomerCard } = require("../models/CustomerCardSchema");
const {
  customercardValidationSchema,
  customercardUpdateValidationSchema,
} = require("../validation/customercardValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postCustomerCard = async (req, res, next) => {
  try {
    const { error, value } = customercardValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (value.is_main) {
      await CustomerCard.updateMany(
        { customer_id: value.customer_id },
        { is_main: false }
      );
    }

    const newCard = await CustomerCard.create(value);
    const populated = await CustomerCard.findById(newCard._id).populate("customer_id");

    res.status(201).json({
      message: "Karta muvaffaqiyatli saqlandi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerCards = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { customer_id, name, search } = req.query;
    const filter = {};

    if (customer_id) filter.customer_id = customer_id;
    if (search) {
      const escaped = escapeRegex(search);
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { phone: { $regex: escaped, $options: "i" } },
      ];
    } else if (name) {
      filter.name = { $regex: escapeRegex(name), $options: "i" };
    }

    const [items, total] = await Promise.all([
      CustomerCard.find(filter)
        .populate("customer_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CustomerCard.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getCustomerCardById = async (req, res, next) => {
  try {
    const item = await CustomerCard.findById(req.params.id).populate("customer_id");
    if (!item) return res.status(404).json({ message: "Karta topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateCustomerCard = async (req, res, next) => {
  try {
    const { error, value } = customercardUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (value.is_main && value.customer_id) {
      await CustomerCard.updateMany(
        { customer_id: value.customer_id, _id: { $ne: req.params.id } },
        { is_main: false }
      );
    }

    const updated = await CustomerCard.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    }).populate("customer_id");

    if (!updated) return res.status(404).json({ message: "Karta topilmadi" });

    res.status(200).json({
      message: "Karta muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCustomerCard = async (req, res, next) => {
  try {
    const deleted = await CustomerCard.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Karta topilmadi" });
    res.status(200).json({ message: "Karta muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchCustomerCard = async (req, res, next) => {
  return getCustomerCards(req, res, next);
};

module.exports = {
  postCustomerCard,
  getCustomerCards,
  getCustomerCardById,
  updateCustomerCard,
  deleteCustomerCard,
  searchCustomerCard,
};
