import { create } from "zustand";

type UserInfo = {
  id: string,
  userId: string,
  companyId: string,
  firstName: string,
  lastName: string,
  firstNameKana: string,
  lastNameKana: string,
  dateOfBirth: string,
  auth: string,
  joiningDate: string,
  referenceDate: string,
  workingDays: string,
  totalDeleteDays: string,
  totalDeleteTimes: string,
  totalAddDays: string,
  totalRemainingDays: string,
  totalCarryoverDays: string,
  periodStart: string,
  periodEnd: string,
  isUpdateGrant: boolean,
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
    firstNameKana: '',
    lastNameKana: '',
    dateOfBirth: '',
    auth: '',
    joiningDate: '',
    referenceDate: '',
    workingDays: '0',
    totalDeleteDays: '0',
    totalDeleteTimes: '0',
    totalAddDays: '0',
    totalRemainingDays: '0',
    totalCarryoverDays: '0',
    periodStart: '',
    periodEnd: '',
    isUpdateGrant: false,
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
      firstNameKana: '',
      lastNameKana: '',
      dateOfBirth: '',
      auth: '',
      joiningDate: '',
      referenceDate: '',
      workingDays: '0',
      totalDeleteDays: '0',
      totalDeleteTimes: '0',
      totalAddDays: '0',
      totalRemainingDays: '0',
      totalCarryoverDays: '0',
      periodStart: '',
      periodEnd: '',
      isUpdateGrant: false,
    }
  })),
  getUserInfo: () => get().userInfo,
  isAdmin: () => get().userInfo && get().userInfo.auth == '0'
}));