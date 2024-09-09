import { Link } from "@remix-run/react";
import { IoCart, IoHeartOutline, IoPersonOutline, IoSearchOutline } from "react-icons/io5";

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
          <Link to="#" className="text-center text-gray-700 hover:text-primary transition flex flex-col items-center justify-center">
            <div className="relative">
              <IoHeartOutline className="text-2xl" />
              <div
                className="absolute -right-2 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
                8
              </div>
            </div>
            <div className="text-xs leading-3">
              Wishlist
            </div>
          </Link>
          <Link to="#" className="text-center text-gray-700 hover:text-primary transition flex flex-col items-center justify-center">
            <div className="relative">
              <IoCart className="text-2xl" />
              <div
                className="absolute -right-3 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white text-xs">
                2
              </div>
            </div>
            <div className="text-xs leading-3">Cart</div>
          </Link>
          <Link to="#" className="text-center text-gray-700 hover:text-primary transition flex flex-col items-center justify-center">
            <IoPersonOutline className="text-2xl" />
            <div className="text-xs leading-3">Account</div>
          </Link>
        </div>
      </div>
    </header>
  )
}