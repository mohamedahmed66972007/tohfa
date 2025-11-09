import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home";
import QuizPage from "@/pages/quiz";
import AddContestantPage from "@/pages/add-contestant";
import type { Contestant, InsertQuestion } from "@shared/schema";

type Screen = "home" | "add-contestant" | "edit-contestant" | "quiz";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [contestants, setContestants] = useState<Contestant[]>(() => {
    const savedContestants = localStorage.getItem("contestants");
    return savedContestants ? JSON.parse(savedContestants) : [];
  });
  const [selectedContestantId, setSelectedContestantId] = useState<string | null>(null);
  const [editingContestantId, setEditingContestantId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("contestants", JSON.stringify(contestants));
  }, [contestants]);

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

  const handleEditContestant = (updatedContestant: {
    name: string;
    questions: InsertQuestion[];
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
    enableTimer: boolean;
    timerMinutes: number;
  }) => {
    if (!editingContestantId) return;

    const updatedContestants = contestants.map((c) => {
      if (c.id === editingContestantId) {
        const questionsWithIds = updatedContestant.questions.map((q: any) => {
          if (q.id) {
            return q;
          }

          return {
            ...q,
            id: `${Date.now()}-${Math.random()}`,
          };
        });

        return {
          ...c,
          ...updatedContestant,
          questions: questionsWithIds,
        };
      }
      return c;
    });

    setContestants(updatedContestants);
    setEditingContestantId(null);
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
  const editingContestant = contestants.find(c => c.id === editingContestantId);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {currentScreen === "home" && (
          <HomePage
            contestants={contestants}
            onAddContestant={() => setCurrentScreen("add-contestant")}
            onStartQuiz={handleStartQuiz}
            onEditContestant={(id) => {
              setEditingContestantId(id);
              setCurrentScreen("edit-contestant");
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

        {currentScreen === "edit-contestant" && editingContestant && (
          <AddContestantPage
            onSubmit={handleEditContestant}
            onCancel={() => {
              setEditingContestantId(null);
              setCurrentScreen("home");
            }}
            contestant={editingContestant}
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