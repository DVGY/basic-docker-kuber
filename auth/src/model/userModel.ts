import mongoose, { Document, Model, Schema } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Entered email is wrong"],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 8,
    select: false,
  },
});

const User: Model<IUser> = mongoose.model("User", userSchema);
export default User;
