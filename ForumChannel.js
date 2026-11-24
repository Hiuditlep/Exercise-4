// ForumChannel.js
import { createElement, Fragment } from "./mini-react.js";
import { useState } from "./reactive-engine.js";
import { useForumMessages } from "./useForumMessages.js";

export function ForumChannel() {
  const [channelId, setChannelId] = useState("general");
  const [text, setText] = useState("");
  const { msgs, loading, refetch } = useForumMessages(channelId);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch(
      `http://localhost:3001/api/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: "Nguyễn Minh Hiếu", text: text.trim() }),
      },
    );

    if (res.ok) {
      setText("");
      refetch();
    }
  };

  return createElement(
    "section",
    { className: "forum-container", "aria-label": "Research Channels" },
    createElement(
      "nav",
      { className: "channel-tabs" },
      ["general", "react-architecture", "pubg-telemetry"].map((ch) =>
        createElement(
          "button",
          {
            type: "button",
            className: channelId === ch ? "active-tab" : "",
            onClick: () => setChannelId(ch),
          },
          `# ${ch}`,
        ),
      ),
    ),
    loading
      ? createElement(
          "p",
          { "aria-busy": "true" },
          "Syncing channel messages...",
        )
      : createElement(
          "dl",
          { className: "message-list" },
          msgs.map((msg) =>
            createElement(
              Fragment,
              { key: msg.id },
              createElement("dt", null, `${msg.author} (${msg.time})`),
              createElement("dd", null, msg.text),
            ),
          ),
        ),
    createElement(
      "form",
      { onSubmit: handleSend, className: "msg-form" },
      createElement("input", {
        type: "text",
        placeholder: `Message #${channelId}...`,
        value: text,
        onInput: (e) => setText(e.target.value),
      }),
      createElement("button", { type: "submit" }, "Send"),
    ),
  );
}
