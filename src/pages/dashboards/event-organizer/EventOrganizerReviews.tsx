import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  RefreshCw,
  Search,
  Star,
} from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useOrganizerReviewsQuery } from "@/hooks/useReviewQueries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaginationMeta } from "@/types/pagination.types";

export interface Review {
  id: number;
  customerName: string;
  eventName: string;
  rating: number;
  comment: string;
  reviewDate: string;
}

const PAGE_TAKE = 5;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function EventOrganizerReviews() {
  // 1. Client UI state (active page & filter inputs)
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState("ALL");

  const debouncedSearch = useDebounce(search, 400);

  // 2. Fetch paginated & filtered reviews via TanStack Query
  const { data, isLoading, isFetching, isPlaceholderData, error, refetch } =
    useOrganizerReviewsQuery({
      page,
      take: PAGE_TAKE,
      search: debouncedSearch,
      event: eventFilter,
      rating: ratingFilter,
    });

  const reviews = data?.reviews ?? [];
  const organizerEvents = data?.events ?? [];
  const averageRating = data?.averageRating ?? 0;
  const totalReviews = data?.totalReviews ?? 0;

  // Matches all 6 required properties of PaginationMeta
  const meta: PaginationMeta = data?.meta ?? {
    page: 1,
    take: PAGE_TAKE,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const errorMsg =
    (error as any)?.response?.data?.message ||
    (error as Error)?.message ||
    null;

  // Handlers that reset to page 1 when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleEventFilterChange = (value: string | null) => {
    setEventFilter(value ?? "ALL");
    setPage(1);
  };

  const handleRatingFilterChange = (value: string | null) => {
    setRatingFilter(value ?? "ALL");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Content</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View customer feedback and ratings for your events (sorted by
            newest).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards: Average Rating (All Reviews) & Total Reviews */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Average Rating
            </p>
            <Star className="size-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
            <span className="text-sm text-muted-foreground">/ 5.0</span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={`size-4 ${
                  index < Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Reviews
            </p>
            <MessageSquare className="size-5 text-[#f4917b]" />
          </div>
          <p className="mt-3 text-2xl font-bold">{totalReviews}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Customer reviews across your events
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Review List */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="space-y-4 border-b p-5">
          <div>
            <h2 className="text-lg font-semibold">Customer Reviews</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and filter feedback from your event attendees.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customer, event, or comment..."
                value={search}
                onChange={handleSearchChange}
                className="pl-9 focus:outline-none focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] text-[#3d312e] focus-visible:ring-2"
              />
            </div>

            {/* Filter by Event */}
            <Select value={eventFilter} onValueChange={handleEventFilterChange}>
              <SelectTrigger className="w-full lg:w-64 focus:border-[#f4917b] focus:border-3">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Events</SelectItem>
                {organizerEvents.map((eventName) => (
                  <SelectItem key={eventName} value={eventName}>
                    {eventName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by Star Rating */}
            <Select
              value={ratingFilter}
              onValueChange={handleRatingFilterChange}
            >
              <SelectTrigger className="w-full lg:w-44 focus:border-[#f4917b] focus:border-3">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reviews Feed */}
        <div
          className={`divide-y transition-opacity duration-200 ${
            isPlaceholderData ? "opacity-60" : "opacity-100"
          }`}
        >
          {isLoading ? (
            <div className="px-5 py-12 text-center text-sm text-muted-foreground">
              Loading reviews...
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <article
                key={review.id}
                className="p-5 transition-colors hover:bg-muted/20"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">{review.customerName}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {review.eventName}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`size-4 ${
                          index < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm font-semibold">
                      {review.rating}.0
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-700">
                  {review.comment}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-4" />
                  <span>{formatDate(review.reviewDate)}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <MessageSquare className="mx-auto size-8 text-muted-foreground/50" />
              <p className="mt-3 font-medium">No reviews found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* Footer & Backend Pagination Controls */}
        <div className="flex flex-col items-center justify-between gap-4 border-t bg-gray-50/50 px-5 py-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Showing page{" "}
            <span className="font-semibold text-foreground">{meta.page}</span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {meta.totalPages}
            </span>{" "}
            ({meta.total} matching reviews)
          </p>

          {meta.totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={!meta.hasPrevPage || isPlaceholderData}
                className="h-8 gap-1 px-2.5 text-xs"
              >
                <ChevronLeft className="size-3.5" />
                Prev
              </Button>

              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    disabled={isPlaceholderData}
                    className={`h-8 w-8 rounded-md text-xs font-semibold transition ${
                      meta.page === pageNum
                        ? "bg-gray-900 text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((prev) => Math.min(meta.totalPages, prev + 1))
                }
                disabled={!meta.hasNextPage || isPlaceholderData}
                className="h-8 gap-1 px-2.5 text-xs"
              >
                Next
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
