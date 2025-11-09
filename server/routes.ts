import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./db-storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all contestants
  app.get("/api/contestants", async (req, res) => {
    try {
      const contestants = await storage.getAllContestants();
      res.json(contestants);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contestants" });
    }
  });

  // Get single contestant
  app.get("/api/contestants/:id", async (req, res) => {
    try {
      const contestant = await storage.getContestant(req.params.id);
      if (!contestant) {
        return res.status(404).json({ error: "Contestant not found" });
      }
      res.json(contestant);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contestant" });
    }
  });

  // Create contestant
  app.post("/api/contestants", async (req, res) => {
    try {
      const contestant = await storage.createContestant(req.body);
      res.status(201).json(contestant);
    } catch (error) {
      res.status(500).json({ error: "Failed to create contestant" });
    }
  });

  // Delete contestant
  app.delete("/api/contestants/:id", async (req, res) => {
    try {
      await storage.deleteContestant(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contestant" });
    }
  });

  const server = createServer(app);
  return server;
}
