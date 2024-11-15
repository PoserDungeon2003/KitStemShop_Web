import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { vnPayCallback } from "~/data";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log('loader', request.url);
  let user = await authenticator.isAuthenticated(request);
  console.log('user', user);
  
  if (!user) return redirect("/");
  try {
    let response = await vnPayCallback(user?.token || "", request.url)
    if (response.data.vnPayResponse.responseCode === '00') {
      console.log(response);
      return redirect(`/checkout-success?message=${encodeURIComponent(response.data.responseCodeMessage)}&code=${response.data.vnPayResponse.responseCode}`);
    }
    return redirect(`/checkout-success?message=${encodeURIComponent(response.data.responseCodeMessage)}&code=${response.data.vnPayResponse.responseCode}`);
  } catch (error) {
    console.log('error', error);
    
    return redirect(`/checkout?message=${encodeURIComponent('Giao dịch thất bại')}&type=error`);
  }
}