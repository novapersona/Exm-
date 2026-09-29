const { Schema, model } = require("mongoose");

const deliverymethodSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const DeliveryMethod = model("DeliveryMethod", deliverymethodSchema);

module.exports = { DeliveryMethod };
