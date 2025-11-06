"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ManualTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDiaglog = ({
  open,
  onOpenChange,
}: ManualTriggerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>
            Configure setting for manual trigger node.
          </DialogDescription>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Used to manually execute a workflow, no configuration available.
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
