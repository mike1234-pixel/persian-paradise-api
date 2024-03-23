import { Express, Request, Response } from "express"
import { ModuleModel } from "../models/module.js"
import { ModulesList } from "persian-paradise-shared-types"

const moduleApi = (app: Express) => {
  app.get("/api/modules", (req: Request, res: Response) => {
    ModuleModel.find({}, (err: Error, modules: ModulesList) => {
      if (err) {
        console.error("Error fetching data:", err)
        res.status(500).json({ error: "Failed to fetch modules" })
      } else {
        console.log("Data from 'modules' collection:", modules)
        res.json(modules)
      }
    })
  })
}

export default moduleApi
