// mini-react.js
export const Fragment = Symbol("Fragment");

export function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children
        .flat()
        .map((child) =>
          typeof child === "object" ? child : createTextElement(child),
        ),
    },
  };
}

// 1. Dynamic import via lazy() (Exercise 1.1)
export function lazy(loader) {
  let status = "pending";
  let result;
  let promise = null;

  return function LazyComponent(props) {
    if (status === "pending") {
      if (!promise) {
        promise = loader().then(
          (mod) => {
            status = "resolved";
            result = mod.default || Object.values(mod)[0];
          },
          (err) => {
            status = "rejected";
            result = err;
          },
        );
      }
      throw promise; // Ném promise cho Suspense bắt
    }
    if (status === "rejected") throw result;
    return result(props);
  };
}

// 2. Suspense Boundary (Exercise 1.1)
export function Suspense({ fallback, children }) {
  try {
    return typeof children === "function" ? children() : children;
  } catch (thrown) {
    if (thrown && typeof thrown.then === "function") {
      // Khi promise tải xong thì trigger render lại toàn app
      thrown.then(() => {
        window.dispatchEvent(new CustomEvent("mini-react-rerender"));
      });
      return fallback;
    }
    throw thrown;
  }
}

export function renderToDOM(vnode) {
  if (vnode === null || vnode === undefined || typeof vnode === "boolean") {
    return document.createTextNode("");
  }

  // Hỗ trợ Component function trực tiếp
  if (typeof vnode.type === "function") {
    return renderToDOM(vnode.type(vnode.props));
  }

  // Hỗ trợ Fragment (Exercise 1.7.1)
  if (vnode.type === Fragment) {
    const frag = document.createDocumentFragment();
    vnode.props.children.forEach((child) => {
      if (child !== null && child !== undefined) {
        frag.appendChild(renderToDOM(child));
      }
    });
    return frag;
  }

  if (vnode.type === "TEXT_ELEMENT") {
    return document.createTextNode(vnode.props.nodeValue);
  }

  const dom = document.createElement(vnode.type);

  const isProperty = (key) => key !== "children";
  // Sửa dòng 99 trong mini-react.js thành:
  Object.keys(vnode.props || {})
    .filter(isProperty)
    .forEach((name) => {
      if (name.startsWith("on")) {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, vnode.props[name]);
      } else if (name === "className") {
        dom.className = vnode.props[name];
      } else {
        dom[name] = vnode.props[name];
      }
    });

  vnode.props.children.forEach((child) => {
    if (child !== null && child !== undefined) {
      dom.appendChild(renderToDOM(child));
    }
  });

  return dom;
}
