import mongoose from "mongoose"

const registersSchema = new mongoose.Schema({
  informal: {
    type: String,
    required: true,
  },
  formal: {
    type: String,
    required: true,
  },
})

const phraseSchema = new mongoose.Schema({
  en: {
    type: String,
    required: true,
  },
  fa: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  emoji: String,
  hint: String,
})

export const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  emoji: String,
  phrases: [phraseSchema],
})

export const ModuleModel = mongoose.model("Module", moduleSchema)
