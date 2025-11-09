import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home";
import QuizPage from "@/pages/quiz";
import AddContestantPage from "@/pages/add-contestant";
import type { Contestant, InsertQuestion } from "@shared/schema";

type Screen = "home" | "add-contestant" | "quiz";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [selectedContestantId, setSelectedContestantId] = useState<string | null>(null);

  const handleAddContestant = (newContestant: {
    name: string;
    questions: InsertQuestion[];
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
    enableTimer: boolean;
    timerMinutes: number;
  }) => {
    const contestant: Contestant = {
      id: Date.now().toString(),
      ...newContestant,
      questions: newContestant.questions.map((q, index) => ({
        ...q,
        id: `${Date.now()}-${index}`,
      })),
    };

    setContestants([...contestants, contestant]);
    setCurrentScreen("home");
  };

  const handleDeleteContestant = (id: string) => {
    setContestants(contestants.filter(c => c.id !== id));
  };

  const handleStartQuiz = (id: string) => {
    setSelectedContestantId(id);
    setCurrentScreen("quiz");
  };

  const selectedContestant = contestants.find(c => c.id === selectedContestantId);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {currentScreen === "home" && (
          <HomePage
            contestants={contestants}
            onAddContestant={() => setCurrentScreen("add-contestant")}
            onStartQuiz={handleStartQuiz}
            onEditContestant={(id) => {
              console.log("Edit contestant:", id);
            }}
            onDeleteContestant={handleDeleteContestant}
          />
        )}

        {currentScreen === "add-contestant" && (
          <AddContestantPage
            onSubmit={handleAddContestant}
            onCancel={() => setCurrentScreen("home")}
          />
        )}

        {currentScreen === "quiz" && selectedContestant && (
          <QuizPage
            contestant={selectedContestant}
            onComplete={() => setCurrentScreen("home")}
          />
        )}

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
