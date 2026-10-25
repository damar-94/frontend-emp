import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { axiosInstance } from "@/lib/axios";
import type { EventModel } from "@/types/event.types";
import type { UserCoupon } from "@/types/transaction.types";
import {
  Calendar,
  Coins,
  MapPin,
  Minus,
  Plus,
  Tag,
  Ticket,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 1. Match UserRole type with schema.prisma (including ADMIN)
type UserRole = "CUSTOMER" | "EVENTORGANIZER" | "ADMIN" | null;

// Business rule constants matching project specifications
const MIN_AFTER_VOUCHER_FOR_COUPON = 30000; // Rule h: Min IDR 30,000 after voucher deduction
const FIXED_COUPON_VALUE = 10000; // Rule j: Coupon discount is fixed at IDR 10,000
const MIN_TRX_FOR_POINTS = 100000; // Rule o: Minimum transaction of IDR 100,000 to use points
const MAX_POINTS_PER_TRX = 20000; // Rule o: Maximum 20,000 points per transaction
const POINT_STEP = 10000; // Rule o: Points must be used in multiples of 10,000 from 0

// Pure helper function to decode a JWT payload without external libraries
const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Pure helper function to map raw role strings to the UserRole type
const normalizeUserRole = (rawRole: unknown): UserRole => {
  if (!rawRole) return null;
  const upper = String(rawRole).toUpperCase();
  if (upper.includes("ORGANIZER")) return "EVENTORGANIZER";
  if (upper === "ADMIN") return "ADMIN";
  if (upper === "CUSTOMER") return "CUSTOMER";
  return null;
};

// Pure helper function to read login status and role from localStorage / JWT
const getAuthInfoFromStorage = (): {
  isLoggedIn: boolean;
  role: UserRole;
} => {
  const rawToken =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt");

  if (rawToken) {
    const decoded = decodeJwtPayload(rawToken);
    if (decoded?.role) {
      return {
        isLoggedIn: true,
        role: normalizeUserRole(decoded.role),
      };
    }
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const rawValue = localStorage.getItem(key);
    if (!rawValue) continue;

    try {
      const parsed = JSON.parse(rawValue);
      const candidate =
        parsed?.state?.user || parsed?.user || parsed?.state || parsed;
      const candidateToken =
        parsed?.state?.token || parsed?.token || candidate?.token;

      if (candidate?.role) {
        return {
          isLoggedIn: true,
          role: normalizeUserRole(candidate.role),
        };
      }

      if (typeof candidateToken === "string") {
        const decoded = decodeJwtPayload(candidateToken);
        if (decoded?.role) {
          return {
            isLoggedIn: true,
            role: normalizeUserRole(decoded.role),
          };
        }
      }
    } catch {
      // Ignore non-JSON localStorage items
    }
  }

  return {
    isLoggedIn: Boolean(rawToken),
    role: null,
  };
};

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Server data states
  const [event, setEvent] = useState<EventModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userPoints, setUserPoints] = useState<number>(0); // Aggregated PointLot balance from backend
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);

  // Interactive checkout selection states (tickets, voucher, coupon, and points)
  const [selectedTickets, setSelectedTickets] = useState<
    Record<number, number>
  >({});
  const [voucherCodeInput, setVoucherCodeInput] = useState<string>("");
  const [selectedCouponCode, setSelectedCouponCode] = useState<string>("");
  const [usePoints, setUsePoints] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch event details & customer wallet (aggregated PointLots + active Coupons)
  useEffect(() => {
    if (!id) return;

    const fetchPageData = async () => {
      try {
        setLoading(true);

        const localAuth = getAuthInfoFromStorage();
        setIsLoggedIn(localAuth.isLoggedIn);
        setUserRole(localAuth.role);

        // 1. Fetch event details by ID
        const eventRes = await axiosInstance.get(`/events/${id}`);
        setEvent(eventRes.data.data);

        // 2. Rules n & b: Fetch active points balance (aggregated point_lots) & user coupons from /transactions/wallet
        // Only call if the user is logged in to avoid 401 console errors for guests
        if (localAuth.isLoggedIn) {
          try {
            const walletRes = await axiosInstance.get("/transactions/wallet");
            const walletData = walletRes.data?.data;

            if (walletData) {
              setIsLoggedIn(true);
              if (walletData.role) {
                setUserRole(normalizeUserRole(walletData.role));
              }
              setUserPoints(Number(walletData.points ?? 0));
              setUserCoupons(walletData.coupons ?? []);
            }
          } catch {
            // Fallback to /auth/me if wallet endpoint fails
            try {
              const profileRes = await axiosInstance.get("/auth/me");
              const userData = profileRes.data?.data || profileRes.data;
              if (userData?.role) {
                setIsLoggedIn(true);
                setUserRole(normalizeUserRole(userData.role));
              }
            } catch {
              // Keep state derived from localAuth
            }
          }
        }
      } catch (err) {
        console.error("Failed to load event details:", err);
        toast.error("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [id]);

  // Pure function to format numbers strictly into Indonesian Rupiah (IDR)
  const formatIDR = (v: number) =>
    v === 0
      ? "Free"
      : new Intl.NumberFormat("en-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(v);

  // Pure state updater to increment/decrement selected ticket quantities within available seat limits
  const handleQuantityChange = (
    ticketId: number,
    delta: number,
    maxAvailable: number,
  ) => {
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

  // ============================================================================
  // PRICE CALCULATIONS FOLLOWING RULES c, d, f, g, h, j, n, o
  // ============================================================================
  const subtotalIDR = event.ticketTypes.reduce((acc, ticket) => {
    const qty = selectedTickets[ticket.id || 0] || 0;
    return acc + ticket.price * qty;
  }, 0);

  const totalSelectedTickets = Object.values(selectedTickets).reduce(
    (acc, q) => acc + q,
    0,
  );

  // Rules d & f: Voucher is only valid if maxUsage > (usedCount ?? 0) & applies once per transaction
  const now = new Date();
  const matchedVoucher = event.vouchers?.find(
    (v) =>
      v.code.toUpperCase() === voucherCodeInput.trim().toUpperCase() &&
      (v.isActive ?? true) &&
      (!v.startAt || new Date(v.startAt) <= now) &&
      new Date(v.expiresAt) >= now &&
      v.maxUsage > (v.usedCount ?? 0),
  );

  const voucherDiscountIDR = matchedVoucher
    ? Math.min(subtotalIDR, matchedVoucher.discountValue)
    : 0;

  // Transaction amount after voucher deduction
  const afterVoucherIDR = Math.max(0, subtotalIDR - voucherDiscountIDR);

  // Rules g, h, j:
  // - isUsed must be false
  // - Transaction amount AFTER voucher deduction must be at least IDR 30,000
  // - Coupon discount value is fixed at IDR 10,000
  const isEligibleForCoupon = afterVoucherIDR >= MIN_AFTER_VOUCHER_FOR_COUPON;

  const matchedCoupon = userCoupons.find(
    (c) =>
      c.code === selectedCouponCode &&
      !c.isUsed &&
      new Date(c.expiresAt) > now &&
      isEligibleForCoupon &&
      afterVoucherIDR >= c.minTransaction,
  );

  const couponDiscountIDR = matchedCoupon
    ? Math.min(afterVoucherIDR, FIXED_COUPON_VALUE)
    : 0;

  const afterCouponIDR = Math.max(0, afterVoucherIDR - couponDiscountIDR);

  // Rule o:
  // - Points are applied all at once (cannot manually adjust amount)
  // - Minimum transaction of IDR 100,000
  // - Maximum 20,000 points per transaction
  // - Multiples of 10,000 from 0 (0, 10,000, or 20,000)
  const maxRawPoints = Math.min(userPoints, MAX_POINTS_PER_TRX, afterCouponIDR);
  const usablePointsStep = Math.floor(maxRawPoints / POINT_STEP) * POINT_STEP;
  const canUsePoints =
    subtotalIDR >= MIN_TRX_FOR_POINTS && usablePointsStep >= POINT_STEP;

  const pointsDiscountIDR = usePoints && canUsePoints ? usablePointsStep : 0;

  // Final net price in IDR
  const finalTotalIDR = Math.max(0, afterCouponIDR - pointsDiscountIDR);

  // ============================================================================
  // SUBMIT TRANSACTION (Rule a: Only CUSTOMERS can purchase tickets)
  // ============================================================================
  const handleCheckoutSubmit = async () => {
    if (totalSelectedTickets === 0) {
      toast.warning("Please select at least 1 ticket first.");
      return;
    }

    const latestAuth = getAuthInfoFromStorage();
    const effectiveRole = userRole || latestAuth.role;
    const effectivelyLoggedIn = isLoggedIn || latestAuth.isLoggedIn;

    // GUARD 1: If user is not logged in (Guest), show toast and redirect to /login
    if (!effectivelyLoggedIn) {
      toast.info("Please log in as a Customer to purchase tickets.");
      navigate("/login");
      return;
    }

    // GUARD 2 (Rule a): If logged in as EVENTORGANIZER or ADMIN, show toast error & stay on page
    if (effectiveRole && effectiveRole !== "CUSTOMER") {
      toast.error(
        "Only Customer accounts can purchase tickets! Organizers and Admins are not allowed to buy tickets.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

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
        usePoints: Boolean(usePoints && canUsePoints),
      });

      const createdTransactionId = response.data.data.id;

      toast.success(
        "Transaction created! Please upload your payment proof within 2 hours.",
      );
      navigate(`/transactions/${createdTransactionId}`);
    } catch (err: any) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        "Failed to create transaction. Please try again.";

      if (status === 403) {
        toast.error("Only Customer accounts can purchase tickets!");
        return;
      }

      if (status === 401 && !effectivelyLoggedIn) {
        toast.info("Please log in first.");
        navigate("/login");
        return;
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter only active vouchers that still have remaining quota: maxUsage > (usedCount ?? 0)
  const availableVouchers = (event.vouchers ?? []).filter(
    (v) => (v.isActive ?? true) && v.maxUsage > (v.usedCount ?? 0),
  );

  return (
    <div className="bg-[#fbf7f4] min-h-screen">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="aspect-21/9 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
          <img
            src={event.thumbnail}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Event Information & Voucher Promotions */}
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

            {/* Active Vouchers List where maxUsage > (usedCount ?? 0) */}
            {availableVouchers.length > 0 && (
              <div className="p-4 bg-[#ffdfa5] rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Event Promotions Available
                  (Click to Apply)
                </h4>
                {availableVouchers.map((v) => (
                  <div
                    key={v.code}
                    onClick={() => {
                      setVoucherCodeInput(v.code);
                      toast.info(`Voucher "${v.code}" applied!`);
                    }}
                    className="flex justify-between items-center text-xs cursor-pointer hover:opacity-80"
                  >
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-bold">
                      {v.code}
                    </span>
                    <span className="text-slate-700">
                      Save {formatIDR(v.discountValue)} • Remaining Quota:{" "}
                      {v.maxUsage - (v.usedCount ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Ticket Selection & Checkout Summary */}
          <div className="space-y-4">
            <div className="bg-[#ffdfa5] p-5 rounded-xl shadow-sm space-y-4">
              <h3 className="font-bold text-base text-amber-800 flex items-center gap-1.5">
                <Ticket className="w-4 h-4" /> Select Tickets
              </h3>

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
                      <p className="text-sm font-semibold text-[#222432]">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {remaining > 0
                          ? `${remaining} seats remaining`
                          : "Sold Out"}
                      </p>
                    </div>

                    <div className="text-right space-y-1.5">
                      <span className="text-sm font-bold text-[#222432] block">
                        {formatIDR(t.price)}
                      </span>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          disabled={selectedQty <= 0}
                          onClick={() =>
                            handleQuantityChange(ticketId, -1, remaining)
                          }
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
                          onClick={() =>
                            handleQuantityChange(ticketId, 1, remaining)
                          }
                          className="p-1 bg-[#f4917b] text-[#222432] rounded hover:bg-[#ffc7b9] disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {totalSelectedTickets > 0 && (
                <div className="pt-3 border-t border-amber-300/70 space-y-3">
                  {/* 1. Event Voucher Input (Rules c, d, f) */}
                  <div>
                    <label className="block text-xs font-semibold text-amber-900 mb-1">
                      Event Voucher Code (Max. 1 Voucher / Transaction)
                    </label>
                    <input
                      type="text"
                      value={voucherCodeInput}
                      onChange={(e) =>
                        setVoucherCodeInput(e.target.value.toUpperCase())
                      }
                      placeholder="e.g. EARLYBIRD"
                      className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-[#fbf7f4] uppercase"
                    />
                    {matchedVoucher && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                        ✓ Voucher applied (-{formatIDR(voucherDiscountIDR)})
                      </p>
                    )}
                    {voucherCodeInput.trim() !== "" && !matchedVoucher && (
                      <p className="text-[11px] text-rose-600 mt-1">
                        Voucher is invalid or quota has run out.
                      </p>
                    )}
                  </div>

                  {/* 2. Referral Coupon Selector (Rules b, g, h, j) */}
                  {userCoupons.filter((c) => !c.isUsed).length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-amber-900 mb-1">
                        Referral Coupon (Discount{" "}
                        {formatIDR(FIXED_COUPON_VALUE)})
                      </label>
                      <select
                        value={selectedCouponCode}
                        disabled={!isEligibleForCoupon}
                        onChange={(e) => {
                          const code = e.target.value;
                          setSelectedCouponCode(code);
                          if (code) {
                            toast.info(
                              `Coupon "${code}" selected (-${formatIDR(FIXED_COUPON_VALUE)})`,
                            );
                          }
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-[#fbf7f4] disabled:opacity-50"
                      >
                        <option value="">Do not use a coupon</option>
                        {userCoupons
                          .filter((c) => !c.isUsed)
                          .map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} - Discount{" "}
                              {formatIDR(FIXED_COUPON_VALUE)}
                            </option>
                          ))}
                      </select>
                      {!isEligibleForCoupon && (
                        <p className="text-[11px] text-amber-800 mt-1">
                          * Minimum transaction value after voucher deduction is{" "}
                          {formatIDR(MIN_AFTER_VOUCHER_FOR_COUPON)} to use a
                          coupon.
                        </p>
                      )}
                    </div>
                  )}

                  {/* 3. Customer Points Toggle (Rules n, o, p) */}
                  {userPoints > 0 && (
                    <div className="p-2.5 rounded-lg bg-[#fbf7f4] border border-amber-300 space-y-1">
                      <label
                        className={`flex items-center justify-between ${
                          canUsePoints
                            ? "cursor-pointer"
                            : "opacity-60 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-amber-600" />
                          <div>
                            <p className="text-xs font-bold text-[#222432]">
                              Use My Points{" "}
                              {canUsePoints
                                ? `(${formatIDR(usablePointsStep)})`
                                : ""}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Active Balance: {formatIDR(userPoints)} (Max.
                              20,000/trx, in multiples of 10,000)
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          disabled={!canUsePoints}
                          checked={Boolean(usePoints && canUsePoints)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setUsePoints(checked);
                            if (checked) {
                              toast.info(
                                `Points applied (-${formatIDR(usablePointsStep)})`,
                              );
                            }
                          }}
                          className="rounded text-[#f4917b] focus:ring-0 disabled:cursor-not-allowed"
                        />
                      </label>
                      {subtotalIDR < MIN_TRX_FOR_POINTS && (
                        <p className="text-[10px] text-amber-800">
                          * Minimum transaction of{" "}
                          {formatIDR(MIN_TRX_FOR_POINTS)} required to use
                          points.
                        </p>
                      )}
                    </div>
                  )}

                  {/* 4. Price Calculation Summary in IDR */}
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

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleCheckoutSubmit}
                    className="w-full py-2.5 bg-[#f4917b] text-[#222432] rounded-lg text-xs font-bold hover:bg-[#ffc7b9] transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Processing Checkout..."
                      : "Checkout & Pay Now"}
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