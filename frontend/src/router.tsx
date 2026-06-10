import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Planning from "./pages/Planning";
import Orders from "./pages/Orders";
import Simulator from "./pages/Simulator";
import Settings from "./pages/Settings";
import Test from "./pages/Test";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/planning",
        element: <Planning />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/simulator",
        element: <Simulator />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/test",
        element: <Test />,
      },
      // Catch-all route (404) for undefined routes
      {
        path: "*",
        element: (
          <div className="flex flex-1 flex-col items-center justify-center h-full text-gray-600 bg-[#0d0d14]">
            <h2 className="text-6xl font-black mb-2 opacity-50">404</h2>
            <p className="text-sm font-bold tracking-widest uppercase">
              Module not found
            </p>
          </div>
        ),
      },
    ],
  },
]);
