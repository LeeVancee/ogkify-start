import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateOrderStatus } from "@/server/orders.server";

// Define order type
interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
}

type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

// Define order status options - corresponds to actual UI display
const orderStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" }, // Frontend displays as "Processing", but maps to PAID
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

// Define component props
interface UpdateOrderStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  onStatusUpdated: () => void;
}

export function UpdateOrderStatusDialog({
  open,
  onOpenChange,
  order,
  onStatusUpdated,
}: UpdateOrderStatusDialogProps) {
  const router = useRouter();

  // Initial status, map PAID to PROCESSING for UI display
  const initialStatus =
    order.status === "PAID" ? "PROCESSING" : (order.status as OrderStatus);
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleUpdate() {
    if (!order.id) return;

    setIsUpdating(true);
    try {
      // Call update order status API
      const result = await updateOrderStatus({
        data: { orderId: order.id, status },
      });

      if (result.success) {
        toast.success("Order status updated");

        // Call the callback to refresh data
        onStatusUpdated();

        // Navigate back to orders page
        router.navigate({ to: "/dashboard/orders" });
      } else {
        toast.error(result.error || "Update order status failed");
      }
    } catch (error) {
      console.error("Update order status failed:", error);
      toast.error("Update order status failed");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Order Number: {order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={status}
            onValueChange={(value) => setStatus(value as OrderStatus)}
          >
            {orderStatusOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 mb-2"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
