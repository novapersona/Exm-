const { Schema, model } = require("mongoose");

const humancategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    start_age: { type: Number, required: true, min: 0 },
    finish_age: { type: Number, required: true, min: 0 },
    gender_id: { type: Schema.Types.ObjectId, ref: "Gender", required: true },
  },
  { timestamps: true }
);

humancategorySchema.pre("save", function (next) {
  if (this.start_age > this.finish_age) {
    return next(new Error("start_age finish_agedan katta bo'lishi mumkin emas"));
  }
  next();
});

const HumanCategory = model("HumanCategory", humancategorySchema);

module.exports = { HumanCategory };
