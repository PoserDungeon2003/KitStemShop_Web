import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "@remix-run/react";
import _ from "lodash";
import { FaAddressCard, FaBoxArchive, FaCreditCard, FaHeart, FaRightFromBracket } from "react-icons/fa6";
import { useGetProfile } from "~/data";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect("/");
  }
  return json({}, { status: 200 });
}

export const handle = {
  breadcrumb: true,
}

const profileNav = [
  {
    title: 'Manage account',
    to: '/account/manage',
    icon: <FaAddressCard />
  },
  {
    title: 'Profile information',
    to: '/account/info',
  },
  {
    title: 'Manage addresses',
    to: '/account/addresses',
  },
  {
    title: 'Change password',
    to: '/account/change-password',
  },
]

export default function Account() {
  const profile = useGetProfile();
  const username = profile.data?.detail?.fullName || profile.data?.detail?.userName
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <main>
      {/* account wrapper */}
      <div className="container grid grid-cols-12 items-start gap-6 pt-4 pb-16">

        {/* sidebar */}
        <div className="col-span-3">
          <div className="px-4 py-3 shadow flex items-center gap-4">
            <div className="flex-shrink-0">
              <img src="/images/avatar.png" alt="profile"
                onClick={() => navigate('/account')}
                className="rounded-full w-14 h-14 border border-gray-200 p-1 object-cover cursor-pointer" />
            </div>
            <div className="flex-grow">
              <p className="text-gray-600">Hello,</p>
              <h4 className="text-gray-800 font-medium">{username}</h4>
            </div>
          </div>

          <div className="mt-6 bg-white shadow rounded p-4 divide-y divide-gray-200 space-y-4 text-gray-600">
            <div className="space-y-1 pl-8">
              {_.map(profileNav, (item, index) => (
                <NavLink key={index} to={item.to} className={({ isActive }) => `${isActive ? 'text-primary' : ''} relative hover:text-primary block capitalize transition`}>
                  {item.icon && (
                    <span className="absolute -left-8 top-0 text-base">
                      {item.icon}
                    </span>
                  )}
                  {item.title}
                </NavLink>
              ))}
            </div>

            <div className="space-y-1 pl-8 pt-4">
              <Link to="/account/order" className="relative hover:text-primary block font-medium capitalize transition">
                <span className="absolute -left-8 top-0 text-base">
                  <FaBoxArchive />
                </span>
                My order history
              </Link>
              <a href="#" className="relative hover:text-primary block capitalize transition">
                My returns
              </a>
              <a href="#" className="relative hover:text-primary block capitalize transition">
                My Cancellations
              </a>
              <a href="#" className="relative hover:text-primary block capitalize transition">
                My reviews
              </a>
            </div>

            <div className="space-y-1 pl-8 pt-4">
              <a href="#" className="relative hover:text-primary block font-medium capitalize transition">
                <span className="absolute -left-8 top-0 text-base">
                  <FaCreditCard />
                </span>
                Payment methods
              </a>
              <a href="#" className="relative hover:text-primary block capitalize transition">
                Voucher
              </a>
            </div>

            <div className="space-y-1 pl-8 pt-4">
              <NavLink to="/account/wishlist" className={({ isActive}) => `${isActive ? 'text-primary' : ''} relative hover:text-primary block font-medium capitalize transition`}>
                <span className="absolute -left-8 top-0 text-base">
                  <FaHeart />
                </span>
                My wishlist
              </NavLink>
            </div>

            <div className="space-y-1 pl-8 pt-4">
              <Link to="/logout?redirectTo=/?action=logout" className="relative hover:text-primary block font-medium capitalize transition">
                <span className="absolute -left-8 top-0 text-base">
                  <FaRightFromBracket />
                </span>
                Logout
              </Link>
            </div>
          </div>
        </div>
        {/* ./sidebar */}
        <Outlet />
        {/* info */}
        {location.pathname === '/account' && (
          <div className="col-span-9 grid grid-cols-3 gap-4">
            <div className="shadow rounded bg-white px-4 pt-6 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800 text-lg">Personal Profile</h3>
                <a href="#" className="text-primary">Edit</a>
              </div>
              <div className="space-y-1">
                <h4 className="text-gray-700 font-medium">{profile.data?.detail?.fullName || "John Doe"}</h4>
                <p className="text-gray-800">{profile.data?.detail?.email}</p>
                <p className="text-gray-800">{profile.data?.detail?.phone}</p>
              </div>
            </div>

            <div className="shadow rounded bg-white px-4 pt-6 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800 text-lg">Shipping address</h3>
                <a href="#" className="text-primary">Edit</a>
              </div>
              <div className="space-y-1">
                <h4 className="text-gray-700 font-medium">{profile.data?.detail?.fullName || "John Doe"}</h4>
                <p className="text-gray-800">{profile.data?.detail?.address}</p>
                {/* <p className="text-gray-800">20371</p> */}
                <p className="text-gray-800">{profile.data?.detail?.phone}</p>
              </div>
            </div>

            {/* <div className="shadow rounded bg-white px-4 pt-6 pb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800 text-lg">Billing address</h3>
                <a href="#" className="text-primary">Edit</a>
              </div>
              <div className="space-y-1">
                <h4 className="text-gray-700 font-medium">John Doe</h4>
                <p className="text-gray-800">Medan, North Sumatera</p>
                <p className="text-gray-800">20317</p>
                <p className="text-gray-800">0811 8877 988</p>
              </div>
            </div> */}
          </div>
        )}
        {/* ./info */}
      </div>
    </main>
  )
}