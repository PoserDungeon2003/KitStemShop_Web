import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { ComboLabKitDetailResponse, ComboLabKitsResponse } from "./types";

export async function getAllCombos(): Promise<ComboLabKitsResponse> {
  return await request.get(`${BASE_URL}/api/Compo/get-all-Combo`);
}

export async function getComboById(id: string): Promise<ComboLabKitDetailResponse> {
  return await request.get(`${BASE_URL}/api/Compo/get-Combo-by-id?comboId=${id}`);
}

export const useGetAllCombos = (
  config?: Partial<UseQueryOptions<ComboLabKitsResponse>>
) => {
  return useQuery({
    queryKey: ['combos'],
    queryFn: () => getAllCombos(),
    ...config,
  })
} 