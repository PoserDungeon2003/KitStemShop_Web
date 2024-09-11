import request, { BASE_URL } from "./request";

async function login(username: string, password: string) {
  return request.post(`${BASE_URL}/api/LoginController/LoginKitStemShop`, { username, password }, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
}