import { useState, useEffect } from "react";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResult from "@/components/QuizResult";
import Header from "@/components/Header";
import { useBackgroundMusic } from "@/hooks/use-background-music";
import type { Contestant, Question } from "@shared/schema";
import backgroundMusicSrc from "@assets/صوت موسيقى من سيربح المليون_1762718195473.mp3";

// Placeholder for sound effects - actual implementation would require audio playback logic
const correctSoundSrc = "/sounds/correct.mp3";
const incorrectSoundSrc = "/sounds/incorrect.mp3";

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

  const { fadeOut } = useBackgroundMusic({
    src: backgroundMusicSrc,
    volume: 0.7,
    fadeOutDuration: 2500
  });

  // Placeholder for playing sound effects
  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.play();
  };

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
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      fadeOut();
      setIsFinished(true);
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
    fadeOut();
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-accent/10 to-background">
      <Header onLogoClick={onComplete} />
      
      {/* Vignette overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
      }} />

      {/* Animated spotlight effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px]" style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
        }} />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        {/* Progress bar with theme colors - moved to top */}
        <div className="mb-6 h-3 bg-black/40 border border-primary/30 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500 relative overflow-hidden bg-primary"
            style={{
              width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
              boxShadow: '0 0 20px hsl(var(--primary) / 0.6), inset 0 1px 0 rgba(255,255,255,0.3)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>

        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-wide mb-2 text-primary" style={{
            textShadow: '0 0 30px hsl(var(--primary) / 0.5)'
          }} data-testid="text-contestant-name">
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
          onNext={handleNext}
          onLifelineUsed={handleLifelineUsed}
          canUseFiftyFifty={!usedFiftyFifty}
          canUsePhoneFriend={!usedPhoneFriend}
          timerSeconds={timerSeconds}
          onTimerEnd={handleTimerEnd}
        />
      </main>
    </div>
  );
}