import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import AddQuestionForm from "./AddQuestionForm";
import type { InsertQuestion } from "@shared/schema";

interface AddContestantFormProps {
  onSubmit: (contestant: {
    name: string;
    questions: InsertQuestion[];
    randomizeQuestions: boolean;
    randomizeOptions: boolean;
    enableTimer: boolean;
    timerMinutes: number;
  }) => void;
  onCancel?: () => void;
}

export default function AddContestantForm({ onSubmit, onCancel }: AddContestantFormProps) {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<InsertQuestion[]>([]);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [randomizeOptions, setRandomizeOptions] = useState(false);
  const [enableTimer, setEnableTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(1);

  const handleAddQuestion = (question: InsertQuestion) => {
    setQuestions([...questions, question]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || questions.length === 0) return;

    onSubmit({
      name,
      questions,
      randomizeQuestions,
      randomizeOptions,
      enableTimer,
      timerMinutes,
    });

    setName("");
    setQuestions([]);
    setRandomizeQuestions(false);
    setRandomizeOptions(false);
    setEnableTimer(false);
    setTimerMinutes(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">إضافة متسابق جديد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="contestant-name">اسم المتسابق</Label>
            <Input
              id="contestant-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسم المتسابق..."
              data-testid="input-contestant-name"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="randomize-questions">ترتيب الأسئلة عشوائياً</Label>
              <Switch
                id="randomize-questions"
                checked={randomizeQuestions}
                onCheckedChange={setRandomizeQuestions}
                data-testid="switch-randomize-questions"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="randomize-options">ترتيب الخيارات عشوائياً</Label>
              <Switch
                id="randomize-options"
                checked={randomizeOptions}
                onCheckedChange={setRandomizeOptions}
                data-testid="switch-randomize-options"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enable-timer">تفعيل مؤقت للأسئلة</Label>
              <Switch
                id="enable-timer"
                checked={enableTimer}
                onCheckedChange={setEnableTimer}
                data-testid="switch-enable-timer"
              />
            </div>

            {enableTimer && (
              <div className="space-y-2 pr-4">
                <Label htmlFor="timer-minutes">عدد الدقائق لكل الأسئلة</Label>
                <Input
                  id="timer-minutes"
                  type="number"
                  min="1"
                  max="60"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  data-testid="input-timer-minutes"
                />
              </div>
            )}
          </div>

          {questions.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">الأسئلة المضافة</h3>
                  <Badge data-testid="badge-questions-count">{questions.length} سؤال</Badge>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {questions.map((q, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-3 bg-muted/30 rounded-md"
                      data-testid={`question-item-${index}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{q.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          الإجابة الصحيحة: {q.options[q.correctAnswer]}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveQuestion(index)}
                        data-testid={`button-remove-question-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AddQuestionForm onAddQuestion={handleAddQuestion} />

      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!name.trim() || questions.length === 0}
          className="flex-1"
          data-testid="button-save-contestant"
        >
          <Plus className="ml-2 h-4 w-4" />
          حفظ المتسابق
        </Button>
        {onCancel && (
          <Button
            variant="secondary"
            onClick={onCancel}
            data-testid="button-cancel"
          >
            إلغاء
          </Button>
        )}
      </div>
    </div>
  );
}
