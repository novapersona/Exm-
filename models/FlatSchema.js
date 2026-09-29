const { Schema, model } = require("mongoose");

const flatSchema = new Schema(
  {
    floor: { type: Number },
    etaj: { type: Number }, // backwards compatibility
    condition: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

flatSchema.pre("save", function (next) {
  if (this.etaj !== undefined && this.floor === undefined) {
    this.floor = this.etaj;
  } else if (this.floor !== undefined && this.etaj === undefined) {
    this.etaj = this.floor;
  }
  next();
});

const Flat = model("Flat", flatSchema);

module.exports = { Flat };
