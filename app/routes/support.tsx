import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { da } from 'date-fns/locale';
import { useState } from 'react';
import { useGetProfile } from '~/data';
import { createSupportRequest } from '~/data/supportrequest';
import { authenticator } from '~/services/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect("/");
  }
  return json({}, { status: 200 });
}

export default function SupportRequest() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const userId = useGetProfile().data?.user?.userId;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = {
      userId: userId,                      
      requestTitle: title,       
      requestDescription: description
    };
  
    try {
      const res = await createSupportRequest(data);
      
      console.log(res);
    } catch (error) {
      console.error("Error submitting support request:", error);
    }
  };
  

  return (
    <div className="py-16 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Submit a Support Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="1">Technical Issue</option>
              <option value="2">Billing</option>
              <option value="3">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}