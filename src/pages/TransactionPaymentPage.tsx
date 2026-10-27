import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import {
  Clock,
  Upload,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  MessageSquarePlus,
  Sparkles,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  useTransactionDetailQuery,
  useUploadPaymentProofMutation,
  useSubmitReviewMutation,
} from "@/hooks/useTransactionQueries";

// shadcn UI & ReUI imports
import { Rating } from "@/components/reui/rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const TransactionPaymentPage: React.FC = () => {
  const params = useParams<{ transactionId?: string; id?: string }>();
  const transactionId = params.transactionId || params.id;
  const navigate = useNavigate();
  const location = useLocation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Client UI state
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Review form UI state
  const [showReviewForm, setShowReviewForm] = useState<boolean>(
    location.hash === "#review",
  );
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  // 1. TanStack Query: Fetch Transaction Detail
  const {
    data: transaction,
    isLoading,
    error: queryError,
    refetch: refetchTransaction,
  } = useTransactionDetailQuery(transactionId);

  // 2. TanStack Mutation: Upload Payment Proof
  const uploadProofMutation = useUploadPaymentProofMutation(transactionId);

  // 3. TanStack Mutation: Submit Event Review
  const submitReviewMutation = useSubmitReviewMutation(transactionId);

  useEffect(() => {
    if (location.hash === "#review") {
      setShowReviewForm(true);
    }
  }, [location.hash]);

  // 2-Hour Countdown Timer
  useEffect(() => {
    if (!transaction || transaction.status !== "WAITING_FOR_PAYMENT") return;

    let hasTriggeredExpiryRefetch = false;

    const calculateRemaining = () => {
      const deadlineMs = new Date(transaction.paymentDeadline).getTime();
      const nowMs = Date.now();
      const diffSec = Math.max(0, Math.floor((deadlineMs - nowMs) / 1000));

      setRemainingSeconds(diffSec);

      if (diffSec === 0 && !hasTriggeredExpiryRefetch) {
        hasTriggeredExpiryRefetch = true;
        refetchTransaction();
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [transaction, refetchTransaction]);

  const formatCountdown = (totalSec: number): string => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return [hrs, mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
  };

  const formatIDR = (v: number): string =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(v || 0);

  // Upload payment proof handler using useMutation
  const handleUploadProof = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile || !transactionId || uploadProofMutation.isPending)
      return;

    const isReupload = transaction?.status === "WAITING_FOR_ADMIN_CONFIRMATION";
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await uploadProofMutation.mutateAsync(selectedFile);

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      const msg = isReupload
        ? "Payment proof successfully re-uploaded!"
        : "Payment proof uploaded! Waiting for organizer confirmation.";
      setSuccessMsg(msg);
      toast.success(msg);
    } catch (err: any) {
      const errText = err.response?.data?.message || "Upload failed";
      setErrorMsg(errText);
      toast.error(errText);
    }
  };

  // Submit Review handler using useMutation
  const handleReviewSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!transaction || submitReviewMutation.isPending) return;

    if (rating === 0) {
      toast.warning("Please choose a rating between 1 and 5 stars.");
      return;
    }

    if (!comment || comment.trim().length < 3) {
      toast.warning("Please write a review comment (minimum 3 characters).");
      return;
    }

    try {
      await submitReviewMutation.mutateAsync({
        transactionId: transaction.id,
        rating,
        comment: comment.trim(),
      });

      toast.success("Thank you! Your review has been submitted.");
      setShowReviewForm(false);
      setComment("");
      setRating(0);
    } catch (err: any) {
      const errText =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit review.";
      toast.error(errText);
    }
  };

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
    const fetchErrMsg =
      (queryError as any)?.response?.data?.message ||
      errorMsg ||
      "Transaction not found.";

    return (
      <div className="bg-[#fbf7f4] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 p-10 text-center text-sm text-red-600 font-semibold">
          {fetchErrMsg}
        </div>
        <Footer />
      </div>
    );
  }

  const isRolledBackStatus =
    transaction.status === "EXPIRED" ||
    transaction.status === "CANCELED" ||
    transaction.status === "REJECTED";

  const hasUploadedProof =
    Boolean(transaction.paymentProof) &&
    transaction.paymentProof !== "FREE_OR_FULLY_COVERED";

  const canUploadOrReupload =
    transaction.status === "WAITING_FOR_PAYMENT" ||
    (transaction.status === "WAITING_FOR_ADMIN_CONFIRMATION" &&
      transaction.paymentProof !== "FREE_OR_FULLY_COVERED");

  const firstEvent = (transaction.transactionItems?.[0]?.ticketType as any)
    ?.event;
  const eventName = firstEvent?.name || "Event Ticket Transaction";
  const eventEndDateStr = firstEvent?.endDate;

  const isEventEnded = eventEndDateStr
    ? new Date(eventEndDateStr).getTime() < Date.now()
    : false;

  const existingReview = (transaction as any).attendances?.[0]?.reviews?.[0];
  const canReviewThisTransaction =
    transaction.status === "DONE" && isEventEnded;

  return (
    <div className="bg-[#fbf7f4] min-h-screen flex flex-col">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex-1 max-w-xl w-full mx-auto px-4 py-12 space-y-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Transactions
        </button>

        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6 border border-amber-200">
          <div className="flex justify-between items-start border-b pb-4">
            <div>
              <span className="text-xs text-slate-400">
                Transaction #{transaction.id}
              </span>
              <h2 className="text-lg font-extrabold text-amber-900 mt-0.5">
                {eventName}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ffdfa5] text-amber-900">
              {String(transaction.status).replace(/_/g, " ")}
            </span>
          </div>

          {/* 2-Hour Countdown */}
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

          {transaction.status === "WAITING_FOR_ADMIN_CONFIRMATION" && (
            <div className="p-4 bg-[#ffc7b9] border border-[#ffdfa5] rounded-xl flex items-center gap-3 text-xs text-[#222432]">
              <CheckCircle2 className="w-5 h-5 text-[#4eb2a0] shrink-0" />
              <div>
                <p className="font-bold">Payment Proof Uploaded!</p>
                <p>
                  Waiting for organizer confirmation. You can still re-upload a
                  receipt below until confirmed.
                </p>
              </div>
            </div>
          )}

          {transaction.status === "DONE" && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Transaction Confirmed!</p>
                <p>Your ticket payment has been approved by the organizer.</p>
              </div>
            </div>
          )}

          {isRolledBackStatus && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-xs text-red-900">
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">Transaction {transaction.status}</p>
                <p>
                  Used points, vouchers, coupons, and reserved seats have been
                  restored.
                </p>
              </div>
            </div>
          )}

          {/* Breakdown */}
          <div className="space-y-2 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900">Order Breakdown</h4>
            {(transaction.transactionItems ?? []).map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.ticketType?.name || "Ticket"} x {item.quantity}
                </span>
                <span>{formatIDR(item.price * item.quantity)}</span>
              </div>
            ))}

            <div className="flex justify-between pt-1 text-slate-500">
              <span>Subtotal</span>
              <span>{formatIDR(transaction.subtotal)}</span>
            </div>

            {transaction.voucherDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Voucher Discount</span>
                <span>-{formatIDR(transaction.voucherDiscount)}</span>
              </div>
            )}

            {transaction.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon Discount</span>
                <span>-{formatIDR(transaction.couponDiscount)}</span>
              </div>
            )}

            {transaction.pointsDiscount > 0 && (
              <div className="flex justify-between text-amber-700">
                <span>Points Used</span>
                <span>-{formatIDR(transaction.pointsDiscount)}</span>
              </div>
            )}

            <div className="border-t pt-2 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Final Amount to Transfer</span>
              <span className="text-amber-800">
                {formatIDR(transaction.totalAmount)}
              </span>
            </div>
          </div>

          {/* Payment Proof Link */}
          {hasUploadedProof && (
            <div className="pt-3 border-t flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                Current Payment Proof
              </span>
              <a
                href={transaction.paymentProof!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-amber-800 hover:underline"
              >
                View Uploaded Image <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Upload / Re-upload Form */}
          {canUploadOrReupload && (
            <form
              onSubmit={handleUploadProof}
              className="space-y-4 pt-4 border-t"
            >
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  {hasUploadedProof
                    ? "Re-upload Payment Proof (JPG/PNG)"
                    : "Upload Payment Proof (JPG/PNG)"}
                </label>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                required
                disabled={uploadProofMutation.isPending}
                onChange={(e) => {
                  setSelectedFile(e.target.files?.[0] || null);
                  setSuccessMsg(null);
                  setErrorMsg(null);
                }}
                className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#ffdfa5] file:text-amber-900 file:font-semibold disabled:opacity-50"
              />

              {errorMsg && (
                <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
              )}
              {successMsg && (
                <p className="text-xs text-emerald-700 font-medium">
                  {successMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={!selectedFile || uploadProofMutation.isPending}
                className="w-full py-2.5 bg-[#f4917b] text-[#222432] font-bold rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-[#ffc7b9] transition disabled:opacity-40"
              >
                {hasUploadedProof ? (
                  <RefreshCw
                    className={`w-4 h-4 ${
                      uploadProofMutation.isPending ? "animate-spin" : ""
                    }`}
                  />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploadProofMutation.isPending
                  ? "Uploading..."
                  : hasUploadedProof
                    ? "Re-upload Proof"
                    : "Submit Payment Proof"}
              </button>
            </form>
          )}

          {/* Review Section */}
          {canReviewThisTransaction && (
            <div
              id="review"
              className="pt-4 border-t border-amber-200 space-y-4"
            >
              {existingReview ? (
                <Card className="border-amber-200 bg-[#fbf7f4]">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">
                        Your Submitted Review
                      </span>
                      <Rating rating={existingReview.rating} editable={false} />
                    </div>
                    <p className="text-xs text-slate-700 italic">
                      &ldquo;{existingReview.comment}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {!showReviewForm ? (
                    <Button
                      type="button"
                      onClick={() => setShowReviewForm(true)}
                      className="w-full gap-2 bg-[#f4917b] text-[#222432] font-bold hover:bg-[#ffc7b9]"
                    >
                      <MessageSquarePlus className="w-4 h-4" />
                      Write a Review
                    </Button>
                  ) : (
                    <Card className="border-amber-300 bg-white">
                      <CardContent className="p-5 space-y-5">
                        <div className="flex justify-between items-center border-b pb-3">
                          <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            Write a Review for &ldquo;{eventName}&rdquo;
                          </h3>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="text-xs text-slate-400 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#fbf7f4] border border-amber-100">
                          <Rating
                            rating={rating}
                            onRatingChange={setRating}
                            editable
                          />
                          {rating > 0 && (
                            <p className="text-xs font-medium text-slate-600">
                              {rating <= 2
                                ? "We're sorry to hear that"
                                : rating <= 3
                                  ? "Thanks for your feedback"
                                  : "Glad you enjoyed the event!"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="review-comment"
                            className="text-xs font-semibold text-slate-700"
                          >
                            Your feedback
                          </Label>
                          <Textarea
                            id="review-comment"
                            rows={3}
                            disabled={submitReviewMutation.isPending}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience attending this event..."
                            className="text-xs focus-visible:ring-[#f4917b]"
                          />
                        </div>

                        <Button
                          type="button"
                          disabled={
                            rating === 0 || submitReviewMutation.isPending
                          }
                          onClick={() => handleReviewSubmit()}
                          className="w-full bg-[#f4917b] text-[#222432] font-bold hover:bg-[#ffc7b9] disabled:opacity-40"
                          size="sm"
                        >
                          {submitReviewMutation.isPending
                            ? "Submitting..."
                            : "Submit Review"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};