import React, { useState } from "react";
import { updateProfile, useGetProfile } from "~/data";

export default function AccountInfo() {
  const profile = useGetProfile();

  const [address, setAddress] = useState(profile.data?.detail?.address);
  const [phone, setPhone] = useState(profile.data?.detail?.phone);
  const [fullName, setFullName] = useState(profile.data?.detail?.fullName);
  const [message, setMessage] = useState("");

  const token = profile.data?.user?.token;

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await updateProfile(token, {address, phone, fullName});
      if(response){
        setMessage("Cập nhật thành công."); 
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage("Đã xảy ra lỗi.");
    }
  };

  return (
    <div className="flex items-center justify-center mt- overflow-auto col-span-9">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Account Info</h1>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Enter your address"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
              placeholder="Enter your phone number"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cập nhật
          </button>
          {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
        </form>
      </div>
    </div>
  );
}
