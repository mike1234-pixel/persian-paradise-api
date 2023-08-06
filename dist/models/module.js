import mongoose from "mongoose";
export const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    emoji: {
        type: String,
        required: true,
    },
    phrases: [
        {
            en: {
                type: String,
                required: true,
            },
            fa: {
                informal: String,
                formal: String,
            },
            emoji: String,
        },
    ],
});
export const ModuleModel = mongoose.model("Module", moduleSchema);
