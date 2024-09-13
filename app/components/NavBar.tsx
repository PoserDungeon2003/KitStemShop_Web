import { Link, NavLink, useLocation, useNavigate } from "@remix-run/react"
import { useQueryClient } from "@tanstack/react-query"
import _ from "lodash"
import { useEffect } from "react"
import { IoMenu } from "react-icons/io5"
import { useGetProfile } from "~/data"

const dropDownList = [
  {
    name: "Sofa",
    icon: "/images/icons/sofa.svg",
    to: '/products/sofa',
  },
  {
    name: "Terrace",
    icon: "/images/icons/terrace.svg",
    to: '/products/terrace',
  },
  {
    name: "Bed",
    icon: "/images/icons/bed.svg",
    to: '/products/bed',
  },
  {
    name: "Office",
    icon: "/images/icons/office.svg",
    to: '/products/office',
  },
  {
    name: "Outdoor",
    icon: "/images/icons/outdoor-cafe.svg",
    to: '/products/outdoor',
  },
  {
    name: "Mattress",
    icon: "/images/icons/bed-2.svg",
    to: '/products/mattress',
  },
]

export const NavBar = () => {
  const profile = useGetProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const user = profile.data?.user
  const searchParams = new URLSearchParams(location.search)
  const action = searchParams.get('action')

  useEffect(() => {
    if (action == 'logout') {
      queryClient.invalidateQueries({
        queryKey: ['profile']
      })
      // navigate('/')
    }
  }, [location.search])

  return (
    <nav className="bg-gray-800">
      <div className="container flex">
        <div className="px-8 py-4 bg-primary flex items-center cursor-pointer relative group">
          <span className="text-white">
            <IoMenu />
          </span>
          <span className="capitalize ml-2 text-white">All Categories</span>

          <div
            className="absolute w-full left-0 top-full bg-white shadow-md py-3 divide-y divide-gray-300 divide-dashed opacity-0 group-hover:opacity-100 transition duration-300 invisible group-hover:visible"
          >
            {_.map(dropDownList, (item, index) => (
              <NavLink to={item.to} key={index} className={({ isActive }) => `${isActive ? 'text-[#fd3d57]' : ''} flex items-center px-6 py-3 hover:bg-gray-100 transition`}>
                <img src={item.icon} alt="sofa" className="w-5 h-5 object-contain" />
                <span className="ml-6 text-gray-600 text-sm">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between flex-grow pl-12">
          <div className="flex items-center space-x-6 capitalize">
            <Link to="/" className="text-gray-200 hover:text-white transition">Home</Link>
            <Link to="/shop" className="text-gray-200 hover:text-white transition">Shop</Link>
            <Link to="/about" className="text-gray-200 hover:text-white transition">About us</Link>
            <Link to="/contact" className="text-gray-200 hover:text-white transition">Contact us</Link>
          </div>
          <div className="text-gray-200 transition flex flex-1 justify-end">
            {user ? (
              <div className="flex items-center justify-center">
                <Link to={'/logout?redirectTo=/?action=logout'} className="hover:text-white cursor-pointer">
                  Logout
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Link to={'/login'} className="hover:text-white">
                  Login
                </Link>
                <span>/</span>
                <Link to={'/register'} className="hover:text-white">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}