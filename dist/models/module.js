import mongoose from "mongoose";
export const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: String,
    emoji: String,
    phrases: [{ type: mongoose.Schema.Types.Mixed }],
});
export const ModuleModel = mongoose.model("Module", moduleSchema);
