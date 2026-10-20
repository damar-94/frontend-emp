import { CalendarDays, MessageSquare, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Review {
  id: number;
  customerName: string;
  eventName: string;
  rating: number;
  comment: string;
  reviewDate: string;
}

const initialReviews: Review[] = [
  {
    id: 1,
    customerName: "Andi Pratama",
    eventName: "Jakarta Music Festival",
    rating: 5,
    comment:
      "Acaranya sangat seru! Penampilan musisi bagus dan pengaturan panggungnya sangat baik. Saya pasti akan datang lagi tahun depan.",
    reviewDate: "2026-10-18",
  },
  {
    id: 2,
    customerName: "Siti Rahma",
    eventName: "Tech Conference 2026",
    rating: 4,
    comment:
      "Materi konferensinya menarik dan pembicaranya kompeten. Akan lebih baik jika waktu istirahatnya sedikit lebih panjang.",
    reviewDate: "2026-10-17",
  },
  {
    id: 3,
    customerName: "Budi Santoso",
    eventName: "Jakarta Music Festival",
    rating: 3,
    comment:
      "Penampilan artisnya bagus, tetapi antrean masuk cukup panjang dan area makanan terlalu ramai.",
    reviewDate: "2026-10-16",
  },
  {
    id: 4,
    customerName: "Dewi Anggraini",
    eventName: "Creative Design Workshop",
    rating: 2,
    comment:
      "Materi workshop cukup menarik, tetapi pelaksanaannya kurang terorganisasi dan acara dimulai terlambat.",
    reviewDate: "2026-10-15",
  },
  {
    id: 5,
    customerName: "Rizky Maulana",
    eventName: "Tech Conference 2026",
    rating: 5,
    comment:
      "Pengalaman yang sangat bermanfaat. Penjelasan pembicara mudah dipahami dan networking session membantu saya bertemu banyak orang baru.",
    reviewDate: "2026-10-14",
  },
  {
    id: 6,
    customerName: "Nadia Putri",
    eventName: "Creative Design Workshop",
    rating: 4,
    comment:
      "Workshop memberikan banyak insight baru. Mentor sangat membantu dan suasana belajarnya nyaman.",
    reviewDate: "2026-10-13",
  },
];

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function EventOrganizerReviews() {
  const [reviews] = useState<Review[]>(initialReviews);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState("ALL");

  const eventOptions = useMemo(
    () => [...new Set(reviews.map((review) => review.eventName))],
    [reviews],
  );

  const filteredReviews = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesSearch =
        review.customerName.toLowerCase().includes(keyword) ||
        review.eventName.toLowerCase().includes(keyword);

      const matchesEvent =
        eventFilter === "ALL" || review.eventName === eventFilter;

      const matchesRating =
        ratingFilter === "ALL" || review.rating === Number(ratingFilter);

      return matchesSearch && matchesEvent && matchesRating;
    });
  }, [reviews, search, eventFilter, ratingFilter]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Content</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View customer feedback and ratings for your events.
        </p>
      </div>

      {/* Summary Cards */}
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
            <MessageSquare className="size-5 text-pink-600" />
          </div>

          <p className="mt-3 text-2xl font-bold">{reviews.length}</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Customer reviews across your events
          </p>
        </div>
      </div>

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
                placeholder="Search customer or event..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={eventFilter}
              onValueChange={(value) => setEventFilter(value ?? "ALL")}
            >
              <SelectTrigger className="w-full lg:w-64">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Events</SelectItem>

                {eventOptions.map((eventName) => (
                  <SelectItem key={eventName} value={eventName}>
                    {eventName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={ratingFilter}
              onValueChange={(value) => setRatingFilter(value ?? "ALL")}
            >
              <SelectTrigger className="w-full lg:w-44">
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

        {/* Reviews */}
        <div className="divide-y">
          {filteredReviews.map((review) => (
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
          ))}

          {filteredReviews.length === 0 && (
            <div className="px-5 py-12 text-center">
              <MessageSquare className="mx-auto size-8 text-muted-foreground/50" />

              <p className="mt-3 font-medium">No reviews found</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>

        <div className="border-t px-5 py-4 text-sm text-muted-foreground">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </div>
      </div>
    </div>
  );
}
