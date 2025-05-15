const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["MainAdmin", "BranchAdmin", "Student", "Teacher"],
      required: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: function () {
        return this.role === "BranchAdmin";
      },
    },
  },
  { timestamps: true }
);

// Create a compound unique index for username and branch
userSchema.index(
  { username: 1, branch: 1 },
  { unique: true, partialFilterExpression: { branch: { $exists: true } } }
);

module.exports = mongoose.model("User", userSchema);
