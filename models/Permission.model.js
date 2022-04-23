const mongoose = require("mongoose");

// Creating user's schema..
const PermissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    reason: {
      type: String,
      required: true,
    },
    passMode: {
      type: Boolean,
      required: true,
    },
    permissionStatus: {
      type: Boolean,
      required: true,
    },
    facultyId: {
      type: String,
      required: true,
    },
    grantedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Export the model..
module.exports = mongoose.model("Permission", PermissionSchema);
