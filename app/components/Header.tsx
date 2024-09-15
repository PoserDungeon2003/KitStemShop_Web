import { Link, NavLink } from "@remix-run/react";
import { IoCartOutline, IoHeartOutline, IoPersonOutline, IoSearchOutline } from "react-icons/io5";
import _ from 'lodash';

const navbar = [
  {
    name: "Wishlist",
    to: "/account/wishlist",
    length: 8,
    icon: IoHeartOutline
  },
  {
    name: "Cart",
    to: "/cart",
    length: 2,
    icon: IoCartOutline
  },
  {
    name: "Account",
    to: "/account",
    icon: IoPersonOutline
  },
]

export const Header = () => {
  return (
    <header className="py-4 shadow-sm bg-white">
      <div className="container flex items-center justify-between">
        <Link to="/">
          <img src="/images/logo.svg" alt="Logo" className="w-32" />
        </Link>

        <div className="w-full max-w-xl relative flex">
          <span className="absolute left-4 top-4 text-lg text-gray-400">
            <IoSearchOutline />
          </span>
          <input type="text" name="search" id="search"
            className="w-full border border-primary border-r-0 pl-12 py-3 pr-3 rounded-l-md focus:outline-none"
            placeholder="Search" />
          <button
            className="bg-primary border border-primary text-white px-8 rounded-r-md hover:bg-transparent hover:text-primary transition">Search</button>
        </div>

        <div className="flex items-center space-x-4">
          {_.map(navbar, (item, index) => {
            return (
              <Link key={index} to={item.to} className={`text-center text-gray-700 hover:text-primary transition flex flex-col items-center justify-center`}>
                <div className="relative">
                  <item.icon className="text-2xl" />
                  {item.length && (
                    <div
                      className="absolute -right-2 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
                      {item.length}
                    </div>
                  )}
                </div>
                <div className="text-xs leading-3">
                  {item.name}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}