import { Outlet, Link, NavLink } from "react-router";
import "./index.css";

export default function Layout() {
	return (
		<div className="">
			<nav className="bg-taupe-200 sticky top-0 px-4 py-4 shadow shadow-gray-200/40">
				<div className="flex justify-center gap-2">
					<NavLink
						to={{
							pathname: "/",
						}}
						className={({ isActive }) =>
							isActive ? `text-yellow-700 font-bold` : ""
						}
					>
						Home
					</NavLink>
					<NavLink
						to={{ pathname: "/students" }}
						className={({ isActive }) =>
							isActive ? `text-yellow-700 font-bold` : ""
						}
					>
						Students
					</NavLink>
					<NavLink
						to={{ pathname: "/about"}}
						className={({ isActive }) =>
							isActive ? `text-yellow-700 font-bold` : ""
						}
					>
						About
					</NavLink>
          <a href="https://google.com" onClick={() => navigator.sendBeacon("http://localhost:5000/students", JSON.stringify({
            first_name: 'Au',
            last_name: 'De',
            matricule: '1111'
          }))}>External Link</a>
				</div>
			</nav>

			<div className="py-8">
				<Outlet />
			</div>
		</div>
	);
}
