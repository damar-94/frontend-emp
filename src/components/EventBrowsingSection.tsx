import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, ChevronRight, MapPin, Ticket } from "lucide-react";
import { useMemo, useState } from "react";

const formatIDR = (price: number): string => {
  if (price === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateStr: string): string => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
};

interface EventItem {
  id: string;
  title: string;
  category: "Semua" | "Musik" | "Teater" | "Workshop" | "Seminar" | "Olahraga";
  location: string;
  venue: string;
  date: string;
  price: number;
  imageUrl: string;
  organizer: string;
  badge?: string;
}

const SAMPLE_EVENTS: EventItem[] = [
  {
    id: "evt-01",
    title: "Teater Musikal: Gadis Kretek & Cerita Masa Lalu",
    category: "Teater",
    location: "Jakarta",
    venue: "Graha Bhakti Budaya, Taman Ismail Marzuki",
    date: "2026-11-12T19:30:00Z",
    price: 175000,
    imageUrl:
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
    organizer: "Titimangsa Foundation",
    badge: "TERLARIS",
  },
  {
    id: "evt-02",
    title: "Dewa 19 ft. All Stars Stadium Tour",
    category: "Musik",
    location: "Jakarta",
    venue: "Stadion Gelora Bung Karno",
    date: "2026-12-09T18:30:00Z",
    price: 350000,
    imageUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    organizer: "Rajawali Indonesia",
    badge: "POPULER",
  },
  {
    id: "evt-03",
    title: "Masterclass: Modern Web Development with React & Go",
    category: "Workshop",
    location: "Bandung",
    venue: "Bandung Creative Hub",
    date: "2026-11-05T09:00:00Z",
    price: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    organizer: "DevSphere Indonesia",
  },
  {
    id: "evt-04",
    title: "Bali International Sunset Run 2026",
    category: "Olahraga",
    location: "Bali",
    venue: "Pantai Kuta, Badung",
    date: "2026-11-28T16:00:00Z",
    price: 250000,
    imageUrl:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
    organizer: "Bali Sports Event",
  },
  {
    id: "evt-05",
    title: "Jakarta Coffee & Roastery Festival",
    category: "Workshop",
    location: "Jakarta",
    venue: "Senayan Park (SPARK)",
    date: "2026-12-02T10:00:00Z",
    price: 50000,
    imageUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    organizer: "Kopi Nusantara",
  },
  {
    id: "evt-06",
    title: "National Tech Conference & Career Expo",
    category: "Seminar",
    location: "Surabaya",
    venue: "Grand City Convention Hall",
    date: "2026-11-20T08:30:00Z",
    price: 100000,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    organizer: "Tech Summit ID",
  },
];

const CATEGORIES = [
  "Semua",
  "Musik",
  "Teater",
  "Workshop",
  "Seminar",
  "Olahraga",
] as const;
const LOCATIONS = [
  "Semua Lokasi",
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Bali",
] as const;

export function EventBrowsingSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedLocation, setSelectedLocation] =
    useState<string>("Semua Lokasi");

  // Filter logic
  const filteredEvents = useMemo(() => {
    return SAMPLE_EVENTS.filter((evt) => {
      const matchCategory =
        selectedCategory === "Semua" || evt.category === selectedCategory;
      const matchLocation =
        selectedLocation === "Semua Lokasi" ||
        evt.location === selectedLocation;
      return matchCategory && matchLocation;
    });
  }, [selectedCategory, selectedLocation]);

  return (
    <section className=" w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <Ticket className="w-4 h-4" />
            Eksplorasi Event Pilihan
          </div>
          <h2 className="text-[#222432] font-coustard text-2xl sm:text-3xl font-extrabold tracking-tight">
            Event Seru Menantimu
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Temukan tiket konser, seni pertunjukan, dan festival terdekat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Pilih lokasi event"
              className="text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-full pl-9 pr-8 py-2 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">
              ▼
            </span>
          </div>

          <a
            href="/events"
            className="hidden sm:inline-flex items-center text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline gap-0.5"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
              selectedCategory === cat
                ? "bg-[#f4917b] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredEvents.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="relative w-full group"
        >
          <CarouselContent className="-ml-3 sm:-ml-4">
            {filteredEvents.map((event) => (
              <CarouselItem
                key={event.id}
                className="pl-3 sm:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <a
                  href={`/events/${event.id}`}
                  className="group/card flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                      loading="lazy"
                    />

                    {/* Tag Kategori & Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {event.category}
                      </span>
                      {event.badge && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                          {event.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Tanggal Event */}
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover/card:text-blue-600 transition-colors">
                        {event.title}
                      </h3>

                      <div className="flex items-start gap-1 text-xs text-slate-500 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          Harga Mulai Dari
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {formatIDR(event.price)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate max-w-[90px] text-right">
                        {event.organizer}
                      </span>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex -left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white shadow-md border-slate-200 text-slate-700 hover:bg-slate-50 z-10" />
          <CarouselNext className="hidden md:flex -right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white shadow-md border-slate-200 text-slate-700 hover:bg-slate-50 z-10" />
        </Carousel>
      ) : (
        <div className="py-14 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            Tidak ada event untuk filter ini
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Coba pilih kategori atau lokasi lain.
          </p>
        </div>
      )}
    </section>
  );
}
