const ModuleModel = require("../models/module.cjs")

module.exports = function (app) {
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
}
