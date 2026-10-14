import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { axiosInstance } from "@/lib/axios";
import type { EventModel } from "@/types/event.types";
import {
  Calendar,
  CalendarDays,
  ChevronRight,
  Flame,
  Loader2,
  MapPin,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

export function EventDiscoverySection() {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDiscoveryEvents = async () => {
      try {
        const res = await axiosInstance.get("/events", { params: { limit: 10 } });
        setEvents(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch discovery events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscoveryEvents();
  }, []);

  // Filter events strictly for this week (with a fallback to upcoming events)
  const thisWeekEvents = useMemo(() => {
    if (!events.length) return [];

    const now = new Date();
    const inSevenDays = new Date();
    inSevenDays.setDate(now.getDate() + 7);

    const filtered = events.filter((e) => {
      const start = new Date(e.startDate);
      return start >= now && start <= inSevenDays;
    });

    // Fallback to the latest upcoming events if no events fall strictly within 7 days
    return filtered.length > 0 ? filtered : events.slice(0, 5);
  }, [events]);

  const getCalendarBadge = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      day: date.toLocaleDateString("en-US", { day: "numeric" }),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    };
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shadcn Carousel Image Slideshow */}
        <div className="lg:col-span-4 w-full">
          {loading ? (
            <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[490px] w-full rounded-2xl bg-slate-100 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#f4917b]" />
            </div>
          ) : events.length > 0 ? (
            <Carousel
              opts={{
                loop: true,
                align: "start",
              }}
              className="relative w-full rounded-2xl overflow-hidden shadow-md group"
            >
              <CarouselContent className="-ml-0">
                {events.slice(0, 5).map((event) => (
                  <CarouselItem key={event.id} className="pl-0 relative">
                    <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[490px] w-full overflow-hidden bg-slate-900 flex flex-col justify-between p-6">
                      {/* Background Image */}
                      <img
                        src={event.thumbnail}
                        alt={event.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="bg-[#f4917b] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                          Spotlight
                        </span>
                        <span className="bg-black/50 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/20">
                          {event.category?.name || "Featured"}
                        </span>
                      </div>

                      {/* Bottom Details & Link */}
                      <div className="relative z-10 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-[#ffc7b9] font-medium">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{event.location}</span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug line-clamp-2 drop-shadow-md">
                          {event.name}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-[#f4917b]" />
                          <span>
                            {new Date(event.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <Link
                          to={`/events/${event.id}`}
                          className="inline-flex items-center justify-center gap-1.5 w-full bg-[#f4917b] hover:bg-[#ffc7b9] text-[#222432] font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 mt-2"
                        >
                          <span>Explore Event</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Prev & Next Controls */}
              <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white text-slate-800 border-none shadow opacity-0 group-hover:opacity-100 transition-opacity z-20" />
              <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white text-slate-800 border-none shadow opacity-0 group-hover:opacity-100 transition-opacity z-20" />
            </Carousel>
          ) : (
            <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[490px] w-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
              No spotlight events available.
            </div>
          )}
        </div>

        {/* Right Column: Header, This Week Badge, and Event List */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#f4917b]" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Event2Go
                </h2>
              </div>

              {/* Retained "This Week" tag */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#f4917b] border border-[#f4917b] ml-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                This Week
              </div>
            </div>

            <Link
              to="/events"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#f4917b] hover:underline"
            >
              More Events
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#f4917b]" />
              <p className="text-sm">Loading curated events...</p>
            </div>
          ) : thisWeekEvents.length > 0 ? (
            <div className="divide-y divide-slate-100 mt-2">
              {thisWeekEvents.map((event) => {
                const badge = getCalendarBadge(event.startDate);
                const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="group py-4 flex items-center justify-between gap-4 transition hover:bg-slate-50/70 px-2 rounded-xl"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Calendar Date Badge */}
                      <div className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                          {badge.month}
                        </span>
                        <span className="text-base font-extrabold text-slate-800 leading-tight">
                          {badge.day}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 leading-none uppercase">
                          {badge.weekday}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#f4917b] transition line-clamp-1">
                          {event.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <span>{formattedDate}</span>
                          <span className="text-slate-300">•</span>
                          <span className="truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {event.location}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="relative w-28 sm:w-36 h-14 sm:h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={event.thumbnail}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-14 text-center text-slate-400 text-sm">
              No events found for this week.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}