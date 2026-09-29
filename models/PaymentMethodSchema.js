const { Schema, model } = require("mongoose");

const paymentmethodSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

const PaymentMethod = model("PaymentMethod", paymentmethodSchema);

module.exports = { PaymentMethod };
