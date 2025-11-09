
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home";
import QuizPage from "@/pages/quiz";
import AddContestantPage from "@/pages/add-contestant";
import type { Contestant, InsertQuestion } from "@shared/schema";

// دالة لتوليد معرف فريد
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

type Page = "home" | "quiz" | "add-contestant" | "edit-contestant";

const STORAGE_KEY = "quiz-contestants";

// دالة لحفظ البيانات في localStorage
function saveToLocalStorage(contestants: Contestant[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contestants));
}

// دالة لتحميل البيانات من localStorage
function loadFromLocalStorage(): Contestant[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [currentContestantId, setCurrentContestantId] = useState<string | null>(null);
  const [editingContestantId, setEditingContestantId] = useState<string | null>(null);

  // تحميل البيانات من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedContestants = loadFromLocalStorage();
    setContestants(savedContestants);
  }, []);

  const handleAddContestant = () => {
    setEditingContestantId(null);
    setCurrentPage("add-contestant");
  };

  const handleEditContestant = (id: string) => {
    setEditingContestantId(id);
    setCurrentPage("edit-contestant");
  };

  const handleSaveContestant = (data: {
    name: string;
    questions: InsertQuestion[];
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
    enableTimer: boolean;
    timerMinutes: number;
  }) => {
    const { name, questions, randomizeQuestions, randomizeOptions, enableTimer, timerMinutes } = data;
    
    if (editingContestantId) {
      // تحديث contestant موجود
      const updatedContestants = contestants.map((c) => {
        if (c.id === editingContestantId) {
          return {
            ...c,
            name,
            questions: questions.map((q, index) => ({
              ...q,
              id: `${editingContestantId}-q-${index}`,
            })),
            randomizeQuestions,
            randomizeOptions,
            enableTimer,
            timerMinutes,
          };
        }
        return c;
      });
      setContestants(updatedContestants);
      saveToLocalStorage(updatedContestants);
    } else {
      // إضافة contestant جديد
      const id = generateId();
      const newContestant: Contestant = {
        id,
        name,
        questions: questions.map((q, index) => ({
          ...q,
          id: `${id}-q-${index}`,
        })),
        randomizeQuestions,
        randomizeOptions,
        enableTimer,
        timerMinutes,
      };
      const updatedContestants = [...contestants, newContestant];
      setContestants(updatedContestants);
      saveToLocalStorage(updatedContestants);
    }
    setCurrentPage("home");
  };

  const handleDeleteContestant = (id: string) => {
    const updatedContestants = contestants.filter((c) => c.id !== id);
    setContestants(updatedContestants);
    saveToLocalStorage(updatedContestants);
  };

  const handleStartQuiz = (contestantId: string) => {
    setCurrentContestantId(contestantId);
    setCurrentPage("quiz");
  };

  const handleQuizComplete = () => {
    setCurrentContestantId(null);
    setCurrentPage("home");
  };

  const handleCancelAddContestant = () => {
    setEditingContestantId(null);
    setCurrentPage("home");
  };

  const currentContestant = contestants.find((c) => c.id === currentContestantId);
  const editingContestant = contestants.find((c) => c.id === editingContestantId);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {currentPage === "home" && (
          <HomePage
            contestants={contestants}
            onAddContestant={handleAddContestant}
            onStartQuiz={handleStartQuiz}
            onEditContestant={handleEditContestant}
            onDeleteContestant={handleDeleteContestant}
          />
        )}
        {currentPage === "quiz" && currentContestant && (
          <QuizPage contestant={currentContestant} onComplete={handleQuizComplete} />
        )}
        {(currentPage === "add-contestant" || currentPage === "edit-contestant") && (
          <AddContestantPage
            onSave={handleSaveContestant}
            onCancel={handleCancelAddContestant}
            editingContestant={editingContestant}
          />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
