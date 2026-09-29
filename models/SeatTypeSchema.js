const { Schema, model } = require("mongoose");

const seattypeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    price_rate: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const SeatType = model("SeatType", seattypeSchema);

module.exports = { SeatType };
