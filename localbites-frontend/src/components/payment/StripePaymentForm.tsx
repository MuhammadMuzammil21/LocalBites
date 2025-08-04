import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface StripePaymentFormProps {
  amount: number;
  orderId: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  loading?: boolean;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  orderId,
  onSuccess,
  onError,
  loading = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          orderId,
          paymentMethod: 'Stripe',
        }),
      });

      const { success, clientSecret, paymentId, error } = await response.json();

      if (!success) {
        throw new Error(error || 'Failed to create payment intent');
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment failed');
      }

      // Confirm payment on backend
      const confirmResponse = await fetch('/api/payments/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          paymentIntentId: clientSecret,
          paymentId,
        }),
      });

      const confirmResult = await confirmResponse.json();

      if (confirmResult.success) {
        toast.success('Payment successful!');
        onSuccess(paymentId);
      } else {
        throw new Error(confirmResult.message || 'Payment confirmation failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setPaymentError(errorMessage);
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          Complete your order with secure payment processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Order Total:</span>
              <span className="font-semibold text-lg">PKR {amount.toLocaleString()}</span>
            </div>
          </div>

          <Separator />

          {/* Card Details */}
          <div className="space-y-4">
            <Label htmlFor="card-element">Card Information</Label>
            <div className="border rounded-md p-3">
              <CardElement
                id="card-element"
                options={CARD_ELEMENT_OPTIONS}
                className="min-h-[40px]"
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>

          {/* Error Display */}
          {paymentError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{paymentError}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || isProcessing || loading}
            className="w-full"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Pay PKR {amount.toLocaleString()}
              </div>
            )}
          </Button>

          {/* Payment Methods */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">We accept</p>
            <div className="flex justify-center gap-2">
              <div className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded">Mastercard</div>
              <div className="text-xs bg-gray-100 px-2 py-1 rounded">American Express</div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}; 