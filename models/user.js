import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
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
  everify: {
    type: Boolean,
    default: false,
  },
  vtoken: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
