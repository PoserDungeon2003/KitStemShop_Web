import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { CreateItemRQ, ItemDetailResponse, ItemsResponse, UpdateItemRQ } from "./types";
import _ from "lodash";

export async function getAllItems(): Promise<ItemsResponse> {
  return await request.get(`${BASE_URL}/api/IStem/get-all-IStem`);
}

export async function getItemById(id: string): Promise<ItemDetailResponse> {
  return await request.get(`${BASE_URL}/api/IStem/get-IStem-by-id?istemId=${id}`);
}

export async function updateItemById(token: string, istemId: number, body: UpdateItemRQ): Promise<any> {
  return await request.put(`${BASE_URL}/api/IStem/update-IStem-by-id`, {
    ...body,
    istemId,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function deleteItemById(token: string, istemById: number[]): Promise<any> {
  const queryString = _.map(istemById, (id) => `istemById=${id}`).join('&');
  return request.deleteWithOptions(`${BASE_URL}/api/IStem/delete-IStem-by-id?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createNewItem(token: string, body: CreateItemRQ) {
  return await request.post(`${BASE_URL}/api/IStem/insert-IStem-by-id`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
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