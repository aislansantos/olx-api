import { Schema, model, Model, connection } from "mongoose";
type StateType = {
  name: string;
};

const schema = new Schema<StateType>({
  name: { type: String, required: true },
});

const modelName: string = "State";
export default connection && connection.models[modelName]
  ? (connection.models[modelName] as Model<StateType>)
  : model<StateType>(modelName, schema);
