import mongoose from "mongoose";

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

userSchema.statics.build = (fields: UserFields) => {
  return new User(fields);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

const user = User.build({
  email: "adhi@test.com",
  password: "test",
});

export { User };
