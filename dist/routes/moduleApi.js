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
    app.post("/api/module/phrase/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    app.put("/api/module/phrase/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { moduleName, newPhrase } = req.body;
        try {
            const module = yield ModuleModel.findOne({ title: moduleName });
            if (!module) {
                res.status(404).json({ error: "Module not found" });
                return;
            }
            const existingPhraseIndex = module.phrases.findIndex((phrase) => phrase.en === newPhrase.en);
            if (existingPhraseIndex === -1) {
                res.status(404).json({ error: "Phrase not found in the module" });
                return;
            }
            module.phrases[existingPhraseIndex].en = newPhrase.en;
            module.phrases[existingPhraseIndex].fa = newPhrase.fa;
            module.phrases[existingPhraseIndex].emoji = newPhrase.emoji;
            module.phrases[existingPhraseIndex].hint = newPhrase.hint;
            yield module.save();
            res.status(200).json({ message: "Phrase updated successfully", module });
        }
        catch (err) {
            console.error("Error updating phrase:", err);
            res.status(500).json({ error: "Failed to update phrase" });
        }
    }));
    app.delete("/api/module/phrase/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { moduleName, phraseName, } = req.body;
        try {
            const module = yield ModuleModel.findOne({ title: moduleName });
            if (!module) {
                res.status(404).json({ error: "Module not found" });
                return;
            }
            const originalLength = module.phrases.length;
            module.phrases = module.phrases.filter((phrase) => phrase.en !== phraseName);
            if (module.phrases.length === originalLength) {
                res.status(404).json({ error: "Phrase not found in the module" });
                return;
            }
            yield module.save();
            res.status(200).json({ message: "Phrase deleted successfully", module });
        }
        catch (err) {
            console.error("Error deleting phrase:", err);
            res.status(500).json({ error: "Failed to delete phrase" });
        }
    }));
};
export default moduleApi;
