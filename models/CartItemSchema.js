const { Schema, model } = require("mongoose");

const cartitemSchema = new Schema(
  {
    ticket_id: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    cart_id: { type: Schema.Types.ObjectId, ref: "Cart", required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

cartitemSchema.index({ cart_id: 1, ticket_id: 1 }, { unique: true });

const CartItem = model("CartItem", cartitemSchema);

module.exports = { CartItem };
