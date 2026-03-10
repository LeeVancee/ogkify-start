import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentMethodData {
  paymentMethod: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  sameShippingAddress: boolean;
}

interface PaymentMethodSectionProps {
  formData: PaymentMethodData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRadioChange: (value: string) => void;
}

export function PaymentMethodSection({
  formData,
  onChange,
  onRadioChange,
}: PaymentMethodSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <RadioGroup
          value={formData.paymentMethod}
          onValueChange={(value) => onRadioChange(String(value))}
          className="grid gap-4"
        >
          <div className="flex items-center space-x-2 rounded-lg border p-4">
            <RadioGroupItem value="card" id="payment-card" />
            <Label htmlFor="payment-card" className="flex-1">
              Credit / Debit Card
            </Label>
          </div>
          <div className="flex items-center space-x-2 rounded-lg border p-4">
            <RadioGroupItem value="paypal" id="payment-paypal" />
            <Label htmlFor="payment-paypal" className="flex-1">
              PayPal
            </Label>
          </div>
        </RadioGroup>

        {formData.paymentMethod === "card" && (
          <Tabs defaultValue="card" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card">Card Details</TabsTrigger>
              <TabsTrigger value="billing">Billing Address</TabsTrigger>
            </TabsList>
            <TabsContent value="card" className="grid gap-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={onChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    name="cardExpiry"
                    placeholder="MM/YY"
                    value={formData.cardExpiry}
                    onChange={onChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    name="cardCvc"
                    placeholder="123"
                    value={formData.cardCvc}
                    onChange={onChange}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="billing" className="pt-4">
              {formData.sameShippingAddress ? (
                <div className="text-sm text-muted-foreground">
                  Using the same address as shipping address.
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="billingAddress">Address</Label>
                    <Input id="billingAddress" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="billingCity">City</Label>
                      <Input id="billingCity" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="billingState">State</Label>
                      <Input id="billingState" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="billingPostalCode">Postal Code</Label>
                      <Input id="billingPostalCode" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="billingCountry">Country</Label>
                    <Input id="billingCountry" defaultValue="US" />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
