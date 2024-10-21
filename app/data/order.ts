import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { OrdersResponse } from "./types";

export async function getOrdersByUserId(token: string): Promise<OrdersResponse> {
  return await request.get(`${BASE_URL}/api/Order/GetOrdersByUserId`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const useGetOrdersByUserId = (
  token: string,
  config?: UseQueryOptions<OrdersResponse>
) => {
  return useQuery({
    queryKey: ["my-order"],
    queryFn: () => getOrdersByUserId(token),
    enabled: !!token,
    ...config,
  })
}