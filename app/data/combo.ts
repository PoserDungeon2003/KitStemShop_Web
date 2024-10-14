import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { CategoryComposResponse, ComboLabKitDetailResponse, ComboLabKitsResponse } from "./types";

export async function getAllCombos(): Promise<ComboLabKitsResponse> {
  return await request.get(`${BASE_URL}/api/Compo/get-all-Combo`);
}

export async function getComboById(id: string): Promise<ComboLabKitDetailResponse> {
  return await request.get(`${BASE_URL}/api/Compo/get-Combo-by-id?comboId=${id}`);
}

export async function getAllCategoriesCombo(): Promise<CategoryComposResponse> {
  return await request.get(`${BASE_URL}/api/CategoryCompo/get-all-category-Compo`);
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