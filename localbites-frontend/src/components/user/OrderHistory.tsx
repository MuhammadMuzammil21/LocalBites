import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface Order {
  _id: string;
  restaurant: {
    _id: string;
    name: string;
  };
  items: {
    menuItem: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface OrderHistoryProps {
  orders: Order[];
  onReorder: (order: Order) => void;
}

const OrderHistory = ({ orders, onReorder }: OrderHistoryProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-600';
      case 'confirmed': return 'bg-blue-600';
      case 'preparing': return 'bg-orange-600';
      case 'out_for_delivery': return 'bg-purple-600';
      case 'delivered': return 'bg-green-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-400">No orders yet</p>
            <p className="text-gray-500 text-sm mt-2">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">
                        Order #{order._id.slice(-6)}
                      </span>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {formatStatus(order.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {order.restaurant.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()} • 
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white mb-2">
                      Rs. {order.totalAmount}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReorder(order)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      Reorder
                    </Button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-600 pt-3">
                  <p className="text-gray-400 text-sm mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          {item.quantity}x {item.menuItem.name}
                        </span>
                        <span className="text-gray-300">
                          Rs. {item.menuItem.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="border-t border-gray-600 pt-3 mt-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/menu/${order.restaurant._id}`, '_blank')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-600"
                    >
                      View Restaurant
                    </Button>
                    {order.status === 'delivered' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        Rate Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistory;
