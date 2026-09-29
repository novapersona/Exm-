const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    login: { type: String, required: true, unique: true, trim: true, index: true },
    hashed_password: { type: String, required: true, trim: true },
    is_active: { type: Boolean, default: true },
    is_creator: { type: Boolean, default: false },
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

adminSchema.pre("save", async function (next) {
  if (!this.isModified("hashed_password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.hashed_password = await bcrypt.hash(this.hashed_password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.hashed_password);
};

const Admin = model("Admin", adminSchema);

module.exports = { Admin };
