import _ from "lodash";
import { useMemo } from "react";
import { useGetAllBlogs } from "~/data";
import { BASE_URL } from "~/data/request";

export default function BlogList() {
  const blogs = useGetAllBlogs();

  const filterBlogs = useMemo(() => {
    return _(blogs.data?.data)
      .orderBy(it => it.updatedAt, "desc")
      .value();
  }, [blogs.data?.data]);

  return (
    <main className="grid max-2xl:grid-cols-3 grid-cols-6 gap-10 p-10 overflow-auto">
      {_.map(filterBlogs, (blog, index) => (
        <div key={index} className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
          <a href="#">
            <img className="rounded-t-lg" src={blog.image.startsWith('/images') ? `${BASE_URL}${blog.image}` : blog.image} alt={blog.title} />
          </a>
          <span>
          </span>
          <div className="p-5">
            <a href="#">
              <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">{blog.title}</h5>
            </a>
            By {blog.user || "Annymous"}
            <p className="font-normal text-gray-700 mb-3 line-clamp-3">{blog.content}</p>
            <a className="!text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center" href="#">
              Read more
            </a>
          </div>
        </div>
      ))}
      {/* {_.map(filterBlogs, (blog, index) => (
        <div className="dark:bg-gray-100 dark:text-gray-900 border-b-0 border" key={index}>
          <div className="container grid grid-cols-12 mx-auto dark:bg-gray-50">
            <div className="bg-no-repeat bg-cover dark:bg-gray-300 col-span-full lg:col-span-4" ></div>
            <div className="flex flex-col p-6 col-span-full row-span-full lg:col-span-8 lg:p-10">
              <h1 className="text-3xl font-semibold">{blog.title}</h1>
              <p className="flex-1 pt-2">{blog.content}</p>
              <img src={blog.image} alt="nothing" style={{ width: "400px" }} />
              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-2">

                  <span className="self-center text-sm">by {blog.user || "Unknown"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))} */}
    </main>
  );
}
