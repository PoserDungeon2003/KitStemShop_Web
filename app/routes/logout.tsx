import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  let url = new URL(request.url);
  let searchParams = url.searchParams;
  const showUnauthorizedMessage = encodeURIComponent('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.');
  let redirectTo = searchParams.get('redirectTo') || `/?message=${showUnauthorizedMessage}&type=error`;
  return await authenticator.logout(request, {
    redirectTo: `${redirectTo}`
  });
}