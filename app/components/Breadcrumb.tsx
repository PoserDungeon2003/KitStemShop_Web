import { Link, useMatches } from "@remix-run/react";
import _ from "lodash";
import { FaChevronRight, FaHouse } from "react-icons/fa6"

export const Breadcrumb = () => {
  const matches = useMatches();
  const last = _.last(matches)?.handle as any
  // console.log('matches', matches);
  if (!last?.breadcrumb) return null;
  return (
    // breadcrumb
    < div className="container py-4 flex items-center gap-3" >
      <a href="/home" className="text-primary text-base">
        <FaHouse />
      </a>
      <span className="text-sm text-gray-400">
        <FaChevronRight />
      </span>
      {_.map(matches, (match, index) => (
        <Link key={index} to={match.pathname} className="text-gray-600 font-medium">{match.pathname}</Link>
      ))}
    </div >
  )
}