import { CalendarDays, MessageSquare, Pencil, Star } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface EventToReview {
  attendanceId: number;
  eventId: number;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  attended: boolean;
}

interface CustomerReviewItem {
  id: number;
  userId: number;
  attendanceId: number;
  eventName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

const initialEvents: EventToReview[] = [
  {
    attendanceId: 1,
    eventId: 10,
    eventName: "Jakarta Music Festival 2026",
    eventLocation: "Jakarta",
    eventDate: "2026-10-10T10:00:00.000Z",
    attended: true,
  },
  {
    attendanceId: 2,
    eventId: 11,
    eventName: "Tech Conference Indonesia",
    eventLocation: "Jakarta Convention Center",
    eventDate: "2026-10-12T10:00:00.000Z",
    attended: true,
  },
];

const initialReviews: CustomerReviewItem[] = [
  {
    id: 1,
    userId: 5,
    attendanceId: 3,
    eventName: "Creative Design Workshop",
    rating: 5,
    comment:
      "The event was well organized and the speakers were very informative.",
    createdAt: "2026-10-08T10:00:00.000Z",
    updatedAt: "2026-10-08T10:00:00.000Z",
  },
];

export function CustomerReview() {
  const [events, setEvents] = useState(initialEvents);
  const [reviews, setReviews] = useState(initialReviews);

  const [selectedEvent, setSelectedEvent] = useState<EventToReview | null>(
    null,
  );

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [editingReview, setEditingReview] = useState<CustomerReviewItem | null>(
    null,
  );

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  const reviewedAttendanceIds = new Set(
    reviews.map((review) => review.attendanceId),
  );

  const eventsToReview = events.filter(
    (event) => event.attended && !reviewedAttendanceIds.has(event.attendanceId),
  );

  const openReviewForm = (event: EventToReview) => {
    setSelectedEvent(event);
    setEditingReview(null);
    setRating(0);
    setHoverRating(0);
    setComment("");
  };

  const openEditForm = (review: CustomerReviewItem) => {
    const event = events.find(
      (item) => item.attendanceId === review.attendanceId,
    );

    setEditingReview(review);
    setSelectedEvent(
      event ?? {
        attendanceId: review.attendanceId,
        eventId: 0,
        eventName: review.eventName,
        eventLocation: "",
        eventDate: review.createdAt,
        attended: true,
      },
    );

    setRating(review.rating);
    setComment(review.comment);
    setHoverRating(0);
  };

  const closeForm = () => {
    setSelectedEvent(null);
    setEditingReview(null);
    setRating(0);
    setHoverRating(0);
    setComment("");
  };

  const handleSubmitReview = () => {
    if (!selectedEvent || rating < 1 || !comment.trim()) {
      return;
    }

    const now = new Date().toISOString();

    if (editingReview) {
      setReviews((current) =>
        current.map((review) =>
          review.id === editingReview.id
            ? {
                ...review,
                rating,
                comment: comment.trim(),
                updatedAt: now,
              }
            : review,
        ),
      );
    } else {
      setReviews((current) => [
        {
          id: Date.now(),
          userId: 5,
          attendanceId: selectedEvent.attendanceId,
          eventName: selectedEvent.eventName,
          rating,
          comment: comment.trim(),
          createdAt: now,
          updatedAt: now,
        },
        ...current,
      ]);
    }

    closeForm();
  };

  const renderStars = (value: number, interactive = false) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onFocus={() => interactive && setHoverRating(star)}
            onBlur={() => interactive && setHoverRating(0)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            className={
              interactive
                ? "rounded-sm transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-pink-500"
                : "cursor-default"
            }
          >
            <Star
              className={`h-5 w-5 ${
                active ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          My Reviews
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Write reviews for events you attended and manage your submitted
          reviews.
        </p>
      </div>

      {/* Events to Review */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Events to Review
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Share your experience with events you attended.
          </p>
        </div>

        {eventsToReview.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {eventsToReview.map((event) => (
              <div
                key={event.attendanceId}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-50">
                    <CalendarDays className="h-6 w-6 text-pink-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {event.eventName}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {event.eventLocation}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Attended on {formatDate(event.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <Button
                    className="w-full bg-pink-600 text-white hover:bg-pink-700"
                    onClick={() => openReviewForm(event)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Write a Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-3 font-medium text-gray-900">
              No events to review
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Events you have attended and not reviewed will appear here.
            </p>
          </div>
        )}
      </section>

      {/* My Submitted Reviews */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            My Submitted Reviews
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and edit reviews you have submitted.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {reviews.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-5 transition-colors hover:bg-gray-50 sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {review.eventName}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        {renderStars(review.rating)}

                        <span className="text-xs text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {review.comment}
                      </p>

                      {review.updatedAt !== review.createdAt && (
                        <p className="mt-2 text-xs text-gray-400">
                          Edited on {formatDate(review.updatedAt)}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 gap-2 self-start"
                      onClick={() => openEditForm(review)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-3 font-medium text-gray-900">
                No reviews submitted yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Your submitted reviews will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Review Form Dialog */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingReview ? "Edit Review" : "Write a Review"}
            </DialogTitle>

            <DialogDescription>
              Share your feedback about this event.
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-5">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-900">
                  {selectedEvent.eventName}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedEvent.eventLocation}
                </p>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  Your Rating
                </label>

                <div className="flex items-center gap-3">
                  {renderStars(hoverRating || rating, true)}

                  <span className="text-sm text-gray-500">
                    {rating > 0 ? `${rating} / 5` : "Select a rating"}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Your Comment
                </label>

                <Textarea
                  id="review-comment"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Tell us about your experience..."
                  rows={5}
                />

                <p className="mt-2 text-xs text-gray-500">
                  {comment.trim().length} characters
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeForm}>
                  Cancel
                </Button>

                <Button
                  className="bg-pink-600 text-white hover:bg-pink-700"
                  disabled={rating < 1 || !comment.trim()}
                  onClick={handleSubmitReview}
                >
                  {editingReview ? "Save Changes" : "Submit Review"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
