import { getYear } from "date-fns"

export const Copyright = () => {
  const currentYear = getYear(new Date())

  return (
    <div className="bg-gray-800 py-4">
      <div className="container flex items-center justify-between">
        <p className="text-white">&copy; TailCommerce - {currentYear} All Rights Reserved</p>
        <div>
          <img src="/images/methods.png" alt="methods" className="h-5" />
        </div>
      </div>
    </div>
  )
}