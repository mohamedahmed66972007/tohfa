import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import type { InsertQuestion } from "@shared/schema";

interface AddQuestionFormProps {
  onAddQuestion: (question: InsertQuestion) => void;
}

export default function AddQuestionForm({ onAddQuestion }: AddQuestionFormProps) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionText.trim()) return;
    if (options.some(opt => !opt.trim())) return;

    onAddQuestion({
      text: questionText,
      options,
      correctAnswer,
    });

    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const optionLabels = ["أ", "ب", "ج", "د"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">إضافة سؤال جديد</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question-text">نص السؤال</Label>
            <Textarea
              id="question-text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="أدخل السؤال هنا..."
              rows={3}
              data-testid="input-question-text"
            />
          </div>

          <div className="space-y-4">
            <Label>الخيارات</Label>
            <RadioGroup value={String(correctAnswer)} onValueChange={(v) => setCorrectAnswer(Number(v))}>
              {options.map((option, index) => (
                <div key={index} className="flex items-start gap-3">
                  <RadioGroupItem
                    value={String(index)}
                    id={`option-${index}`}
                    className="mt-3"
                    data-testid={`radio-correct-${index}`}
                  />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={`input-option-${index}`} className="text-sm text-muted-foreground">
                      الخيار {optionLabels[index]} {index === correctAnswer && "(الإجابة الصحيحة)"}
                    </Label>
                    <Input
                      id={`input-option-${index}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`الخيار ${optionLabels[index]}`}
                      data-testid={`input-option-${index}`}
                    />
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!questionText.trim() || options.some(opt => !opt.trim())}
            data-testid="button-add-question"
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة السؤال
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
