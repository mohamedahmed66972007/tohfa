import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import AddQuestionForm from "./AddQuestionForm";
import type { InsertQuestion, Contestant, Question } from "@shared/schema";

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
  contestant?: Contestant;
}

export default function AddContestantForm({ onSubmit, onCancel, contestant }: AddContestantFormProps) {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<(InsertQuestion & { id?: string })[]>([]);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [randomizeOptions, setRandomizeOptions] = useState(false);
  const [enableTimer, setEnableTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(1);
  const [editingQuestion, setEditingQuestion] = useState<{ question: Question | (InsertQuestion & { id?: string }); id: string } | null>(null);

  useEffect(() => {
    if (contestant) {
      setName(contestant.name);
      setQuestions(contestant.questions);
      setRandomizeQuestions(contestant.randomizeQuestions);
      setRandomizeOptions(contestant.randomizeOptions);
      setEnableTimer(contestant.enableTimer);
      setTimerMinutes(contestant.timerMinutes);
    }
  }, [contestant]);

  const handleAddQuestion = (question: InsertQuestion) => {
    const questionWithId = {
      ...question,
      id: `temp-${Date.now()}-${Math.random()}`,
    };
    setQuestions([...questions, questionWithId]);
  };

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    const questionId = editingQuestion?.id;
    if (!questionId) return;

    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...updatedQuestion,
          id: questionId,
        };
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
    setEditingQuestion(null);
  };

  const handleRemoveQuestion = (index: number) => {
    const questionToRemove = questions[index];
    const questionId = questionToRemove.id;
    
    setQuestions(questions.filter((_, i) => i !== index));
    
    if (questionId && editingQuestion?.id === questionId) {
      setEditingQuestion(null);
    }
  };

  const handleEditQuestion = (question: InsertQuestion & { id?: string }) => {
    if (!question.id) return;
    setEditingQuestion({ question, id: question.id });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
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
          <CardTitle className="text-2xl">{contestant ? "تعديل المتسابق" : "إضافة متسابق جديد"}</CardTitle>
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
                      className={cn(
                        "flex items-start gap-2 p-3 bg-muted/30 rounded-md transition-colors",
                        editingQuestion?.id === q.id && "ring-2 ring-primary bg-primary/5"
                      )}
                      data-testid={`question-item-${index}`}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{q.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          الإجابة الصحيحة: {q.options[q.correctAnswer]}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditQuestion(q)}
                          data-testid={`button-edit-question-${index}`}
                          title="تعديل السؤال"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveQuestion(index)}
                          data-testid={`button-remove-question-${index}`}
                          title="حذف السؤال"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AddQuestionForm 
        onAddQuestion={handleAddQuestion}
        onUpdateQuestion={handleUpdateQuestion}
        editingQuestion={editingQuestion}
        onCancelEdit={handleCancelEdit}
      />

      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!name.trim() || questions.length === 0}
          className="flex-1"
          data-testid="button-save-contestant"
        >
          {contestant ? <Edit className="ml-2 h-4 w-4" /> : <Plus className="ml-2 h-4 w-4" />}
          {contestant ? "حفظ التعديلات" : "حفظ المتسابق"}
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
