import { Link, useLocation } from "react-router-dom";
import { routes } from "../util/breadScrum";
import compolent_address from "../assets/compolent_address.svg";

export function Breadcrumb() {
  const location = useLocation();
  const matchId = location.pathname.match(/\/(\d+)$/);
  const currentId = matchId ? matchId[1] : null;

  const items = routes.filter(
    (r) =>
      location.pathname === r.path ||
      location.pathname.startsWith(`${r.path}/`)
  );
  return (
    <div className="flex flex-col text-sm">
        <div className="flex gap-2">

            {items.map((item, i) => {
                const isCurrent =
                i === items.length - 1;

                return (
                <div
                    key={item.path}
                    className="flex items-center"
                >
                    {i > 0 && (
                    <span className="mr-1 text-[#B0B0B0]">
                        <img src={compolent_address} />
                    </span>
                    )}

                    {isCurrent ? (
                    <span
                        className="
                        font-semibold
                        text-[#222222]
                        font-be_vietnam_pro
                        "
                        aria-current="page"
                    >
                        {item.breadcrumb}
                    </span>
                    ) : (
                    <Link
                        to={(item as any).appendId && currentId ? `${item.path}/${currentId}` : item.path}
                        className="
                        text-[#7A7A7A]
                        hover:text-[#444]
                        transition
                        font-be_vietnam_pro
                        "
                    >
                        {item.breadcrumb}
                    </Link>
                    )}
                </div>
                
                );
            })}
        </div>
        
    </div>
  );
}