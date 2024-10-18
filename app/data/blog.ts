import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { BlogDetailResponse, BlogsResponse, UpdateBlogRQ } from "./types";
import _ from "lodash";

export async function getAllBlogs(): Promise<BlogsResponse> {
  return await request.get(`${BASE_URL}/api/Blog/get-all-Blog`);
}

export async function getBlogById(id: string): Promise<BlogDetailResponse> {
  return await request.get(`${BASE_URL}/api/Blog/get-Blog-by-id?blogId=${id}`);
}

export async function createNewBlog(token: string, body: FormData): Promise<any> {
  return await request.postMultiPart(`${BASE_URL}/api/Blog/insert-Blog-by-id`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateBlogById(token: string, blogId: number, body: UpdateBlogRQ): Promise<any> {
  return await request.put(`${BASE_URL}/api/Blog/update-Blog-by-id`, {
    ...body,
    blogId,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function deleteComboById(token: string, blogById: number[]): Promise<any> {
  const queryString = _.map(blogById, (id) => `blogById=${id}`).join('&');
  return request.deleteWithOptions(`${BASE_URL}/api/Blog/delete-Blog-by-id?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const useGetAllBlogs = (
  config?: UseQueryOptions<BlogsResponse>
) => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: () => getAllBlogs(),
    ...config,
  })
}