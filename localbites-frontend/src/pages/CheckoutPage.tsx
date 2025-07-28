import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

export default function CheckoutPage() {
  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Shipping Information</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Full Name" />
          <Input placeholder="Email Address" type="email" />
          <Input placeholder="Phone Number" type="tel" />
          <Input placeholder="Delivery Address" />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Payment Method</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Card Number" />
          <Input placeholder="Expiry Date (MM/YY)" />
          <Input placeholder="CVV" type="password" />
        </CardContent>
      </Card>

      <Separator className="mb-4" />

      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Total: $15.97</p> {/* Dynamically replace this */}
        <Button className="px-6">Place Order</Button>
      </div>
    </div>
  );
}
