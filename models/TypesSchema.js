const { Schema, model } = require("mongoose");

const typesSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

const Types = model("Types", typesSchema);

module.exports = { Types };
