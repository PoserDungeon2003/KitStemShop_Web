import { yupResolver } from '@hookform/resolvers/yup';
import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { message } from 'antd';
import { da } from 'date-fns/locale';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { InferType, object, string } from 'yup';
import { useGetProfile } from '~/data';
import { createSupportRequest } from '~/data/supportrequest';
import { authenticator } from '~/services/auth.server';

const schema = object({
  requestTitle: string().required(),
  category: string(),
  requestDescription: string().required(),
})

export type SupportRequestForm = InferType<typeof schema>;

const resolver = yupResolver(schema);

export default function SupportRequest() {
  const { register, handleSubmit } = useForm<SupportRequestForm>({
    resolver,
  })


  const profile = useGetProfile();

  const onSubmit = async (data: SupportRequestForm) => {

    try {
      const response = await createSupportRequest(profile.data?.user?.token || "", {
        requestDescription: data.requestDescription,
        requestTitle: data.requestTitle,
      });

      console.log(response);
      if (response.status === -4) {
        message.error(response.message);
        return;
      }

      if (response) {
        message.success("Support request submitted successfully");
      }
    } catch (error: any) {
      message.error(error?.message);
    }
  };


  return (
    <div className="py-16 flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Submit a Support Request</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              {...register('requestTitle')}
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
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
              rows={4}
              {...register('requestDescription')}
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