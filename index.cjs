const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const helmet = require("helmet")
const dotenv = require("dotenv").config()
const moduleApi = require("./routes/moduleApi.cjs")

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

mongoose
  .connect(DB)
  .then((con) => {
    console.log("DB connection successful.")
  })
  .catch((err) => console.log(err))

moduleApi(app)

app.listen(port, "0.0.0.0", () => {
  console.log("Server listening on port 4000")
})
