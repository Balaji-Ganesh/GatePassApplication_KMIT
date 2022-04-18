const mongoose = require("mongoose");

// Creating user's schema..
const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String, // Why String type..??
      default: "",
    },
    role: {
      type: String,
      enum: {
        values: ["Student", "Teacher", "GateKeeper"], // Only these values are allowed
        message: "{VALUE} is not supported", // Mongoose replaces {VALUE} with the value being validated.
      },
    },
  },
  { timestamps: true }
);

// Export the model..
module.exports = mongoose.model("User", UserSchema);
