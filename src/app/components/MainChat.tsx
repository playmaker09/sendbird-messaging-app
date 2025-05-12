"use client";

import { useEffect, useState } from "react";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import ChannelListPage from "./ChannelListPage";
import { generateNewUser, ChatUser } from "../lib/generateUser";

export default function MainChat() {
  const [user, setUser] = useState<ChatUser | null>(null);
  useEffect(() => {
    const initUser = async () => {
      const cachedUser = localStorage.getItem("chat_user");

      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      } else {
        const newUser = generateNewUser();
        localStorage.setItem("chat_user", JSON.stringify(newUser));
        setUser(newUser);

        try {
          await fetch("/api/user/create-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          });
        } catch (error) {
          console.error("Failed to create Sendbird user:", error);
        }
      }
    };

    initUser();
  }, []);

  if (!user) return <div>Loading chat...</div>;

  return (
    <SendbirdProvider
      appId={process.env.NEXT_PUBLIC_APP_ID || ""}
      userId={user.userId}
      nickname={user.nickname}
    >
      <ChannelListPage />
    </SendbirdProvider>
  );
}
