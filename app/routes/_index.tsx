import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // let user = await authenticator.isAuthenticated(request);
  // console.log('user', user);
  
  // if (!user) {
  //   return redirect("/login");
  // }
  return json({}, { status: 200 });
}

export default function Index() {
  return (
    <div className="">
    </div>
  );
}
