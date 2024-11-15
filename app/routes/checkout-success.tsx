import { json, useLocation } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useEffect } from "react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { Link, LoaderFunctionArgs, redirect, useNavigate } from "react-router-dom";
import { clearCart, useGetProfile } from "~/data";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
}

export default function CheckoutSuccess() {
  const profile = useGetProfile();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const messageParams = queryParams.get("message");
  const code = queryParams.get("code");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // const clearCartItems = async () => {
  //   try {
  //     const response = await clearCart(profile.data?.user?.token || "");
  //     if (response) {
  //       message.success("Thanh toán thành công");
  //     }
  //   } catch (error) {
  //     return navigate(`/checkout?message=${encodeURIComponent('Giao dịch thất bại')}&type=error`);
  //   }
  // }

  // useEffect(() => {
  //   clearCartItems();
  // }, [])

  return (
    <main className="mt-20">
      <div className="container py-16 flex flex-col gap-5 items-center justify-center">
        {code === '00' ?
          <FaCircleCheck className="w-20 h-20 text-green-500" /> :
          <FaCircleXmark className="w-20 h-20 text-red-500" />}
        <h1 className="text-xl">{messageParams || 'Giao dịch thất bại'}</h1>
        {code == '00' ? (
          <div className="text-sm cursor-pointer" onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ['my-order']
            })
            navigate('/account/order')
          }}>
            Xem đơn hàng
          </div>
        ) : (
          <Link className="text-sm" to={'/checkout'}>
            Quay lại thanh toán
          </Link>
        )}
      </div>
    </main>
  )
}