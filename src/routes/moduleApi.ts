import { Express, Request, Response } from "express"
import { ModuleModel } from "../models/module.js"
import {
  CourseModule,
  ModulesList,
  Phrase,
} from "persian-paradise-shared-types"

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

  app.post("/api/module/add", async (req: Request, res: Response) => {
    const { title, subtitle, emoji, phrases }: CourseModule = req.body

    if (!title || !phrases || !Array.isArray(phrases)) {
      res.status(400).json({ error: "Invalid request body" })
      return
    }

    try {
      const newModule = new ModuleModel({ title, subtitle, emoji, phrases })
      await newModule.save()
      res
        .status(201)
        .json({ message: "Module created successfully", module: newModule })
    } catch (err) {
      console.error("Error creating module:", err)
      res.status(500).json({ error: "Failed to create module" })
    }
  })

  app.put("/api/module/update", async (req: Request, res: Response) => {
    const { title, subtitle, emoji }: Omit<CourseModule, "phrases"> = req.body

    if (!title) {
      res.status(400).json({ error: "Invalid request body" })
      return
    }

    try {
      const module = await ModuleModel.findOne({ title })

      if (!module) {
        res.status(404).json({ error: "Module not found" })
        return
      }

      module.subtitle = subtitle
      module.emoji = emoji

      await module.save()

      res.status(200).json({ message: "Module updated successfully", module })
    } catch (err) {
      console.error("Error updating module:", err)
      res.status(500).json({ error: "Failed to update module" })
    }
  })

  app.delete("/api/module/delete", async (req: Request, res: Response) => {
    const { title }: { title: string } = req.body

    if (!title) {
      res.status(400).json({ error: "Title is required" })
      return
    }

    try {
      const module = await ModuleModel.findOneAndDelete({ title })

      if (!module) {
        res.status(404).json({ error: "Module not found" })
        return
      }

      res.status(200).json({ message: "Module deleted successfully" })
    } catch (err) {
      console.error("Error deleting module:", err)
      res.status(500).json({ error: "Failed to delete module" })
    }
  })

  app.post("/api/module/phrase/add", async (req: Request, res: Response) => {
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

  app.put("/api/module/phrase/update", async (req: Request, res: Response) => {
    const { moduleName, newPhrase }: { moduleName: string; newPhrase: Phrase } =
      req.body

    console.log(moduleName, newPhrase)

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

      module.markModified("phrases")
      await module.save()

      res.status(200).json({ message: "Phrase updated successfully", module })
    } catch (err) {
      console.error("Error updating phrase:", err)
      res.status(500).json({ error: "Failed to update phrase" })
    }
  })

  app.delete(
    "/api/module/phrase/delete",
    async (req: Request, res: Response) => {
      const {
        moduleName,
        phraseName,
      }: { moduleName: string; phraseName: string } = req.body

      try {
        const module = await ModuleModel.findOne({ title: moduleName })

        if (!module) {
          res.status(404).json({ error: "Module not found" })
          return
        }

        const originalLength = module.phrases.length
        module.phrases = module.phrases.filter(
          (phrase) => phrase.en !== phraseName
        )

        if (module.phrases.length === originalLength) {
          res.status(404).json({ error: "Phrase not found in the module" })
          return
        }

        await module.save()

        res.status(200).json({ message: "Phrase deleted successfully", module })
      } catch (err) {
        console.error("Error deleting phrase:", err)
        res.status(500).json({ error: "Failed to delete phrase" })
      }
    }
  )
}

export default moduleApi
