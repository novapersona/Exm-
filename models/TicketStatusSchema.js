const { Schema, model } = require("mongoose");

const ticketstatusSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

const TicketStatus = model("TicketStatus", ticketstatusSchema);

module.exports = { TicketStatus };
