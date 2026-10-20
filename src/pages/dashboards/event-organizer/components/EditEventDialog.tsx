import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface EventItem {
  id: number;
  name: string;
  date: string;
  location: string;
  image: string;
  ticketsSold: number;
  totalTickets: number;
  startDate: string;
  endDate: string;
}

interface EditEventDialogProps {
  event: EventItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedEvent: EventItem) => void;
}

interface EditEventForm {
  name: string;
  location: string;
  image: string;
  startDate: string;
  endDate: string;
}

function toDateTimeInputValue(value: string): string {
  return value.slice(0, 16);
}

export default function EditEventDialog({
  event,
  open,
  onOpenChange,
  onSave,
}: EditEventDialogProps) {
  const [form, setForm] = useState<EditEventForm>({
    name: "",
    location: "",
    image: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!event) return;

    setForm({
      name: event.name,
      location: event.location,
      image: event.image,
      startDate: toDateTimeInputValue(event.startDate),
      endDate: toDateTimeInputValue(event.endDate),
    });
  }, [event]);

  const handleChange = (field: keyof EditEventForm, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!event) return;

    if (form.endDate < form.startDate) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    const updatedEvent: EventItem = {
      ...event,
      ...form,
      startDate: form.startDate,
      endDate: form.endDate,
      date: new Date(form.startDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };

    onSave(updatedEvent);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the event information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="event-name" className="text-sm font-medium">
              Event Name
            </label>
            <Input
              id="event-name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="event-location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="event-location"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="event-image" className="text-sm font-medium">
              Image URL
            </label>
            <Input
              id="event-image"
              type="url"
              value={form.image}
              onChange={(e) => handleChange("image", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="event-start-date" className="text-sm font-medium">
              Start Date
            </label>
            <Input
              id="event-start-date"
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="event-end-date" className="text-sm font-medium">
              End Date
            </label>
            <Input
              id="event-end-date"
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              min={form.startDate}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
