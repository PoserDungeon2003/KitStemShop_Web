import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { KitResponse, KitsResponse, UpdateKitRQ } from "./types";
import _ from "lodash";

export async function getAllKits(): Promise<KitsResponse> {
  return await request.get(`${BASE_URL}/api/Kit/get-all-kit`);
}

export async function getKitById(id: string): Promise<KitResponse> {
  return await request.get(`${BASE_URL}/api/Kit/get-Kit-by-id?kitId=${id}`);
}

export async function updateKitById(token: string, id: number, body: UpdateKitRQ): Promise<any> {
  return await request.put(`${BASE_URL}/api/Kit/update-Kit-by-id`, {
    ...body,
    kitId: id,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function deleteKitById(token: string, kitById: number[]): Promise<any> {
  const queryString = _.map(kitById, (id) => `kitById=${id}`).join('&');
  return request.deleteWithOptions(`${BASE_URL}/api/Kit/delete-Kit-by-id?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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