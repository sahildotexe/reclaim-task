import mongoose, { Schema, models } from "mongoose";
import User from "./user";

const appSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        provider: {
            type: [String],
            required: true,
        },
        api_key: {
            type: String,
            required: true,
        },
        app_owner: {
            type: Schema.Types.ObjectId,
            required: true,
        },
      },
        { timestamps: true }
);

const App = models.App || mongoose.model("App", appSchema);
export default App;
