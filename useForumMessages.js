// useForumMessages.js
import { useState } from "./reactive-engine.js";

let forumAbortController = null;
let loadedChannel = null;

export function useForumMessages(channelId) {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = (targetChannel) => {
    if (forumAbortController) {
      forumAbortController.abort();
    }
    const controller = new AbortController();
    forumAbortController = controller;
    setLoading(true);

    fetch(`http://localhost:3001/api/channels/${targetChannel}/messages`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setMsgs(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setLoading(false);
        }
      });
  };

  // Tự động fetch khi đổi kênh lần đầu
  if (loadedChannel !== channelId) {
    loadedChannel = channelId;
    setTimeout(() => fetchMessages(channelId), 0);
  }

  return { msgs, loading, refetch: () => fetchMessages(channelId) };
}
