import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { Cart, CartResponse, RemoveFromCartRS } from "./types";

export async function addToCart(token: string, data: Cart): Promise<CartResponse> {
  return await request.post(`${BASE_URL}/api/Cart/add-to-cart`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true,
  });
}

export async function removeFromCart(token: string, compoId: number, istemId: number): Promise<RemoveFromCartRS> {
  return request.deleteWithOptions(`${BASE_URL}/api/Cart/remove-from-cart?compoId=${compoId}&istemId=${istemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true,
  });
}

export async function getCart(token: string): Promise<Cart> {
  return await request.get(`${BASE_URL}/api/Cart/get-cart`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true,
  })
}

export const useGetCart = (
  token: string,
  config?: UseQueryOptions<Cart>,
) => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart(token),
    enabled: !!token,
    ...config,
  })
}