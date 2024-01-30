import { useState, useEffect } from "react";

export const useFetchRecipient = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);

  useEffect(() => {
    const recipient = chat?.members.find((member) => member._id !== user?._id);

    if (!recipient) return null;
    setRecipientUser(recipient);
  }, [chat]);

  return { recipientUser };
};
