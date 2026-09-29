const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const customerSchema = new Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    hashed_password: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    birth_date: { type: Date, required: true },
    gender_id: { type: Schema.Types.ObjectId, ref: "Gender", required: true },
    lang_id: { type: Schema.Types.ObjectId, ref: "Lang", required: true },
    hashed_refresh_token: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.hashed_password;
        delete ret.hashed_refresh_token;
        return ret;
      },
    },
  }
);

customerSchema.pre("save", async function (next) {
  if (!this.isModified("hashed_password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.hashed_password = await bcrypt.hash(this.hashed_password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

customerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.hashed_password);
};

const Customer = model("Customer", customerSchema);

module.exports = { Customer };
