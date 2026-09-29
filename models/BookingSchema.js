const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
  {
    cart_id: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    finished: { type: Date, default: null },
    fineshed: { type: Date, default: null }, // backwards compatibility
    payment_method_id: { type: Schema.Types.ObjectId, ref: "PaymentMethod", required: true },
    delivery_method_id: { type: Schema.Types.ObjectId, ref: "DeliveryMethod", required: true },
    discount_id: { type: Schema.Types.ObjectId, ref: "Discount", default: null },
    status_id: { type: Schema.Types.ObjectId, ref: "TicketStatus", required: true },
    total_price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Booking = model("Booking", bookingSchema);

module.exports = { Booking };
