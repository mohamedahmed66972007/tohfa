import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./file-storage";
import { insertContestantSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/contestants", async (_req, res) => {
    try {
      const contestants = await storage.getAllContestants();
      res.json(contestants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contestants" });
    }
  });

  app.get("/api/contestants/:id", async (req, res) => {
    try {
      const contestant = await storage.getContestant(req.params.id);
      if (!contestant) {
        return res.status(404).json({ message: "Contestant not found" });
      }
      res.json(contestant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contestant" });
    }
  });

  app.post("/api/contestants", async (req, res) => {
    try {
      const data = insertContestantSchema.parse(req.body);
      const contestant = await storage.createContestant(data);
      res.status(201).json(contestant);
    } catch (error) {
      res.status(400).json({ message: "Invalid contestant data" });
    }
  });

  app.delete("/api/contestants/:id", async (req, res) => {
    try {
      await storage.deleteContestant(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contestant" });
    }
  });

  app.post("/api/contestants/:id/share", async (req, res) => {
    try {
      const contestant = await storage.getContestant(req.params.id);
      if (!contestant) {
        return res.status(404).json({ message: "Contestant not found" });
      }
      const shareCode = await storage.createShareCode(contestant);
      res.json({ code: shareCode });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate share code" });
    }
  });

  app.post("/api/contestants/import", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code || typeof code !== 'string') {
        return res.status(400).json({ message: "Share code is required" });
      }
      const contestant = await storage.importFromShareCode(code);
      if (!contestant) {
        return res.status(404).json({ message: "Invalid or expired share code" });
      }
      res.status(201).json(contestant);
    } catch (error) {
      res.status(500).json({ message: "Failed to import contestant" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
