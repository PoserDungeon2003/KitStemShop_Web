import { Outlet } from "@remix-run/react";
import { AdminLayout } from "~/components";

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