import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import { message, Tooltip } from 'antd';
import _ from 'lodash';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { InferType, number, object, string } from 'yup';
import { createSupportRequest, useGetAllLabs, useGetOrdersByUserId, useGetProfile } from '~/data';

const schema = object({
  requestTitle: string().required(),
  labId: number().required(),
  requestDescription: string().required(),
})

export type SupportRequestForm = InferType<typeof schema>;

const resolver = yupResolver(schema);

export default function SupportRequest() {
  const { register, handleSubmit, formState: { errors } } = useForm<SupportRequestForm>({
    resolver,
  })
  const queryClient = useQueryClient();
  const profile = useGetProfile();
  const labs = useGetAllLabs(profile.data?.user?.token || "");
  const orders = useGetOrdersByUserId(profile.data?.user?.token || "");

  const mapLab = useMemo(() => {
    return _.mapKeys(labs.data?.data, it => it.labId);
  }, [labs.data?.data]);

  const filterActiveLab = useMemo(() => {
    return _(orders.data?.data)
      .filter(it => it.statusLabActive.toLowerCase() == 'true')
      .value();
  }, [orders.data?.data]);

  const onSubmit = async (data: SupportRequestForm) => {

    try {
      const response = await createSupportRequest(profile.data?.user?.token || "", {
        requestDescription: data.requestDescription,
        requestTitle: data.requestTitle,
        labId: data.labId,
      });

      if (response.status === -4) {
        message.error(response.message);
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ['support-request']
      })
      message.success("Support request submitted successfully");

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
            {errors.requestTitle && <p className="text-red-500 text-sm mt-1">{errors.requestTitle.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="category">
              Lab
            </label>
            <select
              {...register('labId')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select lab</option>
              {_.isEmpty(filterActiveLab) && <option value="" disabled>No active lab</option>}
              {_.map(filterActiveLab, (item, index) => {
                return (
                  <option key={index} value={item.labId}>{mapLab[item.labId]?.labName}</option>
                )
              })}
            </select>
            {errors.labId && <p className="text-red-500 text-sm mt-1">{errors.labId.message}</p>}
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
            {errors.requestDescription && <p className="text-red-500 text-sm mt-1">{errors.requestDescription.message}</p>}
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