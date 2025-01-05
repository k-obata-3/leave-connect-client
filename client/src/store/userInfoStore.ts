import { create } from "zustand";

type UserInfo = {
  id: string,
  userId: string,
  companyId: string,
  firstName: string,
  lastName: string,
  auth: string,
  referenceDate: string,
  workingDays: string,
  totalDeleteDays: string,
  totalAddDays: string,
  totalRemainingDays: string,
  totalCarryoverDays: string,
}

type UserInfoStore = {
  userInfo: UserInfo,
  setUserInfo: (userinfo: UserInfo) => void,
  clearUserInfo: () => void,
  getUserInfo: () => UserInfo,
  isAdmin: () => boolean,
};

export const useUserInfoStore = create<UserInfoStore>((set, get) => ({
  userInfo: {
    id: '',
    userId: '',
    companyId: '',
    firstName: '',
    lastName: '',
    auth: '',
    referenceDate: '',
    workingDays: '0',
    totalDeleteDays: '0',
    totalAddDays: '0',
    totalRemainingDays: '0',
    totalCarryoverDays: '0',
  },
  setUserInfo: (userinfo) => set((state) => ({
    userInfo: userinfo
  })),
  clearUserInfo: () => set((state) => ({
    userInfo: {
      id: '',
      userId: '',
      companyId: '',
      firstName: '',
      lastName: '',
      auth: '',
      referenceDate: '',
      workingDays: '0',
      totalDeleteDays: '0',
      totalAddDays: '0',
      totalRemainingDays: '0',
      totalCarryoverDays: '0',
    }
  })),
  getUserInfo: () => get().userInfo,
  isAdmin: () => get().userInfo && get().userInfo.auth == '0'
}));