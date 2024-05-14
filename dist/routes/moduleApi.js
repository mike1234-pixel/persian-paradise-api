var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ModuleModel } from "../models/module.js";
const moduleApi = (app) => {
    app.get("/api/modules", (req, res) => {
        ModuleModel.find({}, (err, modules) => {
            if (err) {
                console.error("Error fetching data:", err);
                res.status(500).json({ error: "Failed to fetch modules" });
            }
            else {
                res.json(modules);
            }
        });
    });
    app.post("/api/modules/addPhrase", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { title, phrase } = req.body;
        try {
            const module = yield ModuleModel.findOne({ title });
            if (!module) {
                res.status(404).json({ error: "Module not found" });
                return;
            }
            module.phrases.push(phrase);
            yield module.save();
            res.status(200).json({ message: "Phrase added successfully", module });
        }
        catch (err) {
            console.error("Error updating module:", err);
            res.status(500).json({ error: "Failed to add phrase to module" });
        }
    }));
};
export default moduleApi;
