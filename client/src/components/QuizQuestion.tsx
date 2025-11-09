import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Users, MinusCircle } from "lucide-react";
import { useSoundEffect } from "@/hooks/use-sound-effect";
import phoneFriendSrc from "@assets/صوت استعانه ب صديق_1762718111821.mp3";
import correctAnswerSrc from "@assets/صوت الاجابة صح_1762720364265.mp3";
import wrongAnswerSrc from "@assets/صوت الاجابة غلط_1762720364264.mp3";

interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  onAnswerSelected: (isCorrect: boolean) => void;
  onLifelineUsed?: (lifeline: "fifty-fifty" | "phone-friend") => void;
  canUseFiftyFifty?: boolean;
  canUsePhoneFriend?: boolean;
  timerSeconds?: number;
  onTimerEnd?: () => void;
}

const optionLabels = ["أ", "ب", "ج", "د"];

export default function QuizQuestion({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  correctAnswer,
  onAnswerSelected,
  onLifelineUsed,
  canUseFiftyFifty = true,
  canUsePhoneFriend = true,
  timerSeconds,
  onTimerEnd,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [removedOptions, setRemovedOptions] = useState<number[]>([]);
  const [showPhoneFriend, setShowPhoneFriend] = useState(false);
  const [phoneFriendTimer, setPhoneFriendTimer] = useState(30);
  const [remainingTime, setRemainingTime] = useState(timerSeconds);

  const { play: playSoundEffect, stop: stopSoundEffect, fade: fadeSoundEffect } = useSoundEffect({ volume: 0.7 });

  useEffect(() => {
    if (timerSeconds && remainingTime !== undefined && remainingTime > 0 && !showResult) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev === undefined || prev <= 1) {
            clearInterval(timer);
            if (onTimerEnd) onTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timerSeconds, remainingTime, showResult, onTimerEnd]);

  useEffect(() => {
    if (showPhoneFriend && phoneFriendTimer > 0) {
      const timer = setInterval(() => {
        setPhoneFriendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowPhoneFriend(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showPhoneFriend, phoneFriendTimer]);

  const handleFiftyFifty = () => {
    if (!canUseFiftyFifty || removedOptions.length > 0) return;

    const wrongAnswers = [0, 1, 2, 3].filter((i) => i !== correctAnswer);
    const shuffled = wrongAnswers.sort(() => Math.random() - 0.5);
    const toRemove = shuffled.slice(0, 2);

    setRemovedOptions(toRemove);
    if (onLifelineUsed) onLifelineUsed("fifty-fifty");
  };

  const handlePhoneFriend = () => {
    if (!canUsePhoneFriend) return;
    playSoundEffect(phoneFriendSrc);
    setShowPhoneFriend(true);
    setPhoneFriendTimer(30);
    if (onLifelineUsed) onLifelineUsed("phone-friend");
  };

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null || showResult || removedOptions.includes(index)) return;

    if (showPhoneFriend) {
      fadeSoundEffect(1500);
      setShowPhoneFriend(false);
    }

    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = index === correctAnswer;

    if (isCorrect) {
      playSoundEffect(correctAnswerSrc);
    } else {
      playSoundEffect(wrongAnswerSrc);
    }

    setTimeout(() => {
      onAnswerSelected(isCorrect);
    }, 1500);
  };

  const formatTime = (seconds: number | undefined) => {
    if (seconds === undefined) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="mb-8 flex items-center justify-between">
        <p className="text-primary text-lg font-semibold" data-testid="text-question-counter">
          السؤال {questionNumber} من {totalQuestions}
        </p>
        {timerSeconds && remainingTime !== undefined && (
          <div className={cn(
            "text-lg font-bold px-4 py-2 rounded-md",
            remainingTime <= 10 ? "text-red-500 animate-pulse" : "text-primary"
          )}>
            {formatTime(remainingTime)}
          </div>
        )}
      </div>

      <div className="mb-8 flex gap-3 justify-center">
        <Button
          variant="outline"
          onClick={handleFiftyFifty}
          disabled={!canUseFiftyFifty || removedOptions.length > 0}
          data-testid="button-fifty-fifty"
          className={cn(
            "bg-card/50 backdrop-blur-md border-2 border-primary/40",
            (!canUseFiftyFifty || removedOptions.length > 0) && "opacity-40"
          )}
        >
          <MinusCircle className="ml-2 h-5 w-5" />
          حذف إجابتين
        </Button>
        <Button
          variant="outline"
          onClick={handlePhoneFriend}
          disabled={!canUsePhoneFriend}
          data-testid="button-phone-friend"
          className={cn(
            "bg-card/50 backdrop-blur-md border-2 border-primary/40",
            !canUsePhoneFriend && "opacity-40"
          )}
        >
          <Users className="ml-2 h-5 w-5" />
          الاستعانة ب صديق
        </Button>
      </div>

      {showPhoneFriend && (
        <div className="mb-8 bg-accent/20 border-2 border-accent rounded-lg p-6 text-center">
          <p className="text-2xl font-bold text-accent mb-2">اتصال بصديق...</p>
          <p className="text-4xl font-bold text-foreground">{phoneFriendTimer} ثانية</p>
        </div>
      )}

      <div className="mb-12 relative">
        <div 
          className="relative bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-md border-2 border-primary/50 p-8 shadow-2xl"
          style={{
            clipPath: "polygon(2% 0%, 98% 0%, 100% 50%, 98% 100%, 2% 100%, 0% 50%)",
          }}
        >
          <p className="text-2xl md:text-3xl font-bold text-center text-foreground" data-testid="text-question">
            {questionText}
          </p>
          <div className="absolute inset-0 border-2 border-primary/30 blur-sm" 
            style={{
              clipPath: "polygon(2% 0%, 98% 0%, 100% 50%, 98% 100%, 2% 100%, 0% 50%)",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl -z-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === correctAnswer;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;
          const isRemoved = removedOptions.includes(index);

          if (isRemoved) {
            return <div key={index} className="h-[80px]" />;
          }

          return (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleAnswerClick(index)}
              disabled={showResult}
              data-testid={`button-option-${index}`}
              className={cn(
                "h-auto min-h-[80px] relative overflow-visible group transition-all duration-300",
                "bg-gradient-to-r from-card/40 via-card/60 to-card/40 backdrop-blur-sm border-2",
                !showResult && "hover:border-primary hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]",
                showCorrect && "border-green-500 bg-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.6)]",
                showWrong && "border-red-500 bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.6)]",
                !showResult && !isSelected && "border-primary/40"
              )}
              style={{
                clipPath: "polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)",
              }}
            >
              <div className="flex items-center gap-4 w-full px-6">
                <div
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all",
                    "bg-primary/20 text-primary border-2 border-primary/60",
                    showCorrect && "bg-green-500 text-white border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.8)]",
                    showWrong && "bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                  )}
                >
                  {showCorrect ? <Check className="h-7 w-7" /> : showWrong ? <X className="h-7 w-7" /> : optionLabels[index]}
                </div>
                <span className="text-lg font-semibold text-right flex-1">{option}</span>
              </div>
              {showCorrect && (
                <div className="absolute inset-0 bg-green-500/10 animate-pulse" 
                  style={{ clipPath: "polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)" }} 
                />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}