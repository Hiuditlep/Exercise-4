// RegistrationForm.js
import { createElement } from "./mini-react.js";
import { useState } from "./reactive-engine.js";

export function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [iq, setIq] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // DERIVED VALIDATION STATE (Zero useEffect -> 1 keypress = 1 render pass)
  const errors = {};
  if (name.trim().length < 3) {
    errors.name = "Tên phải có ít nhất 3 ký tự.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email không đúng định dạng.";
  }
  const numericIq = Number(iq);
  if (!iq || Number.isNaN(numericIq) || numericIq < 100 || numericIq > 250) {
    errors.iq = "Chỉ số IQ phải nằm trong khoảng 100 - 250.";
  }

  const isFormValid = Object.keys(errors).length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setSubmitted(true);
    }
  };

  return createElement(
    "section",
    { className: "form-container", "aria-labelledby": "reg-heading" },
    createElement(
      "h2",
      { id: "reg-heading" },
      "Pioneer Registration (Zero-Effect Validation)",
    ),
    submitted
      ? createElement(
          "section",
          {
            role: "status",
            "aria-live": "polite",
            className: "success-banner",
          },
          createElement(
            "p",
            null,
            `Đăng ký thành công cho ${name} (${email})!`,
          ),
          createElement(
            "button",
            {
              type: "button",
              onClick: () => {
                setName("");
                setEmail("");
                setIq("");
                setSubmitted(false);
              },
            },
            "Đăng ký người khác",
          ),
        )
      : createElement(
          "form",
          { onSubmit: handleSubmit, noValidate: true, className: "reg-form" },
          // Field 1: Name
          createElement("label", { htmlFor: "reg-name" }, "Full Name:"),
          createElement("input", {
            id: "reg-name",
            type: "text",
            value: name,
            onInput: (e) => setName(e.target.value),
          }),
          errors.name
            ? createElement("span", { className: "field-error" }, errors.name)
            : null,

          // Field 2: Email
          createElement("label", { htmlFor: "reg-email" }, "Academic Email:"),
          createElement("input", {
            id: "reg-email",
            type: "email",
            value: email,
            onInput: (e) => setEmail(e.target.value),
          }),
          errors.email
            ? createElement("span", { className: "field-error" }, errors.email)
            : null,

          // Field 3: IQ
          createElement("label", { htmlFor: "reg-iq" }, "Verified IQ:"),
          createElement("input", {
            id: "reg-iq",
            type: "number",
            value: iq,
            onInput: (e) => setIq(e.target.value),
          }),
          errors.iq
            ? createElement("span", { className: "field-error" }, errors.iq)
            : null,

          createElement(
            "button",
            { type: "submit", disabled: !isFormValid, className: "btn-submit" },
            "Submit Registration",
          ),
        ),
  );
}
