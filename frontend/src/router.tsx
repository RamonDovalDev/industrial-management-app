import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

// Importaremos las páginas reales conforme las creemos
const Placeholder = ({ name }: { name: string }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
    <h2 className="text-4xl font-black text-white mb-4">{name}</h2>
    <p className="text-slate-500">Development Module for Platex V1.</p>
  </div>
);
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/planning", element: <Placeholder name="Planning Gantt" /> },
      { path: "/orders", element: <Placeholder name="Orders Management" /> },
      {
        path: "/simulator",
        element: <Placeholder name="Impact Simulator" />,
      },
    ],
  },
]);
