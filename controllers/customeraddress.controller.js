const { CustomerAddress } = require("../models/CustomerAddressSchema");
const {
  customeraddressValidationSchema,
  customeraddressUpdateValidationSchema,
} = require("../validation/customeraddressValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postCustomerAddress = async (req, res, next) => {
  try {
    const { error, value } = customeraddressValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newAddress = await CustomerAddress.create(value);
    const populated = await CustomerAddress.findById(newAddress._id)
      .populate("customer_id")
      .populate("region_id")
      .populate("district_id")
      .populate("flat_id");

    res.status(201).json({
      message: "Manzil muvaffaqiyatli yaratildi",
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerAddresses = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { customer_id, region_id, district_id, search } = req.query;
    const filter = {};

    if (customer_id) filter.customer_id = customer_id;
    if (region_id) filter.region_id = region_id;
    if (district_id) filter.district_id = district_id;
    if (search) {
      const escaped = escapeRegex(search);
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { street: { $regex: escaped, $options: "i" } },
        { house: { $regex: escaped, $options: "i" } },
        { post_index: { $regex: escaped, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      CustomerAddress.find(filter)
        .populate("customer_id")
        .populate("region_id")
        .populate("district_id")
        .populate("flat_id")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CustomerAddress.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getCustomerAddressById = async (req, res, next) => {
  try {
    const item = await CustomerAddress.findById(req.params.id)
      .populate("customer_id")
      .populate("region_id")
      .populate("district_id")
      .populate("flat_id");

    if (!item) return res.status(404).json({ message: "Manzil topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateCustomerAddress = async (req, res, next) => {
  try {
    const { error, value } = customeraddressUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await CustomerAddress.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    })
      .populate("customer_id")
      .populate("region_id")
      .populate("district_id")
      .populate("flat_id");

    if (!updated) return res.status(404).json({ message: "Manzil topilmadi" });

    res.status(200).json({
      message: "Manzil muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCustomerAddress = async (req, res, next) => {
  try {
    const deleted = await CustomerAddress.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Manzil topilmadi" });
    res.status(200).json({ message: "Manzil muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchCustomerAddress = async (req, res, next) => {
  return getCustomerAddresses(req, res, next);
};

module.exports = {
  postCustomerAddress,
  getCustomerAddresses,
  getCustomerAddresss: getCustomerAddresses, // compatibility with legacy typo
  getCustomerAddressById,
  updateCustomerAddress,
  deleteCustomerAddress,
  searchCustomerAddress,
};
