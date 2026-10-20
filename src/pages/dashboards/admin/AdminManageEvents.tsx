import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type EventItem = {
  id: number;
  name: string;
  organizer: string;
  category: string;
  status: "COMPLETED" | "UPCOMING";
};

const initialEvents: EventItem[] = [
  {
    id: 1,
    name: "Jakarta Music Festival",
    organizer: "Soundwave Organizer",
    category: "Music",
    status: "COMPLETED",
  },
  {
    id: 2,
    name: "Tech Innovation Conference",
    organizer: "Tech Community",
    category: "Technology",
    status: "COMPLETED",
  },
  {
    id: 3,
    name: "Creative Workshop",
    organizer: "Creative Space",
    category: "Workshop",
    status: "UPCOMING",
  },
];

export default function AdminManageEvents() {
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [eventToDelete, setEventToDelete] = useState<EventItem | null>(null);

  const categories = [...new Set(events.map((event) => event.category))];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.organizer.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || event.category === categoryFilter;

    const matchesStatus =
      statusFilter === "ALL" || event.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = () => {
    if (!eventToDelete) return;

    setEvents((current) =>
      current.filter((event) => event.id !== eventToDelete.id),
    );

    setEventToDelete(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Manage Events
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Monitor event statistics and manage platform events.
        </p>
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Total Events</p>
          <p className="mt-2 text-2xl font-bold">{events.length}</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">COMPLETED</p>
          <p className="mt-2 text-2xl font-bold">
            {events.filter((event) => event.status === "COMPLETED").length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">UPCOMING</p>
          <p className="mt-2 text-2xl font-bold">
            {events.filter((event) => event.status === "UPCOMING").length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search event or organizer..."
            className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm"
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="ALL">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="UPCOMING">Upcoming</option>
          </select>
        </div>

        {/* Events Table */}
        <div className="mt-5 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Organizer</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{event.name}</td>

                  <td className="px-4 py-3">{event.organizer}</td>

                  <td className="px-4 py-3">{event.category}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        event.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        title="View event"
                        aria-label={`View ${event.name}`}
                        onClick={() => setSelectedEvent(event)}
                        className="rounded-md border p-2 hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title="Delete event"
                        aria-label={`Delete ${event.name}`}
                        onClick={() => setEventToDelete(event)}
                        className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEvents.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-gray-500">
          Showing {filteredEvents.length} of {events.length} events
        </p>
      </div>

      {/* Event Details Dialog */}
      <Dialog
        open={selectedEvent !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.name}</DialogTitle>
            <DialogDescription>Event details</DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-gray-500">Organizer: </span>
                {selectedEvent.organizer}
              </p>

              <p>
                <span className="text-gray-500">Category: </span>
                {selectedEvent.category}
              </p>

              <p>
                <span className="text-gray-500">Status: </span>
                {selectedEvent.status}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={eventToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setEventToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                {eventToDelete?.name}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEventToDelete(null)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
