import { UserNameObject } from "@/api/getUserNameList";
import { create } from "zustand";

type UserNameListStore = {
  userNameList: UserNameObject[],
  setUserNameList: (userinfo: UserNameObject[]) => void,
  clearUserNameList: () => void,
  getUserNameList: () => UserNameObject[],
};

export const useUserNameListStore = create<UserNameListStore>((set, get) => ({
  userNameList: [],
  setUserNameList: (list) => set((state) => ({
    userNameList: list
  })),
  clearUserNameList: () => set((state) => ({
    userNameList: [],
  })),
  getUserNameList: () => get().userNameList,
}));