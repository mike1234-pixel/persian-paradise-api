import { Express, Request, Response } from "express"
import { ModuleModel } from "../models/module.js"
import { ModulesList, Phrase } from "persian-paradise-shared-types"

const moduleApi = (app: Express) => {
  app.get("/api/modules", (req: Request, res: Response) => {
    ModuleModel.find({}, (err: Error, modules: ModulesList) => {
      if (err) {
        console.error("Error fetching data:", err)
        res.status(500).json({ error: "Failed to fetch modules" })
      } else {
        res.json(modules)
      }
    })
  })

  app.post("/api/modules/addPhrase", async (req: Request, res: Response) => {
    const { title, phrase }: { title: string; phrase: Phrase } = req.body

    try {
      const module = await ModuleModel.findOne({ title })

      if (!module) {
        res.status(404).json({ error: "Module not found" })
        return
      }

      module.phrases.push(phrase)
      await module.save()

      res.status(200).json({ message: "Phrase added successfully", module })
    } catch (err) {
      console.error("Error updating module:", err)
      res.status(500).json({ error: "Failed to add phrase to module" })
    }
  })

  app.put("/api/modules/updatePhrase", async (req: Request, res: Response) => {
    const { moduleName, newPhrase }: { moduleName: string; newPhrase: Phrase } =
      req.body

    try {
      const module = await ModuleModel.findOne({ title: moduleName })

      if (!module) {
        res.status(404).json({ error: "Module not found" })
        return
      }

      const existingPhraseIndex = module.phrases.findIndex(
        (phrase) => phrase.en === newPhrase.en
      )

      if (existingPhraseIndex === -1) {
        res.status(404).json({ error: "Phrase not found in the module" })
        return
      }

      module.phrases[existingPhraseIndex].en = newPhrase.en
      module.phrases[existingPhraseIndex].fa = newPhrase.fa
      module.phrases[existingPhraseIndex].emoji = newPhrase.emoji
      module.phrases[existingPhraseIndex].hint = newPhrase.hint

      await module.save()

      res.status(200).json({ message: "Phrase updated successfully", module })
    } catch (err) {
      console.error("Error updating phrase:", err)
      res.status(500).json({ error: "Failed to update phrase" })
    }
  })
}

export default moduleApi
