export interface TicketTypeItem {
  id?: number;
  name: string;
  price: number;
  totalSeat: number;
  availableSeat?: number;
}

export interface VoucherItem {
  id?: number;
  code: string;
  notes?: string;
  discountValue: number;
  maxUsage: number;
  usedCount?: number;
  startAt: string;
  expiresAt: string;
  isActive?: boolean;
}

export interface EventModel {
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
  category: { id: number; name: string };
  ticketTypes: TicketTypeItem[];
  vouchers: VoucherItem[];
}