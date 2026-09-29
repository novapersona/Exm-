const { Country } = require("../models/CountrySchema");
const {
  countryValidationSchema,
  countryUpdateValidationSchema,
} = require("../validation/countryValidation");
const { escapeRegex, getPagination, formatPaginatedResponse } = require("../helpers/queryHelper");

const postCountry = async (req, res, next) => {
  try {
    const { error, value } = countryValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newCountry = await Country.create(value);
    res.status(201).json({
      message: "Davlat muvaffaqiyatli yaratildi",
      data: newCountry,
    });
  } catch (error) {
    next(error);
  }
};

const getCountries = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const { country_name, search } = req.query;
    const filter = {};

    const searchTerm = search || country_name;
    if (searchTerm) {
      filter.country_name = { $regex: escapeRegex(searchTerm), $options: "i" };
    }

    const [items, total] = await Promise.all([
      Country.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Country.countDocuments(filter),
    ]);

    res.status(200).json(formatPaginatedResponse(items, total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getCountryById = async (req, res, next) => {
  try {
    const item = await Country.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Davlat topilmadi" });
    res.status(200).json({ data: item });
  } catch (error) {
    next(error);
  }
};

const updateCountry = async (req, res, next) => {
  try {
    const { error, value } = countryUpdateValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updated = await Country.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Davlat topilmadi" });

    res.status(200).json({
      message: "Davlat muvaffaqiyatli yangilandi",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCountry = async (req, res, next) => {
  try {
    const deleted = await Country.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Davlat topilmadi" });
    res.status(200).json({ message: "Davlat muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const searchCountry = async (req, res, next) => {
  return getCountries(req, res, next);
};

module.exports = {
  postCountry,
  getCountries,
  getCountrys: getCountries, // compatibility
  getCountryById,
  updateCountry,
  deleteCountry,
  searchCountry,
};
