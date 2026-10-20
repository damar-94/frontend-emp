import { useState } from "react";
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

import type { EventItem } from "./EditEventDialog";

interface Guest {
  id: number;
  name: string;
  ticketQuantity: number;
  totalPaid: number;
}

interface EventGuestList {
  eventId: number;
  guests: Guest[];
}

interface GuestListDialogProps {
  event: EventItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const guestsPerPage = 5;

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const initialGuestLists: EventGuestList[] = [
  {
    eventId: 1,
    guests: [
      { id: 1, name: "Andi Pratama", ticketQuantity: 2, totalPaid: 500000 },
      { id: 2, name: "Siti Rahma", ticketQuantity: 1, totalPaid: 250000 },
      { id: 3, name: "Budi Santoso", ticketQuantity: 3, totalPaid: 750000 },
      { id: 4, name: "Dewi Anggraini", ticketQuantity: 2, totalPaid: 500000 },
      { id: 5, name: "Rizky Saputra", ticketQuantity: 1, totalPaid: 250000 },
      { id: 6, name: "Nadia Putri", ticketQuantity: 2, totalPaid: 500000 },
      { id: 7, name: "Fajar Ramadhan", ticketQuantity: 1, totalPaid: 250000 },
    ],
  },
  {
    eventId: 2,
    guests: [
      { id: 8, name: "Agus Setiawan", ticketQuantity: 1, totalPaid: 300000 },
      { id: 9, name: "Maya Lestari", ticketQuantity: 2, totalPaid: 600000 },
      { id: 10, name: "Dimas Putra", ticketQuantity: 1, totalPaid: 300000 },
    ],
  },
  {
    eventId: 3,
    guests: [
      { id: 11, name: "Rina Amelia", ticketQuantity: 1, totalPaid: 150000 },
      { id: 12, name: "Yoga Pratama", ticketQuantity: 2, totalPaid: 300000 },
    ],
  },
];

export default function GuestListDialog({
  event,
  open,
  onOpenChange,
}: GuestListDialogProps) {
  const [guestSearch, setGuestSearch] = useState("");
  const [guestPage, setGuestPage] = useState(1);

  const selectedGuests =
    initialGuestLists.find((guestList) => guestList.eventId === event?.id)
      ?.guests ?? [];

  const filteredGuests = selectedGuests.filter((guest) =>
    guest.name.toLowerCase().includes(guestSearch.toLowerCase()),
  );

  const totalGuestPages = Math.ceil(filteredGuests.length / guestsPerPage);

  const paginatedGuests = filteredGuests.slice(
    (guestPage - 1) * guestsPerPage,
    guestPage * guestsPerPage,
  );

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
            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-pink-500"
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
              {paginatedGuests.map((guest) => (
                <tr key={guest.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{guest.name}</td>
                  <td className="px-4 py-3 text-center">
                    {guest.ticketQuantity}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {currencyFormatter.format(guest.totalPaid)}
                  </td>
                </tr>
              ))}

              {filteredGuests.length === 0 && (
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredGuests.length === 0
              ? "No participants"
              : `Showing ${(guestPage - 1) * guestsPerPage + 1}–${Math.min(
                  guestPage * guestsPerPage,
                  filteredGuests.length,
                )} of ${filteredGuests.length} participants`}
          </p>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={guestPage <= 1}
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
              disabled={totalGuestPages === 0 || guestPage >= totalGuestPages}
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
