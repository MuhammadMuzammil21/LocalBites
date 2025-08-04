import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  X, 
  Check, 
  Clock, 
  Package, 
  CreditCard, 
  Star, 
  MessageSquare,
  Settings,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    orderId?: string;
    restaurantId?: string;
    reviewId?: string;
    amount?: number;
    trackingCode?: string;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'ORDER_CONFIRMED':
    case 'ORDER_PREPARING':
    case 'ORDER_READY':
    case 'ORDER_DELIVERED':
    case 'ORDER_CANCELLED':
      return <Package className="h-4 w-4" />;
    case 'PAYMENT_SUCCESS':
    case 'PAYMENT_FAILED':
    case 'REFUND_PROCESSED':
      return <CreditCard className="h-4 w-4" />;
    case 'REVIEW_RECEIVED':
    case 'REVIEW_REPLIED':
      return <Star className="h-4 w-4" />;
    case 'DELIVERY_UPDATE':
      return <Clock className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'ORDER_CONFIRMED':
    case 'PAYMENT_SUCCESS':
    case 'ORDER_DELIVERED':
      return 'text-green-600 bg-green-50';
    case 'ORDER_CANCELLED':
    case 'PAYMENT_FAILED':
      return 'text-red-600 bg-red-50';
    case 'ORDER_PREPARING':
    case 'ORDER_READY':
      return 'text-blue-600 bg-blue-50';
    case 'REVIEW_RECEIVED':
    case 'REVIEW_REPLIED':
      return 'text-yellow-600 bg-yellow-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      setupWebSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isOpen]);

  const setupWebSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newSocket = io('http://localhost:5000', {
      auth: {
        token,
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to notification server');
      newSocket.emit('authenticate', token);
    });

    newSocket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast(notification.title, {
        description: notification.message,
        action: {
          label: 'View',
          onClick: () => handleNotificationClick(notification),
        },
      });
    });

    setSocket(newSocket);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.filter(notif => notif._id !== notificationId)
        );
        const deletedNotification = notifications.find(n => n._id === notificationId);
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    // Handle navigation based on notification type
    if (notification.data?.orderId) {
      // Navigate to order details
      window.location.href = `/orders/${notification.data.orderId}`;
    } else if (notification.data?.restaurantId) {
      // Navigate to restaurant
      window.location.href = `/restaurants/${notification.data.restaurantId}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <Bell className="h-12 w-12 mb-2" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification._id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}; 