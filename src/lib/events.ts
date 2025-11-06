type EventCallback<T = any> = (data?: T) => void;

class EventEmitter {
  private listeners: { [key: string]: EventCallback[] } = {};

  subscribe<T>(event: string, callback: EventCallback<T>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit<T>(event: string, data?: T) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

export const eventEmitter = new EventEmitter();

export const EVENTS = {
  ATTENDANCE_UPDATED: 'ATTENDANCE_UPDATED',
  LEAVES_UPDATED: 'LEAVES_UPDATED',
  NOTIFICATION_CREATED: 'NOTIFICATION_CREATED',
  NOTIFICATION_UPDATED: 'NOTIFICATION_UPDATED'
} as const;