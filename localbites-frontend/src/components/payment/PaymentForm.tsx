import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Loader2, CreditCard, DollarSign } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onPaymentError('Stripe has not loaded yet');
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Send payment method to your server for processing
      const response = await fetch('/api/orders/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: amount
        })
      });

      const result = await response.json();
      
      if (result.success) {
        onPaymentSuccess(result.paymentIntentId);
        toast.success('Payment processed successfully!');
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(error instanceof Error ? error.message : 'Payment failed');
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#aab7c4',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Card Information
            </label>
            <div className="p-3 border border-gray-600 rounded-md bg-gray-700">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
            <span className="text-gray-300">Total Amount:</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {amount.toFixed(2)} PKR
            </span>
          </div>

          <Button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${amount.toFixed(2)} PKR`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm; 