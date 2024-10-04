import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { LabDetailResponse } from "./types";

export async function getLabById(id: number): Promise<LabDetailResponse> {
  return await request.get(`${BASE_URL}/api/Lab/get-Lab-by-id?labId=${id}`);
}

export const useGetLabById = (
  id: number,
  config?: Partial<UseQueryOptions<LabDetailResponse>>
) => {
  return useQuery({
    queryKey: ['lab', id],
    queryFn: () => getLabById(id),
    ...config,
  })
} 