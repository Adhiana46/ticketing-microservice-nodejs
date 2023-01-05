import mongoose from "mongoose";
import { Password } from "../services";

// An interface that describes the properties
// that are required to create a new User
interface UserFields {
  email: string;
  password: string;
}

// An interface that describes the properties
// that User model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(fields: UserFields): UserDoc;
}

// An interface that describe the properties
// that User document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashedPassword = await Password.hash(this.password);
    this.set("password", hashedPassword);
  }
  done();
});

userSchema.statics.build = (fields: UserFields) => {
  return new User(fields);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
