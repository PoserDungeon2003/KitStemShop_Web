import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { KitsResponse } from "./types";

export async function getAllKits(): Promise<KitsResponse> {
  return await request.get(`${BASE_URL}/api/Kit/get-all-kit`);
}

export const useGetAllKits = (
  config?: Partial<UseQueryOptions<KitsResponse>>
) => {
  return useQuery({
    queryKey: ['kits'],
    queryFn: () => getAllKits(),
    ...config,
  })
}