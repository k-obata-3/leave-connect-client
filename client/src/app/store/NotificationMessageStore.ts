import { create } from "zustand";

type NotificationMessageObject = {
  errorMessageList: string[],
  inputErrorMessageList: string[],
}

type NotificationMessageStore = {
  notificationMessageObject: NotificationMessageObject,
  setNotificationMessageObject: (obj: NotificationMessageObject) => void;
  clearNotificationMessageObject: (obj: NotificationMessageObject) => void;
  getNotificationMessageObject: () => NotificationMessageObject;
};

export const useNotificationMessageStore = create<NotificationMessageStore>((set, get) => ({
  notificationMessageObject: {
    errorMessageList: [],
    inputErrorMessageList: [],
  },
  setNotificationMessageObject: (obj) => set((state) => ({
    notificationMessageObject: obj,
  })),
  clearNotificationMessageObject: () => set((state) => ({
    notificationMessageObject: {
      errorMessageList: [],
      inputErrorMessageList: [],
    }
  })),
  getNotificationMessageObject: () => get().notificationMessageObject
}));