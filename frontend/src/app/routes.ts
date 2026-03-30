import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Scan } from "./components/Scan";
import { Files } from "./components/Files";
import { DeveloperMode } from "./components/DeveloperMode";
import { Settings } from "./components/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "scan", Component: Scan },
      { path: "files", Component: Files },
      { path: "developer", Component: DeveloperMode },
      { path: "settings", Component: Settings },
    ],
  },
]);
