import { SupportRequestForm } from "~/routes/support";
import request, { BASE_URL } from "./request";
import { createSupportRequestRS, SupportRequest } from "./types";

export async function getSupportRequest(token: string): Promise<SupportRequest[]> {
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