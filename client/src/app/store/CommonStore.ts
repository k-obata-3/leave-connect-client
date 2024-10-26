import { create } from "zustand";

type CommonObject = {
  errorMessage: string,
  actionRequiredApplicationCount: string,
  approvalTaskCount: string,
  activeApplicationCount: string,
}

type CommonStore = {
  commonObject: CommonObject,
  setCommonObject: (obj: CommonObject) => void;
  clearCommonObject: (obj: CommonObject) => void;
  getCommonObject: () => CommonObject;
};

export const useCommonStore = create<CommonStore>((set, get) => ({
  commonObject: {
    errorMessage: '',
    actionRequiredApplicationCount: '0',
    approvalTaskCount: '0',
    activeApplicationCount: '0',
  },
  setCommonObject: (obj) => set((state) => ({
    commonObject: obj
  })),
  clearCommonObject: () => set((state) => ({
    commonObject: {
      errorMessage: '',
      actionRequiredApplicationCount: '0',
      approvalTaskCount: '0',
      activeApplicationCount: '0',
    }
  })),
  getCommonObject: () => get().commonObject
}));