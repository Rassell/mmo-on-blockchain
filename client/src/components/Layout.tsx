import React from "react";
import { Link, Outlet, useMatch, useResolvedPath } from "react-router-dom";

const menuItemClassName = "p-1 rounded-lg";

function RouteOption({ to, title }: { to: string; title: string }) {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  const backgroundColor = match ? "bg-blue-200" : "bg-gray-400";

  return (
    <div>
      <Link to={to} className={`${backgroundColor} ${menuItemClassName}`}>
        {title}
      </Link>
    </div>
  );
}

export default function Layout() {
  return (
    <div className="flex flex-col h-full">
      <nav>
        <ul className="flex flex-row gap-3">
          <RouteOption to="/" title="Home" />
          <RouteOption to="/characterList" title="Character List" />
          <RouteOption to="/roster" title="Roster" />
          <RouteOption to="/arena" title="Arena" />
        </ul>
      </nav>
      <div className="h-full">
        <Outlet />
      </div>
      <a href="https://www.flaticon.com/free-icons/mmorpg" title="mmorpg icons">
        Mmorpg icons created by Freepik - Flaticon
      </a>
    </div>
  );
}
