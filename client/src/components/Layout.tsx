import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex flex-row">
      <nav>
        <ul className="flex flex-col">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/characterList">Character List</Link>
          </li>
          <li>
            <Link to="/roster">Roster</Link>
          </li>
          <li>
            <Link to="/arena">Arena</Link>
          </li>
        </ul>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
