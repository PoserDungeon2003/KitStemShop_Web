import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { ComboLabKitsResponse } from "./types";

export async function getAllCombos(): Promise<ComboLabKitsResponse> {
  return await request.get(`${BASE_URL}/api/Compo/get-all-Combo`);
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