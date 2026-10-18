import React, { useState, useEffect } from "react";
import { Link } from "react-router"; // Gunakan react-router
import { Search, MapPin, Calendar, AlertCircle } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { axiosInstance } from "@/lib/axios";
import type { EventModel } from "@/types/event.types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Category } from "@/types/category.type";

export const EventBrowsingPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [locations, setLocations] = useState<string[]>(["All Locations"]);
  const [events, setEvents] = useState<EventModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  console.log(categories);

  const [categoryId, setCategoryId] = useState<number>(0);

  const debouncedSearch = useDebounce(search, 350);

  // Mengambil data kategori
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get<Category[]>("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to retrieve categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // 2. Fetch events otomatis akan berjalan dengan categoryId yang benar
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (categoryId !== 0) params.categoryId = categoryId;
        if (location !== "All Locations") params.location = location;

        const res = await axiosInstance.get("/events", { params });
        setEvents(res.data.data);
      } catch (err) {
        console.error("Failed to retrieve events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [debouncedSearch, categoryId, location]);

  useEffect(() => {
    if (location === "All Locations" && events.length > 0) {
      const uniqueCities = Array.from(
        new Set(events.map((event) => event.location)),
      ).filter(Boolean);
      setLocations(["All Locations", ...uniqueCities]);
    }
  }, [events, location]);

  const formatIDR = (val: number) => {
    if (val === 0) return "Free";
    return new Intl.NumberFormat("en-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // 3. Handler untuk transisi kategori instan dari Navbar
  const handleCategorySelect = (categoryName: string) => {
    const matchedCategory = categories.find(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase(),
    );

    if (matchedCategory) {
      setCategoryId(matchedCategory.id);

      window.history.pushState(
        {},
        "",
        `/events?category=${encodeURIComponent(matchedCategory.name)}`,
      );
    }
  };

  // Update kategori juga saat "Category Pills" diklik
  const handlePillClick = (id: number, name: string) => {
    setCategoryId(id);

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
      {/* Sambungkan Navbar dengan handler */}
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
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-[#f4917b] rounded-lg text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#f4917b]"
              />
            </div>

            <div className="relative md:w-56">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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

          {/* kategori pill yang muncul berdasarkan data array yg telah difetch */}
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

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            Loading events...
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
