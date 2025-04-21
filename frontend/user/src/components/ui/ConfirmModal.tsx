import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { ReactNode, useState } from "react";

  interface ConfirmModalProps {
    trigger: ReactNode;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    loading?: boolean;
  }

  export default function ConfirmModal({
    trigger,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Yes, confirm",
    cancelText = "Cancel",
    onConfirm,
    loading = false,
  }: ConfirmModalProps) {
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
      onConfirm();
      setOpen(false);
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{description}</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
              {cancelText}
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
              {confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
