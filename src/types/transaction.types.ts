export type StatusTransaction =
  | "WAITING_FOR_PAYMENT"
  | "WAITING_FOR_ADMIN_CONFIRMATION"
  | "DONE"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELED";

export interface UserCoupon {
  id: number;
  code: string;
  discountValue: number;
  minTransaction: number;
  expiresAt: string;
  isUsed: boolean;
}

export interface TransactionDetailModel {
  id: number;
  userId: number;
  status: StatusTransaction;
  subtotal: number;
  voucherDiscount: number;
  couponDiscount: number;
  pointsDiscount: number;
  totalAmount: number;
  paymentDeadline: string;
  adminDeadline: string | null;
  paymentProof: string | null;
  createdAt: string;
  transactionItems: Array<{
    id: number;
    ticketTypeId: number;
    quantity: number;
    price: number;
    ticketType: {
      id: number;
      name: string;
      event: {
        id: number;
        name: string;
        location: string;
        startDate: string;
        thumbnail: string;
      };
    };
  }>;
}