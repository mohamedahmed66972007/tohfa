import { type Contestant, type InsertContestant } from "@shared/schema";
import { randomUUID } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export interface IStorage {
  getContestant(id: string): Promise<Contestant | undefined>;
  getAllContestants(): Promise<Contestant[]>;
  createContestant(contestant: InsertContestant): Promise<Contestant>;
  deleteContestant(id: string): Promise<void>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "contestants.json");

interface StorageData {
  contestants: Record<string, Contestant>;
}

export class FileStorage implements IStorage {
  private async ensureDataDir(): Promise<void> {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
  }

  private async readData(): Promise<StorageData> {
    await this.ensureDataDir();
    
    if (!existsSync(DATA_FILE)) {
      return { contestants: {} };
    }

    try {
      const content = await readFile(DATA_FILE, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Error reading data file:", error);
      return { contestants: {} };
    }
  }

  private async writeData(data: StorageData): Promise<void> {
    await this.ensureDataDir();
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  }

  async getContestant(id: string): Promise<Contestant | undefined> {
    const data = await this.readData();
    return data.contestants[id];
  }

  async getAllContestants(): Promise<Contestant[]> {
    const data = await this.readData();
    return Object.values(data.contestants);
  }

  async createContestant(insertContestant: InsertContestant): Promise<Contestant> {
    const data = await this.readData();
    const id = randomUUID();
    const questions = insertContestant.questions.map((q, index) => ({
      ...q,
      id: `${id}-q-${index}`,
    }));
    const contestant: Contestant = { 
      ...insertContestant, 
      id, 
      questions,
      enableTimer: insertContestant.enableTimer ?? false,
      timerMinutes: insertContestant.timerMinutes ?? 1,
    };
    data.contestants[id] = contestant;
    await this.writeData(data);
    return contestant;
  }

  async deleteContestant(id: string): Promise<void> {
    const data = await this.readData();
    delete data.contestants[id];
    await this.writeData(data);
  }
}

export const storage = new FileStorage();
