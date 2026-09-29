const { Schema, model } = require("mongoose");

const genderSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

const Gender = model("Gender", genderSchema);

module.exports = { Gender };
