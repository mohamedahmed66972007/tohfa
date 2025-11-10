import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Edit, Trash2, Share2 } from "lucide-react";

interface ContestantCardProps {
  id: string;
  name: string;
  questionCount: number;
  onStart: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

export default function ContestantCard({
  id,
  name,
  questionCount,
  onStart,
  onEdit,
  onDelete,
  onShare,
}: ContestantCardProps) {
  return (
    <Card data-testid={`card-contestant-${id}`} className="hover-elevate">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" data-testid={`badge-question-count-${id}`}>
          {questionCount} سؤال
        </Badge>
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap">
        <Button
          onClick={() => onStart(id)}
          disabled={questionCount === 0}
          data-testid={`button-start-${id}`}
          className="flex-1"
        >
          <Play className="ml-2 h-4 w-4" />
          بدء المسابقة
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => onShare(id)}
          disabled={questionCount === 0}
          data-testid={`button-share-${id}`}
          title="توليد كود مشاركة"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => onEdit(id)}
          data-testid={`button-edit-${id}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => onDelete(id)}
          data-testid={`button-delete-${id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
