import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { CategoryLabResponse, CreateCategoryRQ, CreateLabRQ, LabDetailResponse, LabsResponse, UpdateCategoryLabRQ, UpdateLabRQ } from "./types";
import _ from "lodash";

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

export async function createNewCategoryLab(token: string, body: CreateCategoryRQ): Promise<any> {
  return await request.post(`${BASE_URL}/api/CategoryLab/insert-cate-Lab-by-id`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function updateCategoryLab(token: string, categoryLabId: number, body: UpdateCategoryLabRQ): Promise<any> {
  return await request.put(`${BASE_URL}/api/CategoryLab/update-category-Lab-by-id`, {
    ...body,
    categoryLabId,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function deleteCategoryLabById(token: string, categoryLabById: number[]): Promise<any> {
  const queryString = _.map(categoryLabById, (id) => `categoryLabById=${id}`).join('&');
  return request.deleteWithOptions(`${BASE_URL}/api/CategoryLab/delete-category-Lab-by-id?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteLabById(token: string, labById: number[]): Promise<any> {
  const queryString = _.map(labById, (id) => `labById=${id}`).join('&');
  return request.deleteWithOptions(`${BASE_URL}/api/Lab/delete-Lab-by-id?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getAllCategoriesLab(): Promise<CategoryLabResponse> {
  return await request.get(`${BASE_URL}/api/CategoryLab/get-all-category-Lab`);
}

export const useGetAllCategoriesLab = (
  config?: Partial<UseQueryOptions<CategoryLabResponse>>
) => {
  return useQuery({
    queryKey: ['categories-lab'],
    queryFn: () => getAllCategoriesLab(),
    ...config,
  })
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