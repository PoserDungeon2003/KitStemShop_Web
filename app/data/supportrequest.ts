import request, { BASE_URL } from "./request";
import { SupportRequest } from "./types";

export async function getSupportRequest(): Promise<SupportRequest> {
    return await request.get(`${BASE_URL}/api/SupportRequest`);
}

// export async function createSupportRequest(data: SupportRequest): Promise<any> {
//   try {
//     const response = await fetch(`${BASE_URL}/api/SupportRequest`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),  // Send the request data as JSON
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const resData = await response.json();  // Parse the response JSON
//     return resData;  // Return the parsed response
//   } catch (error) {
//     console.error("Error creating support request:", error);
//     throw error;  // Rethrow the error so it can be caught in the calling function
//   }
// }

export async function createSupportRequest(data: SupportRequest): Promise<any> {
    return await request.post(`${BASE_URL}/api/SupportRequest`, data);
}