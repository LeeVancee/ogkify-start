import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { formatPrice } from "@/lib/utils";

import type { Order } from "./order-types";
import {
  getOrderStatusIcon,
  getOrderStatusName,
  getPaymentStatusIcon,
  getPaymentStatusName,
} from "./order-utils";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onUpdateStatus: (order: Order) => void;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
  onUpdateStatus,
}: OrderDetailsDialogProps) {
  if (!open && !order) {
    return <></>;
  }

  if (!order) {
    throw new Error(
      "Selected order is required when order details dialog is open",
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl">
            Order Details #{order.orderNumber}
          </DialogTitle>
          <DialogDescription className="text-base">
            Created at {new Date(order.createdAt).toLocaleString("zh-CN")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="space-y-3 p-4 rounded-lg border">
            <h3 className="font-medium text-lg">Order Information</h3>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium min-w-[80px]">Order Status:</span>
                <div className="flex items-center gap-1">
                  {getOrderStatusIcon(order.status)}
                  <span>{getOrderStatusName(order.status)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium min-w-[80px]">
                  Payment Status:
                </span>
                <div className="flex items-center gap-1">
                  {getPaymentStatusIcon(order.paymentStatus)}
                  <span>{getPaymentStatusName(order.paymentStatus)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium min-w-[80px]">Total Amount:</span>
                <span className="font-semibold">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium min-w-[80px]">Total Items:</span>
                <span>{order.totalItems}</span>
              </div>
              {order.customer && (
                <div className="flex items-center gap-2">
                  <span className="font-medium min-w-[80px]">Customer:</span>
                  <span>{order.customer}</span>
                </div>
              )}
              {order.email && (
                <div className="flex items-center gap-2">
                  <span className="font-medium min-w-[80px]">Email:</span>
                  <span>{order.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-lg border">
            <h3 className="font-medium text-lg">Shipping Information</h3>
            <div className="text-sm space-y-2">
              {order.shippingAddress ? (
                <>
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[80px]">
                      Shipping Address:
                    </span>
                    <span className="flex-1">{order.shippingAddress}</span>
                  </div>
                  {order.phone && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium min-w-[80px]">Phone:</span>
                      <span>{order.phone}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground">
                  No shipping information
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 className="font-medium text-lg mb-3">Order Items</h3>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px]">Product</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <div className="h-16 w-16 overflow-hidden rounded-md">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.color && `Color: ${item.color.name}`}
                          {item.color && item.size && " | "}
                          {item.size && `Size: ${item.size.name}`}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatPrice(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-8 pt-4 border-t">
          <div className="mr-auto text-xl font-bold">
            Total: {formatPrice(order.totalAmount)}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onUpdateStatus(order);
            }}
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
