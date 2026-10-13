import React, { useEffect, useState } from "react";
import { useParams } from "react-router"; // Diubah ke react-router
import { Calendar, MapPin, Tag} from "lucide-react";
import type { EventModel } from "@/types/event.types";
import { axiosInstance } from "@/lib/axios";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const EventDetailPage: React.FC = () => {
  // Ambil ID dari URL
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventModel | null>(null);

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/events/${id}`).then((res) => setEvent(res.data.data));
    }
  }, [id]);

  if (!event)
    return <div className="p-10 text-center">Loading event details...</div>;

  const formatIDR = (v: number) =>
    v === 0
      ? "Free"
      : new Intl.NumberFormat("en-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(v);

  return (
    <div className="bg-[#fbf7f4]">
        <Navbar/>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="aspect-21/9 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
          <img
            src={event.thumbnail}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-xs font-semibold text-[#f4917b] uppercase tracking-wider">
                {event.category.name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-800 mt-1">
                {event.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date(event.startDate).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {event.location}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-2">
                About This Event
              </h3>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Active Voucher Badges */}
            {event.vouchers?.length > 0 && (
              <div className="p-4 bg-[#ffdfa5] rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Event Promotions Available
                </h4>
                {event.vouchers.map((v) => (
                  <div
                    key={v.code}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-bold">
                      {v.code}
                    </span>
                    <span className="text-slate-600">
                      Save {formatIDR(v.discountValue)} (Exp:{" "}
                      {new Date(v.expiresAt).toLocaleDateString("en-US")})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ticket Tier Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#ffdfa5] p-5 rounded-xl shadow-sm space-y-4">
              <h3 className="font-bold text-base text-amber-800">
                Select Tickets
              </h3>
              {event.ticketTypes.map((t) => (
                <div
                  key={t.id}
                  className="p-3 border rounded-lg flex justify-between items-center bg-[#fbf7f4]"
                >
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-slate-500">
                      {t.availableSeat} seats remaining
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#222432] block">
                      {formatIDR(t.price)}
                    </span>
                    <button className="mt-1 px-3 py-1 bg-[#f4917b] text-[#222432] rounded text-xs font-semibold hover:bg-[#ffc7b9]">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};
