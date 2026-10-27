import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFindEventGuestList } from "@/hooks/API/dashboard/organizerDashboard/useFindEventGuestList";
import { useDebounceValue } from "usehooks-ts";

interface GuestListEvent {
  id: number;
  name: string;
}

interface GuestListDialogProps {
  event: GuestListEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const guestsPerPage = 5;

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function GuestListDialog({
  event,
  open,
  onOpenChange,
}: GuestListDialogProps) {
  const [guestSearch, setGuestSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(guestSearch, 700);
  const [guestPage, setGuestPage] = useState(1);

  const eventId = event?.id ?? 0;

  const { data, isPending, isError, refetch } = useFindEventGuestList({
    eventId,
    page: guestPage,
    take: guestsPerPage,
    search: debouncedSearch,
    enabled: open && eventId > 0,
  });

  const guests = data?.data ?? [];
  const totalGuests = data?.meta.total ?? 0;
  const totalGuestPages = Math.ceil(totalGuests / guestsPerPage);

  useEffect(() => {
    if (!open) {
      setGuestSearch("");
      setGuestPage(1);
    }
  }, [open, event?.id]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setGuestSearch("");
      setGuestPage(1);
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Guest List</DialogTitle>
          <DialogDescription>
            Participants registered for{" "}
            <span className="font-medium text-foreground">{event?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={guestSearch}
            onChange={(e) => {
              setGuestSearch(e.target.value);
              setGuestPage(1);
            }}
            placeholder="Search participant name..."
            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#f4917b]"
          />
        </div>

        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b text-left">
                <th className="px-4 py-3 font-medium">Participant</th>
                <th className="px-4 py-3 text-center font-medium">
                  Ticket Quantity
                </th>
                <th className="px-4 py-3 text-right font-medium">Total Paid</th>
              </tr>
            </thead>

            <tbody>
              {isPending && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Loading guest list...
                  </td>
                </tr>
              )}

              {!isPending && isError && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-destructive"
                  >
                    Failed to load guest list.
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                      >
                        Try again
                      </Button>
                    </div>
                  </td>
                </tr>
              )}

              {!isPending &&
                !isError &&
                guests.map((guest) => (
                  <tr key={guest.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{guest.name}</td>
                    <td className="px-4 py-3 text-center">
                      {guest.ticketQuantity}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {currencyFormatter.format(guest.totalAmount)}
                    </td>
                  </tr>
                ))}

              {!isPending && !isError && guests.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No participants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={guestPage <= 1 || isPending}
              onClick={() => setGuestPage((page) => page - 1)}
            >
              Previous
            </Button>

            <span className="text-sm tabular-nums">
              {totalGuestPages === 0 ? 0 : guestPage} / {totalGuestPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={
                totalGuestPages === 0 ||
                guestPage >= totalGuestPages ||
                isPending
              }
              onClick={() => setGuestPage((page) => page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
