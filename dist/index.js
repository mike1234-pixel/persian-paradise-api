var _a, _b, _c, _d;
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from "dotenv";
import moduleApi from "./routes/moduleApi.js"; // must use paths that work at runtime
dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = Number(process.env.PORT) || 4000;
const DB = ((_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : "")
    .replace("<user>", (_b = process.env.MONGO_USER) !== null && _b !== void 0 ? _b : "")
    .replace("<password>", (_c = process.env.MONGO_PASSWORD) !== null && _c !== void 0 ? _c : "")
    .replace("<dbname>", (_d = process.env.DBNAME) !== null && _d !== void 0 ? _d : "");
mongoose
    .connect(DB)
    .then((con) => {
    console.log("DB connection successful.");
})
    .catch((err) => console.log(err));
moduleApi(app);
app.listen(port, "0.0.0.0", () => {
    console.log("Server listening on port 4000");
});
