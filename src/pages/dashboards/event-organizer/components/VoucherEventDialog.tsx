import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetVoucherEvent } from "@/hooks/API/dashboard/organizerDashboard/useGetVoucherEvent";

interface VoucherDialogProps {
  event: {
    id: number;
    name: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
  const {
    data: vouchers = [],
    isLoading,
    isError,
  } = useGetVoucherEvent(event?.id ?? 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-gray-900">
            Event Vouchers
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500">
            Vouchers for {event?.name ?? "this event"}.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Loading vouchers...
          </p>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-red-500">
            Failed to load vouchers.
          </p>
        ) : vouchers.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No vouchers found for this event.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="h-12 whitespace-nowrap px-6 font-semibold text-gray-600">
                      Voucher Code
                    </TableHead>

                    <TableHead className="h-12 whitespace-nowrap px-6 font-semibold text-gray-600">
                      Discount
                    </TableHead>

                    <TableHead className="h-12 whitespace-nowrap px-6 font-semibold text-gray-600">
                      Max Usage
                    </TableHead>

                    <TableHead className="h-12 whitespace-nowrap px-6 font-semibold text-gray-600">
                      Start Date
                    </TableHead>

                    <TableHead className="h-12 whitespace-nowrap px-6 font-semibold text-gray-600">
                      Expiry Date
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {vouchers.map((voucher) => (
                    <TableRow
                      key={voucher.code}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <TableCell className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                        {voucher.code}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {currencyFormatter.format(voucher.discountValue)}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-sm text-gray-900">
                        {voucher.maxUsage}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(voucher.startAt).toLocaleDateString("id-ID")}
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(voucher.expiresAt).toLocaleDateString(
                          "id-ID",
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
