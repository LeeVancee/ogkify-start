import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactFormData {
  email: string;
  phone: string;
}

interface ContactFormSectionProps {
  formData: ContactFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactFormSection({
  formData,
  onChange,
}: ContactFormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={onChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(123) 456-7890"
            value={formData.phone}
            onChange={onChange}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
