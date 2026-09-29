const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, required: true, trim: true },
    start_date: { type: Date, required: true },
    start_time: { type: String, required: true, trim: true },
    finish_date: { type: Date, required: true },
    finish_time: { type: String, required: true, trim: true },
    info: { type: String, trim: true, default: "" },
    event_type_id: { type: Schema.Types.ObjectId, ref: "EventType", required: true },
    human_category_id: { type: Schema.Types.ObjectId, ref: "HumanCategory", required: true },
    venue_id: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    lang_id: { type: Schema.Types.ObjectId, ref: "Lang", required: true },
    release_date: { type: Date, required: true },
  },
  { timestamps: true }
);

eventSchema.pre("save", function (next) {
  if (this.start_date && this.finish_date && new Date(this.start_date) > new Date(this.finish_date)) {
    return next(new Error("start_date finish_datedan keyin bo'lishi mumkin emas"));
  }
  next();
});

const Event = model("Event", eventSchema);

module.exports = { Event };
