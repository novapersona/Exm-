const { Schema, model } = require("mongoose");

const venuetypesSchema = new Schema(
  {
    venueId: { type: Schema.Types.ObjectId, ref: "Venue" },
    venue_id: { type: Schema.Types.ObjectId, ref: "Venue" },
    typeId: { type: Schema.Types.ObjectId, ref: "Types" },
    type_id: { type: Schema.Types.ObjectId, ref: "Types" },
  },
  { timestamps: true }
);

venuetypesSchema.pre("save", function (next) {
  if (this.venueId && !this.venue_id) this.venue_id = this.venueId;
  if (this.venue_id && !this.venueId) this.venueId = this.venue_id;
  if (this.typeId && !this.type_id) this.type_id = this.typeId;
  if (this.type_id && !this.typeId) this.typeId = this.type_id;
  next();
});

const VenueTypes = model("VenueTypes", venuetypesSchema);

module.exports = { VenueTypes };
