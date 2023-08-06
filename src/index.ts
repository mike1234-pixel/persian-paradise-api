import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import helmet from "helmet"
import dotenv from "dotenv"
import moduleApi from "./routes/moduleApi.js" // must use paths that work at runtime

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors())
app.options("*", cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = Number(process.env.PORT) || 4000

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
