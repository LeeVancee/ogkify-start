import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createOrderPaymentIntent } from "@/server/orders";

interface PayOrderButtonProps {
  orderId: string;
}

export function PayOrderButton({ orderId }: PayOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handlePayment() {
    setIsLoading(true);

    try {
      const result = await createOrderPaymentIntent({ data: orderId });

      if (!result.success) {
        throw new Error(result.error || "Failed to initialize payment");
      }

      navigate({
        to: "/checkout",
        search: {
          order_id: result.orderId,
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error instanceof Error ? error.message : "Payment process failed",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button onClick={handlePayment} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Pay Now"
      )}
    </Button>
  );
}
