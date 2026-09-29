const { Schema, model } = require("mongoose");
const { maskCardNumber } = require("../helpers/cardHelper");

const customercardSchema = new Schema(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    number: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    month: { type: String, required: true, trim: true },
    is_active: { type: Boolean, default: true },
    is_main: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.masked_number = maskCardNumber(ret.number);
        ret.number = maskCardNumber(ret.number);
        return ret;
      },
    },
  }
);

const CustomerCard = model("CustomerCard", customercardSchema);

module.exports = { CustomerCard };
