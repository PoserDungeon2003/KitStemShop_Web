import { Link, useMatches } from "@remix-run/react";
import _ from "lodash";
import { FaChevronRight, FaHouse } from "react-icons/fa6"

export const Breadcrumb = () => {
  const matches = useMatches();
  const last = _.last(matches)?.handle as any
  
  const parsePathname = (path?: string) => {
    if (!path) return '';
    const segments = _(path)
      .split('/')
      .value()
      .filter(segment => segment);
    const lastSegment = _.last(segments) || '';
    return _(lastSegment).upperFirst();
  };

  if (!last?.breadcrumb) return null;
  return (
    // breadcrumb
    < div className="container py-4 flex items-center gap-3" >
      <Link to="/" className="text-primary text-base">
        <FaHouse />
      </Link>
      {_.map(matches, (match, index) => {
        const parsedName = parsePathname(match.pathname);
        return (
          <div className="flex items-center gap-3">
            <Link key={index} to={match.pathname} className="text-gray-600 font-medium">{parsedName}</Link>
            {index < matches.length - 1 && (
              <span className="text-sm text-gray-400">
                <FaChevronRight />
              </span>
            )}
          </div>
        )
      })}
    </div >
  )
}