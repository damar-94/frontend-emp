import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronRight, Calendar, MapPin, Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import type { EventModel } from "@/types/event.types";

export function HeroSection() {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    const fetchHeroEvents = async () => {
      try {
        // Fetch up to 5 featured/upcoming events
        const res = await axiosInstance.get("/events", { params: { limit: 5 } });
        setEvents(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch hero events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroEvents();
  }, []);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, events]);

  const formatIDR = (val: number) => {
    if (val === 0) return "Free Entry";
    return new Intl.NumberFormat("en-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/8] max-h-[380px] rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#f4917b]" />
          <span className="text-sm font-medium">Loading featured events...</span>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        className="relative w-full overflow-hidden rounded-2xl shadow-xl group"
      >
        <CarouselContent className="-ml-0">
          {events.map((event) => {
            const lowestPrice = event.ticketTypes?.length
              ? Math.min(...event.ticketTypes.map((t) => t.price))
              : 0;

            const formattedDate = new Date(event.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <CarouselItem key={event.id} className="pl-0 relative">
                <Link
                  to={`/events/${event.id}`}
                  className="relative block w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/8] max-h-[380px] overflow-hidden bg-slate-950"
                >
                  <img
                    src={event.thumbnail}
                    alt={event.name}
                    className="w-full h-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

                  <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between">
                    <div className="max-w-xl">
                      <span className="inline-block px-2.5 py-0.5 mb-2 rounded-full text-[11px] font-semibold tracking-wide bg-[#f4917b] text-white uppercase">
                        {event.category?.name || "Featured Event"}
                      </span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md line-clamp-2">
                        {event.name}
                      </h2>
                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[#f4917b]" />
                          {formattedDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#f4917b]" />
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <div className="self-start">
                      <div className="inline-flex items-center gap-2 bg-white/95 hover:bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-semibold shadow-md backdrop-blur transition-all">
                        <span>Starting from {formatIDR(lowestPrice)}</span>
                        <span className="text-[#f4917b] font-bold inline-flex items-center hover:underline ml-1">
                          Get Tickets
                          <ChevronRight className="w-4 h-4 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/90 hover:bg-white text-slate-800 border-none shadow-md z-10" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-9 w-9 bg-white/90 hover:bg-white text-slate-800 border-none shadow-md z-10" />

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all ${
                current === index
                  ? "w-6 bg-white shadow"
                  : "w-1.5 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}