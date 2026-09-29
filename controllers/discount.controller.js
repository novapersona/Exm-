const { Discount } = require("../models/DiscountSchema");
const {
  discountValidationSchema,
  discountUpdateValidationSchema,
} = require("../validation/discountValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postDiscount = async (req, res, next) => {
  try {
    const { error, value } = discountValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newDiscount = await Discount.create(value);
    res.status(201).json({
      message: "Chegirma yaratildi",
      data: newDiscount,
    });
  } catch (error) {
    next(error);
  }
};

const getDiscounts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { discount, code, search } = req.query;
    const filter = {};

    if (search) {
      const escaped = escapeRegex(search);
      filter.$or = [
        { code: { $regex: escaped, $options: "i" } },
        { discount: { $regex: escaped, $options: "i" } },
      ];
    } else {
      if (code) filter.code = { $regex: escapeRegex(code), $options: "i" };
      if (discount) filter.discount = discount;
    }

    const [items, total] = await Promise.all([
      Discount.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Discount.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getDiscountById = async (req, res, next) => {
  try {
    const item = await Discount.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Chegirma topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateDiscount = async (req, res, next) => {
  try {
    const { error, value } = discountUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Discount.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Chegirma topilmadi" });

    res.status(200).json({
      message: "Chegirma muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDiscount = async (req, res, next) => {
  try {
    const deleted = await Discount.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Chegirma topilmadi" });
    res.status(200).json({ message: "Chegirma muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchDiscount = async (req, res, next) => {
  return getDiscounts(req, res, next);
};

module.exports = {
  postDiscount,
  getDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  searchDiscount,
};
