import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Home } from "lucide-react";

interface QuizResultProps {
  contestantName: string;
  correctAnswers: number;
  totalQuestions: number;
  onReturnHome: () => void;
}

export default function QuizResult({
  contestantName,
  correctAnswers,
  totalQuestions,
  onReturnHome,
}: QuizResultProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-12 text-center space-y-8">
          <div>
            <Trophy className="h-24 w-24 mx-auto text-primary mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="text-result-title">
              مبروك {contestantName}!
            </h2>
            <p className="text-muted-foreground">لقد أنهيت المسابقة</p>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-6">
              <p className="text-6xl font-bold text-primary mb-2" data-testid="text-percentage">
                {percentage}%
              </p>
              <p className="text-lg text-foreground" data-testid="text-score">
                {correctAnswers} من {totalQuestions} إجابة صحيحة
              </p>
            </div>

            {percentage >= 80 && (
              <p className="text-xl text-green-500 font-semibold">أداء ممتاز! 🎉</p>
            )}
            {percentage >= 50 && percentage < 80 && (
              <p className="text-xl text-primary font-semibold">أداء جيد! 👏</p>
            )}
            {percentage < 50 && (
              <p className="text-xl text-muted-foreground">حاول مرة أخرى! 💪</p>
            )}
          </div>

          <Button
            onClick={onReturnHome}
            size="lg"
            className="w-full"
            data-testid="button-return-home"
          >
            <Home className="ml-2 h-5 w-5" />
            العودة للرئيسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
