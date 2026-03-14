import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import Budget from "./components/Budget";
import Analytics from "./components/Analytics";
import Events from "./components/Events";
import AttendanceCheckin from "./components/AttendanceCheckin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "tasks", Component: Tasks },
      { path: "budget", Component: Budget },
      { path: "analytics", Component: Analytics },
      { path: "events", Component: Events },
    ],
  },
  {
    path: "/attendance/:eventId",
    Component: AttendanceCheckin,
  },
]);