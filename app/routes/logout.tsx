import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  let url = new URL(request.url);
  let searchParams = url.searchParams
  let redirectTo = searchParams.get('redirectTo') || '/';
  return await authenticator.logout(request, {
    redirectTo: `${redirectTo}`
  });
}