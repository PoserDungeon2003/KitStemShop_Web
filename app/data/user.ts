import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL, GHN_API_TOKEN, GHN_API_URL } from "./request";
import { DistrictResponse, LoginRS, ProvinceResponse, RegisterForm, UpdateUserRequest, UserProfile, WardResponse } from "./types";

export async function login(username: string, password: string): Promise<LoginRS> {
  return request.post(`${BASE_URL}/api/Login`, { username, password }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export async function registerAccount(body: RegisterForm): Promise<any> {
  return request.post(`${BASE_URL}/api/Register`, body, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export function getMe(token: string): Promise<any> {
  return request.get(`${BASE_URL}/RoleCheck`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function getDistricts(): Promise<DistrictResponse> {
  return request.get(`${GHN_API_URL}/district`, {
    headers: {
      'token': GHN_API_TOKEN,
    }
  });
}

export async function getWards(districtId: number): Promise<WardResponse> {
  return request.get(`${GHN_API_URL}/ward?district_id=${districtId}`, {
    headers: {
      'token': GHN_API_TOKEN,
    }
  });
}

export async function getProvinces(): Promise<ProvinceResponse> {
  return request.get(`${GHN_API_URL}/province`, {
    headers: {
      'token': GHN_API_TOKEN,
    }
  });
}

export const useGetProvinces = (
  config?: UseQueryOptions<ProvinceResponse>
) => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces,
    ...config,
  })
}

export const useGetDistricts = (
  config?: UseQueryOptions<DistrictResponse>
) => {
  return useQuery({
    queryKey: ['districts'],
    queryFn: getDistricts,
    ...config,
  })
}

export const useGetWards = (
  districtId: number,
  config?: UseQueryOptions<WardResponse>
) => {
  return useQuery({
    queryKey: ['wards', districtId],
    queryFn: () => getWards(districtId),
    enabled: !!districtId,
    ...config,
  })
}

export function getProfile(): Promise<UserProfile> {
  return request.get(`/api/me`);
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })
}

export async function updateProfile(token: string, body: UpdateUserRequest): Promise<any> {
  const response = await fetch(`${BASE_URL}/api/UpdateUser`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Failed to update profile: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
