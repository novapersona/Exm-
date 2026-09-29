const { Schema, model } = require("mongoose");

const sectorSchema = new Schema(
  {
    sector_name: { type: String, required: true, trim: true },
    venue_id: { type: Schema.Types.ObjectId, ref: "Venue", default: null },
  },
  { timestamps: true }
);

const Sector = model("Sector", sectorSchema);

module.exports = { Sector };
