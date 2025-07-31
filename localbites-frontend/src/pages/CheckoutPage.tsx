import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import { cartApi, Cart as CartType } from '../api/cartApi';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, MapPin, Loader2 } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'CASH',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [isAuthenticated, navigate]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const cartData = await cartApi.getCart();
      setCart(cartData);
      
      // Pre-fill user data
      setFormData(prev => ({
        ...prev,
        fullName: user?.name || '',
        email: user?.email || '',
      }));
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.paymentMethod === 'CARD' && (!formData.cardNumber || !formData.expiryDate || !formData.cvv)) {
      toast.error('Please fill in all card details');
      return;
    }

    setPlacing(true);
    try {
      // Prepare order data
      const firstRestaurant = cart.items[0]?.menuItem?.restaurant?._id;
      
      const orderData = {
        restaurant: firstRestaurant,
        items: cart.items.map(item => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity
        })),
        deliveryAddress: {
          street: formData.address,
          city: 'Karachi',
          instructions: ''
        },
        paymentMethod: formData.paymentMethod
      };

      const order = await orderApi.placeOrder(orderData);
      toast.success('Order placed successfully!');
      
      // Clear cart and redirect to order confirmation
      await cartApi.clearCart();
      navigate(`/orders/${order._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
                          <div className="flex justify-center mb-4">
                <ShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some delicious items before checking out!</p>
            <Button 
              onClick={() => navigate('/search')}
              className="bg-white text-black hover:bg-gray-200"
            >
              Browse Restaurants
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalAmount;
  const deliveryFee = 50;
  const serviceFee = 25;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" />
              Checkout
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-gray-300">Delivery Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your full address in Karachi"
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    💳 Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button
                      variant={formData.paymentMethod === 'CASH' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'CASH' }))}
                      className={formData.paymentMethod === 'CASH' 
                        ? 'bg-white text-black' 
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }
                    >
                      💵 Cash on Delivery
                    </Button>
                    <Button
                      variant={formData.paymentMethod === 'CARD' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'CARD' }))}
                      className={formData.paymentMethod === 'CARD' 
                        ? 'bg-white text-black' 
                        : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }
                    >
                      💳 Credit Card
                    </Button>
                  </div>

                  {formData.paymentMethod === 'CARD' && (
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate" className="text-gray-300">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            type="password"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    📋 Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{item.menuItem.name}</p>
                          <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-400">{item.menuItem.restaurant.name}</p>
                        </div>
                        <p className="text-white font-medium">Rs. {item.totalPrice}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>Rs. {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Delivery Fee</span>
                      <span>Rs. {deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Service Fee</span>
                      <span>Rs. {serviceFee}</span>
                    </div>
                    <Separator className="bg-gray-600 my-2" />
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span>Rs. {total}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={placing || !formData.fullName || !formData.email || !formData.phone || !formData.address}
                    className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                    size="lg"
                  >
                    {placing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Placing Order...
                      </>
                    ) : (
                      <>🚀 Place Order</>
                    )}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
