const { Schema, model } = require("mongoose");

const venueSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    site: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    schema: { type: String, trim: true, default: '' },
    region_id: { type: Schema.Types.ObjectId, ref: "Region", required: true },
    district_id: { type: Schema.Types.ObjectId, ref: "District", required: true },
  },
  { timestamps: true }
);

const Venue = model("Venue", venueSchema);

module.exports = { Venue };
