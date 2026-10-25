import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { axiosInstance } from "@/lib/axios";
import type { EventModel } from "@/types/event.types";
import { Calendar, ChevronRight, Loader2, MapPin, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

interface CategoryItem {
  id: number;
  name: string;
}

export function EventBrowsingSection() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [location, setLocation] = useState<string>("All Locations");
  const [locations, setLocations] = useState<string[]>(["All Locations"]);
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Fetch Categories dynamically from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        const list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
            ? res.data
            : [];
        setCategories(list);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // 2. Fetch Events based on active filters
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (categoryId !== 0) params.categoryId = categoryId;
        if (location !== "All Locations") params.location = location;

        const res = await axiosInstance.get("/events", { params });
        setEvents(res.data.data || []);
      } catch (err) {
        console.error("Failed to retrieve events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [categoryId, location]);

  // Extract unique locations from events
  useEffect(() => {
    if (location === "All Locations" && events.length > 0) {
      const uniqueCities = Array.from(
        new Set(events.map((event) => event.location))
      ).filter(Boolean);
      setLocations(["All Locations", ...uniqueCities]);
    }
  }, [events, location]);

  const formatIDR = (val: number): string => {
    if (val === 0) return "Free";
    return new Intl.NumberFormat("en-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string): string => {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#f4917b] font-semibold text-xs tracking-wider uppercase mb-1">
            <Ticket className="w-4 h-4" />
            Explore Selected Events
          </div>
          <h2 className="text-[#222432] font-coustard text-2xl sm:text-3xl font-extrabold tracking-tight">
            Exciting Events Await You
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Discover concert tickets, creative workshops, and festivals near you.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Filter events by location"
              className="text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-full pl-9 pr-8 py-2 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f4917b] cursor-pointer appearance-none"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
              ▼
            </span>
          </div>

          <Link
            to="/events"
            className="hidden sm:inline-flex items-center text-xs sm:text-sm font-semibold text-[#f4917b] hover:underline gap-0.5"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Dynamic Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none no-scrollbar">
        <button
          onClick={() => setCategoryId(0)}
          className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
            categoryId === 0
              ? "bg-[#f4917b] text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryId(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
              categoryId === cat.id
                ? "bg-[#f4917b] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#f4917b]" />
          <p className="text-sm">Fetching events...</p>
        </div>
      ) : events.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="relative w-full group"
        >
          <CarouselContent className="-ml-3 sm:-ml-4">
            {events.map((event) => {
              const lowestPrice = event.ticketTypes?.length
                ? Math.min(...event.ticketTypes.map((t) => t.price))
                : 0;

              return (
                <CarouselItem
                  key={event.id}
                  className="pl-3 sm:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Link
                    to={`/events/${event.id}`}
                    className="group/card flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                      <img
                        src={event.thumbnail}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                        loading="lazy"
                      />

                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          {event.category?.name || "Event"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#f4917b] shrink-0" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover/card:text-[#f4917b] transition-colors">
                          {event.name}
                        </h3>

                        <div className="flex items-start gap-1 text-xs text-slate-500 mt-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            Starts from
                          </span>
                          <span className="text-sm font-bold text-[#f4917b]">
                            {formatIDR(lowestPrice)}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 truncate max-w-22.5 text-right">
                          {event.availableSeat} seats left
                        </span>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex -left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white shadow-md border-slate-200 text-slate-700 hover:bg-slate-50 z-10" />
          <CarouselNext className="hidden md:flex -right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white shadow-md border-slate-200 text-slate-700 hover:bg-slate-50 z-10" />
        </Carousel>
      ) : (
        <div className="py-14 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            No events found for this filter
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Try selecting another category or location.
          </p>
        </div>
      )}
    </section>
  );
}