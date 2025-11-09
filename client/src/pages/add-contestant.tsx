import AddContestantForm from "@/components/AddContestantForm";
import Header from "@/components/Header";
import type { InsertQuestion, Contestant } from "@shared/schema";

interface AddContestantPageProps {
  onSubmit: (contestant: {
    name: string;
    questions: InsertQuestion[];
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
    enableTimer: boolean;
    timerMinutes: number;
  }) => void;
  onCancel: () => void;
  contestant?: Contestant;
}

export default function AddContestantPage({
  onSubmit,
  onCancel,
  contestant,
}: AddContestantPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <AddContestantForm onSubmit={onSubmit} onCancel={onCancel} contestant={contestant} />
        </div>
      </main>
    </div>
  );
}
