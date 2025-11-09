import { type Contestant, type InsertContestant } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getContestant(id: string): Promise<Contestant | undefined>;
  getAllContestants(): Promise<Contestant[]>;
  createContestant(contestant: InsertContestant): Promise<Contestant>;
  deleteContestant(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private contestants: Map<string, Contestant>;

  constructor() {
    this.contestants = new Map();
  }

  async getContestant(id: string): Promise<Contestant | undefined> {
    return this.contestants.get(id);
  }

  async getAllContestants(): Promise<Contestant[]> {
    return Array.from(this.contestants.values());
  }

  async createContestant(insertContestant: InsertContestant): Promise<Contestant> {
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
    this.contestants.set(id, contestant);
    return contestant;
  }

  async deleteContestant(id: string): Promise<void> {
    this.contestants.delete(id);
  }
}

export const storage = new MemStorage();
