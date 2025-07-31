import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import Navbar from '../components/layout/Navbar';
import { cartApi, Cart as CartType, CartItem } from '../api/cartApi';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

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
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (menuItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(menuItemId);
      return;
    }

    setUpdating(menuItemId);
    try {
      const updatedCart = await cartApi.updateCartItem(menuItemId, newQuantity);
      setCart(updatedCart);
      toast.success('Cart updated!');
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (menuItemId: string) => {
    setUpdating(menuItemId);
    try {
      const updatedCart = await cartApi.removeFromCart(menuItemId);
      setCart(updatedCart);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartApi.clearCart();
      setCart(null);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              🛒 Your Cart
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {!cart || cart.items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
              <p className="text-gray-400 mb-6">Add some delicious items from our restaurants!</p>
              <Button 
                onClick={() => navigate('/search')}
                className="bg-white text-black hover:bg-gray-200"
              >
                Browse Restaurants
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    Cart Items ({cart.items.length})
                  </h2>
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    size="sm"
                  >
                    🗑️ Clear Cart
                  </Button>
                </div>

                {cart.items.map((item: CartItem) => (
                  <Card key={item._id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">
                            {item.menuItem.name}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {item.menuItem.restaurant.name}
                          </p>
                          {item.menuItem.description && (
                            <p className="text-sm text-gray-300 mb-2">
                              {item.menuItem.description}
                            </p>
                          )}
                          <p className="text-lg font-bold text-white">
                            Rs. {item.menuItem.price} each
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.menuItem._id, item.quantity - 1)}
                              disabled={updating === item.menuItem._id}
                              className="w-8 h-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              −
                            </Button>
                            <span className="text-white font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.menuItem._id, item.quantity + 1)}
                              disabled={updating === item.menuItem._id}
                              className="w-8 h-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              +
                            </Button>
                          </div>
                          
                          <p className="text-lg font-bold text-white">
                            Rs. {item.totalPrice}
                          </p>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveItem(item.menuItem._id)}
                            disabled={updating === item.menuItem._id}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            {updating === item.menuItem._id ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              '🗑️'
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal</span>
                        <span>Rs. {cart.totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Delivery Fee</span>
                        <span>Rs. 50</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Service Fee</span>
                        <span>Rs. 25</span>
                      </div>
                      <Separator className="bg-gray-600" />
                      <div className="flex justify-between text-white font-bold text-lg">
                        <span>Total</span>
                        <span>Rs. {cart.totalAmount + 75}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-white text-black hover:bg-gray-200"
                      size="lg"
                    >
                      🚀 Proceed to Checkout
                    </Button>

                    <div className="text-center">
                      <Button
                        variant="ghost"
                        onClick={() => navigate('/search')}
                        className="text-gray-400 hover:text-white"
                      >
                        ← Continue Shopping
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
