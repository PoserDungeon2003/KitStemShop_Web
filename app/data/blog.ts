import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { CategoryComposResponse, ComboLabKitDetailResponse, ComboLabKitsResponse, CreateCombo, UpdateComboRQ } from "./types";
import _ from "lodash";

export async function getAllBlogs(): Promise<any> {
    return await request.get(`${BASE_URL}/api/Blog/get-all-Blog`);
}