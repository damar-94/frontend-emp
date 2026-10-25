import { CalendarDays, MapPin, Plus, Search, Ticket } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { useFindMyEvents } from "@/hooks/API/dashboard/organizerDashboard/useFindMyEvents";

import type { FindOrganizerEvents } from "@/types/dashboard";

import DeleteEventDialog from "./components/DeleteEventDialog";
import EditEventDialog from "./components/EditEventDialog";
import GuestListDialog from "./components/GuestListDialog";
import VoucherEventDialog from "./components/VoucherEventDialog";
import { useCategories } from "@/hooks/API/category/useGetCategories";

type OrganizerEvent = FindOrganizerEvents["data"][number];

interface EventItem {
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

function getEventStatus(startDate: string, endDate: string) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "UPCOMING";
  if (now > end) return "COMPLETED";
  return "ONGOING";
}

export default function EventOrganizerMyEvents() {
  const { data, isPending, isError, refetch } = useFindMyEvents();
  const { data: categories = [] } = useCategories();

  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedEventForEdit, setSelectedEventForEdit] =
    useState<OrganizerEvent | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isGuestListOpen, setIsGuestListOpen] = useState(false);
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false);

  const organizerEvents = data?.data ?? [];

  const events: EventItem[] = organizerEvents.map((event) => ({
    id: event.id,
    name: event.name,
    date: new Date(event.startDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    location: event.location,
    image: event.thumbnail,
    ticketsSold: event.ticketSold,
    totalTickets: event.totalSeat,
    startDate: event.startDate,
    endDate: event.endDate,
  }));

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create and manage your events in one place.
          </p>
        </div>

        <Link
          to="/event-creation"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-pink-600 px-4 text-sm font-medium text-white transition-colors hover:bg-pink-700"
        >
          <Plus className="h-4 w-4" />
          Create Event
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search events by name..."
          className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {isPending ? (
        <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">
          Loading events...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">Failed to load events</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => {
              const status = getEventStatus(event.startDate, event.endDate);
              const soldPercentage =
                event.totalTickets > 0
                  ? Math.min(
                      (event.ticketsSold / event.totalTickets) * 100,
                      100,
                    )
                  : 0;

              return (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-xl border bg-card shadow-sm"
                >
                  <img
                    src={event.image}
                    alt={event.name}
                    className="h-48 w-full object-cover"
                  />

                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-semibold leading-6">{event.name}</h2>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                          status === "UPCOMING"
                            ? "bg-blue-100 text-blue-700"
                            : status === "ONGOING"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        {event.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 shrink-0" />
                        {event.ticketsSold.toLocaleString("id-ID")} /{" "}
                        {event.totalTickets.toLocaleString("id-ID")} tickets
                        sold
                      </p>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-pink-600"
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t pt-4">
                      <button
                        type="button"
                        className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
                        onClick={() => {
                          const originalEvent = organizerEvents.find(
                            (item) => item.id === event.id,
                          );

                          if (originalEvent) {
                            setSelectedEventForEdit(originalEvent);
                            setIsEditDialogOpen(true);
                          }
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsVoucherDialogOpen(true);
                        }}
                      >
                        Vouchers
                      </button>

                      <button
                        type="button"
                        className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsGuestListOpen(true);
                        }}
                      >
                        Guest List
                      </button>

                      <button
                        type="button"
                        className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="font-medium">
                {events.length === 0 ? "No events yet" : "No events found"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {events.length === 0
                  ? "Create an event to see it here."
                  : "Try a different event name."}
              </p>
            </div>
          )}
        </>
      )}

      <DeleteEventDialog
        event={selectedEvent}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedEvent(null);
        }}
        onConfirm={(eventId) => {
          // Penghapusan dari database belum dihubungkan.
          console.log("Delete event:", eventId);
          setSelectedEvent(null);
          setIsDeleteDialogOpen(false);
        }}
      />

      <EditEventDialog
        event={selectedEventForEdit}
        categories={categories}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedEventForEdit(null);
        }}
      />

      <GuestListDialog
        event={selectedEvent}
        open={isGuestListOpen}
        onOpenChange={(open) => {
          setIsGuestListOpen(open);
          if (!open) setSelectedEvent(null);
        }}
      />

      <VoucherEventDialog
        event={selectedEvent}
        open={isVoucherDialogOpen}
        onOpenChange={(open) => {
          setIsVoucherDialogOpen(open);
          if (!open) setSelectedEvent(null);
        }}
      />
    </div>
  );
}
