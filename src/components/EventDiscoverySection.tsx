import { useState, useMemo } from "react";
import { ChevronRight, Flame, Sparkles, MapPin, CalendarDays } from "lucide-react";

interface NearbyEvent {
  id: string;
  title: string;
  dateRange: string;
  venue: string;
  thumbnailUrl: string;
  isPopular?: boolean;
  isThisWeek?: boolean;
  calendarBadge?: {
    month: string;
    day: string;
    weekday: string;
  };
}

const NEARBY_EVENTS: NearbyEvent[] = [
  {
    id: "near-1",
    title: "Club Pass - Jakarta Illustration & Creative Arts Fair (JICAF) 2026",
    dateRange: "3-4 Okt 2026",
    venue: "Agora Mall (Agora Ballroom, L2 Floor), Jakarta Pusat",
    thumbnailUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80",
    isPopular: true,
    isThisWeek: true,
    calendarBadge: {
      month: "OKT",
      day: "3",
      weekday: "SAB",
    },
  },
  {
    id: "near-2",
    title: "Daily Pass - Jakarta Illustration & Creative Arts Fair (JICAF) 2026",
    dateRange: "3-4 Okt 2026",
    venue: "Agora Mall (Agora Ballroom, L2 Floor), Jakarta Pusat",
    thumbnailUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=400&q=80",
    isPopular: true,
    isThisWeek: true,
  },
  {
    id: "near-3",
    title: "Glitter Camp Live Concert",
    dateRange: "3 Okt 2026",
    venue: "Balai Sarbini Jakarta, Jakarta Selatan",
    thumbnailUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80",
    isPopular: true,
    isThisWeek: true,
  },
  {
    id: "near-4",
    title: "PGR 2026 @Cikarang",
    dateRange: "3 Okt 2026",
    venue: "Lippo Mall Cikarang, Kab. Bekasi",
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
    isPopular: false,
    isThisWeek: true,
  },
  {
    id: "near-5",
    title: "IMOBY Bandung Oktober 2026",
    dateRange: "3-4 Okt 2026",
    venue: "Sudirman Grand Ballroom, Kota Bandung",
    thumbnailUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80",
    isPopular: true,
    isThisWeek: false,
  },
];

export function EventDiscoverySection() {
  const [filterType, setFilterType] = useState<"populer" | "minggu_ini">("populer");

  const filteredList = useMemo(() => {
    if (filterType === "populer") {
      return NEARBY_EVENTS.filter((e) => e.isPopular);
    }
    return NEARBY_EVENTS.filter((e) => e.isThisWeek);
  }, [filterType]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-4 w-full">
          <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[490px] w-full rounded-2xl overflow-hidden shadow-md bg-gradient-to-b from-[#0B2545] to-[#134074] p-6 flex flex-col justify-between text-white border border-blue-900/30">
            <div className="flex items-center gap-1.5">
              <div className="bg-white text-[#0B2545] font-black text-xs px-2 py-1 rounded tracking-tighter">
                L
              </div>
              <span className="text-[11px] font-bold tracking-wider text-blue-200">
                EVENTTIX SPOTLIGHT
              </span>
            </div>

 

            <div className="text-[11px] text-blue-300/70 text-center font-medium">
              Update berkala setiap minggu
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Event2Go
                </h2>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setFilterType("populer")}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition ${
                    filterType === "populer"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Populer
                </button>
                <button
                  onClick={() => setFilterType("minggu_ini")}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition ${
                    filterType === "minggu_ini"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Flame className="w-3 h-3 text-orange-500" />
                  Minggu Ini
                </button>
              </div>
            </div>

            <a
              href="/events"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Lebih Banyak Event
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {filteredList.map((event) => (
              <a
                key={event.id}
                href={`/events/${event.id}`}
                className="group py-4 flex items-center justify-between gap-4 transition hover:bg-slate-50/70 px-2 rounded-xl"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                      {event.calendarBadge?.month || "OKT"}
                    </span>
                    <span className="text-base font-extrabold text-slate-800 leading-tight">
                      {event.calendarBadge?.day || "3"}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 leading-none uppercase">
                      {event.calendarBadge?.weekday || "SAB"}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                      {event.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span>{event.dateRange}</span>
                      <span className="text-slate-300">•</span>
                      <span className="truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {event.venue}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="relative w-28 sm:w-36 h-14 sm:h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </a>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}