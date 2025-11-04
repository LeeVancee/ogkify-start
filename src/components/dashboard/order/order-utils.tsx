import {
  AlertCircle,
  AlertTriangle,
  ArrowDownUp,
  CheckCircle,
  Clock,
  Package,
  X,
} from "lucide-react";

// Get order status icon
export function getOrderStatusIcon(status: string) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "PAID":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "PENDING":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "CANCELLED":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Package className="h-5 w-5 text-gray-500" />;
  }
}

// Get payment status icon
export function getPaymentStatusIcon(status: string) {
  switch (status) {
    case "PAID":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "UNPAID":
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case "REFUNDED":
      return <ArrowDownUp className="h-5 w-5 text-blue-500" />;
    default:
      return <X className="h-5 w-5 text-gray-500" />;
  }
}

// Get order status name
export function getOrderStatusName(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "PAID":
      return "Processing";
    case "PENDING":
      return "Pending";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Unknown Status";
  }
}

// Get payment status name
export function getPaymentStatusName(status: string) {
  switch (status) {
    case "PAID":
      return "Paid";
    case "UNPAID":
      return "Unpaid";
    case "REFUNDED":
      return "Refunded";
    case "FAILED":
      return "Failed";
    default:
      return "Unknown Status";
  }
}
