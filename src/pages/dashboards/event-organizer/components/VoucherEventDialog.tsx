import { useState } from "react";
import { Plus, Search, Trash2, TicketPercent } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { EventItem } from "./EditEventDialog";

interface Voucher {
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
}

interface VoucherDialogProps {
  event: EventItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface VoucherForm {
  code: string;
  notes: string;
  discountValue: string;
  maxUsage: string;
  startAt: string;
  expiresAt: string;
  isActive: boolean;
}

const initialVouchers: Voucher[] = [
  {
    id: 1,
    eventId: 1,
    code: "EARLYBIRD20",
    notes: "Early bird discount",
    discountValue: 20000,
    maxUsage: 50,
    usedCount: 12,
    startAt: "2026-10-01T09:00",
    expiresAt: "2026-11-01T23:59",
    isActive: true,
  },
  {
    id: 2,
    eventId: 1,
    code: "SPECIAL10",
    notes: "Special event discount",
    discountValue: 10000,
    maxUsage: 30,
    usedCount: 30,
    startAt: "2026-10-01T09:00",
    expiresAt: "2026-11-01T23:59",
    isActive: true,
  },
];

const initialForm: VoucherForm = {
  code: "",
  notes: "",
  discountValue: "",
  maxUsage: "",
  startAt: "",
  expiresAt: "",
  isActive: true,
};

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function VoucherEventDialog({
  event,
  open,
  onOpenChange,
}: VoucherDialogProps) {
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [form, setForm] = useState<VoucherForm>(initialForm);
  const [error, setError] = useState("");

  const eventVouchers = vouchers.filter(
    (voucher) =>
      voucher.eventId === event?.id &&
      voucher.code.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (voucherId: number) => {
    setVouchers((currentVouchers) =>
      currentVouchers.filter((voucher) => voucher.id !== voucherId),
    );
  };

  const handleCreateVoucher = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!event) {
      setError("Please select an event first.");
      return;
    }

    const discountValue = Number(form.discountValue);
    const maxUsage = Number(form.maxUsage);

    if (
      !form.code.trim() ||
      !form.notes.trim() ||
      !form.startAt ||
      !form.expiresAt
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (discountValue <= 0 || maxUsage <= 0) {
      setError("Discount and maximum usage must be greater than zero.");
      return;
    }

    if (new Date(form.expiresAt) <= new Date(form.startAt)) {
      setError("Expiry date must be later than the start date.");
      return;
    }

    const normalizedCode = form.code.trim().toUpperCase();

    const duplicateCode = vouchers.some(
      (voucher) =>
        voucher.eventId === event.id &&
        voucher.code.toUpperCase() === normalizedCode,
    );

    if (duplicateCode) {
      setError("This voucher code already exists for this event.");
      return;
    }

    const newVoucher: Voucher = {
      id: Date.now(),
      eventId: event.id,
      code: normalizedCode,
      notes: form.notes.trim(),
      discountValue,
      maxUsage,
      usedCount: 0,
      startAt: form.startAt,
      expiresAt: form.expiresAt,
      isActive: form.isActive,
    };

    setVouchers((currentVouchers) => [...currentVouchers, newVoucher]);
    setForm(initialForm);
    setIsCreateOpen(false);
    setSearch("");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Event Vouchers</DialogTitle>
            <DialogDescription>
              Manage vouchers for {event?.name ?? "this event"}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search voucher code..."
                className="pl-9"
              />
            </div>

            <Button type="button" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 size-4" />
              Add Voucher
            </Button>
          </div>

          <div className="space-y-3">
            {eventVouchers.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <TicketPercent className="mx-auto mb-3 size-8 text-muted-foreground" />
                <p className="font-medium">No vouchers found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add a voucher for this event to get started.
                </p>
              </div>
            ) : (
              eventVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{voucher.code}</span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          !voucher.isActive
                            ? "bg-muted text-muted-foreground"
                            : voucher.usedCount >= voucher.maxUsage
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {!voucher.isActive
                          ? "Inactive"
                          : voucher.usedCount >= voucher.maxUsage
                            ? "Fully Used"
                            : "Active"}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {voucher.notes}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-muted-foreground">Discount</p>
                        <p className="font-medium">
                          {currencyFormatter.format(voucher.discountValue)}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Usage</p>
                        <p className="font-medium">
                          {voucher.usedCount}/{voucher.maxUsage}
                        </p>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-muted-foreground">Expires</p>
                        <p className="font-medium">
                          {new Date(voucher.expiresAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="self-end text-destructive hover:text-destructive sm:self-center"
                    aria-label={`Delete voucher ${voucher.code}`}
                    onClick={() => handleDelete(voucher.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Voucher Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Voucher</DialogTitle>
            <DialogDescription>
              Create a voucher for {event?.name ?? "this event"}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateVoucher} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Voucher Code</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. EARLYBIRD20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Description</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Describe this voucher..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount (IDR)</Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="1"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm({ ...form, discountValue: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUsage">Maximum Usage</Label>
                <Input
                  id="maxUsage"
                  type="number"
                  min="1"
                  value={form.maxUsage}
                  onChange={(e) =>
                    setForm({ ...form, maxUsage: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startAt">Start Date</Label>
              <Input
                id="startAt"
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date</Label>
              <Input
                id="expiresAt"
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm({ ...form, expiresAt: e.target.value })
                }
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="size-4"
              />
              <Label htmlFor="isActive">Activate voucher</Label>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  setError("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Create Voucher</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
