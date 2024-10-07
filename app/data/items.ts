import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { ItemsResponse } from "./types";

export async function getAllItems(): Promise<ItemsResponse> {
  return await request.get(`${BASE_URL}/api/IStem/get-all-IStem`);
}

export const useGetAllItems = (
  config?: Partial<UseQueryOptions<ItemsResponse>>
) => {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => getAllItems(),
    ...config,
  })
}