import { type Contestant, type InsertContestant } from "@shared/schema";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";

export interface IStorage {
  getContestant(id: string): Promise<Contestant | undefined>;
  getAllContestants(): Promise<Contestant[]>;
  createContestant(contestant: InsertContestant): Promise<Contestant>;
  deleteContestant(id: string): Promise<void>;
}

const sql = neon(process.env.DATABASE_URL!);

async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS contestants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      questions JSONB NOT NULL,
      randomize_questions BOOLEAN NOT NULL,
      randomize_options BOOLEAN NOT NULL,
      enable_timer BOOLEAN NOT NULL,
      timer_minutes INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export class DbStorage implements IStorage {
  private initialized = false;

  private async ensureInitialized() {
    if (!this.initialized) {
      await initializeDatabase();
      this.initialized = true;
    }
  }

  async getContestant(id: string): Promise<Contestant | undefined> {
    await this.ensureInitialized();
    const results = await sql`
      SELECT * FROM contestants WHERE id = ${id}
    `;
    
    if (results.length === 0) return undefined;
    
    const row = results[0];
    return {
      id: row.id as string,
      name: row.name as string,
      questions: row.questions as any,
      randomizeQuestions: row.randomize_questions as boolean,
      randomizeOptions: row.randomize_options as boolean,
      enableTimer: row.enable_timer as boolean,
      timerMinutes: row.timer_minutes as number,
    };
  }

  async getAllContestants(): Promise<Contestant[]> {
    await this.ensureInitialized();
    const results = await sql`
      SELECT * FROM contestants ORDER BY created_at DESC
    `;
    
    return results.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      questions: row.questions as any,
      randomizeQuestions: row.randomize_questions as boolean,
      randomizeOptions: row.randomize_options as boolean,
      enableTimer: row.enable_timer as boolean,
      timerMinutes: row.timer_minutes as number,
    }));
  }

  async createContestant(insertContestant: InsertContestant): Promise<Contestant> {
    await this.ensureInitialized();
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

    await sql`
      INSERT INTO contestants (
        id, name, questions, randomize_questions, 
        randomize_options, enable_timer, timer_minutes
      ) VALUES (
        ${contestant.id},
        ${contestant.name},
        ${JSON.stringify(contestant.questions)},
        ${contestant.randomizeQuestions},
        ${contestant.randomizeOptions},
        ${contestant.enableTimer},
        ${contestant.timerMinutes}
      )
    `;

    return contestant;
  }

  async deleteContestant(id: string): Promise<void> {
    await this.ensureInitialized();
    await sql`
      DELETE FROM contestants WHERE id = ${id}
    `;
  }
}

export const storage = new DbStorage();
