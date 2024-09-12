import request, { BASE_URL } from "./request";
import { LoginRS } from "./types";

export async function login(username: string, password: string): Promise<LoginRS> {
  return request.post(`${BASE_URL}/api/Login`, { username, password }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}