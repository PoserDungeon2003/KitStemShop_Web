import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { CategoryComposResponse, ComboLabKitDetailResponse, ComboLabKitsResponse, CreateCombo, UpdateComboRQ } from "./types";
import _ from "lodash";

export async function getAllCombos(): Promise<ComboLabKitsResponse> {
  return await request.get(`${BASE_URL}/api/Compo/get-all-Combo`);
}

export async function getComboById(id: string): Promise<ComboLabKitDetailResponse> {
  return await request.get(`${BASE_URL}/api/Compo/get-Combo-by-id?comboId=${id}`);
}

export async function getAllCategoriesCombo(): Promise<CategoryComposResponse> {
  return await request.get(`${BASE_URL}/api/CategoryCompo/get-all-category-Compo`);
}

export async function updateComboById(token: string, id: number, body: UpdateComboRQ): Promise<any> {
  return await request.put(`${BASE_URL}/api/Compo/update-Compo-by-id`, {
    ...body,
    compoId: id,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function deleteComboById(token: string, CompoById: number[]): Promise<any> {
  const queryString = _.map(CompoById, (id) => `CompoById=${id}`).join('&');
  return request.deleteWithOptions(`${BASE_URL}/api/Compo/delete-Compo-by-id?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createNewCombo(token: string, body: CreateCombo) {
  return await request.post(`${BASE_URL}/api/Compo/insert-Compo-by-id`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
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

export const useGetAllCategoriesCombo = (
  config?: Partial<UseQueryOptions<CategoryComposResponse>>
) => {
  return useQuery({
    queryKey: ['categoriesCombo'],
    queryFn: () => getAllCategoriesCombo(),
    ...config,
  });
}