import { Schema, model, Model, connection } from "mongoose";
type UserType = {
  name: string;
  email: string;
  state: string;
  passwordhash: string;
  token: string;
};

const schema = new Schema<UserType>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  state: { type: String, required: true },
  passwordhash: { type: String, required: true },
  token: { type: String, required: true },
});

const modelName: string = "User";
export default connection && connection.models[modelName]
  ? (connection.models[modelName] as Model<UserType>)
  : model<UserType>(modelName, schema);
