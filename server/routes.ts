import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // إزالة جميع routes المتعلقة بقاعدة البيانات
  // التطبيق الآن يعمل بالكامل من جهة العميل

  const httpServer = createServer(app);
  return httpServer;
}
