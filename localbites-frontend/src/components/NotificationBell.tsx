import React, { useState } from 'react';
import { useNotifications, Notification } from '../context/NotificationContext';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isConnected } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ORDER_STATUS_CHANGED':
      case 'ORDER_PLACED':
        return '📦';
      case 'PAYMENT_SUCCESS':
        return '💳';
      case 'PAYMENT_FAILED':
        return '❌';
      case 'NEW_REVIEW':
        return '⭐';
      case 'REVIEW_RESPONSE':
        return '💬';
      case 'DELIVERY_UPDATE':
        return '🚚';
      case 'RESTAURANT_VERIFIED':
        return '✅';
      case 'SYSTEM_ANNOUNCEMENT':
        return '📢';
      default:
        return '🔔';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    
    // Handle navigation based on notification type
    if (notification.data?.orderId) {
      // Navigate to order details
      console.log('Navigate to order:', notification.data.orderId);
    } else if (notification.data?.reviewId) {
      // Navigate to review
      console.log('Navigate to review:', notification.data.reviewId);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          {!isConnected && (
            <div className="absolute -bottom-1 -right-1 h-2 w-2 bg-gray-400 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto bg-gray-800 border-gray-700">
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <h3 className="font-semibold text-white">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification, index) => (
              <div key={notification._id}>
                <DropdownMenuItem
                  className="p-3 cursor-pointer hover:bg-gray-700 text-white"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-shrink-0">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      {!notification.isRead && (
                        <div className={`w-2 h-2 rounded-full mt-1 ${getPriorityColor(notification.priority)}`} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-white' : 'text-gray-400'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">
                            {formatTime(notification.createdAt)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification._id);
                            }}
                            className="h-6 w-6 p-0 hover:bg-red-900 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification._id);
                          }}
                          className="mt-2 h-6 px-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell; 