// lab4-runner.js
import { createElement, lazy, Suspense } from "./mini-react.js";
import { renderApp, attachRootListener } from "./reactive-engine.js";
import { Routes, Route, NavLink, Outlet } from "./router.js";
import { DeveloperCard } from "./DeveloperCard.js";
import { ScientistDirectory } from "./ScientistDirectory.js";
import { PubgMatchTelemetry } from "./PubgMatchTelemetry.js";
import { PersonDetailSkeleton } from "./PersonDetail.js";
import { RegistrationForm } from "./RegistrationForm.js";
import { ForumChannel } from "./ForumChannel.js";

// Code-Splitting: Dynamic import cho PersonDetail (Exercise 1.1)
const LazyPersonDetail = lazy(() => import("./PersonDetail.js"));

// Shared Layout với Active NavLink & Outlet (Exercise 1.2.1)
function Layout() {
  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return createElement(
    "main",
    { className: "spa-shell" },
    createElement(
      "nav",
      { className: "top-navbar", "aria-label": "Main Navigation" },
      createElement(NavLink, { to: "/", className: navClass }, "Profile (Ex1)"),
      createElement(
        NavLink,
        { to: "/scientists", className: navClass },
        "Directory (Master-Detail)",
      ),
      createElement(
        NavLink,
        { to: "/telemetry", className: navClass },
        "PUBG Radar",
      ),
      createElement(
        NavLink,
        { to: "/register", className: navClass },
        "Validation Form",
      ),
      createElement(
        NavLink,
        { to: "/forum", className: navClass },
        "Forum API",
      ),
    ),
    createElement(
      "section",
      { className: "page-viewport" },
      createElement(Outlet, null),
    ),
  );
}

function App() {
  return createElement(
    Routes,
    null,
    createElement(
      Route,
      { path: "/", element: createElement(Layout, null) },
      createElement(Route, { index: true, element: DeveloperCard() }),
      createElement(Route, {
        path: "scientists",
        element: ScientistDirectory(),
      }),
      createElement(Route, {
        path: "scientists/:id",
        element: createElement(
          Suspense,
          { fallback: PersonDetailSkeleton() },
          () => LazyPersonDetail(),
        ),
      }),
      createElement(Route, {
        path: "telemetry",
        element: PubgMatchTelemetry(),
      }),
      createElement(Route, { path: "register", element: RegistrationForm() }),
      createElement(Route, { path: "forum", element: ForumChannel() }),
    ),
  );
}

const root = document.getElementById("app");
attachRootListener(root);
renderApp(App, root);
