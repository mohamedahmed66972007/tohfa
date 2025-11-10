import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Users, MinusCircle, Divide, Phone } from "lucide-react";
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
  onNext?: () => void;
  onLifelineUsed?: (lifeline: "fifty-fifty" | "phone-friend") => void;
  canUseFiftyFifty?: boolean;
  canUsePhoneFriend?: boolean;
  timerSeconds?: number;
  onTimerEnd?: () => void;
}

const optionLabels = ["أ", "ب", "ج", "د"]; // Arabic letters for options
const arabicLetters = ["أ", "ب", "ج", "د"]; // Consistent mapping

export default function QuizQuestion({
  questionNumber,
  totalQuestions,
  questionText,
  options,
  correctAnswer,
  onAnswerSelected,
  onNext,
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
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<{isCorrect: boolean} | null>(null);

  const soundEffect = useSoundEffect();

  // Timer effect for the main quiz timer
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

  // Timer effect for the phone-a-friend lifeline
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

  // Effect to handle answer selection and trigger next question
  useEffect(() => {
    if (answerResult) {
      onAnswerSelected(answerResult.isCorrect);
      setAutoAdvanceTimer(5); // Set auto-advance timer
      setAnswerResult(null); // Clear the result
    }
  }, [answerResult, onAnswerSelected]);

  // Effect for auto-advancing to the next question
  useEffect(() => {
    if (autoAdvanceTimer !== null && autoAdvanceTimer > 0) {
      const timer = setInterval(() => {
        setAutoAdvanceTimer((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            if (onNext) onNext(); // Proceed to next question
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [autoAdvanceTimer, onNext]);

  // Handler for the 50/50 lifeline
  const handleFiftyFifty = () => {
    if (!canUseFiftyFifty || removedOptions.length > 0) return; // Prevent reuse or if already used

    const wrongAnswers = [0, 1, 2, 3].filter((i) => i !== correctAnswer);
    const shuffled = wrongAnswers.sort(() => Math.random() - 0.5);
    const toRemove = shuffled.slice(0, 2); // Remove two wrong answers

    setRemovedOptions(toRemove);
    if (onLifelineUsed) onLifelineUsed("fifty-fifty");
  };

  // Handler for the phone-a-friend lifeline
  const handlePhoneFriend = () => {
    if (!canUsePhoneFriend) return; // Prevent if not available
    soundEffect.play(phoneFriendSrc, 0.099); // Play sound effect
    setShowPhoneFriend(true); // Show the phone-a-friend panel
    setPhoneFriendTimer(30); // Reset timer
    if (onLifelineUsed) onLifelineUsed("phone-friend");
  };

  // Handler for selecting an answer
  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null || showResult || removedOptions.includes(index)) return; // Prevent multiple selections or clicking removed options

    if (showPhoneFriend) {
      soundEffect.fadeOut(1500); // Fade out sound if phone-a-friend was active
      setShowPhoneFriend(false);
    }

    setSelectedAnswer(index);
    setShowResult(true); // Show result immediately

    const isCorrect = index === correctAnswer;

    if (isCorrect) {
      soundEffect.play(correctAnswerSrc, 0.85); // Play correct answer sound
    } else {
      soundEffect.play(wrongAnswerSrc, 0.85); // Play wrong answer sound
    }

    setAnswerResult({ isCorrect }); // Set the result to trigger the useEffect
  };

  // Handler for proceeding to the next question manually
  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  // Formats time in MM:SS format
  const formatTime = (seconds: number | undefined) => {
    if (seconds === undefined) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Functions to determine styling for answer buttons based on state
  const getAnswerBackground = (index: number) => {
    if (showResult) { // If results are shown
      if (index === correctAnswer) {
        // Highlight correct answer with full green background
        return 'linear-gradient(135deg, rgba(34, 197, 94, 0.85) 0%, rgba(34, 197, 94, 0.95) 100%)';
      } else if (index === selectedAnswer) {
        // Highlight selected wrong answer with full red background
        return 'linear-gradient(135deg, rgba(239, 68, 68, 0.85) 0%, rgba(239, 68, 68, 0.95) 100%)';
      }
    }
    // Default background for unselected answers - same as question box
    return 'linear-gradient(to bottom, rgba(24, 24, 49, 0.95) 0%, rgba(49, 29, 77, 0.95) 100%)';
  };

  const getAnswerBorder = (index: number) => {
    if (showResult) {
      if (index === correctAnswer) {
        return '2px solid #22c55e';
      } else if (index === selectedAnswer) {
        return '2px solid #ef4444';
      }
    }
    return '2px solid #d8a863';
  };

  const getCircleBackground = (index: number) => {
    if (showResult) {
      if (index === correctAnswer) {
        return '#22c55e'; // Green for correct
      } else if (index === selectedAnswer) {
        return '#ef4444'; // Red for wrong
      }
    }
    return 'linear-gradient(to right, #d8a863, #e9c185)'; // Default golden
  };

  const getCircleIcon = (index: number) => {
    if (showResult) {
      if (index === correctAnswer) {
        return '✓'; // Check mark for correct
      } else if (index === selectedAnswer) {
        return '✗'; // X mark for wrong
      }
    }
    return arabicLetters[index]; // Default letter
  };

  const getAnswerBoxShadow = (index: number) => {
    if (showResult) {
      if (index === correctAnswer) {
        return '0 0 30px rgba(34, 197, 94, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)';
      } else if (index === selectedAnswer) {
        return '0 0 30px rgba(239, 68, 68, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)';
      }
    }
    return '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(216, 168, 99, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
  };

  const showingAnswer = selectedAnswer !== null; // Boolean to indicate if an answer has been selected and results are being shown

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Console-style top bar */}
      <div className="mb-10 flex items-center justify-between px-6 py-4 rounded-lg relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(24, 24, 49, 0.95) 0%, rgba(49, 29, 77, 0.95) 100%)',
        border: '2px solid rgba(216, 168, 99, 0.4)',
        boxShadow: '0 0 30px rgba(139, 92, 246, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/8 via-purple-600/12 to-violet-600/8" />
        <p className="text-lg font-bold tracking-wider z-10" style={{
          background: 'linear-gradient(to right, #d8a863, #e9c185)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }} data-testid="text-question-counter">
          السؤال {questionNumber} من {totalQuestions}
        </p>
        {timerSeconds && remainingTime !== undefined && (
          <div className={cn(
            "text-xl font-bold px-6 py-2 rounded-md z-10 tracking-wider",
            remainingTime <= 10
              ? "text-red-400 animate-pulse"
              : ""
          )} style={{
            color: remainingTime <= 10 ? '#ef4444' : '#d8a863',
            textShadow: remainingTime <= 10
              ? '0 0 20px rgba(239, 68, 68, 0.8)'
              : '0 0 20px rgba(216, 168, 99, 0.6)'
          }}>
            {formatTime(remainingTime)}
          </div>
        )}
      </div>

      {/* Mobile lifelines - horizontal at top - only visible on mobile */}
      <div className="md:hidden mb-6 flex gap-3 justify-center w-full px-2">
        <Button
          variant="outline"
          onClick={handleFiftyFifty}
          disabled={!canUseFiftyFifty || removedOptions.length > 0}
          data-testid="button-fifty-fifty-mobile"
          className={cn(
            "px-4 py-3 text-sm font-semibold tracking-wide relative overflow-hidden transition-all duration-300 flex flex-col items-center gap-1.5 min-w-[100px]",
            (!canUseFiftyFifty || removedOptions.length > 0) && "opacity-40 cursor-not-allowed"
          )}
          style={{
            background: 'linear-gradient(135deg, rgba(24, 24, 49, 0.95) 0%, rgba(49, 29, 77, 0.95) 100%)',
            border: '2px solid rgba(216, 168, 99, 0.6)',
            boxShadow: '0 0 20px rgba(216, 168, 99, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          <MinusCircle className="h-5 w-5" />
          <span className="text-center leading-tight text-xs">حذف<br/>إجابتين</span>
        </Button>
        <Button
          variant="outline"
          onClick={handlePhoneFriend}
          disabled={!canUsePhoneFriend}
          data-testid="button-phone-friend-mobile"
          className={cn(
            "px-4 py-3 text-sm font-semibold tracking-wide relative overflow-hidden transition-all duration-300 flex flex-col items-center gap-1.5 min-w-[100px]",
            !canUsePhoneFriend && "opacity-40 cursor-not-allowed"
          )}
          style={{
            background: 'linear-gradient(135deg, rgba(24, 24, 49, 0.95) 0%, rgba(49, 29, 77, 0.95) 100%)',
            border: '2px solid rgba(216, 168, 99, 0.6)',
            boxShadow: '0 0 20px rgba(216, 168, 99, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          <Users className="h-5 w-5" />
          <span className="text-center leading-tight text-xs">الاستعانة<br/>بصديق</span>
        </Button>
      </div>

      {/* Main content area with lifelines on the side (desktop only) */}
      <div className="flex gap-6 items-start">
        {/* Lifeline buttons - vertical on the left side - only visible on desktop */}
        <div className="hidden md:flex flex-col gap-4 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleFiftyFifty}
            disabled={!canUseFiftyFifty || removedOptions.length > 0}
            data-testid="button-fifty-fifty"
            className={cn(
              "px-5 py-4 text-sm font-semibold tracking-wide relative overflow-hidden transition-all duration-300 flex flex-col items-center gap-2 min-w-[120px]",
              (!canUseFiftyFifty || removedOptions.length > 0) && "opacity-40 cursor-not-allowed"
            )}
            style={{
              background: 'linear-gradient(135deg, rgba(24, 24, 49, 0.95) 0%, rgba(49, 29, 77, 0.95) 100%)',
              border: '2px solid rgba(216, 168, 99, 0.6)',
              boxShadow: '0 0 20px rgba(216, 168, 99, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            <MinusCircle className="h-6 w-6" />
            <span className="text-center leading-tight">حذف<br/>إجابتين</span>
          </Button>
          <Button
            variant="outline"
            onClick={handlePhoneFriend}
            disabled={!canUsePhoneFriend}
            data-testid="button-phone-friend"
            className={cn(
              "px-5 py-4 text-sm font-semibold tracking-wide relative overflow-hidden transition-all duration-300 flex flex-col items-center gap-2 min-w-[120px]",
              !canUsePhoneFriend && "opacity-40 cursor-not-allowed"
            )}
            style={{
              background: 'linear-gradient(135deg, rgba(24, 24, 49, 0.95) 0%, rgba(49, 29, 77, 0.95) 100%)',
              border: '2px solid rgba(216, 168, 99, 0.6)',
              boxShadow: '0 0 20px rgba(216, 168, 99, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}
          >
            <Users className="h-6 w-6" />
            <span className="text-center leading-tight">الاستعانة<br/>بصديق</span>
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 w-full">

      {/* Phone-a-friend panel with enhanced styling */}
      {showPhoneFriend && (
        <div className="mb-6 md:mb-10 rounded-lg p-4 md:p-8 text-center relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(24, 24, 49, 0.95) 0%, rgba(49, 29, 77, 0.95) 100%)',
          border: '3px solid rgba(216, 168, 99, 0.7)',
          boxShadow: '0 0 40px rgba(216, 168, 99, 0.5), inset 0 2px 0 rgba(255,255,255,0.1)'
        }}>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-purple-600/8 to-violet-600/5" />
          <p className="text-xl md:text-3xl font-bold mb-2 md:mb-3 z-10 relative" style={{
            color: '#d8a863',
            textShadow: '0 0 20px rgba(216, 168, 99, 0.6)'
          }}>اتصال بصديق...</p>
          <p className="text-3xl md:text-5xl font-bold z-10 relative" style={{
            color: '#e9c185',
            textShadow: '0 0 30px rgba(233, 193, 133, 0.8)'
          }}>{phoneFriendTimer} ثانية</p>
        </div>
      )}

      {/* Question card - simpler design like the real show */}
      <div className="mb-8 md:mb-12 relative">
        {/* Subtle spotlight background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[80px] -z-10 opacity-20" style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)'
        }} />

        <div
          className="relative px-4 py-6 md:px-12 md:py-8 rounded-xl"
          style={{
            background: 'linear-gradient(to bottom, rgba(24, 24, 49, 0.95) 0%, rgba(49, 29, 77, 0.95) 100%)',
            border: '2px solid',
            borderColor: '#d8a863',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(216, 168, 99, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          <p className="text-lg md:text-2xl lg:text-3xl font-bold text-center leading-relaxed" style={{
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)'
          }} data-testid="text-question">
            {questionText}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === correctAnswer;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;
          const isRemoved = removedOptions.includes(index);

          if (isRemoved) {
            return <div key={index} className="h-[60px] md:h-[70px]" />; // Placeholder for removed option
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={showResult} // Disable clicking after an answer is selected
              data-testid={`button-option-${index}`}
              className={cn(
                `relative group h-[60px] md:h-[70px] px-3 py-3 md:px-6 md:py-4 rounded-xl transition-all duration-300 text-right`,
                !showResult && "hover:brightness-110 cursor-pointer active:scale-95",
                showResult && "cursor-default"
              )}
              style={{
                background: getAnswerBackground(index),
                border: getAnswerBorder(index),
                boxShadow: getAnswerBoxShadow(index)
              }}
            >
              <div className="flex items-center gap-2 md:gap-4 w-full">
                <div
                  className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-base md:text-lg transition-all"
                  style={{
                    background: getCircleBackground(index),
                    boxShadow: showResult && (index === correctAnswer || index === selectedAnswer)
                      ? `0 0 20px ${index === correctAnswer ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'}`
                      : '0 0 20px rgba(216, 168, 99, 0.6)'
                  }}
                >
                  <span style={{ color: '#ffffff', fontSize: showResult && (index === correctAnswer || index === selectedAnswer) ? '1.2em' : 'inherit' }}>
                    {getCircleIcon(index)}
                  </span>
                </div>
                <span className="text-sm md:text-lg font-semibold text-right flex-1" style={{ color: '#ffffff' }}>{option}</span>
              </div>
              {showCorrect && (
                <div className="absolute inset-0 bg-white/10 animate-pulse rounded-lg" />
              )}
            </button>
          );
        })}
      </div>

      {/* Auto-advance message - appears after answering */}
      {showResult && autoAdvanceTimer !== null && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-lg font-semibold" style={{
            color: '#d8a863',
            textShadow: '0 0 20px rgba(216, 168, 99, 0.6)'
          }}>
            الانتقال التلقائي خلال {autoAdvanceTimer} ثوانٍ
          </p>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}