import express from "express";
import { scanProject } from "../utils/file-scanning";
import { ScanOptions } from "../types/scan";

const router = express.Router();

router.post("/scan", async (req, res) => {
  try {
    const options: ScanOptions = req.body;
    const result = await scanProject(options.projectPath);
    res.json({ files: result });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Scan failed" });
  }
});

export default router;