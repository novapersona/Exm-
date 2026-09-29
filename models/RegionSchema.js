const { Schema, model } = require("mongoose");

const regionSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    country_id: { type: Schema.Types.ObjectId, ref: "Country", default: null },
  },
  { timestamps: true }
);

const Region = model("Region", regionSchema);

module.exports = { Region };
