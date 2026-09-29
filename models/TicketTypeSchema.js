const { Schema, model } = require("mongoose");

const tickettypeSchema = new Schema(
  {
    ticket_type: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const TicketType = model("TicketType", tickettypeSchema);

module.exports = { TicketType };
