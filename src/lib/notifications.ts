import { eventEmitter, EVENTS } from "./events";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
  userId: string;
}

let notifications: Notification[] = [];

export function createNotification(
  userId: string,
  title: string,
  message: string,
  type: Notification["type"] = "info"
) {
  const notification: Notification = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
    read: false,
    userId,
  };

  notifications.unshift(notification);
  eventEmitter.emit(EVENTS.NOTIFICATION_CREATED, notification);
  return notification;
}

export function getNotifications(userId: string) {
  return notifications.filter(n => n.userId === userId);
}

export function getUnreadNotifications(userId: string) {
  return notifications.filter(n => n.userId === userId && !n.read);
}

export function markNotificationAsRead(notificationId: string) {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    eventEmitter.emit(EVENTS.NOTIFICATION_UPDATED, notification);
  }
}

export function markAllNotificationsAsRead(userId: string) {
  notifications
    .filter(n => n.userId === userId && !n.read)
    .forEach(n => {
      n.read = true;
      eventEmitter.emit(EVENTS.NOTIFICATION_UPDATED, n);
    });
}