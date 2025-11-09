import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ContestantCard from "@/components/ContestantCard";
import Header from "@/components/Header";
import type { Contestant } from "@shared/schema";

interface HomePageProps {
  contestants: Contestant[];
  onAddContestant: () => void;
  onStartQuiz: (contestantId: string) => void;
  onEditContestant: (contestantId: string) => void;
  onDeleteContestant: (contestantId: string) => void;
}

export default function HomePage({
  contestants,
  onAddContestant,
  onStartQuiz,
  onEditContestant,
  onDeleteContestant,
}: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">

        <div className="max-w-6xl mx-auto mb-8">
          <Button
            onClick={onAddContestant}
            size="lg"
            className="w-full md:w-auto shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            data-testid="button-add-contestant"
          >
            <Plus className="ml-2 h-5 w-5" />
            إضافة نموذج جديد
          </Button>
        </div>

        {contestants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-6">
              لا يوجد نماذج بعد
            </p>
            <p className="text-muted-foreground">
              ابدأ بإضافة نموذجك الأول والأسئلة الخاصة به
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {contestants.map((contestant) => (
              <ContestantCard
                key={contestant.id}
                id={contestant.id}
                name={contestant.name}
                questionCount={contestant.questions.length}
                onStart={onStartQuiz}
                onEdit={onEditContestant}
                onDelete={onDeleteContestant}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
