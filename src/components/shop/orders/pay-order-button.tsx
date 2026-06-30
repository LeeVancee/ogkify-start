import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createOrderPaymentIntent } from "@/server/shop/orders";

interface PayOrderButtonProps {
  orderId: string;
}

export function PayOrderButton({ orderId }: PayOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handlePayment() {
    setIsLoading(true);

    const result = await createOrderPaymentIntent({ data: orderId }).catch(
      (error: unknown) => ({
        success: false as const,
        error:
          error instanceof Error ? error.message : "Payment process failed",
      }),
    );

    if (result.success) {
      navigate({
        to: "/checkout",
        search: {
          order_id: result.orderId,
        },
      });
    } else {
      toast.error(result.error || "Failed to initialize payment");
    }
    setIsLoading(false);
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
