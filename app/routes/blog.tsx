import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAllBlogs } from "~/data/blog"; // Adjust your import accordingly

// Define an interface for blog type
interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category?: string;
  author?: string;
}

// Loader function to fetch blogs
export const loader: LoaderFunction = async () => {
  const blogs = await getAllBlogs();
  return json({ blogs });
};

export default function BlogList() {
  // Define the expected type for the useLoaderData hook
  const { blogs } = useLoaderData<{ blogs: Blog[] }>();

  return (
    <div className="dark:bg-gray-100 dark:text-gray-800">
      {blogs.data.map((blog, index) => (
        <div className="dark:bg-gray-100 dark:text-gray-900 border-b-0 border" key={blog.id}>
        <div className="container grid grid-cols-12 mx-auto dark:bg-gray-50">
            <div className="bg-no-repeat bg-cover dark:bg-gray-300 col-span-full lg:col-span-4" ></div>
            <div className="flex flex-col p-6 col-span-full row-span-full lg:col-span-8 lg:p-10">
                <h1 className="text-3xl font-semibold">{blog.title}</h1>
                <p className="flex-1 pt-2">{blog.content}</p>
                <img src={blog.image} alt="nothing" style={{width:"400px"}}/>
                <div className="flex items-center justify-between pt-2">
                    <div className="flex space-x-2">
                        
                        <span className="self-center text-sm">by {blog.user || "Unknown"}</span>
                    </div>  
                </div>
            </div>
        </div>
    </div>
      ))}
    </div>
  );
}
