/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from "./Layout";
import Students from "./student/ui/pages/Students";
import { Provider } from "react-redux";
import { store } from "./student/domain/store";
import Student from "./student/ui/pages/Student";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{
				path: "students",
				Component: Students,
			},
			{
				path: "students/:id",
				Component: Student,
			},
		],
	},
]);

const elem = document.getElementById("root")!;
const app = (
	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
