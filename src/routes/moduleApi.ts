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
}

export default moduleApi
