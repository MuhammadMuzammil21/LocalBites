import API from './axios';

export interface CartItem {
  _id: string;
  menuItem: {
    _id: string;
    name: string;
    price: number;
    description?: string;
    restaurant: {
      _id: string;
      name: string;
    };
  };
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  menuItemId: string;
  quantity: number;
}

export const cartApi = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response = await API.get('/cart');
    return response.data.success ? response.data.data : response.data;
  },

  // Add item to cart
  addToCart: async (data: AddToCartData): Promise<Cart> => {
    const response = await API.post('/cart/add', data);
    return response.data.success ? response.data.data : response.data;
  },

  // Remove item from cart
  removeFromCart: async (menuItemId: string): Promise<Cart> => {
    const response = await API.delete('/cart/remove', {
      data: { menuItemId }
    });
    return response.data.success ? response.data.data : response.data;
  },

  // Update item quantity in cart
  updateCartItem: async (menuItemId: string, quantity: number): Promise<Cart> => {
    const response = await API.put('/cart/update', {
      menuItemId,
      quantity
    });
    return response.data.success ? response.data.data : response.data;
  },

  // Clear cart
  clearCart: async (): Promise<void> => {
    const response = await API.delete('/cart/clear');
    return response.data;
  },

  // Reorder items from a previous order
  reorder: async (orderItems: { menuItem: { _id: string }; quantity: number }[]): Promise<Cart> => {
    try {
      // Clear current cart first
      await cartApi.clearCart();
      
      // Add each item from the order to cart
      let updatedCart: Cart | null = null;
      for (const item of orderItems) {
        updatedCart = await cartApi.addToCart({
          menuItemId: item.menuItem._id,
          quantity: item.quantity
        });
      }
      
      return updatedCart!;
    } catch (error) {
      console.error('Error reordering items:', error);
      throw error;
    }
  },
};
