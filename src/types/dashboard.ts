import type { PaginationResponse } from "./pagination";

export interface TotalCustomerResponse {
  totalCustomers: number;
}

export interface TotalOrganizerResponse {
  totalOrganizers: number;
}

export interface TotalEventResponse {
  totalEvents: number;
}

export interface TotalCategoryResponse {
  totalCategories: number;
}

// ManageUsers

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "EVENTORGANIZER" | "CUSTOMER";
  createdAt: string;
}

export interface GetUsersParams {
  page?: number;
  take?: number;
  sortOrder?: "asc" | "desc";
  sortBy?: string;
  search?: string;
  role?: "ALL" | "ADMIN" | "EVENTORGANIZER" | "CUSTOMER";
}

export interface GetUsersResponse extends PaginationResponse<AdminUser> {}

// Dashboard Organizer

export interface FindOrganizerEvents {
  data: {
    id: number;
    userId: number;
    categoryId: number;
    name: string;
    description: string;
    location: string;
    totalSeat: number;
    availableSeat: number;
    startDate: string;
    endDate: string;
    thumbnail: string;
    createdAt: string;
    updatedAt: string;
    category: {
      id: number;
      name: string;
      createdAt: string;
    };
    ticketTypes: {
      id: number;
      eventId: number;
      name: string;
      price: number;
      totalSeat: number;
      availableSeat: number;
      createdAt: string;
    }[];
    vouchers: {
      id: number;
      eventId: number;
      code: string;
      notes: string;
      discountValue: number;
      maxUsage: number;
      usedCount: number;
      startAt: string;
      expiresAt: string;
      isActive: boolean;
      createdAt: string;
    }[];
    ticketSold: number;
  }[];
}

export type UpdateEventInput = {
  categoryId: number;
  name: string;
  description: string;
  location: string;
  totalSeat: number;
  startDate: string;
  endDate: string;
  thumbnail: string;
};

export interface OrganizerGuest {
  id: number;
  name: string;
  ticketQuantity: number;
  totalAmount: number;
}

export interface OrganizerGuestListResponse {
  data: OrganizerGuest[];
  meta: {
    page: number;
    take: number;
    total: number;
  };
}

// sales analytics
export interface SalesAnalyticsItem {
  label: string;
  tickets: number;
  revenue: number;
}

export type SalesPeriod = "year" | "month" | "day";

// table transactions

export type TransactionStatusFilter =
  | "ALL"
  | "WAITING_FOR_ADMIN_CONFIRMATION"
  | "DONE"
  | "REJECTED";

export interface OrganizerTransaction {
  id: number;
  status:
    | "WAITING_FOR_PAYMENT"
    | "WAITING_FOR_ADMIN_CONFIRMATION"
    | "DONE"
    | "REJECTED"
    | "EXPIRED"
    | "CANCELED";
  customerName: string;
  customerEmail: string;
  eventName: string;
  eventDate: string | null;
  transactionDate: string;
  ticketQuantity: number;
  totalPayment: number;
  paymentProof: string | null;
}
