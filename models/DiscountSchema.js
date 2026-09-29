const { Schema, model } = require("mongoose");

const discountSchema = new Schema(
  {
    discount: { type: Schema.Types.Mixed, required: true }, // supports Number or String
    discount_value: { type: Number, default: 0 },
    discount_type: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    code: { type: String, trim: true, default: "" },
    finish_date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Discount = model("Discount", discountSchema);

module.exports = { Discount };
