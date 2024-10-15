import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { LabDetailResponse, LabsResponse } from "./types";

export async function getLabById(id: number): Promise<LabDetailResponse> {
  return await request.get(`${BASE_URL}/api/Lab/get-Lab-by-id?labId=${id}`);
}

export async function getAllLabs(): Promise<LabsResponse> {
  return await request.get(`${BASE_URL}/api/Lab/get-all-Lab`);
}

export const useGetAllLabs = (
  config?: Partial<UseQueryOptions<LabsResponse>>
) => {
  return useQuery({
    queryKey: ['labs'],
    queryFn: () => getAllLabs(),
    ...config,
  })
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