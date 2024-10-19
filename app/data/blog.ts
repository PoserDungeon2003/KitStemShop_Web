import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import request, { BASE_URL } from "./request";
import { BlogCategoriesResponse, BlogDetailResponse, BlogsResponse, CreateCategoryRQ, UpdateBlogRQ, UpdateCategoryBlogRQ } from "./types";
import _ from "lodash";

export async function getAllBlogs(): Promise<BlogsResponse> {
  return await request.get(`${BASE_URL}/api/Blog/get-all-Blog`);
}

export async function getBlogById(id: number): Promise<BlogDetailResponse> {
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

export async function createNewCategoryBlog(token: string, body: CreateCategoryRQ): Promise<any> {
  return await request.post(`${BASE_URL}/api/CategoryBlog/insert-cate-Blog-by-id`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function updateCategoryBlog(token: string, categoryBlogId: number, body: UpdateCategoryBlogRQ): Promise<any> {
  return await request.put(`${BASE_URL}/api/CategoryBlog/update-category-blog-by-id`, {
    ...body,
    categoryBlogId,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function deleteCategoryBlogById(token: string, DeleteCategoryBlog: number[]): Promise<any> {
  const queryString = _.map(DeleteCategoryBlog, (id) => `DeleteCategoryBlog=${id}`).join('&');
  return request.deleteWithOptions(`${BASE_URL}/api/CategoryBlog/delete-category-blog-by-id?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function deleteBlogById(token: string, blogById: number[]): Promise<any> {
  const queryString = _.map(blogById, (id) => `blogById=${id}`).join('&');
  return request.deleteWithOptions(`${BASE_URL}/api/Blog/delete-Blog-by-id?${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getAllCategoriesBlog(): Promise<BlogCategoriesResponse> {
  return await request.get(`${BASE_URL}/api/CategoryBlog/get-all-category-Blog`);
}

export const useGetAllCategoriesBlog = (
  config?: UseQueryOptions<BlogCategoriesResponse>
) => {
  return useQuery({
    queryKey: ['categories-blog'],
    queryFn: getAllCategoriesBlog,
    ...config,
  })
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