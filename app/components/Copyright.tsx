import { useMatches } from "@remix-run/react";
import { getYear } from "date-fns"
import _ from "lodash";

export const Copyright = () => {
  const currentYear = getYear(new Date())
  const matches = useMatches();
  const last = (_.last(matches) as any)?.handle;

  if (last?.hideCopyright) return;

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