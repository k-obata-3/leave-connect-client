import { create } from "zustand";

export type CareerSettingObject = {
  key: string,
  name: string,
  value: string,
}

type CareerSettingStore = {
  incharge: CareerSettingObject[],
  role: CareerSettingObject[],
  setInchargeObjectList: (obj: CareerSettingObject[]) => void;
  setRoleObjectList: (obj: CareerSettingObject[]) => void;
  clearCareerSettingObject: () => void;
  getInchargeObjectList: () => CareerSettingObject[];
  getRoleObjectList: () => CareerSettingObject[];
};

export const useCareerSettingStore = create<CareerSettingStore>((set, get) => ({
  incharge: [],
  role: [],
  setInchargeObjectList: (obj) => set((state) => ({
    incharge: obj
  })),
  setRoleObjectList: (obj) => set((state) => ({
    role: obj
  })),
  clearCareerSettingObject: () => set((state) => ({
    incharge: [],
    role: []
  })),
  getInchargeObjectList: () => get().incharge,
  getRoleObjectList: () => get().role,
}));
