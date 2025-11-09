import { useState, useEffect } from "react";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResult from "@/components/QuizResult";
import Header from "@/components/Header";
import type { Contestant, Question } from "@shared/schema";

interface QuizPageProps {
  contestant: Contestant;
  onComplete: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizPage({ contestant, onComplete }: QuizPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedPhoneFriend, setUsedPhoneFriend] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | undefined>(undefined);

  useEffect(() => {
    let questions = [...contestant.questions];
    
    if (contestant.randomizeQuestions) {
      questions = shuffleArray(questions);
    }

    if (contestant.randomizeOptions) {
      questions = questions.map(q => {
        const optionsWithIndex = q.options.map((opt, idx) => ({ opt, idx }));
        const shuffled = shuffleArray(optionsWithIndex);
        
        return {
          ...q,
          options: shuffled.map(item => item.opt),
          correctAnswer: shuffled.findIndex(item => item.idx === q.correctAnswer),
        };
      });
    }

    setQuizQuestions(questions);

    if (contestant.enableTimer) {
      setTimerSeconds(contestant.timerMinutes * 60);
    }
  }, [contestant]);

  const handleAnswerSelected = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        setIsFinished(true);
      }, 1000);
    }
  };

  const handleLifelineUsed = (lifeline: "fifty-fifty" | "phone-friend") => {
    if (lifeline === "fifty-fifty") {
      setUsedFiftyFifty(true);
    } else if (lifeline === "phone-friend") {
      setUsedPhoneFriend(true);
    }
  };

  const handleTimerEnd = () => {
    setIsFinished(true);
  };

  if (quizQuestions.length === 0) {
    return null;
  }

  if (isFinished) {
    return (
      <QuizResult
        contestantName={contestant.name}
        correctAnswers={correctAnswers}
        totalQuestions={quizQuestions.length}
        onReturnHome={onComplete}
      />
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-primary" data-testid="text-contestant-name">
            {contestant.name}
          </h2>
        </div>

        <QuizQuestion
          key={currentQuestionIndex}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quizQuestions.length}
          questionText={currentQuestion.text}
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          onAnswerSelected={handleAnswerSelected}
          onLifelineUsed={handleLifelineUsed}
          canUseFiftyFifty={!usedFiftyFifty}
          canUsePhoneFriend={!usedPhoneFriend}
          timerSeconds={timerSeconds}
          onTimerEnd={handleTimerEnd}
        />
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-2 bg-muted/30">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{
            width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
