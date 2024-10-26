import { axiosClient } from "@/axiosClient";

export type GetGrantRuleRequest = {

}

export type GetGrantRuleResponse = {
  sectionMonth: string[],
  workingDays1: string[],
  workingDays2: string[],
  workingDays3: string[],
  workingDays4: string[],
  workingDays5: string[],
  workingDays6: string[],
}

export async function getGrantRule() {
  try {
    const response = await axiosClient.get(`/grantRule`);
    if(!response || !response.data || response.data.resultCode !== 200) {
      throw new Error("error");
    }

    return response.data.result as GetGrantRuleResponse;
  } catch (error: any) {
    throw error.response?.data?.result;
  }
}
