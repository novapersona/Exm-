const { Schema, model } = require("mongoose");

const eventtypeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    parent_event_type_id: { type: Schema.Types.ObjectId, ref: "EventType", default: null },
  },
  { timestamps: true }
);

eventtypeSchema.pre("save", function (next) {
  if (this.parent_event_type_id && this._id && this.parent_event_type_id.toString() === this._id.toString()) {
    return next(new Error("parent_event_type_id o'ziga teng bo'lishi mumkin emas (circular reference)"));
  }
  next();
});

const EventType = model("EventType", eventtypeSchema);

module.exports = { EventType };
