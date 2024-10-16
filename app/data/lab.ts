import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { CreateLabRQ, LabDetailResponse, LabsResponse, UpdateLabRQ } from "./types";

export async function getLabById(id: number): Promise<LabDetailResponse> {
  return await request.get(`${BASE_URL}/api/Lab/get-Lab-by-id?labId=${id}`);
}

export async function getAllLabs(): Promise<LabsResponse> {
  return await request.get(`${BASE_URL}/api/Lab/get-all-Lab`);
}

export async function updateLabById(token: string, labId: number, body: UpdateLabRQ): Promise<any> {
  return await request.put(`${BASE_URL}/api/Lab/update-Lab-by-id`, {
    ...body,
    labId,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function createNewLab(token: string, body: CreateLabRQ): Promise<any> {
  return await request.post(`${BASE_URL}/api/Lab/insert-Lab-by-id`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
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