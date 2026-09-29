const { Schema, model } = require("mongoose");

const seatSchema = new Schema(
  {
    sector_id: { type: Schema.Types.ObjectId, ref: "Sector", required: true },
    row_number: { type: Number, required: true, min: 1 },
    number: { type: Number, required: true, min: 1 },
    venue_id: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    seat_type_id: { type: Schema.Types.ObjectId, ref: "SeatType", required: true },
    location_in_schema: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

seatSchema.index(
  { venue_id: 1, sector_id: 1, row_number: 1, number: 1 },
  { unique: true }
);

const Seat = model("Seat", seatSchema);

module.exports = { Seat };
