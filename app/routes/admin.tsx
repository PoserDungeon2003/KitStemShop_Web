import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { AdminLayout } from "~/components";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect("/login");
  }
  if (String(user?.role).toLowerCase() == 'customer') return redirect("/");
  return json({}, { status: 200 });
}

export const handle = {
  hideFooter: true,
  hideHeader: true,
  hideNavbar: true,
  hideCopyright: true,
}

export default function Admin() {
  return (
    <>
      <AdminLayout children={<Outlet />} />
    </>
  )
}