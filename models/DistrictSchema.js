const { Schema, model } = require("mongoose");

const districtSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    region_id: { type: Schema.Types.ObjectId, ref: "Region", required: true },
  },
  { timestamps: true }
);

districtSchema.index({ region_id: 1, name: 1 }, { unique: true });

const District = model("District", districtSchema);

module.exports = { District };
