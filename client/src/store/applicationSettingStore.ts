import { create } from "zustand";

export type ApplicationTypeObject = {
  type: string,
  name: string,
  value: number,
  format: string,
  initialValue: ApplicationInitialValueObject,
  classifications: ApplicationClassificationObject[],
}

export enum ApplicationTypeFormat {
  time = "time",
  day = 'day',
  period = "period",
}

export type ApplicationClassificationObject = {
  key: string,
  name: string,
  value: number,
  min: number,
  max: number,
}

export type ApplicationInitialValueObject = {
  startTime: string,
  endTime: string,
  classification: number,
  totalTime: number,
}

type ApplicationSettingStore = {
  applicationTypes: ApplicationTypeObject[],
  setApplicationTypeObject: (obj: ApplicationTypeObject[]) => void;
  clearApplicationTypeObject: () => void;
  getApplicationTypeObject: () => ApplicationTypeObject[];
};

export const useApplicationSettingStore = create<ApplicationSettingStore>((set, get) => ({
  applicationTypes: [],
  setApplicationTypeObject: (obj) => set((state) => ({
    applicationTypes: obj
  })),
  clearApplicationTypeObject: () => set((state) => ({
    applicationTypes: [],
  })),
  getApplicationTypeObject: () => get().applicationTypes,
}));
