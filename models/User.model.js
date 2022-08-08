const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      /* required: true */
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        "Please use a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      /* required: true, */
      default: "Beginner",
    },
    avatar: {
      type: String,
      default:
        "https://www.acasadocarnaval.pt/media/catalog/product/cache/1/image/850x850/406734ddb89f5d4b0e49a1fc7f14a25a/f/a/fato-bailarino-de-salsa-59708.jpg",
    },
    favorites: [{type: Schema.Types.ObjectId, ref: "Video"}]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
