import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { axiosInstance } from "@/lib/axios";
import type { EventModel } from "@/types/event.types";
import type { UserCoupon } from "@/types/transaction.types";
import { Calendar, Coins, MapPin, Minus, Plus, Tag, Ticket } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export const EventDetailPage: React.FC = () => {
  // 1. Extract event ID from URL parameters and initialize navigation hook
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 2. Regular React State for server data (Event details + Customer points & coupons)
  const [event, setEvent] = useState<EventModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userPoints, setUserPoints] = useState<number>(20000); // Fetched from /auth/me or fallback
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);

  // 3. Regular React State for interactive checkout selections
  // Stores { [ticketTypeId]: quantitySelected }
  const [selectedTickets, setSelectedTickets] = useState<Record<number, number>>({});
  const [voucherCodeInput, setVoucherCodeInput] = useState<string>("");
  const [selectedCouponCode, setSelectedCouponCode] = useState<string>("");
  const [usePoints, setUsePoints] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // 4. Side effect to fetch Event Details and User Profile (Points & Coupons) on mount
  useEffect(() => {
    if (!id) return;

    const fetchPageData = async () => {
      try {
        setLoading(true);
        // Fetch event details by ID
        const eventRes = await axiosInstance.get(`/events/${id}`);
        setEvent(eventRes.data.data);

        // Optional: Fetch logged-in customer's points & unused coupons if logged in
        try {
          const profileRes = await axiosInstance.get("/auth/me");
          if (profileRes.data?.data) {
            setUserPoints(profileRes.data.data.points ?? 0);
            setUserCoupons(profileRes.data.data.coupons ?? []);
          }
        } catch {
          // If unauthenticated or endpoint not yet merged by Dev 2, keep default state
        }
      } catch (err) {
        console.error("Failed to load event details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [id]);

  // 5. Pure function to format any number strictly into Indonesian Rupiah (IDR)
  const formatIDR = (v: number) =>
    v === 0
      ? "Free"
      : new Intl.NumberFormat("en-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(v);

  // 6. Pure state updater function to increment/decrement ticket quantities within available seat limits
  const handleQuantityChange = (ticketId: number, delta: number, maxAvailable: number) => {
    setSelectedTickets((prev) => {
      const currentQty = prev[ticketId] || 0;
      const nextQty = Math.max(0, Math.min(currentQty + delta, maxAvailable));
      return {
        ...prev,
        [ticketId]: nextQty,
      };
    });
  };

  if (loading || !event) {
    return <div className="p-10 text-center">Loading event details...</div>;
  }

  // 7. Functional Derived Calculations (Subtotal, Voucher, Coupon, Points, and Final IDR Price)
  const subtotalIDR = event.ticketTypes.reduce((acc, ticket) => {
    const qty = selectedTickets[ticket.id || 0] || 0;
    return acc + ticket.price * qty;
  }, 0);

  const totalSelectedTickets = Object.values(selectedTickets).reduce((acc, q) => acc + q, 0);

  // Match typed voucher code against active event vouchers
  const matchedVoucher = event.vouchers?.find(
    (v) => v.code.toUpperCase() === voucherCodeInput.trim().toUpperCase()
  );
  const voucherDiscountIDR = matchedVoucher
    ? Math.min(subtotalIDR, matchedVoucher.discountValue)
    : 0;

  const afterVoucherIDR = subtotalIDR - voucherDiscountIDR;

  // Match selected referral coupon if subtotal meets minTransaction
  const matchedCoupon = userCoupons.find(
    (c) => c.code === selectedCouponCode && !c.isUsed && subtotalIDR >= c.minTransaction
  );
  const couponDiscountIDR = matchedCoupon
    ? Math.min(afterVoucherIDR, matchedCoupon.discountValue)
    : 0;

  const afterCouponIDR = afterVoucherIDR - couponDiscountIDR;

  // Calculate points deduction (e.g. Price IDR 300.000 - 20.000 points = IDR 280.000)
  const pointsDiscountIDR = usePoints ? Math.min(afterCouponIDR, userPoints) : 0;

  // Final net price in IDR
  const finalTotalIDR = Math.max(0, afterCouponIDR - pointsDiscountIDR);

  // 8. Async function to submit the transaction to the backend and redirect to the 2-hour countdown page
  const handleCheckoutSubmit = async () => {
    if (totalSelectedTickets === 0) return;

    try {
      setIsSubmitting(true);
      setCheckoutError(null);

      // Transform selectedTickets map into array of { ticketTypeId, quantity }
      const itemsPayload = Object.entries(selectedTickets)
        .filter(([, quantity]) => quantity > 0)
        .map(([ticketTypeId, quantity]) => ({
          ticketTypeId: Number(ticketTypeId),
          quantity,
        }));

      const response = await axiosInstance.post("/transactions", {
        eventId: event.id,
        items: itemsPayload,
        voucherCode: matchedVoucher ? matchedVoucher.code : undefined,
        couponCode: matchedCoupon ? matchedCoupon.code : undefined,
        usePoints,
      });

      const createdTransactionId = response.data.data.id;
      // Navigate customer to the 2-hour payment proof upload page
      navigate(`/transactions/${createdTransactionId}`);
    } catch (err: any) {
      setCheckoutError(
        err.response?.data?.message || "Failed to create transaction. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fbf7f4] min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="aspect-21/9 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
          <img
            src={event.thumbnail}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Event Information & Voucher Badges */}
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

            {/* Active Voucher Badges (Click to auto-apply code) */}
            {event.vouchers?.length > 0 && (
              <div className="p-4 bg-[#ffdfa5] rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Event Promotions Available (Click to Apply)
                </h4>
                {event.vouchers.map((v) => (
                  <div
                    key={v.code}
                    onClick={() => setVoucherCodeInput(v.code)}
                    className="flex justify-between items-center text-xs cursor-pointer hover:opacity-80"
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

          {/* Right Column: Ticket Tier Selection & Checkout Box */}
          <div className="space-y-4">
            <div className="bg-[#ffdfa5] p-5 rounded-xl shadow-sm space-y-4">
              <h3 className="font-bold text-base text-amber-800 flex items-center gap-1.5">
                <Ticket className="w-4 h-4" /> Select Tickets
              </h3>

              {/* Ticket Tiers List */}
              {event.ticketTypes.map((t) => {
                const ticketId = t.id || 0;
                const remaining = t.availableSeat ?? 0;
                const selectedQty = selectedTickets[ticketId] || 0;

                return (
                  <div
                    key={ticketId}
                    className="p-3 border border-amber-200 rounded-lg flex justify-between items-center bg-[#fbf7f4]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#222432]">{t.name}</p>
                      <p className="text-xs text-slate-500">
                        {remaining > 0 ? `${remaining} seats remaining` : "Sold Out"}
                      </p>
                    </div>

                    <div className="text-right space-y-1.5">
                      <span className="text-sm font-bold text-[#222432] block">
                        {formatIDR(t.price)}
                      </span>

                      {/* Quantity Stepper Controls */}
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={selectedQty <= 0}
                          onClick={() => handleQuantityChange(ticketId, -1, remaining)}
                          className="p-1 bg-white border border-slate-300 rounded disabled:opacity-40"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">
                          {selectedQty}
                        </span>
                        <button
                          type="button"
                          disabled={selectedQty >= remaining}
                          onClick={() => handleQuantityChange(ticketId, 1, remaining)}
                          className="p-1 bg-[#f4917b] text-[#222432] rounded hover:bg-[#ffc7b9] disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Discounts & Points Section (Visible once at least 1 ticket is chosen) */}
              {totalSelectedTickets > 0 && (
                <div className="pt-3 border-t border-amber-300/70 space-y-3">
                  {/* 1. Event Voucher Input */}
                  <div>
                    <label className="block text-xs font-semibold text-amber-900 mb-1">
                      Event Voucher Code
                    </label>
                    <input
                      type="text"
                      value={voucherCodeInput}
                      onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. EARLYBIRD"
                      className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-[#fbf7f4] uppercase"
                    />
                    {matchedVoucher && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                        ✓ Voucher applied (-{formatIDR(voucherDiscountIDR)})
                      </p>
                    )}
                  </div>

                  {/* 2. Referral Coupon Selector */}
                  {userCoupons.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-amber-900 mb-1">
                        Referral Coupon
                      </label>
                      <select
                        value={selectedCouponCode}
                        onChange={(e) => setSelectedCouponCode(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-[#fbf7f4]"
                      >
                        <option value="">No coupon selected</option>
                        {userCoupons
                          .filter((c) => !c.isUsed)
                          .map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} - Save {formatIDR(c.discountValue)}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* 3. Customer Points Toggle */}
                  {userPoints > 0 && subtotalIDR > 0 && (
                    <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#fbf7f4] border border-amber-300 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-600" />
                        <div>
                          <p className="text-xs font-bold text-[#222432]">Use My Points</p>
                          <p className="text-[11px] text-slate-500">
                            Balance: {formatIDR(userPoints)}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={usePoints}
                        onChange={(e) => setUsePoints(e.target.checked)}
                        className="rounded text-[#f4917b] focus:ring-0"
                      />
                    </label>
                  )}

                  {/* 4. Live Price Calculation Summary in IDR */}
                  <div className="p-3 rounded-lg bg-[#fbf7f4] space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({totalSelectedTickets} tickets)</span>
                      <span>{formatIDR(subtotalIDR)}</span>
                    </div>

                    {voucherDiscountIDR > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Voucher Discount</span>
                        <span>- {formatIDR(voucherDiscountIDR)}</span>
                      </div>
                    )}

                    {couponDiscountIDR > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Coupon Discount</span>
                        <span>- {formatIDR(couponDiscountIDR)}</span>
                      </div>
                    )}

                    {pointsDiscountIDR > 0 && (
                      <div className="flex justify-between text-amber-700 font-medium">
                        <span>Points Used</span>
                        <span>- {formatIDR(pointsDiscountIDR)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-extrabold text-sm text-[#222432]">
                      <span>Total Price</span>
                      <span className="text-base text-amber-900">
                        {formatIDR(finalTotalIDR)}
                      </span>
                    </div>
                  </div>

                  {checkoutError && (
                    <p className="text-xs text-red-600 font-medium">{checkoutError}</p>
                  )}

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleCheckoutSubmit}
                    className="w-full py-2.5 bg-[#f4917b] text-[#222432] rounded-lg text-xs font-bold hover:bg-[#ffc7b9] transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing Checkout..." : "Checkout & Pay Now"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};