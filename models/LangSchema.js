const { Schema, model } = require("mongoose");

const langSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const Lang = model("Lang", langSchema);

module.exports = { Lang };
