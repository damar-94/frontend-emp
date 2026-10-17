import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { Clock, Upload, CheckCircle2, XCircle } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { TransactionDetailModel } from "@/types/transaction.types";

export const TransactionPaymentPage: React.FC = () => {
  // 1. Support both `/transactions/:transactionId` and `/transactions/:id` route definitions
  const params = useParams<{ transactionId?: string; id?: string }>();
  const transactionId = params.transactionId || params.id;

  // 2. Regular state for transaction data, loading, countdown seconds, and file upload
  const [transaction, setTransaction] = useState<TransactionDetailModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 3. Pure function to load transaction from backend (memoized with useCallback)
  const fetchTransaction = useCallback(async () => {
    if (!transactionId) {
      setErrorMsg("Invalid transaction ID in URL.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.get(`/transactions/${transactionId}`);
      setTransaction(res.data.data);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to load transaction");
    } finally {
      setIsLoading(false);
    }
  }, [transactionId]);

  // 4. Initial fetch on mount
  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  // 5. 2-Hour Real-time Countdown Timer Effect
  useEffect(() => {
    if (!transaction || transaction.status !== "WAITING_FOR_PAYMENT") return;

    let hasTriggeredExpiryRefetch = false;

    const calculateRemaining = () => {
      const deadlineMs = new Date(transaction.paymentDeadline).getTime();
      const nowMs = Date.now();
      const diffSec = Math.max(0, Math.floor((deadlineMs - nowMs) / 1000));

      setRemainingSeconds(diffSec);

      // When countdown reaches 0, re-fetch ONCE to trigger backend EXPIRED rollback
      if (diffSec === 0 && !hasTriggeredExpiryRefetch) {
        hasTriggeredExpiryRefetch = true;
        fetchTransaction();
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [transaction?.id, transaction?.status, transaction?.paymentDeadline, fetchTransaction]);

  // 6. Pure helper to format seconds as HH:MM:SS
  const formatCountdown = (totalSec: number): string => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return [hrs, mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
  };

  // 7. Pure helper to format IDR currency
  const formatIDR = (v: number): string =>
    new Intl.NumberFormat("en-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(v || 0);

  // 8. Handler for submitting payment proof image via multipart/form-data
  const handleUploadProof = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile || !transactionId) return;

    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("paymentProof", selectedFile);

    try {
      const res = await axiosInstance.patch(
        `/transactions/${transactionId}/payment-proof`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setTransaction(res.data.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // 9. Handle loading and error states before rendering main return
  if (isLoading) {
    return (
      <div className="bg-[#fbf7f4] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 p-10 text-center text-sm text-slate-600">
          Loading transaction...
        </div>
        <Footer />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="bg-[#fbf7f4] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 p-10 text-center text-sm text-red-600 font-semibold">
          {errorMsg || "Transaction not found."}
        </div>
        <Footer />
      </div>
    );
  }

  // Safely check if status is one of the rolled-back states
  const isRolledBackStatus =
    transaction.status === "EXPIRED" ||
    transaction.status === "CANCELED" ||
    transaction.status === "REJECTED";

  return (
    <div className="bg-[#fbf7f4] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-xl w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6 border border-amber-200">
          {/* Header: Transaction ID & Status Badge */}
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <span className="text-xs text-slate-400">Transaction ID</span>
              <h2 className="text-lg font-extrabold text-amber-900">
                #{transaction.id}
              </h2>
            </div>
            {/* Fixed: Use .replace(/_/g, " ") instead of .replaceAll("_", " ") for TS compatibility */}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ffdfa5] text-amber-900">
              {String(transaction.status).replace(/_/g, " ")}
            </span>
          </div>

          {/* 2-Hour Countdown Box (Only shown when WAITING_FOR_PAYMENT) */}
          {transaction.status === "WAITING_FOR_PAYMENT" && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-700 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    Payment Proof Upload Deadline
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Auto-expires & restores seats if not uploaded in 2 hours
                  </p>
                </div>
              </div>
              <span className="font-mono text-lg font-black text-red-600">
                {formatCountdown(remainingSeconds)}
              </span>
            </div>
          )}

          {/* Status Banner for Waiting for Admin Confirmation */}
          {transaction.status === "WAITING_FOR_ADMIN_CONFIRMATION" && (
            <div className="p-4 bg-[#ffc7b9] border border-[#ffdfa5] rounded-xl flex items-center gap-3 text-xs text-[#222432]">
              <CheckCircle2 className="w-5 h-5 text-[#4eb2a0] shrink-0" />
              <div>
                <p className="font-bold">Payment Proof Uploaded!</p>
                <p>
                  Waiting for organizer confirmation (auto-cancels & refunds if
                  no response within 3 days).
                </p>
              </div>
            </div>
          )}

          {/* Status Banner for DONE */}
          {transaction.status === "DONE" && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Transaction Confirmed!</p>
                <p>Your ticket payment has been approved by the organizer.</p>
              </div>
            </div>
          )}

          {/* Status Banner for Expired / Canceled / Rejected */}
          {isRolledBackStatus && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-900">
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">Transaction {transaction.status}</p>
                <p>
                  Your used points, vouchers, coupons, and reserved seats have
                  been automatically restored.
                </p>
              </div>
            </div>
          )}

          {/* Payment Summary with Safe Optional Chaining */}
          <div className="space-y-2 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900">Order Breakdown</h4>

            {(transaction.transactionItems ?? []).map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.ticketType?.name || "Event Ticket"} x {item.quantity}
                </span>
                <span>{formatIDR(item.price * item.quantity)}</span>
              </div>
            ))}

            {transaction.voucherDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Voucher Discount</span>
                <span>- {formatIDR(transaction.voucherDiscount)}</span>
              </div>
            )}

            {transaction.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon Discount</span>
                <span>- {formatIDR(transaction.couponDiscount)}</span>
              </div>
            )}

            {transaction.pointsDiscount > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>Points Used</span>
                <span>- {formatIDR(transaction.pointsDiscount)}</span>
              </div>
            )}

            <div className="border-t pt-2 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Final Amount to Transfer</span>
              <span className="text-amber-800">
                {formatIDR(transaction.totalAmount)}
              </span>
            </div>
          </div>

          {/* Upload Payment Proof Form */}
          {transaction.status === "WAITING_FOR_PAYMENT" && (
            <form onSubmit={handleUploadProof} className="space-y-4 pt-4 border-t">
              <label className="block text-xs font-bold text-slate-800">
                Upload Payment Proof (JPG/PNG)
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#ffdfa5] file:text-amber-900 file:font-semibold"
              />
              {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}
              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="w-full py-2.5 bg-[#f4917b] text-[#222432] font-bold rounded-lg text-xs flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? "Uploading Proof..." : "Submit Payment Proof"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};