import { SupportRequestForm } from "~/routes/support";
import request, { BASE_URL } from "./request";
import { createSupportRequestRS, SupportRequestResponse } from "./types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export async function getSupportRequest(token: string): Promise<SupportRequestResponse> {
	return await request.get(`${BASE_URL}/api/SupportRequest`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}

export async function createSupportRequest(token: string, data: SupportRequestForm): Promise<createSupportRequestRS> {
	return await request.post(`${BASE_URL}/api/SupportRequest`, data, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	});
}

export const useGetSupportRequest = (
	token: string,
	config?: UseQueryOptions<SupportRequestResponse>
) => {
	return useQuery({
		queryKey: ['support-request'],
		queryFn: () => getSupportRequest(token),
		enabled: !!token,
		...config,
	})
}