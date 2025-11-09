import { z } from "zod";

export const questionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "نص السؤال مطلوب"),
  options: z.array(z.string()).length(4, "يجب أن يكون هناك 4 خيارات بالضبط"),
  correctAnswer: z.number().min(0).max(3, "الإجابة الصحيحة يجب أن تكون بين 0 و 3"),
});

export const contestantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "اسم المتسابق مطلوب"),
  questions: z.array(questionSchema),
  randomizeQuestions: z.boolean(),
  randomizeOptions: z.boolean(),
  enableTimer: z.boolean().default(false),
  timerMinutes: z.number().min(1).max(60).default(1),
});

export const insertQuestionSchema = questionSchema.omit({ id: true });
export const insertContestantSchema = contestantSchema.omit({ id: true });

export type Question = z.infer<typeof questionSchema>;
export type Contestant = z.infer<typeof contestantSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertContestant = z.infer<typeof insertContestantSchema>;
