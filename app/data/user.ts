import { useQuery } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { LoginRS, RegisterForm, UserProfile } from "./types";

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
      'Content-Type': 'application/json' ,
      'Authorization': `Bearer ${token}`,
    },
  });
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