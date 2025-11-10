import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Contestant } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { importFromShareCode } from "@/lib/shareCode";

interface ImportDialogProps {
  onClose: () => void;
  onImportSuccess: (contestant: Contestant) => void;
}

export default function ImportDialog({ onClose, onImportSuccess }: ImportDialogProps) {
  const [code, setCode] = useState("");
  const { toast } = useToast();

  const handleImport = () => {
    if (!code.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال رابط المشاركة",
        variant: "destructive",
      });
      return;
    }

    try {
      const contestant = importFromShareCode(code);
      
      if (!contestant) {
        toast({
          title: "خطأ",
          description: "رابط المشاركة غير صحيح",
          variant: "destructive",
        });
        return;
      }
      
      onImportSuccess(contestant);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في استيراد النموذج",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>استيراد نموذج</DialogTitle>
          <DialogDescription>
            الصق رابط المشاركة لاستيراد نموذج الأسئلة
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="share-code">رابط المشاركة</Label>
            <Input
              id="share-code"
              placeholder="الصق الرابط هنا"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-left text-sm font-mono"
              dir="ltr"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleImport} className="flex-1">
              استيراد
            </Button>
            <Button onClick={onClose} variant="outline">
              إلغاء
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            سيتم حفظ النموذج المستورد على جهازك
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
