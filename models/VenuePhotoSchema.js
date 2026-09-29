const { Schema, model } = require("mongoose");

const venuephotoSchema = new Schema(
  {
    venueId: { type: Schema.Types.ObjectId, ref: "Venue" },
    venue_id: { type: Schema.Types.ObjectId, ref: "Venue" },
    url: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

venuephotoSchema.pre("save", function (next) {
  if (this.venueId && !this.venue_id) this.venue_id = this.venueId;
  if (this.venue_id && !this.venueId) this.venueId = this.venue_id;
  next();
});

const VenuePhoto = model("VenuePhoto", venuephotoSchema);

module.exports = { VenuePhoto };
