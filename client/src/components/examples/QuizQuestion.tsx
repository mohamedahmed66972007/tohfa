import { useState } from "react";
import QuizQuestion from "../QuizQuestion";

export default function QuizQuestionExample() {
  const [key, setKey] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex items-center justify-center p-4">
      <QuizQuestion
        key={key}
        questionNumber={1}
        totalQuestions={10}
        questionText="ما هي عاصمة مصر؟"
        options={["القاهرة", "الإسكندرية", "الجيزة", "أسوان"]}
        correctAnswer={0}
        onAnswerSelected={(isCorrect) => {
          console.log("Answer is correct:", isCorrect);
          setTimeout(() => setKey(key + 1), 500);
        }}
        canUseFiftyFifty={true}
        canUsePhoneFriend={true}
        timerSeconds={120}
        onTimerEnd={() => console.log("Timer ended")}
      />
    </div>
  );
}
