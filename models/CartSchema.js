const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    finishedAt: { type: Date, default: null },
    fineshedAt: { type: Date, default: null }, // backwards compatibility
    status_id: { type: Schema.Types.ObjectId, ref: "TicketStatus", required: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 15 * 60 * 1000) },
  },
  { timestamps: true }
);

const Cart = model("Cart", cartSchema);

module.exports = { Cart };
