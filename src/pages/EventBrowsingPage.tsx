import React, { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  MapPin,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCategoriesQuery, useEventsQuery } from "@/hooks/useEventQueries";


const PAGE_LIMIT = 8;

export const EventBrowsingPage: React.FC = () => {
  // Hanya menyimpan Client UI State (input filter & halaman aktif)
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const debouncedSearch = useDebounce(search, 350);

  // 1. Fetch Categories dengan TanStack Query
  const { data: categories = [] } = useCategoriesQuery();

  // 2. Fetch Paginated Events dari Backend dengan TanStack Query
  const {
    data: eventsResponse,
    isLoading,
    isPlaceholderData,
  } = useEventsQuery({
    search: debouncedSearch,
    categoryId,
    location,
    page,
    limit: PAGE_LIMIT,
  });

  const events = eventsResponse?.data ?? [];
  const meta = eventsResponse?.meta ?? {
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    locations: [],
  };

  const locations = ["All Locations", ...(meta.locations ?? [])];

  const formatIDR = (val: number) => {
    if (val === 0) return "Free";
    return new Intl.NumberFormat("en-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Handler saat input search berubah -> langsung reset ke page 1
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Handler saat lokasi berubah -> langsung reset ke page 1
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
    setPage(1);
  };

  // Handler untuk transisi kategori instan dari Navbar
  const handleCategorySelect = (categoryName: string) => {
    const matchedCategory = categories.find(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase(),
    );

    if (matchedCategory) {
      setCategoryId(matchedCategory.id);
      setPage(1);
      window.history.pushState(
        {},
        "",
        `/events?category=${encodeURIComponent(matchedCategory.name)}`,
      );
    }
  };

  // Update kategori & reset ke page 1 saat "Category Pills" diklik
  const handlePillClick = (id: number, name: string) => {
    setCategoryId(id);
    setPage(1);

    if (id === 0) {
      window.history.pushState({}, "", "/events");
      return;
    }

    window.history.pushState(
      {},
      "",
      `/events?category=${encodeURIComponent(name)}`,
    );
  };

  return (
    <div>
      <Navbar onSelectCategory={handleCategorySelect} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white p-4 rounded-xl border border-[#f4917b] shadow-sm mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#f4917b] rounded-lg text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#f4917b]"
              />
            </div>

            <div className="relative md:w-56">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={location}
                onChange={handleLocationChange}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border rounded-lg text-sm cursor-pointer outline-none"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handlePillClick(0, "All Categories")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                categoryId === 0
                  ? "bg-[#f4917b] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Categories
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handlePillClick(category.id, category.name)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  categoryId === category.id
                    ? "bg-[#f4917b] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            Loading events...
          </div>
        ) : events.length > 0 ? (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-200 ${
                isPlaceholderData ? "opacity-60" : "opacity-100"
              }`}
            >
              {events.map((event) => {
                const lowestPrice = event.ticketTypes.length
                  ? Math.min(...event.ticketTypes.map((t) => t.price))
                  : 0;

                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="group flex flex-col bg-white border border-[#f4917b] rounded-xl overflow-hidden hover:shadow-md transition"
                  >
                    <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                      <img
                        src={event.thumbnail}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                        {event.category.name}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#f4917b] transition line-clamp-2">
                          {event.name}
                        </h3>
                        <div className="mt-2 text-xs text-slate-500 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#f4917b] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            Starts from
                          </span>
                          <span className="text-sm font-bold text-[#f4917b]">
                            {formatIDR(lowestPrice)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {event.availableSeat} seats left
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
                <p className="text-xs text-slate-500">
                  Showing page{" "}
                  <span className="font-semibold text-slate-700">
                    {meta.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {meta.totalPages}
                  </span>{" "}
                  ({meta.total} total events)
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={!meta.hasPrevPage || isPlaceholderData}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Prev
                  </button>

                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        disabled={isPlaceholderData}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                          meta.page === pageNum
                            ? "bg-[#f4917b] text-white"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(meta.totalPages, prev + 1))
                    }
                    disabled={!meta.hasNextPage || isPlaceholderData}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed rounded-xl">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">
              No events found
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Try updating your keywords or location filter.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};