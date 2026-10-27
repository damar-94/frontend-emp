import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useDeleteEvent } from "@/hooks/API/dashboard/organizerDashboard/useDeleteEvent";

interface DeleteEventDialogProps {
  event: { id: number; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteEventDialog({
  event,
  open,
  onOpenChange,
}: DeleteEventDialogProps) {
  const deleteEvent = useDeleteEvent(event?.id ?? 0);

  const handleConfirm = () => {
    if (!event) return;

    deleteEvent.mutate(undefined, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (deleteEvent.isPending) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {event?.name ?? "this event"}
            </span>
            ? This event will be hidden from your event list.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!event || deleteEvent.isPending}
          >
            {deleteEvent.isPending ? "Deleting..." : "Delete Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
