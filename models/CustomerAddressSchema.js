const { Schema, model } = require("mongoose");

const customeraddressSchema = new Schema(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    name: { type: String, required: true, trim: true },
    region_id: { type: Schema.Types.ObjectId, ref: "Region", required: true },
    district_id: { type: Schema.Types.ObjectId, ref: "District", required: true },
    street: { type: String, required: true, trim: true },
    house: { type: String, required: true, trim: true },
    flat_id: { type: Schema.Types.ObjectId, ref: "Flat", required: true },
    location: { type: String, required: true, trim: true },
    post_index: { type: String, required: true, trim: true },
    info: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

const CustomerAddress = model("CustomerAddress", customeraddressSchema);

module.exports = { CustomerAddress };
