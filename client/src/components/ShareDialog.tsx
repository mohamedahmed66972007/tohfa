import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import type { Contestant } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { createShareCode } from "@/lib/shareCode";

interface ShareDialogProps {
  contestant: Contestant;
  onClose: () => void;
}

export default function ShareDialog({ contestant, onClose }: ShareDialogProps) {
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateCode = () => {
    try {
      const code = createShareCode(contestant);
      setShareCode(code);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في توليد كود المشاركة",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    if (shareCode) {
      navigator.clipboard.writeText(shareCode);
      setCopied(true);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط المشاركة",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>مشاركة نموذج: {contestant.name}</DialogTitle>
          <DialogDescription>
            قم بتوليد رابط مشاركة لإرساله للآخرين حتى يتمكنوا من استيراد هذا النموذج
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {!shareCode ? (
            <Button onClick={generateCode}>
              توليد رابط المشاركة
            </Button>
          ) : (
            <>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg max-h-32 overflow-auto">
                  <p className="text-xs font-mono break-all text-left" dir="ltr">
                    {shareCode}
                  </p>
                </div>
                <Button onClick={copyToClipboard} variant="outline" className="w-full">
                  {copied ? (
                    <>
                      <Check className="ml-2 h-4 w-4" />
                      تم نسخ الرابط
                    </>
                  ) : (
                    <>
                      <Copy className="ml-2 h-4 w-4" />
                      نسخ الرابط
                    </>
                  )}
                </Button>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">
                    انسخ هذا الرابط واستخدمه على أي جهاز آخر
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    الرابط يحتوي على جميع بيانات النموذج ويعمل على أي جهاز بدون انتهاء صلاحية
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
