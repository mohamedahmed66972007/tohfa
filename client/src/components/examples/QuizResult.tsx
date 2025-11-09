import QuizResult from "../QuizResult";

export default function QuizResultExample() {
  return (
    <QuizResult
      contestantName="أحمد"
      correctAnswers={8}
      totalQuestions={10}
      onReturnHome={() => console.log("Return home")}
    />
  );
}
