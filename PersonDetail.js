// PersonDetail.js
import { createElement } from "./mini-react.js";
import { useParams, navigate } from "./router.js";
import { SMART_PEOPLE } from "./ScientistDirectory.js";

// Component Skeleton cố định chiều cao chống giật bố cục (CLS = 0)
export function PersonDetailSkeleton() {
  return createElement(
    "section",
    {
      className: "person-detail-skeleton",
      "aria-busy": "true",
      "aria-live": "polite",
    },
    createElement("p", null, "Loading Pioneer Dossier..."),
  );
}

function NotFoundState({ id }) {
  return createElement(
    "section",
    { role: "alert", className: "not-found-box" },
    createElement("h3", null, `404 — Pioneer "${id}" Not Found`),
    createElement(
      "p",
      null,
      "ID không tồn tại trong cơ sở dữ liệu SMART_PEOPLE.",
    ),
    createElement(
      "button",
      { type: "button", onClick: () => navigate("/scientists") },
      "← Back to Directory",
    ),
  );
}

export function PersonDetail(props = {}) {
  const people = props.people || SMART_PEOPLE;
  const { id } = useParams();
  // ... phần dưới giữ nguyên
  if (!person) {
    return NotFoundState({ id });
  }

  return createElement(
    "article",
    { className: "person-detail-grid", "aria-labelledby": "person-name" },
    // Cột 1: Thông tin tóm tắt (minmax(280px, 1fr))
    createElement(
      "header",
      { className: "person-summary" },
      createElement("h2", { id: "person-name" }, person.name),
      createElement("p", null, `Pioneer ID: ${person.id.toUpperCase()}`),
      createElement(
        "button",
        {
          type: "button",
          className: "btn-back",
          onClick: () => navigate("/scientists"),
        },
        "← Back to List",
      ),
    ),
    // Cột 2: Chi tiết thuộc tính bằng <dl>, <dt>, <dd> (2fr)
    createElement(
      "dl",
      { className: "person-details" },
      createElement("dt", null, "Full Name:"),
      createElement("dd", null, person.name),
      createElement("dt", null, "Age:"),
      createElement("dd", null, `${person.age} years`),
      createElement("dt", null, "Estimated IQ:"),
      createElement("dd", null, `${person.iq} pts`),
      createElement("dt", null, "Classification:"),
      createElement(
        "dd",
        null,
        person.iq >= 200 ? "Ultra-Polymath" : "Historical Pioneer",
      ),
    ),
  );
}

export default PersonDetail;
