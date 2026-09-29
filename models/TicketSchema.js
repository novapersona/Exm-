const { Schema, model } = require("mongoose");

const ticketSchema = new Schema(
  {
    event_id: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    seat_id: { type: Schema.Types.ObjectId, ref: "Seat", required: true },
    price: { type: Number, required: true, min: 0 },
    service_fee: { type: Number, required: true, min: 0, default: 0 },
    status_id: { type: Schema.Types.ObjectId, ref: "TicketStatus", required: true },
    ticket_type_id: { type: Schema.Types.ObjectId, ref: "TicketType", required: true },
    ticket_code: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

ticketSchema.index({ event_id: 1, seat_id: 1 }, { unique: true });

const Ticket = model("Ticket", ticketSchema);

module.exports = { Ticket };
