"use client";

import { useEffect, useState } from "react";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import ChannelListPage from "./ChannelListPage";
import { generateNewUser, ChatUser } from "../lib/generateUser";

export default function MainChat() {
  const [user, setUser] = useState<ChatUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initUser = async () => {
      const cachedUser = localStorage.getItem("chat_user");

      let newUser: ChatUser;
      if (cachedUser) {
        newUser = JSON.parse(cachedUser);
      } else {
        newUser = generateNewUser();
        localStorage.setItem("chat_user", JSON.stringify(newUser));

        // Create the user in Sendbird
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

      setUser(newUser);

      try {
        const tokenRes = await fetch("/api/sendbird/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: newUser.userId }),
        });

        if (!tokenRes.ok) throw new Error("Token creation failed");

        const getTokenRes = await fetch("/api/sendbird/token-get");
        const { token } = await getTokenRes.json();
        setToken(token);
      } catch (err) {
        console.error("Error getting Sendbird token:", err);
      }
    };

    initUser();
  }, []);

  if (!user || !token) return <div>Loading chat...</div>;

  return (
    <SendbirdProvider
      appId={process.env.NEXT_PUBLIC_APP_ID || ""}
      userId={user.userId}
      nickname={user.nickname}
      accessToken={token}
    >
      <ChannelListPage />
    </SendbirdProvider>
  );
}
