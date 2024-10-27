import { SupportRequestForm } from "~/routes/support";
import request, { BASE_URL } from "./request";
import { createSupportRequestRS, SupportRequestResponse, UpdateSupportRequestRQ } from "./types";
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

export async function getSupportRequestById(token: string, id: number): Promise<SupportRequestResponse> {
	return await request.get(`${BASE_URL}/api/SupportRequest/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	});
}

export async function updateSupportRequestById(token: string, data: UpdateSupportRequestRQ): Promise<any> {
	return await request.patch(`${BASE_URL}/api/SupportRequest`, data, {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	});
}

export async function deleteSupportRequestById(token: string, id: number): Promise<any> {
	return await request.deleteWithOptions(`${BASE_URL}/api/SupportRequest/${id}`, {
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