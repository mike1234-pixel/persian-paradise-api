const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const helmet = require("helmet")
const dotenv = require("dotenv").config()

const app = express()
app.use(helmet())
app.use(cors())
app.options("*", cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 4000

const DB = (process.env.MONGO_URI ?? "")
  .replace("<user>", process.env.MONGO_USER ?? "")
  .replace("<password>", process.env.MONGO_PASSWORD ?? "")
  .replace("<dbname>", process.env.DBNAME ?? "")

const moduleSchema = new mongoose.Schema({
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
})

const ModuleModel = mongoose.model("Module", moduleSchema)

mongoose
  .connect(DB)
  .then((con) => {
    console.log("DB connection successful.")
  })
  .catch((err) => console.log(err))

app.get("/api/modules", (req, res) => {
  ModuleModel.find({}, (err, modules) => {
    if (err) {
      console.error("Error fetching data:", err)
      res.status(500).json({ error: "Failed to fetch modules" })
    } else {
      console.log("Data from 'modules' collection:", modules)
      res.json(modules)
    }
  })
})

app.listen(port, "0.0.0.0", () => {
  console.log("Server listening on port 4000")
})
