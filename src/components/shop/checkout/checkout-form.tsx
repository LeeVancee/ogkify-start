import { Loader2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactFormSection } from "./contact-form-section";
import { PaymentMethodSection } from "./payment-method-section";
import { ShippingAddressSection } from "./shipping-address-section";

interface CheckoutFormProps {
  onSubmit: (formData: any) => void;
  isSubmitting: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
    sameShippingAddress: true,
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, sameShippingAddress: checked }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <ContactFormSection
          formData={{ email: formData.email, phone: formData.phone }}
          onChange={handleChange}
        />

        <ShippingAddressSection
          formData={{
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
            sameShippingAddress: formData.sameShippingAddress,
          }}
          onChange={handleChange}
          onCheckboxChange={handleCheckboxChange}
        />

        <PaymentMethodSection
          formData={{
            paymentMethod: formData.paymentMethod,
            cardNumber: formData.cardNumber,
            cardExpiry: formData.cardExpiry,
            cardCvc: formData.cardCvc,
            sameShippingAddress: formData.sameShippingAddress,
          }}
          onChange={handleChange}
          onRadioChange={handleRadioChange}
        />

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Complete Order"
          )}
        </Button>
      </div>
    </form>
  );
}
