import { type Contestant, type InsertContestant, type InsertQuestion } from "@shared/schema";
import { randomUUID } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export interface IStorage {
  getContestant(id: string): Promise<Contestant | undefined>;
  getAllContestants(): Promise<Contestant[]>;
  createContestant(contestant: InsertContestant): Promise<Contestant>;
  deleteContestant(id: string): Promise<void>;
  createShareCode(contestant: Contestant): Promise<string>;
  importFromShareCode(code: string): Promise<Contestant | undefined>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "contestants.json");
const SHARE_CODES_FILE = path.join(DATA_DIR, "share-codes.json");

interface StorageData {
  contestants: Record<string, Contestant>;
}

interface ShareCodesData {
  codes: Record<string, {
    contestant: Contestant;
    createdAt: string;
  }>;
}

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
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

  private async readShareCodes(): Promise<ShareCodesData> {
    await this.ensureDataDir();
    
    if (!existsSync(SHARE_CODES_FILE)) {
      return { codes: {} };
    }

    try {
      const content = await readFile(SHARE_CODES_FILE, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error("Error reading share codes file:", error);
      return { codes: {} };
    }
  }

  private async writeShareCodes(data: ShareCodesData): Promise<void> {
    await this.ensureDataDir();
    await writeFile(SHARE_CODES_FILE, JSON.stringify(data, null, 2), "utf-8");
  }

  async createShareCode(contestant: Contestant): Promise<string> {
    const shareCodes = await this.readShareCodes();
    let code = generateShareCode();
    
    while (shareCodes.codes[code]) {
      code = generateShareCode();
    }

    shareCodes.codes[code] = {
      contestant,
      createdAt: new Date().toISOString(),
    };

    await this.writeShareCodes(shareCodes);
    return code;
  }

  async importFromShareCode(code: string): Promise<Contestant | undefined> {
    const shareCodes = await this.readShareCodes();
    const shareData = shareCodes.codes[code.toUpperCase()];
    
    if (!shareData) {
      return undefined;
    }

    const originalContestant = shareData.contestant;
    const newContestant: InsertContestant = {
      name: originalContestant.name,
      questions: originalContestant.questions.map(q => {
        const { id, ...questionWithoutId } = q;
        return questionWithoutId as InsertQuestion;
      }),
      randomizeQuestions: originalContestant.randomizeQuestions,
      randomizeOptions: originalContestant.randomizeOptions,
      enableTimer: originalContestant.enableTimer,
      timerMinutes: originalContestant.timerMinutes,
    };

    return await this.createContestant(newContestant);
  }
}

export const storage = new FileStorage();
