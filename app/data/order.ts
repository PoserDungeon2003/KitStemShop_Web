import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { CreateOrderRQ, OrdersResponse, VnPayPaymentRS, VnPayCallbackResponse, CreateOrderResponse, OrderDataResponse, RevenueResponse } from "./types";

export async function getOrdersByUserId(token: string): Promise<OrdersResponse> {
  return await request.get(`${BASE_URL}/api/Order/GetOrdersByUserId`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function createOrder(token: string, data: CreateOrderRQ): Promise<CreateOrderResponse> {
  return await request.post(`${BASE_URL}/api/Order/Create`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  })
}

export async function createVnpayPayment(token: string, orderId: number, returnUrl?: string): Promise<VnPayPaymentRS> {
  return await request.get(`${BASE_URL}/api/VNPay/vn-pay/${orderId}${returnUrl ? `?returnUrl=${returnUrl}` : ''}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function vnPayCallback(token: string, urlResponse: string): Promise<VnPayCallbackResponse> {
  return await request.post(`${BASE_URL}/api/VNPay/vn-pay/check-payment`, { urlResponse }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function getOrderDetails(token: string, orderId: number): Promise<OrderDataResponse> {
  return await request.get(`${BASE_URL}/api/Order/GetOrderDetails/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function confirmOrderReceived(token: string, orderDetailId: number, status: string): Promise<{ status: number, message: string, data: any}> {
  return await request.put(`${BASE_URL}/api/Order/ChangeStatus/${orderDetailId}/${status}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getAllOrders(token: string): Promise<OrdersResponse> {
  return await request.get(`${BASE_URL}/api/Order/GetAll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getRevenue(token: string, type: number): Promise<RevenueResponse> {
  return await request.get(`${BASE_URL}/api/Order/GetRenuve/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const useGetRevenue = (
  token: string,
  type: number,
  config?: UseQueryOptions<RevenueResponse>
) => {
  return useQuery({
    queryKey: ["revenue", type],
    queryFn: () => getRevenue(token, type),
    enabled: !!token,
    ...config,
  })
}

export const useGetAllOrders = (
  token: string,
  config?: UseQueryOptions<OrdersResponse>
) => {
  return useQuery({
    queryKey: ["all-order"],
    queryFn: () => getAllOrders(token),
    enabled: !!token,
    ...config,
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

export const useGetOrderDetails = (
  token: string,
  orderId: number,
  config?: UseQueryOptions<OrderDataResponse>
) => {
  return useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => getOrderDetails(token, orderId),
    enabled: !!token,
    ...config,
  })
}