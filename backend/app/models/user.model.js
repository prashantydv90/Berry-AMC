import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  otp: { type: String },
  isVerified: { type: Boolean, default: false },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

});

export const User = mongoose.model('User', userSchema);