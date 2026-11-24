// router.js
import { createElement, Fragment } from "./mini-react.js";

let currentParams = {};
let currentOutlet = null;

// Lấy đường dẫn hiện tại từ hash (VD: #/scientists/sp-1 -> /scientists/sp-1)
export function getCurrentPath() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || "/";
}

export function navigate(to) {
  window.location.hash = to;
}

// Lắng nghe đổi URL để re-render SPA mà không reload trang
window.addEventListener("hashchange", () => {
  window.dispatchEvent(new CustomEvent("mini-react-rerender"));
});

// Hook trích xuất URL params (Exercise 1.2.2)
export function useParams() {
  return currentParams;
}

// Component hiển thị route con bên trong Layout (Exercise 1.2.1)
export function Outlet() {
  return currentOutlet;
}

// NavLink hỗ trợ callback className={({ isActive }) => ...} (Exercise 1.2.1)
export function NavLink({ to, className, children }) {
  const currentPath = getCurrentPath();
  const isActive =
    to === "/" ? currentPath === "/" : currentPath.startsWith(to);

  const resolvedClass =
    typeof className === "function" ? className({ isActive }) : className || "";

  return createElement(
    "a",
    {
      href: `#${to}`,
      className: resolvedClass,
      "aria-current": isActive ? "page" : undefined,
      onClick: (e) => {
        e.preventDefault();
        navigate(to);
      },
    },
    children,
  );
}

// Hàm khớp pattern route động (VD: /scientists/:id khớp với /scientists/sp-1)
function matchPath(pattern, path) {
  if (pattern === "*") return { params: {} };
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      const paramName = patternParts[i].slice(1);
      params[paramName] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return { params };
}

export function Route() {
  return null; // Chỉ dùng để khai báo cấu hình
}

export function Routes({ children }) {
  const currentPath = getCurrentPath();
  const routeList = Array.isArray(children) ? children : [children];

  for (const route of routeList) {
    if (!route || !route.props) continue;

    // Trường hợp Route cha có chứa nested routes (Layout)
    if (route.props.children && route.props.children.length > 0) {
      const basePath = route.props.path === "/" ? "" : route.props.path;
      for (const childRoute of route.props.children) {
        if (!childRoute || !childRoute.props) continue;
        const fullPattern = childRoute.props.index
          ? basePath || "/"
          : `${basePath}/${childRoute.props.path}`.replace(/\/+/g, "/");

        const matched = matchPath(fullPattern, currentPath);
        if (matched) {
          currentParams = matched.params;
          currentOutlet = childRoute.props.element;
          return route.props.element;
        }
      }
    } else {
      // Trường hợp Route đơn lẻ
      const matched = matchPath(route.props.path, currentPath);
      if (matched) {
        currentParams = matched.params;
        currentOutlet = null;
        return route.props.element;
      }
    }
  }

  return createElement("p", null, "404 - Page Not Found");
}
