import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getMe } from "~/data";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request);
  if (!user) return json({user: {}, detail: {}});

  try {
    let detail = await getMe(user.token);
    return json({ user, detail: detail.data });
  } catch (error: any) {
    return json({ user, detail: {}})
  }
}